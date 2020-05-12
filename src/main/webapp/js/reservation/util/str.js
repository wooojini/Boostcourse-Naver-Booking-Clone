class StrUtil {};

StrUtil.reverseStr = function (str) {
    let reverseStr = str.split("").reverse().join("");
    return reverseStr;
};

export {
    StrUtil,
};