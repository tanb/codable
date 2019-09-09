# codable
Codable base class for TypeScript


# installation

```
yarn add codable
```

# Usage
Import Codable and CodableType to create codable class;

```typescript
import { Codable, CodableType } from 'codable';
```

Decode JSON response to object
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
      "longitude":138.832873
    }
  ]
}`);

class Coordinate extends Codable {
  latitude: number
  longitude: number
}

class Landmark extends Codable {
  name: string
  foundingYear: number

  @CodableType(Coordinate)
  location: Coordinate

  @CodableType(Coordinate)
  vantagePoints: Coordinate[]

  codingKeys = {
    name: "title",
    foundingYear: "founding_date",
    location: "location",
    vantagePoints: "vantage_points"
  }
}

const landmark = Landmark.decode(responseBody);
```

Encode object to dictionary as JSON
```
const data = landmark.encode();
const requestBody = JSON.stringify(data);
```
