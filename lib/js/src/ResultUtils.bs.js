'use strict';

var Result$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/library/structure/Result.bs.js");

var handleFail = ((err) => {
    throw err;
});

function getExnSuccessValue(result) {
  return Result$Wonderjs.handleFail(result, handleFail);
}

function getExnSuccessValueIgnore(result) {
  Result$Wonderjs.handleFail(result, handleFail);
  
}

exports.handleFail = handleFail;
exports.getExnSuccessValue = getExnSuccessValue;
exports.getExnSuccessValueIgnore = getExnSuccessValueIgnore;
/* No side effect */
