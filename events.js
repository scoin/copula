module.exports = {
    afterStart: function(){

    },
    beforeStart: function(next){
        next();
    },
    onInit: function(next){
        next();
    },
    onRequest: function(req, res, next){
        next();
    },
    onResponse: function(req, res, next){
        next();
    },
    shutdown: function(){
        
    }
}