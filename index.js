const fs = require("fs-extra");
const watch = require('node-watch');
console.log(process.argv);
const path = process.argv[2] || "./../my-awesome-component-library";
const destPath = process.argv[3] || "../my-awesome-component-library-copy"
console.log("starting sync between", path, "and", destPath);
const filesInPath = (path) => {
    return fs.readdirSync(path).filter(f=> f !== "node_modules");
};

let packetName;
try {
    JSON.parse(fs.readFileSync(path + "/package.json" , "utf-8")).name;

} catch (error) {
    throw("packet at " + path +" not exsist");
}
const removeDir = (path) => {
    try {
        fs.removeSync(path);
    } catch (error) {
        console.log(error);
    }
}
const makeDir = (dir) => {
    fs.ensureDirSync(dir);
}
const sync = () => {
    const destNodeModules =  destPath + "/node_modules/" + packetName;
    removeDir(destNodeModules);
    makeDir(destNodeModules);
    filesInPath(path).forEach(f=>{
        fs.copySync( `${path}/${f}`, destNodeModules + "/" +f)
    });
    console.log(new Date().toISOString(), "synced");
}
sync();
watch(path, { recursive: true }, (eventType, filename) => {
    sync();
});