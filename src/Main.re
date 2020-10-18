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

let _createWebGPUDp = (): Wonderjs.IWebGPUCoreDp.webgpuCore => {
  WebGPU.{
    textureUsage: {
      copy_src: TextureUsage.copy_src,
      copy_dst: TextureUsage.copy_dst,
      sampled: TextureUsage.sampled,
      storage: TextureUsage.storage,
      output_attachment: TextureUsage.output_attachment,
    },
    texture: {
      createView: Texture.createView,
    },
    swapChain: {
      getCurrentTextureView: SwapChain.getCurrentTextureView,
      present: SwapChain.present,
    },
    queue: {
      submit: Queue.submit,
    },
    shaderStage: {
      compute: ShaderStage.compute,
      fragment: ShaderStage.fragment,
      vertex: ShaderStage.vertex,
    },
    bufferUsage: {
      storage: BufferUsage.storage,
      uniform: BufferUsage.uniform,
      indirect: BufferUsage.indirect,
      vertex: BufferUsage.vertex,
      index: BufferUsage.index,
      map_read: BufferUsage.map_read,
      map_write: BufferUsage.map_write,
      copy_src: BufferUsage.copy_src,
      copy_dst: BufferUsage.copy_dst,
    },

    buffer: {
      setSubFloat32Data: Buffer.setSubFloat32Data,
      setSubUint8Data: Buffer.setSubUint8Data,
      setSubUint32Data: Buffer.setSubUint32Data,
    },
    passEncoder: {
      render: {
        setPipeline: PassEncoder.Render.setPipeline,
        setBindGroup: PassEncoder.Render.setBindGroup,
        setDynamicBindGroup: PassEncoder.Render.setDynamicBindGroup,
        setVertexBuffer: PassEncoder.Render.setVertexBuffer,
        setIndexBuffer: PassEncoder.Render.setIndexBuffer,
        draw: PassEncoder.Render.draw,
        drawIndexed: PassEncoder.Render.drawIndexed,
        endPass: PassEncoder.Render.endPass,
      },
      compute: {
        setPipeline: PassEncoder.Compute.setPipeline,
        setBindGroup: PassEncoder.Compute.setBindGroup,
        setDynamicBindGroup: PassEncoder.Compute.setDynamicBindGroup,
        dispatchX: PassEncoder.Compute.dispatchX,
        endPass: PassEncoder.Compute.endPass,
      },
    },
    commandEncoder: {
      copyBufferToTexture: CommandEncoder.copyBufferToTexture,
      beginRenderPass: CommandEncoder.beginRenderPass,
      beginComputePass: CommandEncoder.beginComputePass,
      finish: CommandEncoder.finish,
    },
    device: {
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
    context: {
      getSwapChainPreferredFormat: Context.getSwapChainPreferredFormat,
      configureSwapChain: Context.configureSwapChain,
    },
    window: {
      make: Window.make,
      getContext: Window.getContext,
      pollEvents: Window.pollEvents,
      shouldClose: Window.shouldClose,
      getWidth: Window.getWidth,
      getHeight: Window.getHeight,
    },
    adapter: {
      requestDevice: Adapter.requestDevice,
    },
    gpu: {
      requestAdapter: GPU.requestAdapter,
    },
    // TODO fix wonder.js?
    loadGLSL: srcPath => {
      let v =
        _loadShaderFile("./node_modules/wonder.js/" ++ srcPath)->Obj.magic;

      v;
    },
    capacity: {
      getTextureArrayLayerSize: () => (2048, 2048),
      getTextureArrayMaxLayerCount: () => 2048,
    },
  };
};

let _createWebGPURayTracingDp =
    (): Wonderjs.IWebGPURayTracingDp.webgpuRayTracing => {
  WebGPU.{
    accelerationContainer: {
      updateInstance: AccelerationContainer.updateInstance,
      setSubFloat32Data: AccelerationContainer.setSubFloat32Data,
    },
    passEncoder: {
      setPipeline: PassEncoder.RayTracing.setPipeline,
      setBindGroup: PassEncoder.RayTracing.setBindGroup,
      traceRays: PassEncoder.RayTracing.traceRays,
      endPass: PassEncoder.RayTracing.endPass,
    },
    commandEncoder: {
      beginRayTracingPass: CommandEncoder.beginRayTracingPass,
      buildRayTracingAccelerationContainer: CommandEncoder.buildRayTracingAccelerationContainer,
      updateRayTracingAccelerationContainer: CommandEncoder.updateRayTracingAccelerationContainer,
    },
    device: {
      createRayTracingPipeline: Device.createRayTracingPipeline,
      createRayTracingShaderBindingTable: Device.createRayTracingShaderBindingTable,
      createRayTracingAccelerationContainer: Device.createRayTracingAccelerationContainer,
      createRayTracingBindGroup: Device.createRayTracingBindGroup,
    },
    accelerationContainerUsage: {
      none: AccelerationContainerUsage.none,
      allow_update: AccelerationContainerUsage.allow_update,
      prefer_fast_trace: AccelerationContainerUsage.prefer_fast_trace,
      prefer_fast_build: AccelerationContainerUsage.prefer_fast_build,
      low_memory: AccelerationContainerUsage.low_memory,
    },
    accelerationGeometryUsage: {
      none: AccelerationGeometryUsage.none,
      opaque: AccelerationGeometryUsage.opaque,
      allow_any_hit: AccelerationGeometryUsage.allow_any_hit,
    },
    accelerationInstanceUsage: {
      none: AccelerationInstanceUsage.none,
      triangle_cull_disable: AccelerationInstanceUsage.triangle_cull_disable,
      triangle_front_counterclockwise: AccelerationInstanceUsage.triangle_front_counterclockwise,
      force_opaque: AccelerationInstanceUsage.force_opaque,
      force_no_opaque: AccelerationInstanceUsage.force_no_opaque,
    },

    bufferUsage: {
      storage: BufferUsage.storage,
      uniform: BufferUsage.uniform,
      indirect: BufferUsage.indirect,
      vertex: BufferUsage.vertex,
      index: BufferUsage.index,
      map_read: BufferUsage.map_read,
      map_write: BufferUsage.map_write,
      copy_src: BufferUsage.copy_src,
      copy_dst: BufferUsage.copy_dst,
      ray_tracing: BufferUsage.ray_tracing,
    },

    shaderStage: {
      compute: ShaderStage.compute,
      fragment: ShaderStage.fragment,
      vertex: ShaderStage.vertex,
      ray_generation: ShaderStage.ray_generation,
      ray_closest_hit: ShaderStage.ray_closest_hit,
      ray_any_hit: ShaderStage.ray_any_hit,
      ray_miss: ShaderStage.ray_miss,
      ray_intersection: ShaderStage.ray_intersection,
    },
  };
};

let _getStreamFromTuple = ((_, pipelineStream)) => pipelineStream;

let _getWindowWidth = () => 640;

let _getWindowHeight = () => 480;

let _createCamera = (~localPosition=(0.1, 1.1, 20.), ()) => {
  let gameObject =
    Wonderjs.GameObjectRunAPI.create()->ResultUtils.getExnSuccessValue;

  let transform =
    Wonderjs.GameObjectRunAPI.getTransform(gameObject)
    ->Wonderjs.OptionSt.getExn;

  Wonderjs.TransformRunAPI.setLocalPosition(
    transform,
    localPosition->Wonderjs.PositionVO.create,
    // (0.1, 10.1, 50.)->Wonderjs.PositionVO.create,
    // (0.1, 50.1, 100.)->Wonderjs.PositionVO.create,
    // (0.1, 1.1, 100.)->Wonderjs.PositionVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  let cameraProjection = Wonderjs.PerspectiveCameraProjectionRunAPI.create();

  Wonderjs.PerspectiveCameraProjectionRunAPI.setNear(
    cameraProjection,
    0.1->Wonderjs.NearVO.create,
  );
  Wonderjs.PerspectiveCameraProjectionRunAPI.setFar(
    cameraProjection,
    1000.->Wonderjs.FarVO.create,
  );
  Wonderjs.PerspectiveCameraProjectionRunAPI.setFovy(
    cameraProjection,
    60.->Wonderjs.FovyVO.create,
  );
  Wonderjs.PerspectiveCameraProjectionRunAPI.setAspect(
    cameraProjection,
    (
      _getWindowWidth()->Belt.Float.fromInt
      /. _getWindowHeight()->Belt.Float.fromInt
    )
    ->Wonderjs.AspectVO.create,
  );

  let cameraView = Wonderjs.BasicCameraViewRunAPI.create();

  Wonderjs.BasicCameraViewRunAPI.active(cameraView);

  Wonderjs.GameObjectRunAPI.addPerspectiveCameraProjection(
    gameObject,
    cameraProjection,
  )
  ->ResultUtils.getExnSuccessValueIgnore;
  Wonderjs.GameObjectRunAPI.addBasicCameraView(gameObject, cameraView)
  ->ResultUtils.getExnSuccessValueIgnore;

  gameObject;
};

let _createDirectionLight = () => {
  let gameObject =
    Wonderjs.GameObjectRunAPI.create()->ResultUtils.getExnSuccessValue;

  let transform =
    Wonderjs.GameObjectRunAPI.getTransform(gameObject)
    ->Wonderjs.OptionSt.getExn;

  Wonderjs.TransformRunAPI.setLocalEulerAngles(
    transform,
    (
      (-60.)->Wonderjs.AngleVO.create,
      0.->Wonderjs.AngleVO.create,
      0.->Wonderjs.AngleVO.create,
    )
    ->Wonderjs.EulerAnglesVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  let light =
    Wonderjs.DirectionLightRunAPI.create()->ResultUtils.getExnSuccessValue;

  Wonderjs.DirectionLightRunAPI.setIntensity(
    light,
    5.0->Wonderjs.IntensityVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  Wonderjs.GameObjectRunAPI.addDirectionLight(gameObject, light)
  ->ResultUtils.getExnSuccessValueIgnore;

  gameObject;
};

let _setBSDFMaterialData =
    (
      material,
      (
        (diffuse, specular, specularColor, metalness, roughness, transmission),
        (
          diffuseMapImageIdOpt,
          normalMapImageIdOpt,
          emissionMapImageIdOpt,
          channelRoughnessMetallicMapImageIdOpt,
        ),
      ),
    ) => {
  Wonderjs.BSDFMaterialRunAPI.setDiffuseColor(
    material,
    diffuse->Wonderjs.Color3VO.create->Wonderjs.DiffuseVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;
  Wonderjs.BSDFMaterialRunAPI.setSpecular(
    material,
    specular->Wonderjs.SpecularVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;
  Wonderjs.BSDFMaterialRunAPI.setRoughness(
    material,
    roughness->Wonderjs.RoughnessVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;
  Wonderjs.BSDFMaterialRunAPI.setMetalness(
    material,
    metalness->Wonderjs.MetalnessVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  Wonderjs.BSDFMaterialRunAPI.setSpecularColor(
    material,
    specularColor->Wonderjs.Color3VO.create->Wonderjs.SpecularColorVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;
  Wonderjs.BSDFMaterialRunAPI.setTransmission(
    material,
    transmission->Wonderjs.TransmissionVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  switch (diffuseMapImageIdOpt) {
  | None => ()
  | Some(mapImageId) =>
    Wonderjs.BSDFMaterialRunAPI.setDiffuseMapImageId(
      material,
      mapImageId->Wonderjs.ImageIdVO.create,
    )
  };

  switch (normalMapImageIdOpt) {
  | None => ()
  | Some(mapImageId) =>
    Wonderjs.BSDFMaterialRunAPI.setNormalMapImageId(
      material,
      mapImageId->Wonderjs.ImageIdVO.create,
    )
  };

  switch (emissionMapImageIdOpt) {
  | None => ()
  | Some(mapImageId) =>
    Wonderjs.BSDFMaterialRunAPI.setEmissionMapImageId(
      material,
      mapImageId->Wonderjs.ImageIdVO.create,
    )
  };

  switch (channelRoughnessMetallicMapImageIdOpt) {
  | None => ()
  | Some(mapImageId) =>
    Wonderjs.BSDFMaterialRunAPI.setChannelRoughnessMetallicMapImageId(
      material,
      mapImageId->Wonderjs.ImageIdVO.create,
    )
  };
};

let _createSphere =
    (
      ~localPosition,
      ~localEulerAngles=(0., 0., 0.),
      ~radius=2.,
      ~specular=1.0,
      ~specularColor=(1.0, 1.0, 1.0),
      ~metalness=0.0,
      ~roughness=0.0,
      ~transmission=0.0,
      ~diffuse=(0.0, 0.0, 0.0),
      ~diffuseMapImageIdOpt=None,
      ~normalMapImageIdOpt=None,
      ~emissionMapImageIdOpt=None,
      ~channelRoughnessMetallicMapImageIdOpt=None,
      (),
    ) => {
  let gameObject =
    Wonderjs.GameObjectRunAPI.create()->ResultUtils.getExnSuccessValue;

  let transform =
    Wonderjs.GameObjectRunAPI.getTransform(gameObject)
    ->Wonderjs.OptionSt.getExn;

  Wonderjs.TransformRunAPI.setLocalPosition(
    transform,
    localPosition->Wonderjs.PositionVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  let (x, y, z) = localEulerAngles;
  Wonderjs.TransformRunAPI.setLocalEulerAngles(
    transform,
    (
      x->Wonderjs.AngleVO.create,
      y->Wonderjs.AngleVO.create,
      z->Wonderjs.AngleVO.create,
    )
    ->Wonderjs.EulerAnglesVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  let bands = 20;
  let geometry =
    Wonderjs.GeometryRunAPI.createSphereGeometry(radius, bands)
    ->ResultUtils.getExnSuccessValue;

  Wonderjs.GameObjectRunAPI.addGeometry(gameObject, geometry)
  ->ResultUtils.getExnSuccessValueIgnore;

  let material =
    Wonderjs.BSDFMaterialRunAPI.create()->ResultUtils.getExnSuccessValue;

  _setBSDFMaterialData(
    material,
    (
      (diffuse, specular, specularColor, metalness, roughness, transmission),
      (
        diffuseMapImageIdOpt,
        normalMapImageIdOpt,
        emissionMapImageIdOpt,
        channelRoughnessMetallicMapImageIdOpt,
      ),
    ),
  );

  Wonderjs.GameObjectRunAPI.addBSDFMaterial(gameObject, material)
  ->ResultUtils.getExnSuccessValueIgnore;

  gameObject;
};

let _createPlane =
    (
      ~localPosition,
      ~localEulerAngles=(0., 0., 0.),
      ~width=50.,
      ~height=50.,
      ~specular=1.0,
      ~specularColor=(1.0, 1.0, 1.0),
      ~metalness=0.0,
      ~roughness=0.0,
      ~transmission=0.0,
      ~diffuse=(0.0, 0.0, 0.0),
      ~diffuseMapImageIdOpt=None,
      ~normalMapImageIdOpt=None,
      ~emissionMapImageIdOpt=None,
      ~channelRoughnessMetallicMapImageIdOpt=None,
      (),
    ) => {
  let gameObject =
    Wonderjs.GameObjectRunAPI.create()->ResultUtils.getExnSuccessValue;

  let transform =
    Wonderjs.GameObjectRunAPI.getTransform(gameObject)
    ->Wonderjs.OptionSt.getExn;

  Wonderjs.TransformRunAPI.setLocalPosition(
    transform,
    localPosition->Wonderjs.PositionVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  let (x, y, z) = localEulerAngles;
  Wonderjs.TransformRunAPI.setLocalEulerAngles(
    transform,
    (
      x->Wonderjs.AngleVO.create,
      y->Wonderjs.AngleVO.create,
      z->Wonderjs.AngleVO.create,
    )
    ->Wonderjs.EulerAnglesVO.create,
  )
  ->ResultUtils.getExnSuccessValueIgnore;

  let geometry =
    Wonderjs.GeometryRunAPI.createPlaneGeometry(width, height, 1, 1)
    ->ResultUtils.getExnSuccessValue;

  Wonderjs.GameObjectRunAPI.addGeometry(gameObject, geometry)
  ->ResultUtils.getExnSuccessValueIgnore;

  let material =
    Wonderjs.BSDFMaterialRunAPI.create()->ResultUtils.getExnSuccessValue;

  _setBSDFMaterialData(
    material,
    (
      (diffuse, specular, specularColor, metalness, roughness, transmission),
      (
        diffuseMapImageIdOpt,
        normalMapImageIdOpt,
        emissionMapImageIdOpt,
        channelRoughnessMetallicMapImageIdOpt,
      ),
    ),
  );

  Wonderjs.GameObjectRunAPI.addBSDFMaterial(gameObject, material)
  ->ResultUtils.getExnSuccessValueIgnore;

  gameObject;
};

let _buildScene1 = () => {
  let _ = _createCamera();
  let _ = _createDirectionLight();

  let _ =
    _createSphere(
      ~localPosition=(5.0, 0.0, 5.0),
      ~specular=0.95,
      ~metalness=0.3,
      ~roughness=0.07,
      ~diffuse=(0.5, 0.5, 0.1),
      (),
    );

  let _ =
    _createSphere(
      ~localPosition=((-5.0), 0.0, 5.0),
      ~specular=0.2,
      ~metalness=0.1,
      ~roughness=0.05,
      ~diffuse=(0.0, 1.0, 0.1),
      (),
    );

  let _ =
    _createPlane(
      ~localPosition=(0., (-10.), (-5.)),
      ~localEulerAngles=((-90.), 0., 0.),
      ~specular=0.95,
      ~metalness=0.6,
      ~roughness=0.03,
      ~diffuse=(0., 0., 1.),
      (),
    );

  ();
};

let _buildScene2 = () => {
  let _ = _createCamera();
  let _ = _createDirectionLight();

  let _ =
    _createSphere(
      ~localPosition=(5.0, 0.0, 5.0),
      ~specular=0.95,
      ~diffuseMapImageIdOpt="diffuseMap1"->Some,
      ~normalMapImageIdOpt="normalMap1"->Some,
      ~emissionMapImageIdOpt="emissionMap1"->Some,
      ~channelRoughnessMetallicMapImageIdOpt="metalRoughnessMap1"->Some,
      (),
    );

  let _ =
    _createSphere(
      ~localPosition=((-5.0), 0.0, 5.0),
      ~localEulerAngles=(0., 90., 0.),
      ~specular=0.95,
      ~diffuseMapImageIdOpt="diffuseMap1"->Some,
      ~normalMapImageIdOpt="normalMap1"->Some,
      ~emissionMapImageIdOpt="emissionMap1"->Some,
      ~channelRoughnessMetallicMapImageIdOpt="metalRoughnessMap1"->Some,
      (),
    );

  let _ =
    _createPlane(
      ~localPosition=(0., (-10.), (-5.)),
      ~localEulerAngles=((-90.), 0., 0.),
      ~specular=0.95,
      ~diffuseMapImageIdOpt="diffuseMap2"->Some,
      ~normalMapImageIdOpt="normalMap2"->Some,
      ~emissionMapImageIdOpt="emissionMap2"->Some,
      ~channelRoughnessMetallicMapImageIdOpt="metalRoughnessMap2"->Some,
      (),
    );

  ();
};

let _buildScene3 = () => {
  let _ = _createCamera(~localPosition=(0.1, 1.1, 25.), ());
  let _ = _createDirectionLight();

  let _ =
    _createSphere(
      ~localPosition=(0.0, 0.0, 0.0),
      ~specular=1.0,
      ~metalness=0.3,
      ~roughness=0.07,
      ~diffuse=(0.5, 0.5, 0.1),
      ~transmission=1.0,
      (),
    );

  let _ =
    _createSphere(
      ~localPosition=(8.0, 0.0, 7.0),
      ~specular=1.0,
      ~metalness=0.3,
      ~roughness=0.07,
      ~diffuse=(1.0, 0.0, 0.0),
      (),
    );

  let _ =
    _createSphere(
      ~localPosition=((-7.0), 3.0, 0.0),
      ~metalness=0.3,
      ~roughness=0.07,
      ~diffuse=(0.0, 0.0, 1.0),
      ~transmission=0.7,
      (),
    );

  let _ =
    _createPlane(
      ~localPosition=((-6.), 0., 7.0),
      ~width=5.,
      ~height=5.,
      ~localEulerAngles=(180.0, 0.0, 0.0),
      ~metalness=0.6,
      ~roughness=0.03,
      ~transmission=1.0,
      (),
    );

  let _ =
    _createPlane(
      ~localPosition=((-7.0), 2.0, 8.0),
      ~width=5.,
      ~height=5.,
      ~metalness=0.6,
      ~roughness=0.03,
      ~diffuse=(0., 0., 1.),
      ~transmission=0.7,
      (),
    );

  let _ =
    _createPlane(
      ~localPosition=(0., 0., (-20.)),
      ~localEulerAngles=(0., 0., 0.),
      ~metalness=0.6,
      ~roughness=0.03,
      ~diffuse=(1., 0., 0.),
      (),
    );

  let _ =
    _createPlane(
      ~localPosition=(0., (-10.), 0.),
      ~localEulerAngles=((-90.), 0., 0.),
      ~metalness=0.6,
      ~roughness=0.03,
      ~diffuse=(0., 0., 1.),
      (),
    );

  ();
};

let _readPNGFile: Js.Typed_array.ArrayBuffer.t => Wonderjs.ImagePOType.data = [%bs.raw
  {|
   (buf) =>{
      var loadpng = require("@cwasm/lodepng");

      return loadpng.decode(buf);
   }
|}
];

let _readJPEGFile: Js.Typed_array.ArrayBuffer.t => Wonderjs.ImagePOType.data = [%bs.raw
  {|
   (buf) =>{
      var jpegturbo = require("@cwasm/jpeg-turbo");

      return jpegturbo.decode(buf);
   }
|}
];

let _isPNGFile = buffer => {
  let viewU8 = Js.Typed_array.Uint8Array.fromBuffer(buffer);
  let offset = 0x0;

  Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset) === 0x89
  && Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset + 1) === 0x50
  && Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset + 2) === 0x4E
  && Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset + 3) === 0x47;
};

let _isJPEGFile = buffer => {
  let viewU8 = Js.Typed_array.Uint8Array.fromBuffer(buffer);
  let offset = 0x0;

  Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset) === 0xFF
  && Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset + 1) === 0xD8
  && Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset + 2) === 0xFF
  && Js.Typed_array.Uint8Array.unsafe_get(viewU8, offset + 3) === 0xE0;
};

let _readImageFile = path => {
  let buf = Node.readFileSync(path);

  _isPNGFile(buf)
    ? _readPNGFile(buf)->WonderBsMost.Most.just->Wonderjs.Result.succeed
    : {
      _isJPEGFile(buf)
        ? _readJPEGFile(buf)->WonderBsMost.Most.just->Wonderjs.Result.succeed
        : Wonderjs.Result.failWith("Cannot process image file $path");
    };
};

let start = () => {
  Wonderjs.OtherConfigDpCPAPI.set({getIsDebug: () => true});
  Wonderjs.TimeDpCPAPI.set({getNow: () => Performance.now()});
  Wonderjs.NetworkDpCPAPI.set({readImageFile: _readImageFile});

  Wonderjs.WebGPUCoreDpRunAPI.set(_createWebGPUDp());
  Wonderjs.WebGPURayTracingDpRunAPI.set(_createWebGPURayTracingDp());

  Wonderjs.DirectorCPAPI.prepare(
    ~pictureSize=(_getWindowWidth(), _getWindowHeight()),
    ~sampleCount=30,
    (),
  )
  ->Wonderjs.Result.handleFail(ResultUtils.handleFail);

  let stream =
    Wonderjs.AssetRunAPI.loadImages([
      ("emissionMap1", "./asset/BoomBox/glTF/BoomBox_emissive.png"),
      ("normalMap1", "./asset/BoomBox/glTF/BoomBox_normal.png"),
      ("diffuseMap1", "./asset/BoomBox/glTF/BoomBox_baseColor.png"),
      (
        "metalRoughnessMap1",
        "./asset/BoomBox/glTF/BoomBox_metallicRoughness.png",
      ),
      ("emissionMap2", "./asset/DamagedHelmet/glTF/Default_emissive.jpg"),
      ("normalMap2", "./asset/DamagedHelmet/glTF/Default_normal.jpg"),
      ("diffuseMap2", "./asset/DamagedHelmet/glTF/Default_albedo.jpg"),
      (
        "metalRoughnessMap2",
        "./asset/DamagedHelmet/glTF/Default_metalRoughness.jpg",
      ),
    ])
    ->ResultUtils.getExnSuccessValue
    ->WonderBsMost.Most.concat(_buildScene3()->WonderBsMost.Most.just, _)
    ->WonderBsMost.Most.map(_ => ()->Wonderjs.Result.succeed, _);

  stream
  ->WonderBsMost.Most.concat(
      Wonderjs.DirectorCPAPI.init()
      ->Wonderjs.Result.handleFail(ResultUtils.handleFail)
      ->_getStreamFromTuple,
      _,
    )
  ->WonderBsMost.Most.concat(
      Wonderjs.DirectorCPAPI.update()
      ->Wonderjs.Result.handleFail(ResultUtils.handleFail)
      ->_getStreamFromTuple,
      _,
    )
  ->WonderBsMost.Most.drain
  ->Js.Promise.then_(
      () => {Js.log("init and update")->Js.Promise.resolve},
      _,
    )
  ->Js.Promise.catch(
      e => {
        Js.log(e);
        e->Obj.magic->Js.Promise.reject;
      },
      _,
    )
  ->Js.Promise.then_(
      () => {
        let stream =
          Wonderjs.DirectorCPAPI.render()
          ->Wonderjs.Result.handleFail(ResultUtils.handleFail)
          ->_getStreamFromTuple;

        let rec _onFrame = () => {
          stream
          ->WonderBsMost.Most.drain
          ->Js.Promise.then_(
              () => {
                Js.log("render");

                _onFrame()->Js.Promise.resolve;
              },
              _,
            )
          ->Js.Promise.catch(
              e => {
                Js.log(e);
                e->Obj.magic->Js.Promise.reject;
              },
              _,
            )
          ->ignore;
        };
        _onFrame()->Js.Promise.resolve;
      },
      _,
    )
  ->ignore;
};

start();
