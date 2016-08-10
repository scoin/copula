var path = require('path');
var fs = require('fs');
var _ = require('lodash');

// function init(moduleName, directory, pointer){
//     var context = this;
//     if(!pointer){
//         pointer = "globals";
//     }
//     var globalsHandler = context.globals;
//     var globals = globalsHandler.get();

//     var serviceFiles = fs.readdirSync(directory);
//     console.log("INITIALIZING " + moduleName);

//     var services = {}

//     for(var i in serviceFiles){
//         var service = serviceFiles[i].substr(0, serviceFiles[i].lastIndexOf('.'));
//         var methods = require(directory + "/" + service);
//         services[service] = methods;
//     }

//     globals[moduleName] = {};

//     for(var name in services){
//         console.log(name)
//         if(typeof services[name] === "function"){
//             globals[moduleName][name] = services[name].bind(globals)
//         } else if(typeof services[name] === "object"){
//             globals[moduleName][name] = {}
//             for(var func in services[name]){
//                 globals[moduleName][name][func] = services[name][func].bind(globals);
//             }
//         }
//     }

//     var setObj = {};
//     setObj[moduleName] = globals[moduleName];

//     globalsHandler.set(setObj);

//     return globals[moduleName];
// }

function init(moduleName, directory){
    console.log("INITIALIZING " + moduleName);
    var context = this;

    var globalsHandler = context.globals;

    var data = buildFileData(moduleName, directory, globalsHandler.get());
    console.log("DATA", data)
    globalsHandler.set(data);
    return data;
}

var buildFileData = function(pointer, directory, globals, data){
    if(!data){
        data = {};
    }

    var files = fs.readdirSync(directory);
    files.forEach(function(filename, index){
        var file = directory + "/" + filename;
        if(fs.statSync(file).isFile()){
            var name = filename.split(".")[0];
            var fileData = require(file);

            if(typeof fileData === "object"){
                for(var i in fileData){
                    if(typeof fileData[i] === "function"){
                        fileData[i] = fileData[i].bind(globals);
                    }
                }
            } else if(typeof fileData === "function"){
                fileData = fileData.bind(globals);
            }
            console.log(pointer + "." + name)
            _.set(data, pointer + "." + name, fileData);

        } else if(fs.statSync(file).isDirectory()){
            var name = filename;
            console.log(pointer + "." + name)
            _.merge(data, buildFileData(pointer + "." + name, directory + "/" + name, globals, data))
        }
    })
    return data;
}

module.exports = init;