type buffer = Js.Typed_array.ArrayBuffer.t;

[@bs.module "fs"]
external readFileSync:  string => buffer  = "";