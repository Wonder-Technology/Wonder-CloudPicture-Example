let handleFail = [%bs.raw{|
(err) => {
    throw err;
}
|}];

let getExnSuccessValue = result => {
result -> Wonderjs.Result.handleFail(handleFail);
};

let getExnSuccessValueIgnore = result => {
result -> getExnSuccessValue -> ignore;
};