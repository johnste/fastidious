import { validate as v, fastidious as f } from "./index";

describe("test", () => {
  test("empty schema", () => {
    expect(f({}, {})).toHaveLength(0);
  });

  test("Optional", () => {
    const schema = {
      a: v.boolean
    };

    expect(f({ a: true }, schema)).toHaveLength(0);
    expect(f({ a: undefined }, schema)).toHaveLength(0);
    expect(f({}, schema)).toHaveLength(0);
  });

  test("Required", () => {
    const schema = {
      a: v.boolean.isRequired
    };

    expect(f({ a: true }, schema)).toHaveLength(0);
    expect(f({ a: undefined }, schema)).toHaveLength(1);
    expect(f({}, schema)).toHaveLength(1);
  });

  test("Extraneous properties", () => {
    const schema = {
      a: v.boolean
    };

    expect(f({ b: true, c: "string" }, schema)).toHaveLength(2);
  });

  test("Boolean", () => {
    const schema = {
      a: v.boolean.isRequired
    };

    expect(f({ a: true }, schema)).toHaveLength(0);
    expect(f({ a: false }, schema)).toHaveLength(0);
    expect(f({ a: "truthy value" }, schema)).toHaveLength(1);
    expect(f({ a: null }, schema)).toHaveLength(1);
    expect(f({ a: undefined }, schema)).toHaveLength(1);
  });

  test("Number", () => {
    const schema = {
      a: v.number.isRequired
    };

    expect(f({ a: 5 }, schema)).toHaveLength(0);
    expect(f({ a: -413 }, schema)).toHaveLength(0);
    expect(f({ a: 0 }, schema)).toHaveLength(0);
    expect(f({ a: Math.PI }, schema)).toHaveLength(0);
    expect(f({ a: Number.MAX_VALUE }, schema)).toHaveLength(0);
    expect(f({ a: Number.POSITIVE_INFINITY }, schema)).toHaveLength(0);
    expect(f({ a: Number.MIN_VALUE }, schema)).toHaveLength(0);
    expect(f({ a: Number.NaN }, schema)).toHaveLength(1);
    expect(f({ a: "truthy value" }, schema)).toHaveLength(1);
    expect(f({ a: null }, schema)).toHaveLength(1);
    expect(f({ a: undefined }, schema)).toHaveLength(1);
  });

  test("String", () => {
    const schema = {
      a: v.string.isRequired
    };

    expect(f({ a: "test" }, schema)).toHaveLength(0);
    expect(f({ a: "0" }, schema)).toHaveLength(0);
    expect(f({ a: "" }, schema)).toHaveLength(0);
    expect(f({ a: {} }, schema)).toHaveLength(1);
    expect(f({ a: [] }, schema)).toHaveLength(1);
  });

  test("Function", () => {
    const schema = {
      a: v.function.isRequired
    };

    expect(f({ a() {} }, schema)).toHaveLength(0);
    expect(f({ a: (x: any) => x }, schema)).toHaveLength(0);
    expect(f({ a: {} }, schema)).toHaveLength(1);
    expect(f({ a: false }, schema)).toHaveLength(1);
  });

  test("RegExp", () => {
    const schema = {
      a: v.regex.isRequired
    };

    expect(f({ a: /test/ }, schema)).toHaveLength(0);
    expect(f({ a: new RegExp("test") }, schema)).toHaveLength(0);
    expect(f({ a: {} }, schema)).toHaveLength(1);
    expect(f({ a: false }, schema)).toHaveLength(1);
  });

  describe("Value", () => {
    test("validator", () => {
      const schema = {
        a: v.value("value").isRequired
      };

      expect(f({ a: "value" }, schema)).toHaveLength(0);
      expect(f({ a: "not value" }, schema)).toHaveLength(1);
      expect(f({ a: undefined }, schema)).toHaveLength(1);
    });

    test("validator", () => {
      const value: any[] = [];
      const schema = {
        a: v.value(value).isRequired
      };

      expect(f({ a: value }, schema)).toHaveLength(0);
      expect(f({ a: [] }, schema)).toHaveLength(1);
      expect(f({ a: value.slice() }, schema)).toHaveLength(1);
    });
  });

  test("OneOf", () => {
    const schema = {
      a: v.oneOf([v.boolean, v.string]).isRequired
    };

    expect(f({ a: "test" }, schema)).toHaveLength(0);
    expect(f({ a: true }, schema)).toHaveLength(0);
    expect(f({ a: undefined }, schema)).toHaveLength(1);
    expect(f({ a: /regex/ }, schema)).toHaveLength(1);
    expect(f({ a() {} }, schema)).toHaveLength(1);
  });

  describe("ArrayOf", () => {
    test("optional", () => {
      const schema = {
        a: v.arrayOf(v.boolean).isRequired
      };

      expect(f({ a: [true, false] }, schema)).toHaveLength(0);
      expect(f({ a: [true, undefined] }, schema)).toHaveLength(0);
      expect(f({ a: [true, "test"] }, schema)).toHaveLength(1);
    });

    test("required", () => {
      const schema = {
        a: v.arrayOf(v.boolean.isRequired).isRequired
      };

      expect(f({ a: [true, false] }, schema)).toHaveLength(0);
      expect(f({ a: [true, undefined] }, schema)).toHaveLength(1);
    });
  });

  test("shape", () => {
    const schema = {
      a: v.shape({ bool: v.boolean.isRequired, string: v.string }).isRequired
    };

    expect(f({ a: { bool: true, string: "string" } }, schema)).toHaveLength(0);
    expect(f({ a: { bool: true } }, schema)).toHaveLength(0);
    expect(f({ a: { string: "string" } }, schema)).toHaveLength(1);
  });

  test("shape 2", () => {
    const schema = {
      a: v.shape({ bool: v.boolean.isRequired, string: v.string.isRequired }).isRequired
    };

    expect(f({ a: {} }, schema)).toHaveLength(1);
    expect(f({ a: true }, schema)).toHaveLength(1);
  });
});
