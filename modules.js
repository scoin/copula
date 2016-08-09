var path = require('path');
var fs = require('fs');

function init(moduleName, directory){
    var context = this;
    var globalsHandler = context.globals;
    var globals = globalsHandler.get();

    var serviceFiles = fs.readdirSync(directory);
    console.log("INITIALIZING " + moduleName);

    var services = {}

    for(var i in serviceFiles){
        var service = serviceFiles[i].substr(0, serviceFiles[i].lastIndexOf('.'));
        var methods = require(directory + "/" + service);
        services[service] = methods;
    }

    globals[moduleName] = {};

    for(var name in services){
        console.log(name)
        if(typeof services[name] === "function"){
            globals[moduleName][name] = services[name].bind(globals)
        } else if(typeof services[name] === "object"){
            globals[moduleName][name] = {}
            for(var func in services[name]){
                globals[moduleName][name][func] = services[name][func].bind(globals);
            }
        }
    }

    var setObj = {};
    setObj[moduleName] = globals[moduleName];

    globalsHandler.set(setObj);

    return globals[moduleName];
}

module.exports = init;