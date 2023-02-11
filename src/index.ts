import { Redis } from "@upstash/redis/with-fetch";

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

  async findById(key: string, id: string) {
    const field = "id";

    const filter = `$[?(@.${field}=='${id}')]`;

    const idResult: any[] = await this.redis.json.get(key, filter);

    if (idResult.length > 0) return idResult[0];
  }

  private getFilter(field: string, value: string | number) {
    const valueString = typeof value === "string" ? `'${value}'` : value;
    return `$[?(@.${field}==${valueString})]`;
  }

  async findByField(key: string, field: string, value: string | number) {
    const idResult = await this.redis.json.get(
      key,
      this.getFilter(field, value)
    );
    if (idResult.length > 0) return idResult[0];
  }

  async findAllByField(key: string, field: string, value: string | number) {
    const result = await this.redis.json.get(key, this.getFilter(field, value));
    return result && result.length > 0 ? result[0] : [];
  }

  async findAll(key: string) {
    const result = await this.redis.json.get(key, "$");

    return result && result.length > 0 ? result[0] : [];
  }

  async create(key: string, value: any, id?: string) {
    const keyExists = await this.redis.exists(key);
    if (!keyExists) {
      await this.redis.json.set(key, "$", []);
    }

    if (!value.id) value.id = tuid();

    await this.redis.json.arrappend(key, "$", value);

    return value;
  }

  async createMany(key: string, values: any[]) {
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

  async update(key: string, id: string, value: any) {
    const filter = this.getFilter("id", id);
    console.log("filter", filter);

    const current = await this.findById(key, id);

    const newValue = { ...current, ...value };

    const result = await this.redis.json.set(key, filter, newValue);

    return newValue;
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
