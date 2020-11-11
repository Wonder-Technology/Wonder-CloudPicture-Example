let Util = require("util");

let _printComplete = (value) => {
    console.log(Util.inspect(value, {
        maxArrayLength: null
    }));
    return value;
}

module.exports = { printComplete: _printComplete };