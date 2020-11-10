let fs = require("fs");

let _readPNGFile = ((buf) => {
    var loadpng = require("@cwasm/lodepng");

    return loadpng.decode(buf);
});

let _readJPEGFile = ((buf) => {
    var jpegturbo = require("@cwasm/jpeg-turbo");

    return jpegturbo.decode(buf);
});

let _isPNGFile = (buffer) => {
    var viewU8 = new Uint8Array(buffer);
    if (viewU8[0] === 137 && viewU8[1] === 80 && viewU8[2] === 78) {
        return viewU8[3] === 71;
    } else {
        return false;
    }
}

let _isJPEGFile = (buffer) => {
    var viewU8 = new Uint8Array(buffer);
    if (viewU8[0] === 255 && viewU8[1] === 216 && viewU8[2] === 255) {
        return viewU8[3] === 224;
    } else {
        return false;
    }
}


let _convertToImageData = (buf) => {
    if (_isPNGFile(buf)) {
        return _readPNGFile(buf);
    } else if (_isJPEGFile(buf)) {
        return _readJPEGFile(buf);
    } else {
        throw new Error("Cannot process image file $path");
    }
}

let _readImageFile = (path) => {
    var buf = fs.readFileSync(path);

    return _convertToImageData(buf);
}

module.exports = { readImageFile: _readImageFile, convertToImageData: _convertToImageData };