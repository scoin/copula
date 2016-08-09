module.exports = {
    ping: function(req, res, next){
        this.helpers.something("YO!!")
        res.ok({hello: "wut up"})
    },
    view: function(req, res, next){
        res.render("index");
    }
}