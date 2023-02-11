import RedisLib from "./index";

const redis = new RedisLib();

describe("index", () => {
  describe("create", () => {
    test("should create entry", async () => {
      //   const result = await redis.create("test", { id: "abc", name: "test" });

      //   console.log(result);
      const result = await redis.create("test", {
        id: "abc",
        field1: "value1",
        field2: 2,
      });

      console.log(result);
      expect(result).toBeDefined();
      expect(result.id).toBe("abc");
    });
  });

  describe("findById", () => {
    test("should return object that exists", async () => {
      const obj = await redis.findById("test", "abc");
      console.log(obj);
      expect(obj).toBeDefined();
      expect(obj.id).toBe("abc");
    });
  });

  describe("findByField", () => {
    test("should return object with string filter", async () => {
      const obj = await redis.findByField("test", "field1", "value1");
      console.log(obj);
      expect(obj).toBeDefined();
      expect(obj.field1).toBe("value1");
    });
  });

  describe.only("findAll", () => {
    test("should return all", async () => {
      const obj = await redis.findAll("test");
      console.log(obj);
      expect(obj).toBeDefined();
    });
  });

  describe("update", () => {
    test("should return object with string filter", async () => {
      const obj = await redis.update("test", "abc", { field3: "value3" });
      console.log(obj);
      expect(obj).toBeDefined();
      //   expect(obj.field1).toBe("value1");
    });
  });

  describe("removeAll", () => {
    test("should remove all objects in array", async () => {
      const obj = await redis.removeAll("test");
      console.log(obj);
      //   console.log(obj);
      //   expect(obj).toBeDefined();
      //   expect(obj.field1).toBe("value1");
    });
  });
});
