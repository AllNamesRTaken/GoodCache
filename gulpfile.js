const { series, src, dest } = require('gulp');
var fs = require("fs");
// var chalk = require("chalk");

// var config = require("./build/buildConfig.js");
var package = require("./package.json");
var version = package.version.split(".").map((v) => parseInt(v) || 0);

function bump(cb) {
    version[2]++;
    package.version = version.join(".");
    fs.writeFileSync("./package.json", JSON.stringify(package, null, 2), { encoding: "utf8" });
    cb();
}
function modifyBundle(cb) {
    var bundle = fs.readFileSync(`./dist/${package.name}.min.js`, "utf8");
    var bundle = bundle.replace("window, function()", `typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : typeof(self) !== "undefined" ? self : undefined, function()`);
    var bundle = bundle.replace("window,function()", `typeof(window) !== "undefined" ? window : typeof(global) !== "undefined" ? global : typeof(self) !== "undefined" ? self : undefined, function()`);
    fs.writeFileSync(`./dist/${package.name}.min.js`, bundle, { encoding: "utf8" });
    cb();
}
function pack() {
    return src(["./package.json", "./README.md"])
        .pipe(dest("dist"));
}
function copyDTS() {
    return src("./dts/**/*.d.ts")
        .pipe(dest("dist"));
}

exports.package = series(bump, modifyBundle, copyDTS, pack);