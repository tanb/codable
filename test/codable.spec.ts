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

  it('Decode: CodableType', ()=> {
    const landmark = Landmark.decode(responseBody);
    expect(landmark.location.constructor.name).toBe("Coordinate");
    expect(landmark.location.latitude).toBe(35.360707);
    expect(landmark.location.longitude).toBe(138.727765);
  });

  it('Decode: codingKeys', () => {
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

  it('Encode', ()=> {
    const landmark = Landmark.decode(responseBody);
    const data = landmark.encode();
    expect(JSON.stringify(data, null, 2)).toBe(jsonString);
  });
})
