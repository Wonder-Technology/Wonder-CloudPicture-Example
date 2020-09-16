type textureFormat = string;

module TextureView = {
  type t = Wonderjs.IWebGPUCoreDp.textureViewObject;

  [@bs.deriving abstract]
//   type descriptor = {
//     format: textureFormat,
//     [@bs.optional]
//     dimension: string,
//     [@bs.optional]
//     aspect: string,
//     [@bs.optional]
//     baseMipLevel: int,
//     [@bs.optional]
//     mipLevelCount: int,
//     [@bs.optional]
//     baseArrayLayer: int,
//     [@bs.optional]
//     arrayLayerCount: int,
//   };
  type descriptor = Wonderjs.IWebGPUCoreDp.textureViewDescriptor
};

module Extend3D = {
  type t = {
    .
    "width": int,
    "height": int,
    "depth": int,
  };
};

module TextureUsage = {
  type t = int;

  [@bs.val] [@bs.scope "GPUTextureUsage"] [@bs.module "webgpu"]
  external copy_src: t = "COPY_SRC";
  [@bs.val] [@bs.scope "GPUTextureUsage"] [@bs.module "webgpu"]
  external copy_dst: t = "COPY_DST";
  [@bs.val] [@bs.scope "GPUTextureUsage"] [@bs.module "webgpu"]
  external sampled: t = "SAMPLED";
  [@bs.val] [@bs.scope "GPUTextureUsage"] [@bs.module "webgpu"]
  external storage: t = "STORAGE";
  [@bs.val] [@bs.scope "GPUTextureUsage"] [@bs.module "webgpu"]
  external output_attachment: t = "OUTPUT_ATTACHMENT";
};

module Sampler = {
  type t = Wonderjs.IWebGPUCoreDp.samplerObject;

  [@bs.deriving abstract]
  type descriptor = Wonderjs.IWebGPUCoreDp.samplerDescriptor;
};

module Texture = {
  type t = Wonderjs.IWebGPUCoreDp.textureObject;

  [@bs.send.pipe: t]
  external createView: TextureView.descriptor => TextureView.t;

//   [@bs.deriving abstract]
//   type descriptor = {
//     size: Extend3D.t,
//     arrayLayerCount: int,
//     mipLevelCount: int,
//     sampleCount: int,
//     dimension: string,
//     format: textureFormat,
//     usage: TextureUsage.t,
//   };

  type descriptor = Wonderjs.IWebGPUCoreDp.textureDescriptor;
};

module SwapChain = {
  type t = Wonderjs.IWebGPUCoreDp.swapChainObject;

  [@bs.send.pipe: t] external getCurrentTextureView: unit => TextureView.t;
  [@bs.send.pipe: t] external present: unit;
};

module CommandBuffer = {
  type t = Wonderjs.IWebGPUCoreDp.commandBufferObject;
};

module Queue = {
  type t = Wonderjs.IWebGPUCoreDp.queueObject;

  [@bs.send.pipe: t] external submit: array(CommandBuffer.t) => unit;
};

module ShaderStage = {
  type t = int;

  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external ray_generation: t = "RAY_GENERATION";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external ray_closest_hit: t = "RAY_CLOSEST_HIT";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external ray_any_hit: t = "RAY_ANY_HIT";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external ray_miss: t = "RAY_MISS";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external ray_intersection: t = "RAY_INTERSECTION";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external compute: t = "COMPUTE";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external fragment: t = "FRAGMENT";
  [@bs.val] [@bs.scope "GPUShaderStage"] [@bs.module "webgpu"]
  external vertex: t = "VERTEX";
};

module BufferUsage = {
  type t = int;

  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external storage: t = "STORAGE";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external uniform: t = "UNIFORM";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external indirect: t = "INDIRECT";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external vertex: t = "VERTEX";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external index: t = "INDEX";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external map_read: t = "MAP_WRITE";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external map_write: t = "MAP_WRITE";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external copy_src: t = "COPY_SRC";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external copy_dst: t = "COPY_DST";
  [@bs.val] [@bs.scope "GPUBufferUsage"] [@bs.module "webgpu"]
  external ray_tracing: t = "RAY_TRACING";
};

module Buffer = {
  type t = Wonderjs.IWebGPUCoreDp.bufferObject;

//   type descriptor = {
//     .
//     "size": int,
//     "usage": BufferUsage.t,
//   };

  type descriptor = Wonderjs.IWebGPUCoreDp.bufferDescriptor;

  [@bs.send.pipe: t]
  external setSubFloat32Data: (int, Js.Typed_array.Float32Array.t) => unit =
    "setSubData";
  [@bs.send.pipe: t]
  external setSubUint8Data: (int, Js.Typed_array.Uint8Array.t) => unit =
    "setSubData";
  [@bs.send.pipe: t]
  external setSubUint32Data: (int, Js.Typed_array.Uint32Array.t) => unit =
    "setSubData";
};

module AccelerationContainerUsage = {
  type t = int;

  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationContainerUsage"]
  [@bs.module "webgpu"]
  external none: t = "NONE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationContainerUsage"]
  [@bs.module "webgpu"]
  external allow_update: t = "ALLOW_UPDATE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationContainerUsage"]
  [@bs.module "webgpu"]
  external prefer_fast_trace: t = "PREFER_FAST_TRACE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationContainerUsage"]
  [@bs.module "webgpu"]
  external prefer_fast_build: t = "PREFER_FAST_BUILD";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationContainerUsage"]
  [@bs.module "webgpu"]
  external low_memory: t = "LOW_MEMORY";
};

module AccelerationGeometryUsage = {
  type t = int;

  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationGeometryUsage"]
  [@bs.module "webgpu"]
  external none: t = "NONE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationGeometryUsage"]
  [@bs.module "webgpu"]
  external opaque: t = "OPAQUE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationGeometryUsage"]
  [@bs.module "webgpu"]
  external allow_any_hit: t = "ALLOW_ANY_HIT";
};

module AccelerationInstanceUsage = {
  type t = int;

  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationInstanceUsage"]
  [@bs.module "webgpu"]
  external none: t = "NONE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationInstanceUsage"]
  [@bs.module "webgpu"]
  external triangle_cull_disable: t = "TRIANGLE_CULL_DISABLE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationInstanceUsage"]
  [@bs.module "webgpu"]
  external triangle_front_counterclockwise: t =
    "TRIANGLE_FRONT_COUNTERCLOCKWISE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationInstanceUsage"]
  [@bs.module "webgpu"]
  external force_opaque: t = "FORCE_OPAQUE";
  [@bs.val]
  [@bs.scope "GPURayTracingAccelerationInstanceUsage"]
  [@bs.module "webgpu"]
  external force_no_opaque: t = "FORCE_NO_OPAQUE";
};

module AccelerationContainer = {
  type t = Wonderjs.IWebGPURayTracingDp.accelerationContainerObject;

  type geometryVertex = {
    .
    "buffer": Buffer.t,
    "format": string,
    "stride": int,
    "count": int,
  };

  type geometryIndex = {
    .
    "buffer": Buffer.t,
    "format": string,
    "count": int,
  };

  type geometry = {
    .
    "usage": AccelerationGeometryUsage.t,
    "type": string,
    "vertex": geometryVertex,
    "index": geometryIndex,
  };

  type transform3D = {
    .
    "x": float,
    "y": float,
    "z": float,
  };

  type transform = {
    .
    "translation": transform3D,
    "rotation": transform3D,
    "scale": transform3D,
  };

  type instanceId = int;

//   [@bs.deriving abstract]
//   type instance = {
//     usage: AccelerationInstanceUsage.t,
//     mask: int,
//     instanceId,
//     instanceOffset: int,
//     geometryContainer: t,
//     [@bs.optional]
//     transform,
//     [@bs.optional]
//     transformMatrix: Js.Typed_array.Float32Array.t,
//   };

  type instance = Wonderjs.IWebGPURayTracingDp.instance;

//   let getInstanceId = instance => {
//     instance->instanceIdGet;
//   };

//   [@bs.deriving abstract]
//   type descriptor = {
//     level: string,
//     usage: AccelerationContainerUsage.t,
//     [@bs.optional]
//     geometries: array(geometry),
//     [@bs.optional]
//     instances: array(instance),
//   };
  type descriptor = Wonderjs.IWebGPURayTracingDp.accelerationContainerDescriptor;

  [@bs.send.pipe: t] external updateInstance: (instanceId, instance) => unit;

  [@bs.send.pipe: t]
  external setSubFloat32Data: (int, Js.Typed_array.Float32Array.t) => unit =
    "setSubData";
};

module BindGroupLayout = {
  type t = Wonderjs.IWebGPUCoreDp.bindGroupLayoutObject;

  type bindingPoint = int;

//   [@bs.deriving abstract]
//   type layoutBinding = {
//     binding: bindingPoint,
//     visibility: ShaderStage.t,
//     [@bs.as "type"]
//     type_: string,
//     [@bs.optional]
//     hasDynamicOffset: bool,
//   };
  type layoutBinding = Wonderjs.IWebGPUCoreDp.layoutBinding;

//   type descriptor = {. "entries": array(layoutBinding)};
  type descriptor = Wonderjs.IWebGPUCoreDp.bindGroupLayoutDescriptor;
};

module BindGroup = {
  type t = Wonderjs.IWebGPUCoreDp.bindGroupObject;
};


module CoreBindGroup = {

//   [@bs.deriving abstract]
//   type binding = {
//     // [@bs.optional]
//     // accelerationContainer: AccelerationContainer.t,
//     binding: BindGroupLayout.bindingPoint,
//     [@bs.optional]
//     buffer: Buffer.t,
//     [@bs.optional]
//     sampler: Sampler.t,
//     [@bs.optional]
//     textureView: TextureView.t,
//     [@bs.optional]
//     offset: int,
//     size: int,
//   };

  type binding = Wonderjs.IWebGPUCoreDp.binding;


//   type descriptor = {
//     .
//     "layout": BindGroupLayout.t,
//     "entries": array(binding),
//   };
  type descriptor = Wonderjs.IWebGPUCoreDp.bindGroupDescriptor;
};

module RayTracingBindGroup = {
//   [@bs.deriving abstract]
//   type binding = {
//     // [@bs.optional]
//     accelerationContainer: AccelerationContainer.t,
//     binding: BindGroupLayout.bindingPoint,
//     [@bs.optional]
//     buffer: Buffer.t,
//     [@bs.optional]
//     sampler: Sampler.t,
//     [@bs.optional]
//     textureView: TextureView.t,
//     [@bs.optional]
//     offset: int,
//     size: int,
//   };
  type binding = Wonderjs.IWebGPURayTracingDp.binding;

//   type descriptor = {
//     .
//     "layout": BindGroupLayout.t,
//     "entries": array(binding),
//   };
  type descriptor = Wonderjs.IWebGPURayTracingDp.bindGroupDescriptor;
};

module ShaderModule = {
  type t = Wonderjs.IWebGPUCoreDp.shaderModuleObject;

//   type descriptor = {. "code": string};
  type descriptor = Wonderjs.IWebGPUCoreDp.shaderModuleDescriptor;
};

module ShaderBindingTable = {
  type t = Wonderjs.IWebGPURayTracingDp.shaderBindingTableObject;

  type stage = {
    .
    "module": ShaderModule.t,
    "stage": ShaderStage.t,
  };

//   [@bs.deriving abstract]
//   type group = {
//     [@bs.as "type"]
//     type_: string,
//     [@bs.optional]
//     generalIndex: int,
//     [@bs.optional]
//     anyHitIndex: int,
//     [@bs.optional]
//     closestHitIndex: int,
//     [@bs.optional]
//     intersectionIndex: int,
//   };

  type group = Wonderjs.IWebGPURayTracingDp.group;

//   type descriptor = {
//     .
//     "stages": array(stage),
//     "groups": array(group),
//   };

  type descriptor = Wonderjs.IWebGPURayTracingDp.shaderBindingTableDescriptor;
};

module Pipeline = {

  type layout = Wonderjs.IWebGPUCoreDp.pipelineLayoutObject;

  type layoutConfig = {. "bindGroupLayouts": array(BindGroupLayout.t)};

  module Render = {
  type t = Wonderjs.IWebGPUCoreDp.renderPipelineObject;

    // [@bs.deriving abstract]
    // type vertexStage = {
    //   [@bs.as "module"]
    //   module_: ShaderModule.t,
    //   entryPoint: string,
    // };

    // [@bs.deriving abstract]
    // type fragmentStage = {
    //   [@bs.as "module"]
    //   module_: ShaderModule.t,
    //   entryPoint: string,
    // };

    // [@bs.deriving abstract]
    // type vertexAttribute = {
    //   shaderLocation: int,
    //   offset: int,
    //   format: string,
    // };

    // [@bs.deriving abstract]
    // type vertexBuffer = {
    //   arrayStride: int,
    //   [@bs.optional]
    //   stepMode: string,
    //   attributes: array(vertexAttribute),
    // };

    // [@bs.deriving abstract]
    // type vertexState = {
    //   indexFormat: string,
    //   [@bs.optional]
    //   vertexBuffers: array(vertexBuffer),
    // };

    // [@bs.deriving abstract]
    // type rasterizationState = {
    //   [@bs.optional]
    //   frontFace: string,
    //   [@bs.optional]
    //   cullMode: string,
    // };

    // [@bs.deriving abstract]
    // type blendDescriptor = {
    //   [@bs.optional]
    //   srcFactor: string,
    //   [@bs.optional]
    //   dstFactor: string,
    //   [@bs.optional]
    //   operation: string,
    // };

    // [@bs.deriving abstract]
    // type colorState = {
    //   format: textureFormat,
    //   alphaBlend: blendDescriptor,
    //   colorBlend: blendDescriptor,
    // };

    // [@bs.deriving abstract]
    // type stencilStateFaceDescriptor = {
    //   [@bs.optional]
    //   compare: string,
    //   [@bs.optional]
    //   failOp: string,
    //   [@bs.optional]
    //   depthFailOp: string,
    //   [@bs.optional]
    //   passOp: string,
    // };

    // [@bs.deriving abstract]
    // type depthStencilState = {
    //   depthWriteEnabled: bool,
    //   depthCompare: string,
    //   format: string,
    //   stencilFront: stencilStateFaceDescriptor,
    //   stencilBack: stencilStateFaceDescriptor,
    // };

    // [@bs.deriving abstract]
    // type descriptor = {
    //   layout,
    //   [@bs.optional]
    //   sampleCount: int,
    //   vertexStage,
    //   fragmentStage,
    //   primitiveTopology: string,
    //   vertexState,
    //   rasterizationState,
    //   colorStates: array(colorState),
    //   [@bs.optional]
    //   depthStencilState,
    // };

  type descriptor = Wonderjs.IWebGPUCoreDp.pipelineRenderDescriptor;
  };

  module RayTracing = {
  type t = Wonderjs.IWebGPURayTracingDp.rayTracingPipelineObject;

    // [@bs.deriving abstract]
    // type rayTracingState = {
    //   shaderBindingTable: ShaderBindingTable.t,
    //   maxRecursionDepth: int,
    //   maxPayloadSize: int,
    // };

    // [@bs.deriving abstract]
    // type descriptor = {
    //   layout,
    //   rayTracingState,
    // };

  type descriptor = Wonderjs.IWebGPURayTracingDp.pipelineRayTracingDescriptor;
  };

  module Compute = {
  type t = Wonderjs.IWebGPUCoreDp.computePipelineObject;

    // [@bs.deriving abstract]
    // type computeStage = {
    //   [@bs.as "module"]
    //   module_: ShaderModule.t,
    //   entryPoint: string,
    // };

    // [@bs.deriving abstract]
    // type descriptor = {
    //   layout,
    //   computeStage,
    // };

  type descriptor = Wonderjs.IWebGPUCoreDp.pipelineComputeDescriptor;
  };
};

module PassEncoder = {
  module Render = {
    type t = Wonderjs.IWebGPUCoreDp.passEncoderRenderObject;

    // type clearColor = {
    //   .
    //   "r": float,
    //   "g": float,
    //   "b": float,
    //   "a": float,
    // };

    // type colorAttachment = {
    //   .
    //   "clearColor": clearColor,
    //   "loadOp": string,
    //   "storeOp": string,
    //   "attachment": TextureView.t,
    // };

    // type depthStencilAttachment = {
    //   .
    //   "clearDepth": float,
    //   "depthLoadOp": string,
    //   "depthStoreOp": string,
    //   "clearStencil": int,
    //   "stencilLoadOp": string,
    //   "stencilStoreOp": string,
    //   "attachment": TextureView.t,
    // };

    // [@bs.deriving abstract]
    // type descriptor = {
    //   colorAttachments: array(colorAttachment),
    //   [@bs.optional]
    //   depthStencilAttachment,
    // };

  type descriptor = Wonderjs.IWebGPUCoreDp.passEncoderRenderDescriptor;

    type vertexCount = int;
    type indexCount = int;
    type instanceCount = int;
    type firstVertex = int;
    type firstIndex = int;
    type firstInstance = int;
    type baseVertex = firstVertex;

    [@bs.send.pipe: t] external setPipeline: Pipeline.Render.t => unit;
    [@bs.send.pipe: t]
    external setBindGroup: (BindGroupLayout.bindingPoint, BindGroup.t) => unit;
    [@bs.send.pipe: t]
    external setDynamicBindGroup:
      (BindGroupLayout.bindingPoint, BindGroup.t, array(int)) => unit =
      "setBindGroup";
    [@bs.send.pipe: t] external setVertexBuffer: (int, Buffer.t) => unit;
    [@bs.send.pipe: t] external setIndexBuffer: Buffer.t => unit;
    [@bs.send.pipe: t]
    external draw:
      (vertexCount, instanceCount, firstVertex, firstInstance) => unit;
    [@bs.send.pipe: t]
    external drawIndexed:
      (indexCount, instanceCount, firstIndex, baseVertex, firstInstance) =>
      unit;
    [@bs.send.pipe: t] external endPass: unit;
  };

  module RayTracing = {
    type t = Wonderjs.IWebGPURayTracingDp.passEncoderRayTracingObject;

    // [@bs.deriving abstract]
    // type descriptor = {
    //   [@bs.optional]
    //   label: string,
    // };
  type descriptor = Wonderjs.IWebGPURayTracingDp.passEncoderRayTracingDescriptor;

    type sbtRayGenerationOffset = int;
    type sbtRayHitOffset = int;
    type sbtRayMissOffset = int;
    type queryWidthDimension = int;
    type queryHeightDimension = int;
    type queryDepthDimension = int;

    [@bs.send.pipe: t] external setPipeline: Pipeline.RayTracing.t => unit;
    [@bs.send.pipe: t]
    external setBindGroup: (BindGroupLayout.bindingPoint, BindGroup.t) => unit;
    [@bs.send.pipe: t]
    external traceRays:
      (
        sbtRayGenerationOffset,
        sbtRayHitOffset,
        sbtRayMissOffset,
        queryWidthDimension,
        queryHeightDimension,
        queryDepthDimension
      ) =>
      unit;
    [@bs.send.pipe: t] external endPass: unit;
  };

  module Compute = {
    type t = Wonderjs.IWebGPUCoreDp.passEncoderComputeObject;

    // [@bs.deriving abstract]
    // type descriptor = {
    //   [@bs.optional]
    //   label: string,
    // };
  type descriptor = Wonderjs.IWebGPUCoreDp.passEncoderComputeDescriptor;

    type x = int;
    type y = int;
    type z = int;

    [@bs.send.pipe: t] external setPipeline: Pipeline.Compute.t => unit;
    [@bs.send.pipe: t]
    external setBindGroup: (BindGroupLayout.bindingPoint, BindGroup.t) => unit;
    [@bs.send.pipe: t]
    external setDynamicBindGroup:
      (BindGroupLayout.bindingPoint, BindGroup.t, array(int)) => unit =
      "setBindGroup";
    [@bs.send.pipe: t] external dispatchX: x => unit = "dispatch";
    [@bs.send.pipe: t] external endPass: unit;
  };
};

module CommandEncoder = {
  type t = Wonderjs.IWebGPUCoreDp.commandEncoderObject;

//   [@bs.deriving abstract]
//   type descriptor = {
//     [@bs.optional]
//     label: string,
//   };
  type descriptor = Wonderjs.IWebGPUCoreDp.commandEncoderDescriptor;

  [@bs.send.pipe: t]
  external beginRenderPass:
    PassEncoder.Render.descriptor => PassEncoder.Render.t;
  [@bs.send.pipe: t]
  external beginRayTracingPass:
    PassEncoder.RayTracing.descriptor => PassEncoder.RayTracing.t;
  [@bs.send.pipe: t]
  external beginComputePass:
    PassEncoder.Compute.descriptor => PassEncoder.Compute.t;
  [@bs.send.pipe: t]
  external buildRayTracingAccelerationContainer:
    AccelerationContainer.t => unit;
  [@bs.send.pipe: t]
  external updateRayTracingAccelerationContainer:
    AccelerationContainer.t => unit;
  [@bs.send.pipe: t] external finish: CommandBuffer.t;
};

module Device = {
  type t = Wonderjs.IWebGPUCoreDp.deviceObject;

  [@bs.send.pipe: t] external getQueue: Queue.t;
  [@bs.send.pipe: t]
  external createShaderModule: ShaderModule.descriptor => ShaderModule.t;
  [@bs.send.pipe: t]
  external createPipelineLayout: Pipeline.layoutConfig => Pipeline.layout;
  [@bs.send.pipe: t] external createBuffer: Buffer.descriptor => Buffer.t;
  [@bs.send.pipe: t]
  external createBindGroupLayout:
    BindGroupLayout.descriptor => BindGroupLayout.t;
//   [@bs.send.pipe: t]
//   external createBindGroup: BindGroup.descriptor => BindGroup.t;

  [@bs.send.pipe: t]
  external createCoreBindGroup: CoreBindGroup.descriptor => BindGroup.t = "createBindGroup";

  [@bs.send.pipe: t]
  external createRayTracingBindGroup: RayTracingBindGroup.descriptor => BindGroup.t = "createBindGroup";

  [@bs.send.pipe: t]
  external createRenderPipeline:
    Pipeline.Render.descriptor => Pipeline.Render.t;
  [@bs.send.pipe: t]
  external createRayTracingPipeline:
    Pipeline.RayTracing.descriptor => Pipeline.RayTracing.t;
  [@bs.send.pipe: t]
  external createComputePipeline:
    Pipeline.Compute.descriptor => Pipeline.Compute.t;
  [@bs.send.pipe: t]
  external createRayTracingShaderBindingTable:
    ShaderBindingTable.descriptor => ShaderBindingTable.t;
  [@bs.send.pipe: t]
  external createRayTracingAccelerationContainer:
    AccelerationContainer.descriptor => AccelerationContainer.t;
  [@bs.send.pipe: t]
  external createCommandEncoder: CommandEncoder.descriptor => CommandEncoder.t;
  [@bs.send.pipe: t] external createSampler: Sampler.descriptor => Sampler.t;
  [@bs.send.pipe: t] external createTexture: Texture.descriptor => Texture.t;
};

module Context = {
  type t= Wonderjs.IWebGPUCoreDp.contextObject;

  type swapChainConfig = {
    .
    "device": Device.t,
    "format": textureFormat,
  };

  [@bs.send.pipe: t]
  external getSwapChainPreferredFormat:
    Device.t => Js.Promise.t(textureFormat);
  [@bs.send.pipe: t]
  external configureSwapChain: swapChainConfig => SwapChain.t;
};

module Window = {
  type t = Wonderjs.IWebGPUCoreDp.windowObject;

  type descriptor = {
    .
    "width": int,
    "height": int,
    "title": string,
    "resizable": bool,
  };

  [@bs.module "webgpu"] [@bs.new]
  external make: descriptor => t = "WebGPUWindow";
  [@bs.send.pipe: t] external getContext: ([@bs.as "webgpu"] _) => Context.t;
  [@bs.send.pipe: t] external pollEvents:  unit;
  [@bs.send.pipe: t] external shouldClose: bool;

  [@bs.get] external getWidth: t => int = "width";
  [@bs.get] external getHeight: t => int = "height";
};

module Adapter = {
  type t = Wonderjs.IWebGPUCoreDp.adapterObject;

  [@bs.send.pipe: t]
  external requestDevice:
    {. "extensions": array(string)} => Js.Promise.t(Device.t);
};

module GPU = {
//   [@bs.deriving abstract]
//   type adapterDescriptor = {
//     window: Window.t,
//     [@bs.optional]
//     preferredBackend: string,
//   };
  type descriptor = Wonderjs.IWebGPUCoreDp.adapterDescriptor;

  [@bs.scope "GPU"] [@bs.module "webgpu"]
  external requestAdapter: descriptor => Js.Promise.t(Adapter.t);
};
