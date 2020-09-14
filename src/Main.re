let _loadShaderFile: string => string = [%bs.raw
   {|
   (srcPath) =>{
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
   }
    |}
];


let _createWebGPUDp = ():Wonderjs.IWebGPUCoreDp.webgpuCore =>{
open WebGPU;

{
textureUsage:{
copy_src: TextureUsage.copy_src,
copy_dst: TextureUsage.copy_dst,
sampled: TextureUsage.sampled,
storage: TextureUsage.storage,
output_attachment: TextureUsage.output_attachment,
    },
texture:{
createView: Texture.createView,
},
swapChain: {
getCurrentTextureView: SwapChain. getCurrentTextureView,
present: SwapChain. present,
},
queue:{
submit: Queue.submit,
},
shaderStage:{
compute: ShaderStage. compute,
fragment: ShaderStage. fragment,
vertex: ShaderStage. vertex,
},
bufferUsage:{
storage: BufferUsage. storage,
uniform: BufferUsage. uniform,
indirect: BufferUsage. indirect,
vertex: BufferUsage. vertex,
index: BufferUsage. index,
map_read: BufferUsage. map_read,
map_write: BufferUsage. map_write,
copy_src: BufferUsage. copy_src,
copy_dst: BufferUsage. copy_dst,
},

buffer:{
setSubFloat32Data: Buffer.setSubFloat32Data,
setSubUint8Data: Buffer.setSubUint8Data,
setSubUint32Data: Buffer.setSubUint32Data,
},
passEncoder:{
render:{
setPipeline: PassEncoder.Render.setPipeline,
setBindGroup: PassEncoder.Render.setBindGroup,
setDynamicBindGroup: PassEncoder.Render.setDynamicBindGroup,
setVertexBuffer: PassEncoder.Render.setVertexBuffer,
setIndexBuffer: PassEncoder.Render.setIndexBuffer,
draw: PassEncoder.Render.draw,
drawIndexed: PassEncoder.Render.drawIndexed,
endPass: PassEncoder.Render.endPass,

},
compute:{
setPipeline: PassEncoder.Compute.setPipeline,
setBindGroup: PassEncoder.Compute.setBindGroup,
setDynamicBindGroup: PassEncoder.Compute.setDynamicBindGroup,
dispatchX: PassEncoder.Compute.dispatchX,
endPass: PassEncoder.Compute.endPass,
},
},
commandEncoder:{
beginRenderPass: CommandEncoder.beginRenderPass,
beginComputePass: CommandEncoder.beginComputePass,
finish: CommandEncoder.finish,

},
device:{
getQueue: Device.getQueue,
createShaderModule: Device.createShaderModule,
createPipelineLayout: Device.createPipelineLayout,
createBuffer: Device.createBuffer,
createBindGroupLayout: Device.createBindGroupLayout,
createBindGroup: Device.createCoreBindGroup,
createRenderPipeline: Device.createRenderPipeline,
createComputePipeline: Device.createComputePipeline,
createCommandEncoder: Device.createCommandEncoder,
createSampler: Device.createSampler,
createTexture: Device.createTexture,
},
context:{
getSwapChainPreferredFormat: Context.getSwapChainPreferredFormat,
configureSwapChain: Context.configureSwapChain,
},
window:{
make: Window.make,
getContext: Window.getContext,
pollEvents: Window.pollEvents,
shouldClose: Window.shouldClose,
getWidth: Window.getWidth,
getHeight: Window.getHeight,
},
adapter:{
requestDevice: Adapter.requestDevice
},
gpu:{
requestAdapter: GPU.requestAdapter
},
// TODO fix wonder.js?
loadGLSL: (srcPath) => _loadShaderFile(
  "./node_modules/wonder.js/" ++ srcPath
) -> Obj.magic
}
};



let _createWebGPURayTracingDp = ():Wonderjs.IWebGPURayTracingDp.webgpuRayTracing =>{
open WebGPU;

{
    accelerationContainer:{
updateInstance:AccelerationContainer.updateInstance,
setSubFloat32Data:AccelerationContainer.setSubFloat32Data,
    },
passEncoder:{
setPipeline: PassEncoder.RayTracing.setPipeline,
setBindGroup: PassEncoder.RayTracing.setBindGroup,
traceRays: PassEncoder.RayTracing.traceRays,
endPass: PassEncoder.RayTracing.endPass,
},
commandEncoder:{
beginRayTracingPass: CommandEncoder.beginRayTracingPass,
buildRayTracingAccelerationContainer: CommandEncoder.buildRayTracingAccelerationContainer,
updateRayTracingAccelerationContainer: CommandEncoder.updateRayTracingAccelerationContainer,
},
device:{
createRayTracingPipeline: Device.createRayTracingPipeline,
createRayTracingShaderBindingTable: Device.createRayTracingShaderBindingTable,
createRayTracingAccelerationContainer: Device.createRayTracingAccelerationContainer,
createRayTracingBindGroup: Device.createRayTracingBindGroup,
},
accelerationContainerUsage:{
none:AccelerationContainerUsage.none,
allow_update:AccelerationContainerUsage.allow_update,
prefer_fast_trace:AccelerationContainerUsage.prefer_fast_trace,
prefer_fast_build:AccelerationContainerUsage.prefer_fast_build,
low_memory:AccelerationContainerUsage.low_memory,
},
accelerationGeometryUsage:{
none:AccelerationGeometryUsage.none,
opaque:AccelerationGeometryUsage.opaque,
allow_any_hit:AccelerationGeometryUsage.allow_any_hit,
},
accelerationInstanceUsage:{
none:AccelerationInstanceUsage.none,
triangle_cull_disable:AccelerationInstanceUsage.triangle_cull_disable,
triangle_front_counterclockwise:AccelerationInstanceUsage.triangle_front_counterclockwise,
force_opaque:AccelerationInstanceUsage.force_opaque,
force_no_opaque:AccelerationInstanceUsage.force_no_opaque,
},

bufferUsage:{
storage: BufferUsage. storage,
uniform: BufferUsage. uniform,
indirect: BufferUsage. indirect,
vertex: BufferUsage. vertex,
index: BufferUsage. index,
map_read: BufferUsage. map_read,
map_write: BufferUsage. map_write,
copy_src: BufferUsage. copy_src,
copy_dst: BufferUsage. copy_dst,
ray_tracing: BufferUsage. ray_tracing,
},

shaderStage:{
compute: ShaderStage. compute,
fragment: ShaderStage. fragment,
vertex: ShaderStage. vertex,
ray_generation: ShaderStage. ray_generation,
ray_closest_hit: ShaderStage. ray_closest_hit,
ray_any_hit: ShaderStage. ray_any_hit,
ray_miss: ShaderStage. ray_miss,
ray_intersection: ShaderStage. ray_intersection,
},
}
};


let _getStreamFromTuple  =( (_, pipelineStream)) => pipelineStream;



let _getWindowWidth = () => 640;

let _getWindowHeight = () => 480;

let _createCamera = () =>{
let gameObject =  Wonderjs.GameObjectRunAPI.create()  -> Result.getExnSuccessValue;

let transform = Wonderjs.GameObjectRunAPI.getTransform(gameObject) -> Wonderjs.OptionSt.getExn;


Wonderjs.TransformRunAPI.setLocalPosition(transform, (0.,0.,-30.) -> Wonderjs.PositionVO.create) -> Result.getExnSuccessValueIgnore;


let cameraProjection = Wonderjs.PerspectiveCameraProjectionRunAPI.create() ;

Wonderjs.PerspectiveCameraProjectionRunAPI.setNear(
    cameraProjection, 0.1 -> Wonderjs.NearVO.create
);
Wonderjs.PerspectiveCameraProjectionRunAPI.setFar(
    cameraProjection, 1000. -> Wonderjs.FarVO.create
);
Wonderjs.PerspectiveCameraProjectionRunAPI.setFovy(
    cameraProjection, 60. -> Wonderjs.FovyVO.create
);
Wonderjs.PerspectiveCameraProjectionRunAPI.setAspect(
    cameraProjection, (_getWindowWidth() -> Belt.Float.fromInt /. (_getWindowHeight() -> Belt.Float.fromInt)) -> Wonderjs.AspectVO.create
);


let cameraView = Wonderjs.BasicCameraViewRunAPI.create() ;

Wonderjs.BasicCameraViewRunAPI.active(cameraView);



Wonderjs.GameObjectRunAPI.addPerspectiveCameraProjection(gameObject, cameraProjection)-> Result.getExnSuccessValueIgnore;
Wonderjs.GameObjectRunAPI.addBasicCameraView(gameObject, cameraView)-> Result.getExnSuccessValueIgnore;

gameObject
};

let _createDirectionLight = () =>{
let gameObject =  Wonderjs.GameObjectRunAPI.create()  -> Result.getExnSuccessValue;

let transform = Wonderjs.GameObjectRunAPI.getTransform(gameObject) -> Wonderjs.OptionSt.getExn;


Wonderjs.TransformRunAPI.setLocalEulerAngles(transform, (20. -> Wonderjs.AngleVO.create,10. -> Wonderjs.AngleVO.create,30. -> Wonderjs.AngleVO.create) -> Wonderjs.EulerAnglesVO.create) -> Result.getExnSuccessValueIgnore;


let light = Wonderjs.DirectionLightRunAPI.create()  -> Result.getExnSuccessValue;

Wonderjs.DirectionLightRunAPI.setIntensity(
    light, 1.0 -> Wonderjs.IntensityVO.create
) -> Result.getExnSuccessValueIgnore;


Wonderjs.GameObjectRunAPI.addDirectionLight(gameObject, light)-> Result.getExnSuccessValueIgnore;


gameObject;
};

let _createSphere = (
      localPosition,
      (diffuse, specular, metalness, roughness),
) =>{
let gameObject =  Wonderjs.GameObjectRunAPI.create() -> Result.getExnSuccessValue;

let transform = Wonderjs.GameObjectRunAPI.getTransform(gameObject) -> Wonderjs.OptionSt.getExn;

Wonderjs.TransformRunAPI.setLocalPosition(transform, localPosition -> Wonderjs.PositionVO.create) -> Result.getExnSuccessValueIgnore;


  let radius = 2.;
  let bands = 20;
let geometry =  Wonderjs.GeometryRunAPI.createSphereGeometry(radius, bands) -> Result.getExnSuccessValue;

Wonderjs.GameObjectRunAPI.addGeometry(gameObject, geometry)-> Result.getExnSuccessValueIgnore;

let material =  Wonderjs.PBRMaterialRunAPI.create() -> Result.getExnSuccessValue;

Wonderjs.PBRMaterialRunAPI.setDiffuseColor(
material,
diffuse -> Wonderjs.Color3VO.create-> Wonderjs.DiffuseVO.create
) -> Result.getExnSuccessValueIgnore;
Wonderjs.PBRMaterialRunAPI.setSpecular(
material,
specular -> Wonderjs.SpecularVO.create
) -> Result.getExnSuccessValueIgnore;
Wonderjs.PBRMaterialRunAPI.setRoughness(
material,
roughness -> Wonderjs.RoughnessVO.create
) -> Result.getExnSuccessValueIgnore;
Wonderjs.PBRMaterialRunAPI.setMetalness(
material,
metalness -> Wonderjs.MetalnessVO.create
) -> Result.getExnSuccessValueIgnore;

Wonderjs.GameObjectRunAPI.addPBRMaterial(gameObject, material)-> Result.getExnSuccessValueIgnore;


gameObject;
};

let _buildScene = () =>{

    let _ = _createCamera();
    let _ = _createDirectionLight();
    let _ = _createSphere(
      (0.,0.,0.),
      ((1.,0.,0.), 0.95, 0.5, 0.5),
    );

};

let start = () =>{



Wonderjs.OtherConfigDpCPAPI.set(
    {
getIsDebug: () => true
    }
);
Wonderjs.TimeDpCPAPI.set(
    {
getNow: () => Performance.now()
    }
);

    Wonderjs.WebGPUCoreDpRunAPI.set(
_createWebGPUDp()
    );
    Wonderjs.WebGPURayTracingDpRunAPI.set(
    _createWebGPURayTracingDp()
    );

Wonderjs.DirectorCPAPI.prepare((_getWindowWidth(), _getWindowHeight()), 1) -> Wonderjs.Result.handleFail(Result.handleFail); 



_buildScene();


let stream = Wonderjs.DirectorCPAPI.init() -> Wonderjs.Result.handleFail(Result.handleFail)->_getStreamFromTuple ;



stream -> WonderBsMost.Most.drain -> Js.Promise.then_(() =>{
    Js.log("init") -> Js.Promise. resolve;
}, _) 
-> Js.Promise.then_(() =>{
    // Js.log("init") -> Js.Promise. resolve;


  let rec _onFrame = () => {
    // !(window |> Window.shouldClose)
    //   ? {
    //     Global.setTimeout(_onFrame, 1e3 /. 60.0) |> ignore;
    //   }
    //   : ();


        // Global.setTimeout(_onFrame, 1e3 /. 60.0) |> ignore;


    // let time = Performance.now() -. lastTime^;
    // lastTime := Performance.now();


    // swapChain |> SwapChain.present;
    // window |> Window.pollEvents();


    let stream =     Wonderjs.DirectorCPAPI.update()-> Wonderjs.Result.handleFail(Result.handleFail) -> _getStreamFromTuple;



    let stream = stream -> WonderBsMost.Most.concat(
        Wonderjs.DirectorCPAPI.render()-> Wonderjs.Result.handleFail(Result.handleFail) -> _getStreamFromTuple, _
    );
//     -> WonderBsMost.Most.tap((result ) => {
// result -> Wonderjs.Result.handleFail((e) =>{
//     Js.log(e);
// })
//     }, _);


stream -> WonderBsMost.Most.drain -> Js.Promise.then_(() =>{
    Js.log("finish one frame");
    
// _onFrame() -> Js.Promise. resolve 

Global.setTimeout(_onFrame, 1e4 /. 60.0) -> Js.Promise. resolve;

}, _)
-> Js.Promise.catch((e) => {Js.log(e); e -> Obj.magic-> Js.Promise.reject}, _)
 -> ignore;


  };
  Global.setTimeout(_onFrame, 1e3 /. 60.0) -> Js.Promise.resolve


}, _) -> ignore;


// -> WonderBsMost.Most.concat(
//         Wonderjs.DirectorCPAPI.update()-> Wonderjs.Result.handleFail(Result.handleFail) -> _getStreamFromTuple, _
//     );

// let stream = range(0, 10)
// let stream = range(0, 1)
// -> reduce(stream, (stream, _) =>{
//     stream -> WonderBsMost.Most.concat(
//         Wonderjs.DirectorCPAPI.render()-> Wonderjs.Result.handleFail(Result.handleFail) -> _getStreamFromTuple, _
//     )
// });

//     let stream = stream -> WonderBsMost.Most.concat(
//         Wonderjs.DirectorCPAPI.render()-> Wonderjs.Result.handleFail(Result.handleFail) -> _getStreamFromTuple, _
//     );


// stream -> WonderBsMost.Most.drain -> Js.Promise.then_(() =>{
//     Js.log("finish") -> Js.Promise. resolve
// }, _) 

}

start();



// TODO update wonder.js:
// shaders


        // IWebGPURayTracingDp.group(~type_="general", ~generalIndex=2, ()),
        // IWebGPURayTracingDp.group(~type_="general", ~generalIndex=3, ()),




// rename PassCPDoService->getCoxxx to getCommonBufferDataSize






// InitAcc:
  //       let _createAndSetPipeline = (device, swapChainFormat, bindGroupLayout) => {
  // let baseShaderPath = "src/run/cloud_picture/domain_layer/domain/shader/accumulation";



// InitPath: change visibility
//       let cameraBindGroupLayout =
//         WebGPUCoreDpRunAPI.unsafeGet().device.createBindGroupLayout(
//           {
//             "entries": [|
//               IWebGPUCoreDp.layoutBinding(
//                 ~binding=0,
//                 ~visibility=
//                   WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.
//                     ray_generation
//                 (),
//               ),
//             |],
//           },
//           device,
//         );

          // let directionLightBindGroupLayout =
          //   WebGPUCoreDpRunAPI.unsafeGet().device.createBindGroupLayout(
          //     {
          //       "entries": [|
          //         IWebGPUCoreDp.layoutBinding(
          //           ~binding=0,
          //           ~visibility=
          //             WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.
          //                   ray_closest_hit,
          //           ~type_="storage-buffer",
          //           (),
          //         ),
          //       |],
          //     },
          //     device,
          //   );



// InitAcc: add common buffer data to bind group/layout


// open Js.Typed_array;

// let create = () => JobEntity.create("init_accumulation");

// let _buildAccumulationPixelBufferData = (window, device) => {
//   let bufferSize =
//     WebGPUCoreDpRunAPI.unsafeGet().window.getWidth(window)
//     * WebGPUCoreDpRunAPI.unsafeGet().window.getHeight(window)
//     * 4
//     * Float32Array._BYTES_PER_ELEMENT;

//   let buffer =
//     StorageBufferVO.createFromDevice(
//       ~device,
//       ~bufferSize,
//       ~usage=
//         WebGPUCoreDpRunAPI.unsafeGet().bufferUsage.copy_dst
//         lor WebGPUCoreDpRunAPI.unsafeGet().bufferUsage.storage,
//       (),
//     );

//   (buffer, bufferSize);
// };

// let _createAndSetBindGroup =
//     (
//       device,
//       (
//         (resolutionBuffer, resolutionBufferData),
//         (pixelBuffer, pixelBufferSize),
// (commonBuffer, commonBufferData),
//         (accumulationPixelBuffer, accumulationPixelBufferSize),
//       ),
//     ) => {
//   let bindGroupLayout =
//     WebGPUCoreDpRunAPI.unsafeGet().device.createBindGroupLayout(
//       {
//         "entries": [|
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=0,
//             ~visibility=
//               WebGPUCoreDpRunAPI.unsafeGet().shaderStage.fragment,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=1,
//             ~visibility=
//               WebGPUCoreDpRunAPI.unsafeGet().shaderStage.fragment,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=2,
//             ~visibility=
//               WebGPUCoreDpRunAPI.unsafeGet().shaderStage.fragment,
//             ~type_="uniform-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=3,
//             ~visibility=
//               WebGPUCoreDpRunAPI.unsafeGet().shaderStage.fragment,
//             ~type_="uniform-buffer",
//             (),
//           ),
//         |],
//       },
//       device,
//     );

//   AccumulationPassCPRepo.setStaticBindGroupData(
//     0,
//     WebGPUCoreDpRunAPI.unsafeGet().device.createBindGroup(
//       {
//         "layout": bindGroupLayout,
//         "entries": [|
//           IWebGPUCoreDp.binding(
//             ~binding=0,
//             ~buffer=pixelBuffer,
//             ~offset=0,
//             ~size=pixelBufferSize,
//             (),
//           ),
//           IWebGPUCoreDp.binding(
//             ~binding=1,
//             ~buffer=accumulationPixelBuffer,
//             ~offset=0,
//             ~size=accumulationPixelBufferSize,
//             (),
//           ),
//           IWebGPUCoreDp.binding(
//             ~binding=2,
//             ~buffer=resolutionBuffer,
//             ~offset=0,
//             ~size=
//               resolutionBufferData->PassCPDoService.getResolutionBufferDataSize,
//             (),
//           ),
//           IWebGPUCoreDp.binding(
//             ~binding=3,
//             ~buffer=commonBuffer,
//             ~offset=0,
//             ~size=
//               commonBufferData->PassCPDoService.getCommonBufferDataSize,
//             (),
//           ),
//         |],
//       },
//       device,
//     ),
//   );

//   bindGroupLayout;
// };

// let _createAndSetPipeline = (device, swapChainFormat, bindGroupLayout) => {
//   let baseShaderPath = "src/run/cloud_picture/domain_layer/domain/shader/accumulation";

//   let vertexShaderModule =
//     WebGPUCoreDpRunAPI.unsafeGet().device.createShaderModule(
//       {
//         "code":
//           WebGPUCoreDpRunAPI.unsafeGet().loadGLSL(
//             {j|$(baseShaderPath)/accumulation.vert|j},
//           ),
//       },
//       device,
//     );
//   let fragmentShaderModule =
//     WebGPUCoreDpRunAPI.unsafeGet().device.createShaderModule(
//       {
//         "code":
//           WebGPUCoreDpRunAPI.unsafeGet().loadGLSL(
//             {j|$(baseShaderPath)/accumulation.frag|j},
//           ),
//       },
//       device,
//     );

//   WebGPUCoreDpRunAPI.unsafeGet().device.createRenderPipeline(
//     IWebGPUCoreDp.pipelineRenderDescriptor(
//       ~layout=
//         WebGPUCoreDpRunAPI.unsafeGet().device.createPipelineLayout(
//           {"bindGroupLayouts": [|bindGroupLayout|]},
//           device,
//         ),
//       ~vertexStage={
//         IWebGPUCoreDp.vertexStage(
//           ~module_=vertexShaderModule,
//           ~entryPoint="main",
//         );
//       },
//       ~fragmentStage={
//         IWebGPUCoreDp.fragmentStage(
//           ~module_=fragmentShaderModule,
//           ~entryPoint="main",
//         );
//       },
//       ~primitiveTopology="triangle-list",
//       ~vertexState=IWebGPUCoreDp.vertexState(~indexFormat="uint32", ()),
//       ~rasterizationState=IWebGPUCoreDp.rasterizationState(),
//       ~colorStates=[|
//         IWebGPUCoreDp.colorState(
//           ~format=swapChainFormat,
//           ~alphaBlend=IWebGPUCoreDp.blendDescriptor(),
//           ~colorBlend=IWebGPUCoreDp.blendDescriptor(),
//         ),
//       |],
//       (),
//     ),
//     device,
//   )
//   ->AccumulationPassCPRepo.setPipeline;
// };

// let exec = () => {
//   Tuple3.collectOption(
//     WebGPUCPRepo.getWindow(),
//     WebGPUCPRepo.getDevice(),
//     WebGPUCPRepo.getSwapChainFormat(),
//   )
//   ->Result.bind(((window, device, swapChainFormat)) => {
//       _buildAccumulationPixelBufferData(window, device)
//       ->AccumulationPassCPRepo.setAccumulationPixelBufferData;

//       Tuple4.collectOption(
//         PassCPRepo.getResolutionBufferData(),
//         PassCPRepo.getPixelBufferData(),
//         PassCPRepo.getCommonBufferData(),
//         AccumulationPassCPRepo.getAccumulationPixelBufferData(),
//       )
//       ->Result.mapSuccess(
//           (
//             (
//               (resolutionBuffer, resolutionBufferData),
//               (pixelBuffer, pixelBufferSize),
// (commonBuffer, commonBufferData),
//               (accumulationPixelBuffer, accumulationPixelBufferSize),
//             ) as allBufferData,
//           ) => {
//           _createAndSetBindGroup(
//             device,
//             (
//               (resolutionBuffer->UniformBufferVO.value, resolutionBufferData),
//               (pixelBuffer->StorageBufferVO.value, pixelBufferSize),
//               (commonBuffer->UniformBufferVO.value, commonBufferData),
//               (
//                 accumulationPixelBuffer->StorageBufferVO.value,
//                 accumulationPixelBufferSize,
//               ),
//             ),
//           )
//           ->_createAndSetPipeline(device, swapChainFormat, _)
//         });
//     })
//   ->WonderBsMost.Most.just;
// };





// update path: change visibility


//   let rtBindGroupLayout =
//     WebGPUCoreDpRunAPI.unsafeGet().device.createBindGroupLayout(
//       {
//         "entries": [|
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=0,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_generation
//               lor WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.
//                     ray_closest_hit,
//             ~type_="acceleration-container",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=1,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_generation,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=2,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_generation,
//             ~type_="uniform-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=3,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_closest_hit,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=4,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_closest_hit,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=5,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_closest_hit,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=6,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_closest_hit,
//             ~type_="storage-buffer",
//             (),
//           ),
//           IWebGPUCoreDp.layoutBinding(
//             ~binding=7,
//             ~visibility=
//               WebGPURayTracingDpRunAPI.unsafeGet().shaderStage.ray_closest_hit,
//             ~type_="storage-buffer",
//             (),
//           ),
//         |],
//       },
//       device,
//     );
