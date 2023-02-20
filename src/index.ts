import { Redis } from "@upstash/redis";

import tuid from "tiny-uid";

export default class {
  redis: Redis;

  constructor(
    url: string = process.env.UPSTASH_REDIS_REST_URL!,
    token: string = process.env.UPSTASH_REDIS_REST_TOKEN!
  ) {
    this.redis = new Redis({
      url,
      token,
    });
  }

  async findById<T>(key: string, id: string): Promise<T | null> {
    const field = "id";

    const filter = `$[?(@.${field}=='${id}')]`;

    const result: any[] = await this.redis.json.get(key, filter);

    if (!result || result.length === 0) return null;
    return result[0];
  }

  private getFilter(field: string, value: string | number) {
    const valueString = typeof value === "string" ? `'${value}'` : value;
    return `$[?(@.${field}==${valueString})]`;
  }

  async findByField<T>(
    key: string,
    field: string,
    value: string | number
  ): Promise<T | null> {
    const result = await this.redis.json.get(key, this.getFilter(field, value));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  async findAllByField<T>(
    key: string,
    field: string,
    value: string | number
  ): Promise<T[]> {
    const result: T[][] = await this.redis.json.get(
      key,
      this.getFilter(field, value)
    );

    if (!result) return [];
    return result[0];
  }

  async findAll<T>(key: string): Promise<T[]> {
    const result: T[][] = await this.redis.json.get(key, "$");

    if (!result) return [];
    return result[0];
  }

  async create<T>(key: string, value: any, id?: string): Promise<T> {
    const keyExists = await this.redis.exists(key);
    if (!keyExists) {
      await this.redis.json.set(key, "$", []);
    }

    if (!value.id) value.id = tuid();

    await this.redis.json.arrappend(key, "$", value);

    return value;
  }

  async createMany<T>(key: string, values: any[]): Promise<T[]> {
    const keyExists = await this.redis.exists(key);
    if (!keyExists) {
      await this.redis.json.set(key, "$", []);
    }

    for (let value of values) {
      if (!value.id) value.id = tuid();
    }

    await this.redis.json.arrappend(key, "$", values);

    return values;
  }

  async update<T>(key: string, id: string, value: Partial<T>): Promise<T> {
    const filter = this.getFilter("id", id);

    const current = await this.findById<T>(key, id);

    const newValue: Partial<T> = { ...current, ...value };

    const result = await this.redis.json.set(key, filter, newValue as any);

    return newValue as T;
  }

  async remove(key: string, id: string) {
    const filter = this.getFilter("id", id);

    await this.redis.json.del(key, filter);
  }

  async removeAll(key: string) {
    await this.redis.json.del(key);
  }

  async get(key: string) {
    const item: any | null = await this.redis.get(key);
    return item;
  }

  async set(key: string, value: object) {
    const item: any | null = await this.redis.set(key, JSON.stringify(value));
    return item;
  }

  async listPush(key: string, value: object) {
    const item: any | null = await this.redis.rpush(key, JSON.stringify(value));
    return item;
  }

  async listPop(key: string) {
    const item: any | null = await this.redis.lpop(key);
    return item;
  }

  async listGetAll(key: string) {
    const item: any | null = await this.redis.lrange(key, 0, -1);
    return item;
  }

  private objectsToArray(objects: any) {
    return Object.keys(objects).map((key) => {
      return { id: key, ...objects[key] };
    });
  }
}
