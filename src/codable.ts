import 'reflect-metadata';

const METADATA_KEY = Symbol('coding: type');

export class Codable {
  codingKeys?: { [ key: string]: string };
  static decode<T extends typeof Codable>(this: T, data: { [ key: string]: any }): InstanceType<T> {
    const keysValues: { [key: string]: any} = {};
    const convert = (value: any, cls: T): InstanceType<T> | InstanceType<T>[] => {
      if (Array.isArray(value)) {
        return value.map(v => cls.decode(v));
      } else {
        return cls.decode(value);
      }
    };
    const instance = new this();
    Object.keys(data).forEach(key => {
      const propKey = instance.codingKeys ? instance.codingKeys[key] : key;
      const cls = Reflect.getMetadata(METADATA_KEY, this, propKey) as T;
      let value = data[key];
      if (cls) {
        value = convert(value, cls);
      }
      keysValues[propKey] = value;
    });
    return Object.assign(instance, keysValues) as InstanceType<T>;
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

export function CodableType<T extends typeof Codable>(klass: T) {
  return (target: any, propertyKey: any) => {
    Reflect.defineMetadata(METADATA_KEY, klass, target, propertyKey);
  };
}
