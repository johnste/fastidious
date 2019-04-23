function fastidious(object, schema, prefix = "config.", catchError = true) {
    const schemaKeys = Object.keys(schema).filter(key =>
        Object.prototype.hasOwnProperty.call(schema, key)
    );
    const objectKeys = Object.keys(object).filter(key =>
        Object.prototype.hasOwnProperty.call(object, key)
    );
    const errors = [];

    // Validate each property in schema
    schemaKeys.forEach(key => {
        try {
            const propChecker = schema[key];
            if (typeof propChecker === "function") {
                propChecker(object[key], prefix + key);
            } else if (["string", "number"].includes(typeof propChecker)) {
                fastidious.value(propChecker)(object[key], key);
            } else {
                throw new Error("Expected a validator at key " + prefix + key);
            }
        } catch (ex) {
            if (!catchError) {
                throw ex;
            }
            errors.push(ex.toString());
        }
    });

    // Check for extraneous properties in object
    objectKeys.forEach(key => {
        if (!schemaKeys.includes(key)) {
            errors.push("extraneous key " + prefix + key);
        }
    });

    return errors.length === 0 ? true : errors;
}

function formatValue(value) {
    if (value instanceof RegExp) {
        return value.toString();
    }

    return JSON.stringify(value);
}

function createValidator(typeName, typeCallback) {
    function isDefined(value) {
        return typeof value !== "undefined" && value !== null;
    }

    function checkType(value, key) {
        if (!isDefined(value)) {
            return true;
        }

        const valid = typeCallback(value, key);
        if (!valid) {
            throw new Error(
                `Value at ${key}: ${formatValue(value)} is not ${typeName}`
            );
        } else if (Array.isArray(valid)) {
            throw new Error(valid.join(", "));
        }
    }

    checkType.typeName = typeName;

    checkType.isRequired = function isRequired(value, key) {
        if (!isDefined(value)) {
            throw new Error(`Expected "${key}" to be ${typeName}`);
        }
        return checkType(value, key);
    };

    return checkType;
}

fastidious.boolean = createValidator(
    "boolean",
    value => typeof value === "boolean"
);
fastidious.string = createValidator(
    "string",
    value => typeof value === "string"
);
fastidious.number = createValidator(
    "number",
    value => typeof value === "number"
);
fastidious.function = createValidator(
    "function",
    value => typeof value === "function"
);
fastidious.regex = createValidator("regex", value => value instanceof RegExp);
fastidious.value = expectedValue =>
    createValidator(expectedValue, value => value === expectedValue);
fastidious.shape = schema =>
    createValidator("shape", (value, key) => {
        if (typeof value !== "object") {
            return false;
        }

        const valid = fastidious(value, schema, key + ".", false);
        return valid;
    });

fastidious.arrayOf = validator =>
    createValidator("array", (value, key) => {
        if (!Array.isArray(value)) {
            return false;
        }

        const errors = value.reduce((errors, item, index) => {
            try {
                validator(item, `${key}[${index}]`);
            } catch (ex) {
                return [...errors, ex.message];
            }
            return errors;
        }, []);

        return errors.length > 0 ? errors : true;
    });

fastidious.oneOf = OneOfs => {
    OneOfs = OneOfs.map(v => {
        if (["string", "number"].includes(typeof v)) {
            return fastidious.value(v);
        }
        return v;
    });
    const description = OneOfs.map(oneOf => oneOf.typeName);

    return createValidator(`oneOf: [${description}]`, (value, key) => {
        const errors = OneOfs.filter(oneof => {
            try {
                oneof(value);
            } catch (ex) {
                return true;
            }
            return false;
        });

        return errors.length === OneOfs.length
            ? [`${key}: Value not one of ${description}`]
            : true;
    });
};