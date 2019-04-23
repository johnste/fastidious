# fastidious
Very small Javascript library to validate objects. 


## usage

```js
const schema = {
    match: fastidious.oneOf([
        fastidious.string,
        fastidious.function,
        fastidious.regex
    ]).isRequired
};

fastidious({}, schema); // [ 'Error: Expected "config.match" to be oneOf: [string,function,regex]' ] 

fastidious({ match: "test" }, schema); // true

```

## Validator API

```
fastidious.boolean
fastidious.string
fastidious.number
fastidious.function
fastidious.regex
fastidious.value
fastidious.shape
fastidious.arrayOf
fastidious.oneOf
```

## Schema example 

Used in [Finicky](https://github.com/johnste/finicky) to validate config file

```js
const schema = {
    defaultBrowser: fastidious.string.isRequired,
    options: fastidious.shape({
        hideIcon: fastidious.boolean,
        urlShorteners: fastidious.arrayOf(fastidious.string)
    }),
    rewrite: fastidious.arrayOf(
        fastidious.shape({
            match: fastidious.oneOf([
                fastidious.string,
                fastidious.function,
                fastidious.regex
            ]).isRequired,
            url: fastidious.oneOf([fastidious.string, fastidious.function])
                .isRequired
        }).isRequired
    ),
    handlers: fastidious.arrayOf(
        fastidious.shape({
            match: fastidious.oneOf([
                fastidious.string,
                fastidious.function,
                fastidious.regex
            ]).isRequired,
            browser: fastidious.oneOf([
                fastidious.string,
                fastidious.shape({
                    name: fastidious.string.isRequired,
                    type: fastidious.oneOf(["name", "bundleIdentifier"])
                        .isRequired
                })
            ]).isRequired
        })
    )
};
```
