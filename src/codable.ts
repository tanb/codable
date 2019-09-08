import 'reflect-metadata';

const METADATA_KEY = Symbol('coding: type');

export class Codable {
  codingKeys?: { [ key: string]: string };
  static decode<T extends Codable>(data: { [ key: string]: any }): any {
    const keysValues: { [key: string]: any} = {};
    const convert = <L extends Codable>(value: any): L | L[] => {
      if (Array.isArray(value)) {
        return value.map(v => Codable.decode<L>(v));
      } else {
        return Codable.decode<L>(value);
      }
    };
    const instance = new this();
    const reverseCodingKyes: { [key: string]: string } = {};
    if (instance.codingKeys) {
      Object.keys(instance.codingKeys).forEach(key => {
        const value: string = instance.codingKeys![key];
        reverseCodingKyes[value] = key;
      });
    }
    Object.keys(data).forEach(key => {
      const propKey = instance.codingKeys ? reverseCodingKyes[key] : key;
      const klass = Reflect.getMetadata(METADATA_KEY, this, propKey);
      let value = data[key];
      if (klass) {
        value = convert<typeof klass>(value);
      }
      keysValues[propKey] = value;
    });
    return Object.assign(instance, keysValues) as T;
  }

  encode(): object {
    const data: { [key: string]: any } = {};
    let properties = [];
    if (this.codingKeys) {
      properties = Object.keys(this.codingKeys);
    } else {
      properties = ([] as string[]).concat(Object.keys(this), Object.keys(this.constructor.prototype));
    }
    const convert = (value: any): any => {
      if (value instanceof Codable) {
        return value.encode();
      } else {
        return value;
      }
    };
    properties.forEach(prop => {
      const value = (this as any)[prop];
      if (this.codingKeys) {
        prop = this.codingKeys[prop];
      }
      if (Array.isArray(value)) {
        data[prop] = value.map(v => convert(v));
      } else {
        data[prop] = convert(value);
      }
    });
    return data;
  }
}

export function CodableType<T extends Codable>(klass: T) {
  return (target: any, propertyKey: any) => {
    Reflect.defineMetadata(METADATA_KEY, klass, target, propertyKey);
  };
}
