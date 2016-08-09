var express = require('express');
var fs = require('fs');
var path = require('path');
var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
var async = require('async');
var _ = require('lodash');
var initResponses = require(path.normalize(__dirname + "/responses"));

module.exports = function(context){
    console.log("INITIALIZING ROUTES")
    var router = express.Router();
    return registerRoutes(context, router);
}

var registerRoutes = function(context, router){
    for(var key in context.routes){

        var routeInfo = {
            method: key.split(" ")[0].toLowerCase(),
            path: key.split(" ")[1]
        }

        if(typeof context.routes[key] === "string"){
                        
            var routeActions = context.routes[key].split(" ");

            var handlers = getHandlers(context, routeActions);

        } else if (context.routes[key] instanceof Array) {

            var handlers = context.routes[key];

        } else if (typeof context.routes[key] === "function"){
            var handlers = [context.routes[key]]
        }

        for(var func in handlers){
            handlers[func] = handlers[func].bind(context.globals.get());
        }

        var routeFunction = handlers.pop();

        router[routeInfo.method](routeInfo.path, function(req, res, next){
            var scope = this;
            initResponses.call(context, req, res);
            async.waterfall(scope.handlers.reduce(function(acc, val){ acc.push(async.apply(val, req, res)); return acc; }, []), function(err){
                if(err){
                    return;
                }
                scope.routeFunction(req, res, next);
            })
        }.bind({handlers: handlers, routeFunction: routeFunction}));
    }
    return router;
}

var getHandlers = function(context, routeActions){
    var handlers = [];
    for(var i in routeActions){
        var data = _.get(context, routeActions[i], null);

        if(typeof data != "function"){

            //todo: smarter about validator datatype, or validator premade as function
            if(routeActions[i].split(".")[0] === "validators"){
                handlers.push(doValidation.bind({validate: ajv.compile(data)}))
            } else {
                throw routeActions[i] + " is not a function or validator schema."
            }

        } else {
            handlers.push(data);
            
        }
    }
    return handlers;
}

// var findRouteHandler = function(key, routeDir){
//     var fileNames = fs.readdirSync(routeDir);
//     var routeHandler = null;
//     for(var i in fileNames){
//         stats = fs.statSync(routeDir + "/" + fileNames[i]);
//         if (stats.isFile()){
//             var routes = require(routeDir + "/" + fileNames[i]);
//             if(key in routes){
//                 routeHandler = routes[key];
//                 break;
//             }
//         }
//     }
//     if(!routeHandler){
//         throw "You have not defined a '" + key + "' function in any file in " + routeDir
//     }
//     return routeHandler;
// }

// var getMiddleware = function(input){
//     var middleware = [];
//     var sliceIndex = 2;
//     if(input.length > 2){
//         var validatorSchema = findMiddleware(input[2], __dirname + "/../api/validators");
//         if(validatorSchema){
//             middleware.push(doValidation.bind({validate: ajv.compile(validatorSchema)}));
//             sliceIndex += 1;
//         }
//         var middlewareCalls = input.slice(sliceIndex);
//         for(var i in middlewareCalls){
//             var middlewareFunc = findMiddleware(middlewareCalls[i], __dirname + "/../api/middleware")
//             if(!middlewareFunc){
//                 throw middlewareCalls[i] + " validator / middleware cannot be found."
//             }
//             middleware.push(middlewareFunc.bind(globalsHandler.get()));
//         }
//     }
//     return middleware;
// }

// var findMiddleware = function(path, dir){
//     var validatorLocation = path.split(".");
//     try{
//         var file = require(dir + "/" + validatorLocation[0]);
//     }
//     catch(e){
//         return false;
//     }
//     if(validatorLocation[1]){
//         return file[validatorLocation[1]];
//     }
//     return file;
// }

var doValidation = function(req, res, next){
    var valid = this.validate({
        query: req.query,
        body: req.body,
        params: req.params
    });
    if (!valid){
        return res.badRequest(this.validate.errors, "Validation Error");
    }
    else{
        next();
    }
}