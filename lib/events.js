var EventEmitter = require("events");

module.exports = function(){
    var context = this;
    var _emitter = new EventEmitter();
    return {
        on: function(event, cb){
            _emitter.on(event, cb.bind(context.globals.get()));
        },
        emit: function(event, data){
            _emitter.emit(event, data);
        },
        up: function(protocol, host, port){
            if(_emitter.listenerCount("up") > 0){
                _emitter.emit("up", {protocol: protocol, host: host, port: port});
            }
        },
        start: function(next){
            if(_emitter.listenerCount("start") > 0){
                _emitter.emit("start", next);
            } else {
                next();
            }
        },
        init: function(next){
            console.log(this)
            if(_emitter.listenerCount("init") > 0){
                _emitter.emit("init", next);
            } else {
                next();
            }
        },
        request: function(req, res, next){
            if(_emitter.listenerCount("request") > 0){
                _emitter.emit("request", {req: req, res: res, next: next});
            } else {
                next();
            }
        },
        response: function(req, res){
            if(_emitter.listenerCount("response") > 0){
                _emitter.emit("response", {req: req, res: res});
            }
        },
        shutdown: function(type){
            if(_emitter.listenerCount("shutdown") > 0){
                _emitter.emit("shutdown", type);
            }
        },
    }
}