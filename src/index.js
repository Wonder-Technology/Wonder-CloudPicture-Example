
var perf_hooks = require("perf_hooks");

var wonderWebgpu = require("wonder-webgpu");

// var THREE = require("./three/three.wonder.js");


global.self = global;
global.atob = require('atob');

global.Blob = require('cross-blob');


// let sizeOf = require('image-size');



// global.fetch = (url, options) => {
//     let fs = require("fs");


//     url = url.replace("file:", "");

//     if (url[0] === "/" || url[0] === "\\") {
//         url = url.slice(1);
//     }

//     console.log("url:", url)

//     if (!url.includes(".png") && !url.includes(".jpg") && !url.includes(".jpeg")) {
//         throw new Error("not support fetch url:" + url);
//     }

//     return new Promise((resolve, reject) => {
//         fs.readFile(url, function (error, data) {
//             if (error) {
//                 console.error("fetch error: ", error);
//                 reject(JSON.stringify(error));
//             } else {
//                 resolve(
//                     {
//                         blob: () => {
//                             return new Promise((resolve, reject) => {
//                                 sizeOf(url, function (err, dimensions) {
//                                     if (err) {
//                                         reject(JSON.stringify(err));
//                                     }

//                                     let blob = new Blob([new Uint8Array(data.buffer)]);
//                                     blob.imageWidth = dimensions.width;
//                                     blob.imageHeight = dimensions.height;

//                                     resolve(blob);
//                                 });


//                             });
//                         }
//                     }
//                 )
//             }
//         });
//     });
// };









// global.URL = require('url');

// URL.createObjectURL = (blob) => {
//     return new Promise(resolve => {
//         blob.arrayBuffer().then(buffer => {
//             const base64 = new Buffer.from(buffer).toString('base64');


//             let type = "";
//             switch (blob.type) {
//                 case "image/png":
//                 case "image/jpeg":
//                     type = blob.type;
//                     break;
//                 default:
//                     throw new Error("unknwon blob type:" + blob.type);
//             }

//             const completedURI = `data:` + type + `;base64,` + base64;
//             console.log("completedURI.length:",completedURI.length)
//             resolve(completedURI);
//         });
//     })
// };


// global.createImageBitmap = (blob, options) => {
//     console.log("createImageBitmap:", blob, options)

//     return new Promise((resolve, reject) => {
//         blob.arrayBuffer()
//             .then(data => {
//                 resolve({
//                     width: blob.imageWidth,
//                     height: blob.imageHeight,
//                     data: new Uint8Array(data)
//                 })
//             })

//     })
// };

// global.createImageBitmap = undefined;

// global.navigator = {
//     userAgent: "nodejs"
// }


global.XMLHttpRequest = require("./lib/XMLHttpRequest.js").XMLHttpRequest;


let THREE = require("./three/three.wonder.js");

global.THREE = THREE;



require("./three/GLTFLoader.js");
require("./three/BufferGeometryUtils");

var { set: setConfigDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/ConfigDpCPAPI.bs.js");
var { set: setSceneGraphRepoDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/SceneGraphRepoDpCPAPI.bs.js");
var { set: setImageRepoDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/ImageRepoDpCPAPI.bs.js");
var { set: setWebGPUCoreDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/WebGPUCoreDpCPAPI.bs.js");
var { set: setWebGPURayTracingDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/WebGPURayTracingDpCPAPI.bs.js");
var { set: setTimeDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/TimeDpCPAPI.bs.js");
var { set: setConfigDp } = require("wonder.js/lib/js/src/run/external_layer/api/dependency/ConfigDpCPAPI.bs.js");
var { prepare, init, update, render } = require("wonder.js/lib/js/src/run/external_layer/api/DirectorCPAPI.bs.js");
var { setTextureArrayLayerSize } = require("wonder.js/lib/js/src/run/external_layer/api/WebGPUCPAPI.bs.js");



let _imageDataMap = {};

let _getImageData = (imageId) => {
    return _imageDataMap[imageId];
}

let _setImageData = (imageId, imageData) => {
    _imageDataMap[imageId] = imageData;
}



let _isLoadGLTFFlag = false;

let _isLoadGLTF = () => {
    return _isLoadGLTFFlag;
}

let _markIsLoadGLTF = (isLoadGLTF) => {
    _isLoadGLTFFlag = isLoadGLTF;
}



let _convertDegToRad = (degArr) => {
    let deg_to_rad = Math.PI / 180;

    return degArr.map((deg) => deg * deg_to_rad);
};


let _log = (param1, param2) => {
    // console.log(param1, param2);
}

let _logGeometryData = (param1, param2) => {
    // console.log(param1, param2);
}

let _logMaterialData = (param1, param2) => {
    // console.log(param1, param2);
}

let _fatal = (message) => {
    throw new Error(message);
}


let _fatal2 = (message, data) => {
    console.error(message, data);
    throw new Error(message);
}

let _createCamera = (localPositionOpt, lookAtOpt) => {
    var localPosition = localPositionOpt !== undefined ? localPositionOpt : [
        0.1,
        1.1,
        20
    ];


    let camera = new THREE.PerspectiveCamera(60, 640 / 480, 0.01, 100000);

    camera.position.set(localPosition[0], localPosition[1], localPosition[2]);


    var lookAt = lookAtOpt !== undefined ? lookAtOpt : [
        0, 0, 0
    ];

    camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));

    return camera;
}

let _createDirectionLight = ([x, y, z]) => {
    let light = new THREE.DirectionalLight(0xffffff, 5.0);

    // light.position.set(0, 1, 0.3);
    // light.position.set(0, 1, -0.3);
    // light.position.set(0, 1, 1.0);
    // light.position.set(0, 1, -1.0);
    // light.position.set(0, 1, 1.0);
    light.position.set(x, y, z).normalize();

    let target = new THREE.Object3D();

    return [light, target];
};

let _setMapRelatedData = (setMaterialMapFunc, mapImageIdOpt) => {
    let { readImageFile } = require("./utils/ReadImage.js");
    let { createTexture } = require("./three/WonderImageLoader.js");

    let imageDataArr = [
        [
            "emissionMap1",
            "./asset/BoomBox/glTF/BoomBox_emissive.png"
        ],
        [
            "normalMap1",
            "./asset/BoomBox/glTF/BoomBox_normal.png"
        ],
        [
            "diffuseMap1",
            "./asset/BoomBox/glTF/BoomBox_baseColor.png"
        ],
        [
            "metalRoughnessMap1",
            "./asset/BoomBox/glTF/BoomBox_metallicRoughness.png"
        ],
        [
            "emissionMap2",
            "./asset/DamagedHelmet/glTF/Default_emissive.jpg"
        ],
        [
            "normalMap2",
            "./asset/DamagedHelmet/glTF/Default_normal.jpg"
        ],
        [
            "diffuseMap2",
            "./asset/DamagedHelmet/glTF/Default_albedo.jpg"
        ],
        [
            "metalRoughnessMap2",
            "./asset/DamagedHelmet/glTF/Default_metalRoughness.jpg"
        ],
    ];

    if (mapImageIdOpt === undefined) {
        return;
    }

    let mapImageId = mapImageIdOpt;


    let data = null;
    if (!!_getImageData(mapImageId)) {
        data = _getImageData(mapImageId);
    }
    else {

        let result =
            imageDataArr.find(([imageId, _]) => {
                return imageId === mapImageId;
            });

        if (!result) {
            _fatal("not find image! image id is:" + String(mapImageId));
        }

        let [_, imagePath] = result;

        data = readImageFile(imagePath);

        _setImageData(mapImageId, data);
    }

    let texture = new THREE.DataTexture();
    texture.image = data;

    setMaterialMapFunc(createTexture(data))
};

let _createMaterial = (
    specular, specularColor, metalness, roughness, transmission, diffuse, diffuseMapImageIdOpt, normalMapImageIdOpt, emissionMapImageIdOpt, channelRoughnessMetallicMapImageIdOpt,
) => {
    let material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(diffuse[0], diffuse[1], diffuse[2]),
        metalness,
        roughness,
        // specular,
        // ior,
        transmission,
        // map: diffuseMapImageIdOpt,
        // emissiveMap: emissionMapImageIdOpt,
        // normalMap: normalMapImageIdOpt,
        // metalnessMap: channelRoughnessMetallicMapImageIdOpt,
        // roughnessMap: channelRoughnessMetallicMapImageIdOpt,

        // transmissionMap: 
        // specularMap: 
    });


    _setMapRelatedData((texture) => { material.map = texture }, diffuseMapImageIdOpt);
    _setMapRelatedData((texture) => { material.emissiveMap = texture }, emissionMapImageIdOpt);
    _setMapRelatedData((texture) => { material.normalMap = texture }, normalMapImageIdOpt);
    _setMapRelatedData((texture) => {
        material.metalnessMap = texture;
        material.roughnessMap = texture;
    }, channelRoughnessMetallicMapImageIdOpt);

    return material;
};

let _createSphere = (localPosition, localEulerAnglesOpt, radiusOpt, specularOpt, specularColorOpt, metalnessOpt, roughnessOpt, transmissionOpt, diffuseOpt, diffuseMapImageIdOptOpt, normalMapImageIdOptOpt, emissionMapImageIdOptOpt, channelRoughnessMetallicMapImageIdOptOpt) => {
    var localEulerAngles = localEulerAnglesOpt !== undefined ? localEulerAnglesOpt : [
        0,
        0,
        0
    ];
    localEulerAngles = _convertDegToRad(localEulerAngles);

    var radius = radiusOpt !== undefined ? radiusOpt : 2;
    var specular = specularOpt !== undefined ? specularOpt : 1.0;
    var specularColor = specularColorOpt !== undefined ? specularColorOpt : [
        1.0,
        1.0,
        1.0
    ];
    var metalness = metalnessOpt !== undefined ? metalnessOpt : 0.0;
    var roughness = roughnessOpt !== undefined ? roughnessOpt : 0.0;
    var transmission = transmissionOpt !== undefined ? transmissionOpt : 0.0;
    var diffuse = diffuseOpt !== undefined ? diffuseOpt : [
        1.0,
        1.0,
        1.0
    ];
    var diffuseMapImageIdOpt = diffuseMapImageIdOptOpt !== undefined ? (diffuseMapImageIdOptOpt) : undefined;
    var normalMapImageIdOpt = normalMapImageIdOptOpt !== undefined ? (normalMapImageIdOptOpt) : undefined;
    var emissionMapImageIdOpt = emissionMapImageIdOptOpt !== undefined ? (emissionMapImageIdOptOpt) : undefined;
    var channelRoughnessMetallicMapImageIdOpt = channelRoughnessMetallicMapImageIdOptOpt !== undefined ? (channelRoughnessMetallicMapImageIdOptOpt) : undefined;


    let geometry = new THREE.SphereGeometry(radius, 20, 20);
    // let geometry = new THREE.SphereGeometry(radius, 4, 4);

    let material = _createMaterial(
        specular, specularColor, metalness, roughness, transmission, diffuse, diffuseMapImageIdOpt, normalMapImageIdOpt, emissionMapImageIdOpt, channelRoughnessMetallicMapImageIdOpt,
    );

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(localPosition[0], localPosition[1], localPosition[2]);
    mesh.rotation.set(localEulerAngles[0], localEulerAngles[1], localEulerAngles[2]);

    return mesh;
}

let _createPlane = (localPosition, localEulerAnglesOpt, widthOpt, heightOpt, specularOpt, specularColorOpt, metalnessOpt, roughnessOpt, transmissionOpt, diffuseOpt, diffuseMapImageIdOptOpt, normalMapImageIdOptOpt, emissionMapImageIdOptOpt, channelRoughnessMetallicMapImageIdOptOpt) => {
    var localEulerAngles = localEulerAnglesOpt !== undefined ? localEulerAnglesOpt : [
        0,
        0,
        0
    ];
    localEulerAngles = _convertDegToRad(localEulerAngles);


    var width = widthOpt !== undefined ? widthOpt : 50;
    var height = heightOpt !== undefined ? heightOpt : 50;
    var specular = specularOpt !== undefined ? specularOpt : 1.0;
    var specularColor = specularColorOpt !== undefined ? specularColorOpt : [
        1.0,
        1.0,
        1.0
    ];
    var metalness = metalnessOpt !== undefined ? metalnessOpt : 0.0;
    var roughness = roughnessOpt !== undefined ? roughnessOpt : 0.0;
    var transmission = transmissionOpt !== undefined ? transmissionOpt : 0.0;
    var diffuse = diffuseOpt !== undefined ? diffuseOpt : [
        0.0,
        0.0,
        0.0
    ];
    var diffuseMapImageIdOpt = diffuseMapImageIdOptOpt !== undefined ? (diffuseMapImageIdOptOpt) : undefined;
    var normalMapImageIdOpt = normalMapImageIdOptOpt !== undefined ? (normalMapImageIdOptOpt) : undefined;
    var emissionMapImageIdOpt = emissionMapImageIdOptOpt !== undefined ? (emissionMapImageIdOptOpt) : undefined;
    var channelRoughnessMetallicMapImageIdOpt = channelRoughnessMetallicMapImageIdOptOpt !== undefined ? (channelRoughnessMetallicMapImageIdOptOpt) : undefined;


    let geometry = new THREE.PlaneGeometry(width, height, 1, 1);

    let material = _createMaterial(
        specular, specularColor, metalness, roughness, transmission, diffuse, diffuseMapImageIdOpt, normalMapImageIdOpt, emissionMapImageIdOpt, channelRoughnessMetallicMapImageIdOpt
    );

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(localPosition[0], localPosition[1], localPosition[2]);
    mesh.rotation.set(localEulerAngles[0], localEulerAngles[1], localEulerAngles[2]);

    return mesh;
}

let _hasMap = (map) => map !== undefined && map !== null;

// let _fixGLTFLoadedScene = (gltfScene) => {
//     gltfScene.traverse((object) => {
//         if (!object.material) {
//             return;
//         }

//         let material = object.material;

//         if (_hasMap(material.map)) {
//             material.color.set(0.0, 0.0, 0.0);
//         }
//     });
// };


let _getCameraFromScene = (scene) => scene.wonder_camera;

let _setCameraToScene = (camera, scene) => scene.wonder_camera = camera;


let _buildScene1 = () => {
    let camera = _createCamera();

    let [light, lightTarget] = _createDirectionLight();
    light.wonder_target = lightTarget;

    let scene = new THREE.Scene();

    scene.add(light);
    scene.add(lightTarget);

    scene.add(_createSphere([
        5.0,
        0.0,
        5.0
    ], undefined, undefined, 0.95, undefined, 0.3, 0.07, undefined, [
        0.5,
        0.5,
        0.1
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(_createSphere([
        -5.0,
        0.0,
        5.0
    ], undefined, undefined, 0.2, undefined, 0.1, 0.05, undefined, [
        0.0,
        1.0,
        0.1
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(
        _createPlane([
            0,
            -10,
            -5
        ], [
            -90,
            0,
            0
        ], undefined, undefined, 0.95, undefined, 0.6, 0.03, undefined, [
            0,
            0,
            1
        ], undefined, undefined, undefined, undefined, undefined)
    );

    _setCameraToScene(camera, scene);

    return [camera, scene];
}


let _buildScene2 = () => {
    let camera = _createCamera();

    let [light, lightTarget] = _createDirectionLight();
    light.wonder_target = lightTarget;

    let scene = new THREE.Scene();

    scene.add(light);
    scene.add(lightTarget);

    scene.add(_createSphere([
        5.0,
        0.0,
        5.0
    ], undefined, undefined, 0.95, undefined, undefined, undefined, undefined, undefined, "diffuseMap1", "normalMap1", "emissionMap1", "metalRoughnessMap1", undefined));

    scene.add(_createSphere([
        -5.0,
        0.0,
        5.0
    ], [
        0,
        90,
        0
    ], undefined, 0.95, undefined, undefined, undefined, undefined, undefined, "diffuseMap1", "normalMap1", "emissionMap1", "metalRoughnessMap1", undefined));

    scene.add(_createPlane([
        0,
        -10,
        -5
    ], [
        -90,
        0,
        0
    ], undefined, undefined, 0.95, undefined, undefined, undefined, undefined, undefined, "diffuseMap2", "normalMap2", "emissionMap2", "metalRoughnessMap2", undefined));

    _setCameraToScene(camera, scene);

    return [camera, scene];
}


let _buildScene3 = () => {
    let camera = _createCamera([
        0.1,
        1.1,
        25
    ]);

    let [light, lightTarget] = _createDirectionLight();
    light.wonder_target = lightTarget;

    let scene = new THREE.Scene();

    scene.add(light);
    scene.add(lightTarget);

    scene.add(_createSphere([
        0.0,
        0.0,
        0.0
    ], undefined, undefined, 1.0, undefined, 0.3, 0.07, 1.0, [
        0.5,
        0.5,
        0.1
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(_createSphere([
        8.0,
        0.0,
        7.0
    ], undefined, undefined, 1.0, undefined, 0.3, 0.07, undefined, [
        1.0,
        0.0,
        0.0
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(_createSphere([
        -7.0,
        3.0,
        0.0
    ], undefined, undefined, undefined, undefined, 0.3, 0.07, 0.7, [
        0.0,
        0.0,
        1.0
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(_createPlane([
        -6,
        0,
        7.0
    ], [
        180.0,
        0.0,
        0.0
    ], 5, 5, undefined, undefined, 0.6, 0.03, 1.0, undefined, undefined, undefined, undefined, undefined, undefined));

    scene.add(_createPlane([
        -7.0,
        2.0,
        8.0
    ], undefined, 5, 5, undefined, undefined, 0.6, 0.03, 0.7, [
        0,
        0,
        1
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(_createPlane([
        0,
        0,
        -20
    ], [
        0,
        0,
        0
    ], undefined, undefined, undefined, undefined, 0.6, 0.03, undefined, [
        1,
        0,
        0
    ], undefined, undefined, undefined, undefined, undefined));

    scene.add(_createPlane([
        0,
        -10,
        0
    ], [
        -90,
        0,
        0
    ], undefined, undefined, undefined, undefined, 0.6, 0.03, undefined, [
        0,
        0,
        1
    ], undefined, undefined, undefined, undefined, undefined));

    _setCameraToScene(camera, scene);

    return [camera, scene];
}

let _createDefaultCamera = (gltfScene, getCameraPositionFunc, getCameraTargetFunc) => {
    let box3 = new THREE.Box3().setFromObject(gltfScene);

    let boxSize = new THREE.Vector3();
    box3.getSize(boxSize);

    return _createCamera(
        getCameraPositionFunc(boxSize),
        getCameraTargetFunc(boxSize)
    );
};

let _findMaxMapSize = (scene) => {
    let maxMapSize = [2048, 2048];

    scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            let material = child.material;

            maxMapSize =
                [
                    _getDiffuseMap(material),
                    _getNormalMap(material),
                    _getChannelRoughnessMetallicMap(material)
                ].reduce(([width, height], map) => {
                    if (_hasMap(map)) {
                        let image = map.image;

                        return [
                            image.width > width ? image.width : width,
                            image.height > height ? image.height : height,
                        ]
                    }

                    return [width, height];
                }, maxMapSize);
        }
    });

    return maxMapSize;
};

let _loadGLTF = ({ modelDirPath, modelName, directionLightPosition, getCameraPositionFunc, getCameraTargetFunc }) => {
    let path = require("path");

    let loader = new THREE.GLTFLoader().setPath(path.join("file:", __dirname, modelDirPath));
    return new Promise((resolve, reject) => {
        loader.load(modelName, function (gltf) {
            let scene = gltf.scene;

            // _fixGLTFLoadedScene(scene);

            let [mapMaxWidth, mapMaxHeight] = _findMaxMapSize(scene);


            setTextureArrayLayerSize(mapMaxWidth, mapMaxHeight);




            let directionalLight = null;
            let directionLightTarget = null;

            let sceneDirectionLights = [];
            scene.traverse(function (child) {
                if (child instanceof THREE.DirectionalLight) {
                    sceneDirectionLights.push(child);
                }
            });

            if (sceneDirectionLights.length > 0) {
                directionalLight = sceneDirectionLights[0];
                directionLightTarget = new THREE.Object3D();
            }
            else {
                let [light, lightTarget] = _createDirectionLight(directionLightPosition);
                directionalLight = light;
                directionLightTarget = lightTarget;
            }

            directionalLight.wonder_target = directionLightTarget;

            scene.add(directionalLight);
            scene.add(directionLightTarget);




            let camera = null;
            // TODO support OrthoCamera
            let scenePerspectiveCameras = [];
            scene.traverse(function (child) {
                if (child instanceof THREE.PerspectiveCamera) {
                    scenePerspectiveCameras.push(child);
                }
            });

            if (scenePerspectiveCameras.length > 0) {
                camera = scenePerspectiveCameras[0];
            }
            else {
                camera = _createDefaultCamera(scene, getCameraPositionFunc, getCameraTargetFunc);
            }

            _setCameraToScene(camera, scene);

            resolve([camera, scene]);
        });
    });
}


let _convertTangentsFromFourToThree = (tangents) => {
    let j = 0;
    let resultArr = [];
    for (let i = 0; i < tangents.length / 4; i++) {
        let index = i * 4;
        resultArr.push(
            tangents[index],
            tangents[index + 1],
            tangents[index + 2],
        );
    }

    return new Float32Array(resultArr);
};


let _hasAttribute = (bufferGeometry, attributeName) => {
    return bufferGeometry.getAttribute(attributeName) !== undefined;
};

let _isGeometryHasVertexData = (bufferGeometry) => {
    let attribute = bufferGeometry.getAttribute("position");

    return attribute !== undefined && attribute.count > 0;
}


let _getNullablePoints = (bufferGeometry, attributeName) => {
    if (_hasAttribute(bufferGeometry, attributeName)) {
        let result = bufferGeometry.getAttribute(attributeName).array;
        _logGeometryData("get " + attributeName + ":", result);
        return result;
    }

    return undefined;
};

let _getExistPoints = (bufferGeometry, attributeName) => {
    if (_hasAttribute(bufferGeometry, attributeName)) {
        let result = bufferGeometry.getAttribute(attributeName).array;
        _logGeometryData("get " + attributeName + ":", result);
        return result;
    }

    _fatal(attributeName + " should exist!");
}

let _isNeedComputeTangents = (bufferGeometry) => {
    return _hasAttribute(bufferGeometry, "position") && _hasAttribute(bufferGeometry, "normal") && _hasAttribute(bufferGeometry, "uv") && _hasIndices(bufferGeometry);
};


let _getDiffuseMap = (material) => material.map;

let _getNormalMap = (material) => material.normalMap;

let _getChannelRoughnessMetallicMap = (material) => {
    if (!(_hasMap(material.metalnessMap) && _hasMap(material.roughnessMap)) && !(!_hasMap(material.metalnessMap) && !_hasMap(material.roughnessMap))) {
        _fatal("only support metallicRoughnessTexture, not support metallicTexture or rougnessTexture!")
    }

    return material.metalnessMap;
}

let _getMapImageData = (map) => {
    let { width, height, data } = map.image;

    return {
        width,
        height,
        data
    }
}


let _getMapImageIdAndSetImageData = (map) => {
    if (_hasMap(map)) {
        let imageId = map.uuid;

        _setImageData(imageId, _getMapImageData(map));

        return imageId;
    }

    return undefined;
};


let _getMapImageWrap = (wrap) => {
    if (wrap === THREE.ClampToEdgeWrapping) {
        return 0;
    }

    if (wrap === THREE.RepeatWrapping) {
        return 1;
    }

    if (wrap === THREE.MirroredRepeatWrapping) {
        return 2;
    }

    _fatal("unknown wrap:" + wrap);
}

let _getMapImageWrapData = (map) => {
    if (_hasMap(map)) {
        return [_getMapImageWrap(map.wrapS), _getMapImageWrap(map.wrapT)];
    }

    return undefined;
}



let _setAllDp = (scene) => {
    let _getFromVector3 = (vec3) => {
        return [vec3.x, vec3.y, vec3.z];
    }

    let _getFromQuaternion = (quat) => {
        return [quat.x, quat.y, quat.z, quat.w];
    }

    let _getFromEuler = (euler) => {
        return [euler.x, euler.y, euler.z];
    }

    let _getFromMatrix4 = (mat4) => {
        return mat4.elements;
    }

    let _getFromMatrix3 = (mat3) => {
        return mat3.elements;
    }

    let _getFromColor = (color) => {
        return [color.r, color.g, color.b];
    }

    var _loadShaderFile = ((srcPath) => {
        var fs = require("fs");
        var path = require("path");

        function findIncludedFile(filePath, includes) {
            let matches = [];
            for (let ii = 0; ii < includes.length; ++ii) {
                let incl = includes[ii];
                let stats = fs.lstatSync(incl);
                if (!stats.isDirectory()) {
                    _fatal(`Include path '${incl}' is not a directory`);
                }
                let includeFilePath = path.join(incl, filePath);
                if (fs.existsSync(includeFilePath) && fs.lstatSync(includeFilePath).isFile()) {
                    try {
                        matches.push(fs.readFileSync(includeFilePath, "utf-8"));
                    } catch (e) {
                        _fatal(`Cannot read included file from '${includeFilePath}'`);
                    }
                } else {
                    _fatal(`Failed to resolve file include path for '${filePath}': '${includeFilePath}' is not a valid file path`);
                }
            };
            if (matches.length <= 0) {
                _fatal(`Cannot inline included file '${filePath}'`);
            }
            if (matches.length > 1) {
                _fatal(`Ambigious include directive for '${filePath}'. More than one match was found`);
            }
            return matches[0];
        };

        function flattenShaderIncludes(source, includeDirectories) {
            let rx = /#include ((<[^>]+>)|("[^"]+"))/g;
            let match = null;
            while (match = rx.exec(source)) {
                let filePath = match[1].slice(1, -1);
                let start = match.index;
                let length = match[0].length;
                let includedFile = flattenShaderIncludes(
                    findIncludedFile(filePath, includeDirectories),
                    includeDirectories
                );
                source = source.substr(0, start) + includedFile + source.substr(start + length);
            };
            return source;
        };

        function loadShaderFile(srcPath) {
            let src = fs.readFileSync(srcPath, "utf-8");
            let flattened = flattenShaderIncludes(src, [path.dirname(srcPath)]);
            return flattened;
        };

        return loadShaderFile(srcPath);
    });


    let _getRotation = (transform) => {
        let worldRotation = new THREE.Quaternion();

        return transform.getWorldQuaternion(worldRotation);
    };


    let _getGeometryId = (geometry) => {
        return geometry.id;
    };

    let _getMaterialId = (material) => {
        return material.id;
    };


    let _getSceneGameObject = () => scene;


    setConfigDp({
        getIsDebug: (() => {
            return true;
        })
    });
    setTimeDp({
        getNow: (() => {
            return perf_hooks.performance.now();
        })
    });


    setSceneGraphRepoDp({
        sceneRepo: {
            getSceneGameObject: () => _getSceneGameObject()
        },
        gameObjectRepo: {
            getTransform: (gameObject) => {
                return gameObject;
            },
            getBSDFMaterial: (gameObject) => {
                return gameObject.material;
            },
            getGeometry: (gameObject) => {
                return gameObject.geometry;
            },
            getDirectionLight: (gameObject) => {
                return gameObject;
            },
            getBasciCameraView: (gameObject) => {
                return gameObject;
            },
            getPerspectiveCameraProjection: (gameObject) => {
                return gameObject;
            },
            getAllGeometryGameObjects: (scene) => {
                let result = [];

                scene.traverse((object) => {
                    if (!object.geometry) {
                        return;
                    }

                    let geometry = object.geometry;

                    if (_isGeometryHasVertexData(geometry)) {
                        result.push(object);
                    }
                });

                return result;
            },
            getAllGameObjectGeometries: (scene) => {
                let result = [];

                scene.traverse((object) => {
                    if (!object.geometry) {
                        return;
                    }

                    let geometry = object.geometry;

                    if (_isGeometryHasVertexData(geometry)) {
                        result.push(geometry);
                    }
                });

                return result;
            },
            getAllGameObjectBSDFMaterials: (scene) => {
                let result = [];

                scene.traverse((object) => {
                    if (!object.material) {
                        return;
                    }

                    let material = object.material;

                    result.push(material);
                });

                return result;
            }
        },
        transformRepo: {
            getLocalToWorldMatrix: (transform) => {
                let result = _getFromMatrix4(transform.matrixWorld);

                _log("getLocalToWorldMatrix:", result);
                return result;
            },
            getNormalMatrix: (transform) => {
                let result = _getFromMatrix3(
                    new THREE.Matrix3().getNormalMatrix(
                        transform.matrixWorld
                    )
                );

                _log("getNormalMatrix:", result);
                return result;
            },
            getLocalPosition: (transform) => {
                let result = _getFromVector3(transform.position);

                _log("getLocalPosition:", result);
                return result;
            },
            getLocalRotation: (transform) => {
                let result = _getFromQuaternion(transform.quaternion);

                _log("getLocalRotation:", result);
                return result;
            },
            getLocalEulerAngles: (transform) => {
                let result = _getFromEuler(transform.rotation);

                _log("getLocalEulerAngles:", result);
                return result;
            },
            getLocalScale: (transform) => {
                let result = _getFromVector3(transform.scale);

                _log("getLocalScale:", result);
                return result;
            },
            getPosition: (transform) => {
                let worldPosition = new THREE.Vector3();

                let result = _getFromVector3(transform.getWorldPosition(worldPosition));

                _log("getPosition:", result);
                return result;
            },
            getRotation: (transform) => {
                let result = _getFromQuaternion(_getRotation(transform));

                _log("getRotation:", result);

                return result;
            },
            getScale: (transform) => {
                let worldScale = new THREE.Vector3();

                let result = _getFromVector3(transform.getWorldScale(worldScale));

                _log("getScale:", result);
                return result;
            },
        },
        directionLightRepo: {
            getColor: (light) => {
                let result = _getFromVector3(light.color);
                _log("getColor:", result);
                return result;
            },
            getIntensity: (light) => {
                let result = light.intensity;
                _log("getIntensity:", result);
                return result;
            },
            getDirection: (light) => {
                let target = light.wonder_target;

                let result = new THREE.Vector3();
                result = _getFromVector3(
                    result.setFromMatrixPosition(
                        light.matrixWorld
                    )
                        .sub(
                            new THREE.Vector3().setFromMatrixPosition(
                                target.matrixWorld
                            )
                        )
                );
                _log("getDirection:", result);
                return result;
            },
            getAllLights: (scene) => {
                let result = [];

                scene.traverse((object) => {
                    if (object instanceof THREE.DirectionalLight) {
                        result.push(object);
                    }
                });

                if (result.length > 1) {
                    console.warn("direction lights' length > 1! only use the first one!");

                    result = [result[0]];
                }

                _log("getAllLights:", result);
                return result;

            }
        },
        basicCameraViewRepo: {
            getGameObject: (cameraView) => {
                let result = cameraView;
                _log("getGameObject:", result);
                return result;
            },
            getViewWorldToCameraMatrix: (cameraView) => {
                let result = _getFromMatrix4(cameraView.matrixWorldInverse);
                _log("getViewWorldToCameraMatrix:", result);
                return result;
            },
            getActiveBasicCameraView: (scene) => {
                let result = _getCameraFromScene(scene);
                _log("getActiveBasicCameraView:", result);
                return result;
            }
        },
        perspectiveCameraProjectionRepo: {
            getPMatrix: (cameraProjection) => {
                let result = _getFromMatrix4(cameraProjection.projectionMatrix);
                _log("getPMatrix:", result);
                return result;
            },
            getFovy: (cameraProjection) => {
                let result = cameraProjection.fov;
                _log("getFovy:", result);
                return result;
            },
            getAspect: (cameraProjection) => {
                let result = cameraProjection.aspect;
                _log("getAspect:", result);
                return result;
            },
            getNear: (cameraProjection) => {
                let result = cameraProjection.near;
                _log("getNear:", result);
                return result;
            },
            getFar: (cameraProjection) => {
                let result = cameraProjection.far;
                _log("getFar:", result);
                return result;
            },
        },
        bsdfMaterialRepo: {
            getDiffuseColor: (material) => {
                let [r, g, b] = _getFromColor(material.color);
                let result = [r, g, b, material.opacity];
                _logMaterialData("getDiffuseColor:", result);
                return result;
            },
            getSpecular: (material) => {
                let result = 1.0;
                _logMaterialData("getSpecular:", result);
                return result;
            },
            getSpecularColor: (material) => {
                let result = [1.0, 1.0, 1.0];
                _logMaterialData("getSpecularColor:", result);
                return result;
            },
            getRoughness: (material) => {
                let result = material.roughness;
                result = result === undefined ? 0.0 : result;
                _logMaterialData("getRoughness:", result);
                return result;
            },
            getMetalness: (material) => {
                let result = material.metalness;
                result = result === undefined ? 0.0 : result;
                _logMaterialData("getMetalness:", result);
                return result;
            },
            getTransmission: (material) => {
                let result = material.transmission;
                result = result === undefined ? 0.0 : result;
                _logMaterialData("getTransmission:", result);
                return result;
            },
            getIOR: (material) => {
                let result = material.ior;
                result = result === undefined ? 1.5 : result;
                _logMaterialData("getIOR:", result);
                return result;
            },
            getDiffuseMapImageId: (material) => {
                let result = _getMapImageIdAndSetImageData(
                    _getDiffuseMap(material)
                );
                _logMaterialData("getDiffuseMapImageId:", result);
                return result;
            },
            getChannelRoughnessMetallicMapImageId: (material) => {
                let result = _getMapImageIdAndSetImageData(_getChannelRoughnessMetallicMap(material));
                _logMaterialData("getChannelRoughnessMetallicMapImageId:", result);
                return result;
            },
            getEmissionMapImageId: (material) => {
                let result = _getMapImageIdAndSetImageData(material.emissiveMap);
                _logMaterialData("getEmissionMapImageId:", result);
                return result;
            },
            getNormalMapImageId: (material) => {
                let result = _getMapImageIdAndSetImageData(_getNormalMap(material));
                _logMaterialData("getNormalMapImageId:", result);
                return result;
            },
            getTransmissionMapImageId: (material) => {
                let result = _getMapImageIdAndSetImageData(material.transmissionMap);
                _logMaterialData("getTransmissionMapImageId:", result);
                return result;
            },
            getSpecularMapImageId: (material) => {
                let result = undefined;
                _logMaterialData("getSpecularMapImageId:", result);
                return result;
            },
            getAlphaCutoff: (material) => {
                _logMaterialData("getAlphaCutoff:", [material.transparent, material.alphaTest]);

                if (material.transparent === true) {
                    return 1.0;
                }

                if (material.alphaTest !== undefined) {
                    return material.alphaTest;
                }

                return 0.0;
            },
            isSame: (material1, material2) => {
                let result = _getMaterialId(material1) === _getMaterialId(material2);
                _logMaterialData("isSame:", result);
                return result;
            },
            getId: _getMaterialId,
            getDiffuseMapImageWrapData: (material) => {
                let result = _getMapImageWrapData(_getDiffuseMap(material));
                _logMaterialData("getDiffuseMapImageWrapData:", result);
                return result;
            },
            getChannelRoughnessMetallicMapImageWrapData: (material) => {
                let result = _getMapImageWrapData(_getChannelRoughnessMetallicMap(material));
                _logMaterialData("getChannelRoughnessMetallicMapImageWrapData:", result);
                return result;
            },
            getEmissionMapImageWrapData: (material) => {
                let result = _getMapImageWrapData(material.emissiveMap);
                _logMaterialData("getEmissionMapImageWrapData:", result);
                return result;
            },
            getNormalMapImageWrapData: (material) => {
                let result = _getMapImageWrapData(_getNormalMap(material));
                _logMaterialData("getNormalMapImageWrapData:", result);
                return result;
            },
            getTransmissionMapImageWrapData: (material) => {
                let result = _getMapImageWrapData(material.transmissionMap);
                _logMaterialData("getTransmissionMapImageWrapData:", result);
                return result;
            },
            getSpecularMapImageWrapData: (material) => {
                let result = undefined;
                _logMaterialData("getSpecularMapImageWrapData:", result);
                return result;
            },
            isDoubleSide: (material) => {
                let result = material.side === THREE.DoubleSide;
                _logMaterialData("isDoubleSide:", result);
                return result;
            },
        },
        geometryRepo: {
            getVertices: (geometry) => {
                return _getExistPoints(geometry, "position");
            },
            getNormals: (geometry) => {
                return _getExistPoints(geometry, "normal");
            },
            getTexCoords: (geometry) => {
                return _getNullablePoints(geometry, "uv");
            },
            getTangents: (geometry) => {
                if (!_hasAttribute(geometry, "tangent")) {
                    if (_isNeedComputeTangents(geometry)) {
                        THREE.BufferGeometryUtils.computeTangents(geometry);

                        let newResultData = _convertTangentsFromFourToThree(geometry.getAttribute("tangent").array);

                        _logGeometryData("getTangents:", newResultData);

                        return newResultData;
                    }

                    _logGeometryData("getTangents:", undefined);
                    return undefined;
                }

                let result = _convertTangentsFromFourToThree(geometry.getAttribute("tangent").array);

                _logGeometryData("getTangents:", result);

                return result;
            },
            getIndices: (geometry) => {
                let result = _getExistIndices(geometry);
                _logGeometryData("getIndices:", result);
                return result;
            },
            isFlipTexCoordY: (geometry) => {
                if (_isLoadGLTF()) {
                    return false;
                }

                return true;
            },
            isSame: (geometry1, geometry2) => {
                let result = _getGeometryId(geometry1) === _getGeometryId(geometry2);
                _logGeometryData("isSame:", result);
                return result;
            },
            getId: _getGeometryId
        }
    });


    setImageRepoDp({
        getData: (targetImageId) => {
            if (!!_getImageData(targetImageId)) {
                return _getImageData(targetImageId);
            }

            _fatal("not find image data! image id is:" + String(targetImageId));
        }
    });

    setWebGPUCoreDp({
        textureUsage: {
            copy_src: wonderWebgpu.GPUTextureUsage.COPY_SRC,
            copy_dst: wonderWebgpu.GPUTextureUsage.COPY_DST,
            sampled: wonderWebgpu.GPUTextureUsage.SAMPLED,
            storage: wonderWebgpu.GPUTextureUsage.STORAGE,
            output_attachment: wonderWebgpu.GPUTextureUsage.OUTPUT_ATTACHMENT
        },
        texture: {
            createView: (function (prim, prim$1) {
                return prim$1.createView(prim);
            })
        },
        swapChain: {
            getCurrentTextureView: (function (prim, prim$1) {
                return prim$1.getCurrentTextureView();
            }),
            present: (function (prim) {
                prim.present();

            })
        },
        queue: {
            submit: (function (prim, prim$1) {
                prim$1.submit(prim);

            })
        },
        shaderStage: {
            compute: wonderWebgpu.GPUShaderStage.COMPUTE,
            fragment: wonderWebgpu.GPUShaderStage.FRAGMENT,
            vertex: wonderWebgpu.GPUShaderStage.VERTEX
        },
        bufferUsage: {
            storage: wonderWebgpu.GPUBufferUsage.STORAGE,
            uniform: wonderWebgpu.GPUBufferUsage.UNIFORM,
            indirect: wonderWebgpu.GPUBufferUsage.INDIRECT,
            vertex: wonderWebgpu.GPUBufferUsage.VERTEX,
            index: wonderWebgpu.GPUBufferUsage.INDEX,
            map_read: wonderWebgpu.GPUBufferUsage.MAP_WRITE,
            map_write: wonderWebgpu.GPUBufferUsage.MAP_WRITE,
            copy_src: wonderWebgpu.GPUBufferUsage.COPY_SRC,
            copy_dst: wonderWebgpu.GPUBufferUsage.COPY_DST
        },
        buffer: {
            setSubFloat32Data: (function (prim, prim$1, prim$2) {
                prim$2.setSubData(prim, prim$1);

            }),
            setSubUint8Data: (function (prim, prim$1, prim$2) {
                prim$2.setSubData(prim, prim$1);

            }),
            setSubUint32Data: (function (prim, prim$1, prim$2) {
                prim$2.setSubData(prim, prim$1);

            })
        },
        passEncoder: {
            render: {
                setPipeline: (function (prim, prim$1) {
                    prim$1.setPipeline(prim);

                }),
                setBindGroup: (function (prim, prim$1, prim$2) {
                    prim$2.setBindGroup(prim, prim$1);

                }),
                setDynamicBindGroup: (function (prim, prim$1, prim$2, prim$3) {
                    prim$3.setBindGroup(prim, prim$1, prim$2);

                }),
                setVertexBuffer: (function (prim, prim$1, prim$2) {
                    prim$2.setVertexBuffer(prim, prim$1);

                }),
                setIndexBuffer: (function (prim, prim$1) {
                    prim$1.setIndexBuffer(prim);

                }),
                draw: (function (prim, prim$1, prim$2, prim$3, prim$4) {
                    prim$4.draw(prim, prim$1, prim$2, prim$3);

                }),
                drawIndexed: (function (prim, prim$1, prim$2, prim$3, prim$4, prim$5) {
                    prim$5.drawIndexed(prim, prim$1, prim$2, prim$3, prim$4);

                }),
                endPass: (function (prim) {
                    prim.endPass();

                })
            },
            compute: {
                setPipeline: (function (prim, prim$1) {
                    prim$1.setPipeline(prim);

                }),
                setBindGroup: (function (prim, prim$1, prim$2) {
                    prim$2.setBindGroup(prim, prim$1);

                }),
                setDynamicBindGroup: (function (prim, prim$1, prim$2, prim$3) {
                    prim$3.setBindGroup(prim, prim$1, prim$2);

                }),
                dispatchX: (function (prim, prim$1) {
                    prim$1.dispatch(prim);

                }),
                endPass: (function (prim) {
                    prim.endPass();

                })
            }
        },
        commandEncoder: {
            beginRenderPass: (function (prim, prim$1) {
                return prim$1.beginRenderPass(prim);
            }),
            beginComputePass: (function (prim, prim$1) {
                return prim$1.beginComputePass(prim);
            }),
            finish: (function (prim) {
                return prim.finish();
            }),
            copyBufferToTexture: (function (prim, prim$1, prim$2, prim$3) {
                prim$3.copyBufferToTexture(prim, prim$1, prim$2);

            })
        },
        device: {
            getQueue: (function (prim) {
                return prim.getQueue();
            }),
            createShaderModule: (function (prim, prim$1) {
                return prim$1.createShaderModule(prim);
            }),
            createPipelineLayout: (function (prim, prim$1) {
                return prim$1.createPipelineLayout(prim);
            }),
            createBuffer: (function (prim, prim$1) {
                return prim$1.createBuffer(prim);
            }),
            createBindGroupLayout: (function (prim, prim$1) {
                return prim$1.createBindGroupLayout(prim);
            }),
            createBindGroup: (function (prim, prim$1) {
                return prim$1.createBindGroup(prim);
            }),
            createRenderPipeline: (function (prim, prim$1) {
                return prim$1.createRenderPipeline(prim);
            }),
            createComputePipeline: (function (prim, prim$1) {
                return prim$1.createComputePipeline(prim);
            }),
            createCommandEncoder: (function (prim, prim$1) {
                return prim$1.createCommandEncoder(prim);
            }),
            createSampler: (function (prim, prim$1) {
                return prim$1.createSampler(prim);
            }),
            createTexture: (function (prim, prim$1) {
                return prim$1.createTexture(prim);
            })
        },
        context: {
            getSwapChainPreferredFormat: (function (prim, prim$1) {
                return prim$1.getSwapChainPreferredFormat(prim);
            }),
            configureSwapChain: (function (prim, prim$1) {
                return prim$1.configureSwapChain(prim);
            })
        },
        window: {
            make: (function (prim) {
                return new wonderWebgpu.WebGPUWindow(prim);
            }),
            getContext: (function (prim) {
                return prim.getContext("wonder-webgpu");
            }),
            pollEvents: (function (prim) {
                prim.pollEvents();

            }),
            shouldClose: (function (prim) {
                return prim.shouldClose();
            }),
            getWidth: (function (prim) {
                return prim.width;
            }),
            getHeight: (function (prim) {
                return prim.height;
            })
        },
        adapter: {
            requestDevice: (function (prim, prim$1) {
                return prim$1.requestDevice(prim);
            })
        },
        gpu: {
            requestAdapter: (function (prim) {
                return wonderWebgpu.GPU.requestAdapter(prim);
            })
        },
        loadGLSL: (function (srcPath) {
            return _loadShaderFile("./node_modules/wonder.js/" + srcPath);
        }),
        capacity: {
            // getTextureArrayLayerSize: (function (param) {
            //     return [
            //         // 2048,
            //         // 2048
            //         4096,
            //         4096
            //     ];
            // }),
            getTextureArrayMaxLayerCount: (function (param) {
                return 2048;
            })
        }
    });

    setWebGPURayTracingDp({
        accelerationContainer: {
            updateInstance: (function (prim, prim$1, prim$2) {
                prim$2.updateInstance(prim, prim$1);

            }),
            setSubFloat32Data: (function (prim, prim$1, prim$2) {
                prim$2.setSubData(prim, prim$1);

            })
        },
        passEncoder: {
            setPipeline: (function (prim, prim$1) {
                prim$1.setPipeline(prim);

            }),
            setBindGroup: (function (prim, prim$1, prim$2) {
                prim$2.setBindGroup(prim, prim$1);

            }),
            traceRays: (function (prim, prim$1, prim$2, prim$3, prim$4, prim$5, prim$6) {
                prim$6.traceRays(prim, prim$1, prim$2, prim$3, prim$4, prim$5);

            }),
            endPass: (function (prim) {
                prim.endPass();

            })
        },
        commandEncoder: {
            beginRayTracingPass: (function (prim, prim$1) {
                return prim$1.beginRayTracingPass(prim);
            }),
            buildRayTracingAccelerationContainer: (function (prim, prim$1) {
                prim$1.buildRayTracingAccelerationContainer(prim);

            }),
            updateRayTracingAccelerationContainer: (function (prim, prim$1) {
                prim$1.updateRayTracingAccelerationContainer(prim);

            })
        },
        device: {
            createRayTracingPipeline: (function (prim, prim$1) {
                return prim$1.createRayTracingPipeline(prim);
            }),
            createRayTracingShaderBindingTable: (function (prim, prim$1) {
                return prim$1.createRayTracingShaderBindingTable(prim);
            }),
            createRayTracingAccelerationContainer: (function (prim, prim$1) {
                return prim$1.createRayTracingAccelerationContainer(prim);
            }),
            createRayTracingBindGroup: (function (prim, prim$1) {
                return prim$1.createBindGroup(prim);
            })
        },
        accelerationContainerUsage: {
            none: wonderWebgpu.GPURayTracingAccelerationContainerUsage.NONE,
            allow_update: wonderWebgpu.GPURayTracingAccelerationContainerUsage.ALLOW_UPDATE,
            prefer_fast_trace: wonderWebgpu.GPURayTracingAccelerationContainerUsage.PREFER_FAST_TRACE,
            prefer_fast_build: wonderWebgpu.GPURayTracingAccelerationContainerUsage.PREFER_FAST_BUILD,
            low_memory: wonderWebgpu.GPURayTracingAccelerationContainerUsage.LOW_MEMORY
        },
        accelerationGeometryUsage: {
            none: wonderWebgpu.GPURayTracingAccelerationGeometryUsage.NONE,
            opaque: wonderWebgpu.GPURayTracingAccelerationGeometryUsage.OPAQUE,
            allow_any_hit: wonderWebgpu.GPURayTracingAccelerationGeometryUsage.ALLOW_ANY_HIT
        },
        accelerationInstanceUsage: {
            none: wonderWebgpu.GPURayTracingAccelerationInstanceUsage.NONE,
            triangle_cull_disable: wonderWebgpu.GPURayTracingAccelerationInstanceUsage.TRIANGLE_CULL_DISABLE,
            triangle_front_counterclockwise: wonderWebgpu.GPURayTracingAccelerationInstanceUsage.TRIANGLE_FRONT_COUNTERCLOCKWISE,
            force_opaque: wonderWebgpu.GPURayTracingAccelerationInstanceUsage.FORCE_OPAQUE,
            force_no_opaque: wonderWebgpu.GPURayTracingAccelerationInstanceUsage.FORCE_NO_OPAQUE
        },
        bufferUsage: {
            storage: wonderWebgpu.GPUBufferUsage.STORAGE,
            uniform: wonderWebgpu.GPUBufferUsage.UNIFORM,
            indirect: wonderWebgpu.GPUBufferUsage.INDIRECT,
            vertex: wonderWebgpu.GPUBufferUsage.VERTEX,
            index: wonderWebgpu.GPUBufferUsage.INDEX,
            map_read: wonderWebgpu.GPUBufferUsage.MAP_WRITE,
            map_write: wonderWebgpu.GPUBufferUsage.MAP_WRITE,
            copy_src: wonderWebgpu.GPUBufferUsage.COPY_SRC,
            copy_dst: wonderWebgpu.GPUBufferUsage.COPY_DST,
            ray_tracing: wonderWebgpu.GPUBufferUsage.RAY_TRACING
        },
        shaderStage: {
            compute: wonderWebgpu.GPUShaderStage.COMPUTE,
            fragment: wonderWebgpu.GPUShaderStage.FRAGMENT,
            vertex: wonderWebgpu.GPUShaderStage.VERTEX,
            ray_generation: wonderWebgpu.GPUShaderStage.RAY_GENERATION,
            ray_closest_hit: wonderWebgpu.GPUShaderStage.RAY_CLOSEST_HIT,
            ray_any_hit: wonderWebgpu.GPUShaderStage.RAY_ANY_HIT,
            ray_miss: wonderWebgpu.GPUShaderStage.RAY_MISS,
            ray_intersection: wonderWebgpu.GPUShaderStage.RAY_INTERSECTION
        }
    });
}


let _getBufferGeometry = (geometry) => {
    if (geometry instanceof THREE.BufferGeometry) {
        return geometry;
    }

    let result = new THREE.BufferGeometry().fromGeometry(geometry);

    return THREE.BufferGeometryUtils.mergeVertices(result);
};

let _hasIndices = (bufferGeometry) => {
    return bufferGeometry.index !== null;
}

let _getExistIndices = (bufferGeometry) => {
    if (_hasIndices(bufferGeometry)) {
        return bufferGeometry.index.array;
    }

    _fatal("geometry should has indices!");
}

let _generateIndices = (vertexCount) => {
    let result = [];
    for (let i = 0; i < vertexCount; i++) {
        result.push(i);
    }

    return result;
};

let _convertBufferGeometryIndexToUint32Array = (bufferGeometry) => {
    let indices = _getExistIndices(bufferGeometry);

    if (indices instanceof Uint32Array) {
        return bufferGeometry;
    }


    if (indices instanceof Uint16Array || indices instanceof Uint8Array) {
        let typeArr = indices;
        let result = [];

        for (let i = 0; i < typeArr.length; i++) {
            result.push(typeArr[i]);
        }

        bufferGeometry.index.array = new Uint32Array(
            result
        );

        return bufferGeometry;
    }

    _fatal2("unknown indices:", indices);
};

let _convertSceneAllGeometries = (scene) => {
    scene.traverse(function (object) {
        if (!object.geometry) {
            return;
        }

        let geometry = _getBufferGeometry(object.geometry);


        if (!_hasIndices(geometry)) {
            geometry.setIndex(
                _generateIndices(
                    _getExistPoints(geometry, "position").length / 3
                )
            );
        }

        if (!_hasAttribute(geometry, "normal")) {
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
        }

        geometry = _convertBufferGeometryIndexToUint32Array(geometry);

        object.geometry = geometry;
    });

    return scene;
};


let _loadGLTFModel = () => {
    _markIsLoadGLTF(true);

    let gltfModelData = {
        DamagedHelmet: {
            modelDirPath: "../asset/DamagedHelmet/gltf/",
            modelName: "DamagedHelmet.gltf",
            directionLightPosition: [0, 1, 1.0],
            getCameraPositionFunc: boxSize => [
                0, boxSize.y / 2, boxSize.z / 2 * 3
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        },
        my_little_pony_dream_house: {
            modelDirPath: "../asset/my_little_pony_dream_house/",
            modelName: "scene.gltf",
            directionLightPosition: [0, 1, -1.0],
            getCameraPositionFunc: boxSize => [
                0, boxSize.y / 2, -boxSize.z / 2 * 3
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        },
        lamborghini: {
            modelDirPath: "../asset/lamborghini/",
            modelName: "scene.gltf",
            directionLightPosition: [0, 1, 1.0],
            getCameraPositionFunc: boxSize => [
                0, boxSize.y / 2 * 2, boxSize.z / 2 * 6
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        },
        room: {
            modelDirPath: "../asset/room/",
            modelName: "scene.gltf",
            directionLightPosition: [0, 1, 1.0],
            getCameraPositionFunc: boxSize => [
                -10.73, 4.78, 14.51

            ],
            getCameraTargetFunc: boxSize =>
                [0.57, -0.25, -0.78]
        },
        appartment_vr: {
            modelDirPath: "../asset/appartment_vr/",
            modelName: "scene.gltf",
            directionLightPosition: [0, 1, -1.0],
            getCameraPositionFunc: boxSize => [
                823.71, 25.49, -632.46
            ],
            getCameraTargetFunc: boxSize => [
                -0.79, -0.02, 0.608
            ]
        },
        furniture:{
            modelDirPath: "../asset/",
            modelName: "92b2b5da-1b6b-43ae-b496-e39119a1769c.glb",
            directionLightPosition: [0, 1, -1.0],
            getCameraPositionFunc: boxSize => [
                3.286,
                3.424,
                2.122
            ],
            getCameraTargetFunc: boxSize => [
                -0.621,-0.648,
                -0.439
            ]
        },


        motorcycle: {
            modelDirPath: "../asset/",
            modelName: "c8556e38-643e-467c-94ec-19f6602f51f0.glb",
            directionLightPosition: [0, 1, 1.0],
            getCameraPositionFunc: boxSize => [
                1.07,
                8.974,
                9.59
            ],
            getCameraTargetFunc: boxSize => [
                -0.08,
                -0.67,
                -0.73
            ]
        },

        cube: {
            modelDirPath: "../asset/",
            modelName: "正方形.gltf",
            directionLightPosition: [0, 1.0, 0.1],
            getCameraPositionFunc: boxSize => [
                0, boxSize.y / 2 * 2, boxSize.z / 2 * 4
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        },
        test1: {
            modelDirPath: "../asset/",
            modelName: "几何体11.gltf",
            directionLightPosition: [0, 1.0, 1.0],
            getCameraPositionFunc: boxSize => [
                0, boxSize.y / 2 * 8, boxSize.z / 2 / 2
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        },
        test2: {
            modelDirPath: "../asset/",
            modelName: "几何体2.gltf",
            directionLightPosition: [0, 1.0, 1.0],
            getCameraPositionFunc: boxSize => [
                - boxSize.x / 2, boxSize.y / 2 * 4, boxSize.z / 2* 2
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        },
        woodDesk: {
            modelDirPath: "../asset/",
            modelName: "木桌.gltf",
            directionLightPosition: [0, 1.0, 1.0],
            getCameraPositionFunc: boxSize => [
                - boxSize.x / 2, boxSize.y / 2 * 4, boxSize.z / 2* 2
            ],
            getCameraTargetFunc: boxSize => [0, 0, 0]
        }
    };

    return _loadGLTF(
        // gltfModelData.room
        // gltfModelData.my_little_pony_dream_house
        // gltfModelData.lamborghini
        // gltfModelData.DamagedHelmet
        // gltfModelData.appartment_vr

        // gltfModelData.furniture
        gltfModelData.motorcycle

        // gltfModelData.cube

        // gltfModelData.test1
        // gltfModelData.test2
    );
};


async function _main() {
    // let [camera, scene] = _buildScene1();
    // let [camera, scene] = _buildScene2();
    // let [camera, scene] = _buildScene3();
    let [camera, scene] = await _loadGLTFModel();

    scene = _convertSceneAllGeometries(scene);

    _setAllDp(scene);

    prepare([640, 480], 30);


    camera.updateMatrixWorld();
    scene.updateMatrixWorld();


    await init();

    await update();

    while (true) {
        await render();

        // console.log("render");
    }
}

_log("begin main");

_main().then(() => {
    _log("finish main");
});