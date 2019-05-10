# fastidious

Very small Javascript library to validate objects, similar to [prop-types](https://www.npmjs.com/package/prop-types).

## usage

```js
import { getErrors, validate } from "./fastidious.js";

getErrors({ value: true }, { value: validate.boolean }); // []

const schema = {
  match: validate.oneOf([validate.string, validate.function, validate.regex]).isRequired
};

getErrors({}, schema); // [ 'Error: Expected "config.match" to be oneOf: [string,function,regex]' ]

getErrors({ match: "test" }, schema); // []
```

## Validator API

```
validate.boolean
validate.string
validate.number
validate.function
validate.regex
validate.value(expectedValue)
validate.shape(schema)
validate.arrayOf(validator)
validate.oneOf([validators]))
```

## Advanced schema example

Used in [Finicky](https://github.com/johnste/finicky) to validate config file

```js
const schema = {
  defaultBrowser: validate.string.isRequired,
  options: validate.shape({
    hideIcon: validate.boolean,
    urlShorteners: validate.arrayOf(validate.string)
  }),
  rewrite: validate.arrayOf(
    validate.shape({
      match: validate.oneOf([validate.string, validate.function, validate.regex]).isRequired,
      url: validate.oneOf([validate.string, validate.function]).isRequired
    }).isRequired
  ),
  handlers: validate.arrayOf(
    validate.shape({
      match: validate.oneOf([
        validate.string,
        validate.function,
        validate.regex,
        validate.arrayOf(validate.oneOf([validate.string, validate.function, validate.regex]))
      ]).isRequired,
      browser: validate.oneOf([
        validate.string,
        validate.shape({
          name: validate.string.isRequired,
          type: validate.oneOf(["name", "bundleIdentifier"]).isRequired
        })
      ]).isRequired
    })
  )
};
```

## Credits

Icon made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [www.flaticon.com](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
