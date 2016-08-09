module.exports = {
    get: {
        type: "object",
        properties:{
            query: {
                type: "object",
                required: ["thing"],
            }
        }
    }
}