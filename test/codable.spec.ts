import { Codable, CodableType, CodingKeys } from '../src/codable'

describe('Codable test suite', () => {
  const jsonString = `{
  "title": "My Favorite",
  "founding_date": "2019-01-01",
  "location": {
    "latitude": 35.360707,
    "longitude": 138.727765
  },
  "vantage_points": [
    {
      "latitude": 35.442139,
      "longitude": 138.850397
    },
    {
      "latitude": 35.460179,
      "longitude": 138.832873
    }
  ]
}`;
  const responseBody: JSON = JSON.parse(jsonString);
  class Coordinate extends Codable {
    latitude!: number
    longitude!: number
  }

  @CodingKeys({
      name: "title",
      foundingDate: "founding_date",
      location: "location",
      vantagePoints: "vantage_points"
  })
  class Landmark extends Codable {
    name!: string
    foundingDate!: string

    @CodableType(Coordinate)
    location!: Coordinate

    @CodableType(Coordinate)
    vantagePoints!: Coordinate[]
  }

  beforeEach(() => {
  });

  it('Decoding: CodableType can decode to specified class instance.', ()=> {
    const landmark = Landmark.decode(responseBody);
    expect(landmark.location.constructor.name).toBe("Coordinate");
    expect(landmark.location.latitude).toBe(35.360707);
    expect(landmark.location.longitude).toBe(138.727765);
  });

  it('Decoding: CodingKeys can replace property keys.', () => {
    const landmark = Landmark.decode(responseBody);
    expect(JSON.stringify(Object.keys(landmark).sort())).toBe(JSON.stringify([
      'name',
      'foundingDate',
      'location',
      'vantagePoints'
    ].sort()))
    expect(landmark.name).toBe("My Favorite");
    expect(landmark.foundingDate).toBe("2019-01-01");
    expect(Array.isArray(landmark.vantagePoints)).toBe(true);
    expect(landmark.vantagePoints.length).toBe(2);
    landmark.vantagePoints.forEach(item => {
      expect(item.constructor.name).toBe("Coordinate");
    });
  })

  it('Encoding: CodingKeys can replace property keys', ()=> {
    const landmark = Landmark.decode(responseBody);
    const data = landmark.encode();
    expect(JSON.stringify(data, null, 2)).toBe(jsonString);
  });
})


describe('Accessor method properties test suite', () => {
  const jsonString = `{
  "first_name": "John",
  "last_name": "Appleseed"
}`;
  const responseBody: JSON = JSON.parse(jsonString);

  it('Accessor method properties will be encoded.', ()=> {
    class User extends Codable {
      first_name!: string;
      last_name!: string;

      get full_name() {
        return `${this.first_name} ${this.last_name}`;
      }
    }

    const user = User.decode(responseBody);
    const data = user.encode();
    expect(JSON.stringify(data, null, 2))
      .toBe(`{
  "first_name": "John",
  "last_name": "Appleseed",
  "full_name": "John Appleseed"
}`
           );
  });

  it('CodingKeys can replace Accessor method property keys.', ()=> {
    @CodingKeys({
      first_name: 'first_name',
      last_name: 'last_name',
      full_name: '_full_name'
    })
    class User extends Codable {
      first_name!: string;
      last_name!: string;

      get full_name() {
        return `${this.first_name} ${this.last_name}`;
      }
    }

    const user = User.decode(responseBody);
    const data = user.encode();
    expect(JSON.stringify(data, null, 2))
      .toBe(`{
  "first_name": "John",
  "last_name": "Appleseed",
  "_full_name": "John Appleseed"
}`
           );
  });

  it('Accessor method properties are decodable', ()=> {
    const jsonString = `{
  "username": "appleseed",
  "created_at": "2019-01-23T04:56:07.000Z"
}`;
    const responseBody: JSON = JSON.parse(jsonString);

    @CodingKeys({
      username: 'username',
      created_at: 'created_at'
    })
    class User extends Codable {
      _created_at!: Date;

      get created_at(): string {
        return this._created_at.toISOString()
      }
      set created_at(val: string) {
        this._created_at = new Date(val);
      }
    }
    const user = User.decode(responseBody);
    expect(user.created_at).toBe('2019-01-23T04:56:07.000Z');
    expect(user._created_at.getTime()).toBe(1548219367000);
    const data = user.encode();
    expect(JSON.stringify(data, null, 2)).toBe(jsonString);
  });
})
