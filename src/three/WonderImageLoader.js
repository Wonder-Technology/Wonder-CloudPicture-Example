let fs = require("fs");
let { readImageFile } = require("../utils/ReadImage.js");

let _createTexture = (imageData) => {
    let texture = new THREE.DataTexture();
    texture.image = imageData;

    return texture;
};

function WonderImageLoader(_) {
}

WonderImageLoader.prototype = {
    constructor: WonderImageLoader,

    load: function (url, onLoad, onProgress, onError) {
        url = url.replace("file:", "");

        if (url[0] === "/" || url[0] === "\\") {
            url = url.slice(1);
        }

        let imageData = readImageFile(url);

        if (!onLoad) {
            throw new Error("onLoad should exist");
        }


        onLoad(_createTexture(imageData));
    }
};


module.exports = { WonderImageLoader, createTexture: _createTexture };
