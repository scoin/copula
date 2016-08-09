var path = require("path");

module.exports = {
    //service discovery interface
    discovery: null, //will be function that takes function
    //environment variables
    env: {},
    //event callbacks
    events: require(path.normalize(__dirname + "/events.js")),
    //environment mode, development, staging, production...
    mode: "",
    //globals setter and getter
    globals: require(path.normalize(__dirname + "/globals.js")),
    //middleware
    middleware: {},
    //global file import function
    modules: {},
    //routes declaration
    routes: {},
    //validators
    validators: {},
    //public
    publicDirectory: path.normalize("./public"),
    //view engine
    viewEngine: null,
    //init function
    init: function(hostname, port){ require(path.normalize(__dirname + "/init.js")).call(this, hostname, port) }
}