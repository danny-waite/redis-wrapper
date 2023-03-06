import RedisLib from "./index";

const redis = new RedisLib();

type Test = {
  id: string;
  field1: string;
  field2: number;
  field3?: string;
};

describe("index", () => {
  describe("create", () => {
    test("should create entry", async () => {
      //   const result = await redis.create("test", { id: "abc", name: "test" });

      //   console.log(result);
      const result = await redis.create<Test>("test", {
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
      const obj = await redis.findById<Test>("test", "abc");
      console.log(obj);
      expect(obj).toBeDefined();
      expect(obj!.id).toBe("abc");
    });
  });

  describe("findByField", () => {
    test("should return object with string filter", async () => {
      const obj = await redis.findByField<Test>("test", "field1", "value1");
      console.log(obj);
      expect(obj).toBeDefined();
      expect(obj!.field1).toBe("value1");
    });
  });

  describe("findAll", () => {
    test("should return all", async () => {
      const obj = await redis.findAll<Test>("test");
      console.log(obj);
      expect(obj).toBeDefined();
    });
  });

  describe("update", () => {
    test("should return object with string filter", async () => {
      const obj = await redis.update<Test>("test", "abc", { field3: "value3" });
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

  describe("createMany", () => {
    test("should create many", async () => {
      const result = await redis.createMany<Test>("test-multi", [
        {
          id: "abc",
          field1: "value1",
          field2: 1,
        },
        {
          id: "def",
          field1: "value1",
          field2: 2,
        },
        {
          id: "ghi",
          field1: "value2",
          field2: 3,
        },
      ]);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });
  });

  describe.only("findAllByField", () => {
    test("should return all objects with matching field", async () => {
      const result = await redis.findAllByField<Test>(
        "test-multi",
        "field1",
        "value1"
      );
      console.log(result);
      expect(result).toBeDefined();

      // expect(obj.length).toBe(1);
    });
  });
});
