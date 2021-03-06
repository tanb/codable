# codable
<a href="https://www.npmjs.com/package/codable"><img src="https://img.shields.io/npm/v/codable.svg" /></a>
<a href="https://www.npmjs.com/package/codable"><img src="https://img.shields.io/npm/dw/codable.svg" /></a>

Codable base class for TypeScript


# installation

```
yarn add codable
```

# Usage

## Import

Import ```Codable```, ```CodableType``` and ```CodingKeys``` to create codable class.

```typescript
import { Codable, CodableType, CodingKeys } from 'codable';
```

## Decode

Decode JSON response body to object.

```typescript
// Example
const responseBody: JSON = JSON.parse(`
{
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
}`);

class Coordinate extends Codable {
  latitude: number;
  longitude: number;
}

@CodingKeys({
  name: 'title',
  foundingDate: 'founding_date',
  location: 'location',
  vantagePoints: 'vantage_points'
})
class Landmark extends Codable {
  name: string;
  foundingDate: string;

  @CodableType(Coordinate)
  location: Coordinate;

  @CodableType(Coordinate)
  vantagePoints: Coordinate[];
}

const landmark = Landmark.decode(responseBody);
```

Landmark class has the class decorator ```@CodingKeys``` for property key mapping. If you set keys, only those keys properties are going to be converted. If you don't set ```@CodingKeys``` decorator, then every property will be converted.

```
@CodingKeys({
  <Key name of Object>: <Key name of JSON>,
  ...
})
export class MyClass {
...
```

## Encode
Encode object to dictionary as a JSON request body
```typescript
const data = landmark.encode();
const requestBody = JSON.stringify(data);
```

This example requestBody will be:
```
{
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
}
```

## Accessor method properties (getter/setter)

Accessor method properties also work with Codable class.

```typescript
const jsonString = `{
  "username": "appleseed",
  "created_at": "2019-01-23T04:56:07.000Z"
}`;
const responseBody: JSON = JSON.parse(jsonString);

@CodingKeys({
  username: 'username',
  created_at_raw: 'created_at'
})
class User extends Codable {
  created_at_raw!: string;

  get createdAt(): Date {
    return new Date(this.created_at_raw);
  }
  set createdAt(val: Date) {
    this.created_at_raw = val.toISOString();
  }
}

const user = User.decode(responseBody);
console.log(user.created_at_raw);  // '2019-01-23T04:56:07.000Z'
console.log(user.createdAt.getTime());  // 1548219367000
```

In this case, it has an original value in ```created_at_raw```. And the property ```createdAt``` handles the value as a ```Date```type.

In another case, if you want to set logic in accessor in decoding/encoding time, Codable can handle Accessor method properties at the time.

```typescript
@CodingKeys({
  username: 'username',
  created_at: 'created_at'
})
class User extends Codable {
  _created_at!: Date;  // ignored by @CodingKeys

  get created_at(): string {
    return this._created_at.toISOString()
  }
  set created_at(val: string) {
    this._created_at = new Date(val);
    if (this._created_at.toString() === 'Invalid Date') {
      throw new Error('Invalid Date');
    }
  }
}
```

You can access inner value directly, and also accessor methods gonna work.

```typescript
// User.decode({name:'test', created_at: 'dead'});  // throws Error: Invalid Date
const user = User.decode(responseBody);
console.log(user._created_at.getTime());  // 1548219367000
console.log(user.created_at);  // '2019-01-23T04:56:07.000Z'
const data = user.encode();
```

The ```data```will be:

```javascript
{
  "username": "appleseed",
  "created_at": "2019-01-23T04:56:07.000Z"
}
```
