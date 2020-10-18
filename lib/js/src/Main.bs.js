'use strict';

var Fs = require("fs");
var Most = require("most");
var Perf_hooks = require("perf_hooks");
var WonderWebgpu = require("wonder-webgpu");
var FarVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/FarVO.bs.js");
var FovyVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/FovyVO.bs.js");
var NearVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/NearVO.bs.js");
var Result$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/library/structure/Result.bs.js");
var AngleVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/AngleVO.bs.js");
var AspectVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/AspectVO.bs.js");
var Color3VO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/Color3VO.bs.js");
var OptionSt$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/library/structure/OptionSt.bs.js");
var DiffuseVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/DiffuseVO.bs.js");
var ImageIdVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/asset/image/value_object/ImageIdVO.bs.js");
var PositionVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/PositionVO.bs.js");
var SpecularVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/SpecularVO.bs.js");
var AssetRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/AssetRunAPI.bs.js");
var IntensityVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/IntensityVO.bs.js");
var MetalnessVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/MetalnessVO.bs.js");
var RoughnessVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/RoughnessVO.bs.js");
var TimeDpCPAPI$Wonderjs = require("wonder.js/lib/js/src/run/cloud_picture/external_layer/api/dependency/TimeDpCPAPI.bs.js");
var DirectorCPAPI$Wonderjs = require("wonder.js/lib/js/src/run/cloud_picture/external_layer/api/DirectorCPAPI.bs.js");
var EulerAnglesVO$Wonderjs = require("wonder.js/lib/js/src/construct/domain_layer/domain/scene/scene_graph/value_object/EulerAnglesVO.bs.js");
var GeometryRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/GeometryRunAPI.bs.js");
var NetworkDpCPAPI$Wonderjs = require("wonder.js/lib/js/src/run/cloud_picture/external_layer/api/dependency/NetworkDpCPAPI.bs.js");
var TransformRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/TransformRunAPI.bs.js");
var GameObjectRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/GameObjectRunAPI.bs.js");
var PBRMaterialRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/PBRMaterialRunAPI.bs.js");
var OtherConfigDpCPAPI$Wonderjs = require("wonder.js/lib/js/src/run/cloud_picture/external_layer/api/dependency/OtherConfigDpCPAPI.bs.js");
var WebGPUCoreDpRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/dependency/WebGPUCoreDpRunAPI.bs.js");
var DirectionLightRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/DirectionLightRunAPI.bs.js");
var BasicCameraViewRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/BasicCameraViewRunAPI.bs.js");
var WebGPURayTracingDpRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/dependency/WebGPURayTracingDpRunAPI.bs.js");
var ResultUtils$WonderCloudPictureExample = require("./ResultUtils.bs.js");
var PerspectiveCameraProjectionRunAPI$Wonderjs = require("wonder.js/lib/js/src/construct/external_layer/api/run/domain/PerspectiveCameraProjectionRunAPI.bs.js");

var _loadShaderFile = ((srcPath) =>{
var fs = require("fs");
var path = require("path");

function findIncludedFile(filePath, includes) {
  let matches = [];
  for (let ii = 0; ii < includes.length; ++ii) {
    let incl = includes[ii];
    let stats = fs.lstatSync(incl);
    if (!stats.isDirectory()) {
      throw new SyntaxError(`Include path '${incl}' is not a directory`);
    }
    let includeFilePath = path.join(incl, filePath);
    if (fs.existsSync(includeFilePath) && fs.lstatSync(includeFilePath).isFile()) {
      try {
        matches.push(fs.readFileSync(includeFilePath, "utf-8"));
      } catch (e) {
        throw new ReferenceError(`Cannot read included file from '${includeFilePath}'`);
      }
    } else {
      throw new ReferenceError(`Failed to resolve file include path for '${filePath}': '${includeFilePath}' is not a valid file path`);
    }
  };
  if (matches.length <= 0) {
    throw new ReferenceError(`Cannot inline included file '${filePath}'`);
  }
  if (matches.length > 1) {
    throw new ReferenceError(`Ambigious include directive for '${filePath}'. More than one match was found`);
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

function _createWebGPUDp(param) {
  return {
          textureUsage: {
            copy_src: WonderWebgpu.GPUTextureUsage.COPY_SRC,
            copy_dst: WonderWebgpu.GPUTextureUsage.COPY_DST,
            sampled: WonderWebgpu.GPUTextureUsage.SAMPLED,
            storage: WonderWebgpu.GPUTextureUsage.STORAGE,
            output_attachment: WonderWebgpu.GPUTextureUsage.OUTPUT_ATTACHMENT
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
            compute: WonderWebgpu.GPUShaderStage.COMPUTE,
            fragment: WonderWebgpu.GPUShaderStage.FRAGMENT,
            vertex: WonderWebgpu.GPUShaderStage.VERTEX
          },
          bufferUsage: {
            storage: WonderWebgpu.GPUBufferUsage.STORAGE,
            uniform: WonderWebgpu.GPUBufferUsage.UNIFORM,
            indirect: WonderWebgpu.GPUBufferUsage.INDIRECT,
            vertex: WonderWebgpu.GPUBufferUsage.VERTEX,
            index: WonderWebgpu.GPUBufferUsage.INDEX,
            map_read: WonderWebgpu.GPUBufferUsage.MAP_WRITE,
            map_write: WonderWebgpu.GPUBufferUsage.MAP_WRITE,
            copy_src: WonderWebgpu.GPUBufferUsage.COPY_SRC,
            copy_dst: WonderWebgpu.GPUBufferUsage.COPY_DST
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
                return new WonderWebgpu.WebGPUWindow(prim);
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
                return WonderWebgpu.GPU.requestAdapter(prim);
              })
          },
          loadGLSL: (function (srcPath) {
              return _loadShaderFile("./node_modules/wonder.js/" + srcPath);
            }),
          capacity: {
            getTextureArrayLayerSize: (function (param) {
                return [
                        2048,
                        2048
                      ];
              }),
            getTextureArrayMaxLayerCount: (function (param) {
                return 2048;
              })
          }
        };
}

function _createWebGPURayTracingDp(param) {
  return {
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
            none: WonderWebgpu.GPURayTracingAccelerationContainerUsage.NONE,
            allow_update: WonderWebgpu.GPURayTracingAccelerationContainerUsage.ALLOW_UPDATE,
            prefer_fast_trace: WonderWebgpu.GPURayTracingAccelerationContainerUsage.PREFER_FAST_TRACE,
            prefer_fast_build: WonderWebgpu.GPURayTracingAccelerationContainerUsage.PREFER_FAST_BUILD,
            low_memory: WonderWebgpu.GPURayTracingAccelerationContainerUsage.LOW_MEMORY
          },
          accelerationGeometryUsage: {
            none: WonderWebgpu.GPURayTracingAccelerationGeometryUsage.NONE,
            opaque: WonderWebgpu.GPURayTracingAccelerationGeometryUsage.OPAQUE,
            allow_any_hit: WonderWebgpu.GPURayTracingAccelerationGeometryUsage.ALLOW_ANY_HIT
          },
          accelerationInstanceUsage: {
            none: WonderWebgpu.GPURayTracingAccelerationInstanceUsage.NONE,
            triangle_cull_disable: WonderWebgpu.GPURayTracingAccelerationInstanceUsage.TRIANGLE_CULL_DISABLE,
            triangle_front_counterclockwise: WonderWebgpu.GPURayTracingAccelerationInstanceUsage.TRIANGLE_FRONT_COUNTERCLOCKWISE,
            force_opaque: WonderWebgpu.GPURayTracingAccelerationInstanceUsage.FORCE_OPAQUE,
            force_no_opaque: WonderWebgpu.GPURayTracingAccelerationInstanceUsage.FORCE_NO_OPAQUE
          },
          bufferUsage: {
            storage: WonderWebgpu.GPUBufferUsage.STORAGE,
            uniform: WonderWebgpu.GPUBufferUsage.UNIFORM,
            indirect: WonderWebgpu.GPUBufferUsage.INDIRECT,
            vertex: WonderWebgpu.GPUBufferUsage.VERTEX,
            index: WonderWebgpu.GPUBufferUsage.INDEX,
            map_read: WonderWebgpu.GPUBufferUsage.MAP_WRITE,
            map_write: WonderWebgpu.GPUBufferUsage.MAP_WRITE,
            copy_src: WonderWebgpu.GPUBufferUsage.COPY_SRC,
            copy_dst: WonderWebgpu.GPUBufferUsage.COPY_DST,
            ray_tracing: WonderWebgpu.GPUBufferUsage.RAY_TRACING
          },
          shaderStage: {
            compute: WonderWebgpu.GPUShaderStage.COMPUTE,
            fragment: WonderWebgpu.GPUShaderStage.FRAGMENT,
            vertex: WonderWebgpu.GPUShaderStage.VERTEX,
            ray_generation: WonderWebgpu.GPUShaderStage.RAY_GENERATION,
            ray_closest_hit: WonderWebgpu.GPUShaderStage.RAY_CLOSEST_HIT,
            ray_any_hit: WonderWebgpu.GPUShaderStage.RAY_ANY_HIT,
            ray_miss: WonderWebgpu.GPUShaderStage.RAY_MISS,
            ray_intersection: WonderWebgpu.GPUShaderStage.RAY_INTERSECTION
          }
        };
}

function _getStreamFromTuple(param) {
  return param[1];
}

function _getWindowWidth(param) {
  return 640;
}

function _getWindowHeight(param) {
  return 480;
}

function _createCamera(param) {
  var gameObject = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(GameObjectRunAPI$Wonderjs.create(undefined));
  var transform = OptionSt$Wonderjs.getExn(GameObjectRunAPI$Wonderjs.getTransform(gameObject));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(TransformRunAPI$Wonderjs.setLocalPosition(transform, PositionVO$Wonderjs.create([
                0.1,
                1.1,
                20
              ])));
  var cameraProjection = PerspectiveCameraProjectionRunAPI$Wonderjs.create(undefined);
  PerspectiveCameraProjectionRunAPI$Wonderjs.setNear(cameraProjection, NearVO$Wonderjs.create(0.1));
  PerspectiveCameraProjectionRunAPI$Wonderjs.setFar(cameraProjection, FarVO$Wonderjs.create(1000));
  PerspectiveCameraProjectionRunAPI$Wonderjs.setFovy(cameraProjection, FovyVO$Wonderjs.create(60));
  PerspectiveCameraProjectionRunAPI$Wonderjs.setAspect(cameraProjection, AspectVO$Wonderjs.create(640 / 480));
  var cameraView = BasicCameraViewRunAPI$Wonderjs.create(undefined);
  BasicCameraViewRunAPI$Wonderjs.active(cameraView);
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addPerspectiveCameraProjection(gameObject, cameraProjection));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addBasicCameraView(gameObject, cameraView));
  return gameObject;
}

function _createDirectionLight(param) {
  var gameObject = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(GameObjectRunAPI$Wonderjs.create(undefined));
  var transform = OptionSt$Wonderjs.getExn(GameObjectRunAPI$Wonderjs.getTransform(gameObject));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(TransformRunAPI$Wonderjs.setLocalEulerAngles(transform, EulerAnglesVO$Wonderjs.create([
                AngleVO$Wonderjs.create(-60),
                AngleVO$Wonderjs.create(0),
                AngleVO$Wonderjs.create(0)
              ])));
  var light = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(DirectionLightRunAPI$Wonderjs.create(undefined));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(DirectionLightRunAPI$Wonderjs.setIntensity(light, IntensityVO$Wonderjs.create(1.0)));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addDirectionLight(gameObject, light));
  return gameObject;
}

function _setPBRMaterialData(material, param) {
  var match = param[1];
  var channelRoughnessMetallicMapImageIdOpt = match[3];
  var emissionMapImageIdOpt = match[2];
  var normalMapImageIdOpt = match[1];
  var diffuseMapImageIdOpt = match[0];
  var match$1 = param[0];
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(PBRMaterialRunAPI$Wonderjs.setDiffuseColor(material, DiffuseVO$Wonderjs.create(Color3VO$Wonderjs.create(match$1[0]))));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(PBRMaterialRunAPI$Wonderjs.setSpecular(material, SpecularVO$Wonderjs.create(match$1[1])));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(PBRMaterialRunAPI$Wonderjs.setRoughness(material, RoughnessVO$Wonderjs.create(match$1[3])));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(PBRMaterialRunAPI$Wonderjs.setMetalness(material, MetalnessVO$Wonderjs.create(match$1[2])));
  if (diffuseMapImageIdOpt !== undefined) {
    PBRMaterialRunAPI$Wonderjs.setDiffuseMapImageId(material, ImageIdVO$Wonderjs.create(diffuseMapImageIdOpt));
  }
  if (normalMapImageIdOpt !== undefined) {
    PBRMaterialRunAPI$Wonderjs.setNormalMapImageId(material, ImageIdVO$Wonderjs.create(normalMapImageIdOpt));
  }
  if (emissionMapImageIdOpt !== undefined) {
    PBRMaterialRunAPI$Wonderjs.setEmissionMapImageId(material, ImageIdVO$Wonderjs.create(emissionMapImageIdOpt));
  }
  if (channelRoughnessMetallicMapImageIdOpt !== undefined) {
    return PBRMaterialRunAPI$Wonderjs.setChannelRoughnessMetallicMapImageId(material, ImageIdVO$Wonderjs.create(channelRoughnessMetallicMapImageIdOpt));
  }
  
}

function _createSphere(param, pbrMaterialData) {
  var localEulerAngles = param[1];
  var gameObject = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(GameObjectRunAPI$Wonderjs.create(undefined));
  var transform = OptionSt$Wonderjs.getExn(GameObjectRunAPI$Wonderjs.getTransform(gameObject));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(TransformRunAPI$Wonderjs.setLocalPosition(transform, PositionVO$Wonderjs.create(param[0])));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(TransformRunAPI$Wonderjs.setLocalEulerAngles(transform, EulerAnglesVO$Wonderjs.create([
                AngleVO$Wonderjs.create(localEulerAngles[0]),
                AngleVO$Wonderjs.create(localEulerAngles[1]),
                AngleVO$Wonderjs.create(localEulerAngles[2])
              ])));
  var geometry = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(GeometryRunAPI$Wonderjs.createSphereGeometry(2, 20));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addGeometry(gameObject, geometry));
  var material = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(PBRMaterialRunAPI$Wonderjs.create(undefined));
  _setPBRMaterialData(material, pbrMaterialData);
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addPBRMaterial(gameObject, material));
  return gameObject;
}

function _createPlane(param, pbrMaterialData) {
  var localEulerAngles = param[1];
  var gameObject = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(GameObjectRunAPI$Wonderjs.create(undefined));
  var transform = OptionSt$Wonderjs.getExn(GameObjectRunAPI$Wonderjs.getTransform(gameObject));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(TransformRunAPI$Wonderjs.setLocalPosition(transform, PositionVO$Wonderjs.create(param[0])));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(TransformRunAPI$Wonderjs.setLocalEulerAngles(transform, EulerAnglesVO$Wonderjs.create([
                AngleVO$Wonderjs.create(localEulerAngles[0]),
                AngleVO$Wonderjs.create(localEulerAngles[1]),
                AngleVO$Wonderjs.create(localEulerAngles[2])
              ])));
  var geometry = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(GeometryRunAPI$Wonderjs.createPlaneGeometry(50, 50, 1, 1));
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addGeometry(gameObject, geometry));
  var material = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(PBRMaterialRunAPI$Wonderjs.create(undefined));
  _setPBRMaterialData(material, pbrMaterialData);
  ResultUtils$WonderCloudPictureExample.getExnSuccessValueIgnore(GameObjectRunAPI$Wonderjs.addPBRMaterial(gameObject, material));
  return gameObject;
}

function _buildScene1(param) {
  _createCamera(undefined);
  _createDirectionLight(undefined);
  _createSphere([
        [
          5.0,
          0.0,
          5.0
        ],
        [
          0,
          0,
          0
        ]
      ], [
        [
          [
            0.5,
            0.5,
            0.1
          ],
          0.95,
          0.3,
          0.07
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined
        ]
      ]);
  _createSphere([
        [
          -5.0,
          0.0,
          5.0
        ],
        [
          0,
          0,
          0
        ]
      ], [
        [
          [
            0.0,
            1.0,
            0.1
          ],
          0.2,
          0.1,
          0.05
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined
        ]
      ]);
  _createPlane([
        [
          0,
          -10,
          -5
        ],
        [
          -90,
          0,
          0
        ]
      ], [
        [
          [
            0,
            0,
            1
          ],
          0.95,
          0.6,
          0.03
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined
        ]
      ]);
  
}

function _buildScene2(param) {
  _createCamera(undefined);
  _createDirectionLight(undefined);
  _createSphere([
        [
          5.0,
          0.0,
          5.0
        ],
        [
          0,
          0,
          0
        ]
      ], [
        [
          [
            0,
            0,
            0
          ],
          0.95,
          0.0,
          0.0
        ],
        [
          "diffuseMap1",
          "normalMap1",
          "emissionMap1",
          "metalRoughnessMap1"
        ]
      ]);
  _createSphere([
        [
          -5.0,
          0.0,
          5.0
        ],
        [
          0,
          90,
          0
        ]
      ], [
        [
          [
            0,
            0,
            0
          ],
          0.95,
          0.0,
          0.0
        ],
        [
          "diffuseMap1",
          "normalMap1",
          "emissionMap1",
          "metalRoughnessMap1"
        ]
      ]);
  _createPlane([
        [
          0,
          -10,
          -5
        ],
        [
          -90,
          0,
          0
        ]
      ], [
        [
          [
            0,
            0,
            0
          ],
          0.95,
          0.0,
          0.0
        ],
        [
          "diffuseMap2",
          "normalMap2",
          "emissionMap2",
          "metalRoughnessMap2"
        ]
      ]);
  
}

var _readPNGFile = ((buf) =>{
      var loadpng = require("@cwasm/lodepng");

      return loadpng.decode(buf);
   });

var _readJPEGFile = ((buf) =>{
      var jpegturbo = require("@cwasm/jpeg-turbo");

      return jpegturbo.decode(buf);
   });

function _isPNGFile(buffer) {
  var viewU8 = new Uint8Array(buffer);
  if (viewU8[0] === 137 && viewU8[1] === 80 && viewU8[2] === 78) {
    return viewU8[3] === 71;
  } else {
    return false;
  }
}

function _isJPEGFile(buffer) {
  var viewU8 = new Uint8Array(buffer);
  if (viewU8[0] === 255 && viewU8[1] === 216 && viewU8[2] === 255) {
    return viewU8[3] === 224;
  } else {
    return false;
  }
}

function _readImageFile(path) {
  var buf = Fs.readFileSync(path);
  if (_isPNGFile(buf)) {
    return Result$Wonderjs.succeed(Most.just(_readPNGFile(buf)));
  } else if (_isJPEGFile(buf)) {
    return Result$Wonderjs.succeed(Most.just(_readJPEGFile(buf)));
  } else {
    return Result$Wonderjs.failWith("Cannot process image file $path");
  }
}

function start(param) {
  OtherConfigDpCPAPI$Wonderjs.set({
        getIsDebug: (function (param) {
            return true;
          })
      });
  TimeDpCPAPI$Wonderjs.set({
        getNow: (function (param) {
            return Perf_hooks.performance.now();
          })
      });
  NetworkDpCPAPI$Wonderjs.set({
        readImageFile: _readImageFile
      });
  WebGPUCoreDpRunAPI$Wonderjs.set(_createWebGPUDp(undefined));
  WebGPURayTracingDpRunAPI$Wonderjs.set(_createWebGPURayTracingDp(undefined));
  Result$Wonderjs.handleFail(DirectorCPAPI$Wonderjs.prepare([
            640,
            480
          ], 30), ResultUtils$WonderCloudPictureExample.handleFail);
  var __x = ResultUtils$WonderCloudPictureExample.getExnSuccessValue(AssetRunAPI$Wonderjs.loadImages({
            hd: [
              "emissionMap1",
              "./asset/BoomBox/glTF/BoomBox_emissive.png"
            ],
            tl: {
              hd: [
                "normalMap1",
                "./asset/BoomBox/glTF/BoomBox_normal.png"
              ],
              tl: {
                hd: [
                  "diffuseMap1",
                  "./asset/BoomBox/glTF/BoomBox_baseColor.png"
                ],
                tl: {
                  hd: [
                    "metalRoughnessMap1",
                    "./asset/BoomBox/glTF/BoomBox_metallicRoughness.png"
                  ],
                  tl: {
                    hd: [
                      "emissionMap2",
                      "./asset/DamagedHelmet/glTF/Default_emissive.jpg"
                    ],
                    tl: {
                      hd: [
                        "normalMap2",
                        "./asset/DamagedHelmet/glTF/Default_normal.jpg"
                      ],
                      tl: {
                        hd: [
                          "diffuseMap2",
                          "./asset/DamagedHelmet/glTF/Default_albedo.jpg"
                        ],
                        tl: {
                          hd: [
                            "metalRoughnessMap2",
                            "./asset/DamagedHelmet/glTF/Default_metalRoughness.jpg"
                          ],
                          tl: /* [] */0
                        }
                      }
                    }
                  }
                }
              }
            }
          }));
  var __x$1 = __x.concat(Most.just(_buildScene2(undefined)));
  var stream = Most.map((function (param) {
          return Result$Wonderjs.succeed(undefined);
        }), __x$1);
  var __x$2 = stream.concat(_getStreamFromTuple(Result$Wonderjs.handleFail(DirectorCPAPI$Wonderjs.init(undefined), ResultUtils$WonderCloudPictureExample.handleFail)));
  var __x$3 = Most.drain(__x$2.concat(_getStreamFromTuple(Result$Wonderjs.handleFail(DirectorCPAPI$Wonderjs.update(undefined), ResultUtils$WonderCloudPictureExample.handleFail))));
  var __x$4 = __x$3.then(function (param) {
        return Promise.resolve((console.log("init and update"), undefined));
      });
  var __x$5 = __x$4.catch(function (e) {
        console.log(e);
        return Promise.reject(e);
      });
  __x$5.then(function (param) {
        var stream = _getStreamFromTuple(Result$Wonderjs.handleFail(DirectorCPAPI$Wonderjs.render(undefined), ResultUtils$WonderCloudPictureExample.handleFail));
        var _onFrame = function (param) {
          var __x = Most.drain(stream);
          var __x$1 = __x.then(function (param) {
                console.log("render");
                return Promise.resolve(_onFrame(undefined));
              });
          __x$1.catch(function (e) {
                console.log(e);
                return Promise.reject(e);
              });
          
        };
        return Promise.resolve(_onFrame(undefined));
      });
  
}

start(undefined);

exports._loadShaderFile = _loadShaderFile;
exports._createWebGPUDp = _createWebGPUDp;
exports._createWebGPURayTracingDp = _createWebGPURayTracingDp;
exports._getStreamFromTuple = _getStreamFromTuple;
exports._getWindowWidth = _getWindowWidth;
exports._getWindowHeight = _getWindowHeight;
exports._createCamera = _createCamera;
exports._createDirectionLight = _createDirectionLight;
exports._setPBRMaterialData = _setPBRMaterialData;
exports._createSphere = _createSphere;
exports._createPlane = _createPlane;
exports._buildScene1 = _buildScene1;
exports._buildScene2 = _buildScene2;
exports._readPNGFile = _readPNGFile;
exports._readJPEGFile = _readJPEGFile;
exports._isPNGFile = _isPNGFile;
exports._isJPEGFile = _isJPEGFile;
exports._readImageFile = _readImageFile;
exports.start = start;
/*  Not a pure module */
