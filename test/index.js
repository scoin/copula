var friendship = require("friendship");
var ejs = require("ejs");

friendship.env = {
    development: {
        "REDIS": true
    },
    production: {
        "REDIS": false
    }
}

friendship.mode = "development";

friendship.modules = {
    "helpers": __dirname + "/helpers",
    "doge": __dirname + "/doge"
}

friendship.routes = {
    "GET /": "validators.get middleware.set handlers.ok",
    "GET /lol": "handlers.wut"
}

friendship.validators = require(__dirname + "/validators/ping.js");

friendship.middleware = {
    set: function(req, res, next){
        req.LOL = {"sup": true};
        next();
    }
}

friendship.handlers = {
    ok: function(req, res, next){
        console.log("HERE", this)
        this.helpers.something("OH NO")
        res.ok(req.LOL);
    },
    wut: function(req, res, next){
        res.ok("OK LOL");
    }
}

// friendship.viewEngine = "ejs"
// friendship.publicDirectory = __dirname + "/public"

friendship.events.onInit = function(next){
    var globals = this;
    console.log("OH MENG");
    next();
}

friendship.events.onRequest = function(req, res, next){
    var globals = this;
    console.log("ON REQUEST");
    next()
}

friendship.events.onResponse = function(req, res, data){
    var globals = this;
    console.log("ON RESPONSE");
}

friendship.events.afterStart = function(){
    var globals = this;
    globals.helpers.something("WUT")
}

friendship.events.shutdown = function(){
    var globals = this;
    console.log(globals.env.get("REDIS"))
    console.log("SHUTTING DOWN")
}

friendship.init("localhost", 5000)