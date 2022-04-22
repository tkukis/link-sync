#! /usr/bin/env node
const fs = require("fs-extra");
const nodeWatch = require('node-watch');
const commander = require('commander');

commander
  .version(JSON.parse(fs.readFileSync(__dirname + "/package.json" , "utf-8")).version, '-v, --version')
  .usage('[OPTIONS]...')
  .option('-w, --watch', 'Watch package for change')
  .option('-p, --path  <char>', 'package path relative to the parent directory')
  .parse(process.argv);
const {path, watch} = commander.opts();  
if(!path){
    console.error("please provile linked package");
    process.exit(1)
}

const packetLocation = require("path").resolve("./../" + path);

const packageJsonLocation = packetLocation + "/package.json";
let packetName;
try {
    packetName = JSON.parse(fs.readFileSync(packageJsonLocation , "utf-8")).name;
} catch (error) {
    console.error("error reading " + packageJsonLocation);
    process.exit(1)
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
const niceNumber = (number) => {
    if(number < 10){
        return "0" + number;
    }else {
        return number
    }
}
const logDate = () => {
    const date = new Date();
    return `${niceNumber(date.getHours())}:${niceNumber(date.getMinutes())}:${niceNumber(date.getSeconds())}`
}
const sync = () => {
    const syncFiles = (path) => {
        return fs.readdirSync(packetLocation).filter(f=> f !== "node_modules");
    };
    const destNodeModules = "./node_modules/" + packetName;
    removeDir(destNodeModules);
    makeDir(destNodeModules);
    syncFiles(path).forEach(f=>{
        fs.copySync( `${packetLocation}/${f}`, destNodeModules + "/" +f)
    });
    console.log(`[${logDate()}] `, `${path} synced into node_modules/${packetName}`);
}
sync();

watch && nodeWatch(packetLocation, { recursive: true }, (eventType, filename) => {
    sync();
});