# codable
<a href="https://www.npmjs.com/package/codable">
  <img src="https://img.shields.io/npm/dw/codable.svg" />
</a>

Codable base class for TypeScript


# installation

```
yarn add codable
```

# Usage

## Import
Import **Codable** and **CodableType** to create codable class.
```typescript
import { Codable, CodableType } from 'codable';
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
  latitude: number
  longitude: number
}

class Landmark extends Codable {
  name: string
  foundingDate: string

  @CodableType(Coordinate)
  location: Coordinate

  @CodableType(Coordinate)
  vantagePoints: Coordinate[]

  codingKeys = {
    name: "title",
    foundingDate: "founding_date",
    location: "location",
    vantagePoints: "vantage_points"
  }
}

const landmark = Landmark.decode(responseBody);
```

Codable class has an optional property **codingKeys** for property name mapping. And If you set names to **codingKeys**, only the names properties are going to be converted. If the **codingKeys** is undefined, then every property will be converted.

```
codingKeys = {
  <Key name of Object>: <Key name of JSON>
}
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
