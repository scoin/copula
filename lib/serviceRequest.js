var request = require('request');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function(serviceName){
	var discovery = this;
	var services = discovery.services();
	if(!(serviceName in services) || _.isEmpty(services[serviceName])){
		throw {
			statusCode: 500,
			error: "Service " + serviceName + " not connected.",
			sender: services.self
		}
	}

	var service = getRandomService(serviceName, services);

	var httpRequest = function(path, options, cb){
	
		var protocol = service.info.protocol;
		var url = service.info.host;
		var port = service.info.port;

		if(typeof options === "function"){
			cb = options;
			options = {};
		}
		if(!options.headers){
			options.headers = {};
		}
		options.headers["content-type"] = "application/json";
		options.headers["accept"] = "application/json";
		options.json = true;
		options.url = protocol + "://" + url + ":" + port + path

		request[this.method](options, function(err, res, body) {
			if(err){
				return cb({
					statusCode: _.get(res, "statusCode", 500),
					body: err,
					sender: services.self,
					receiver: service
				})
			}
			if(res.statusCode >= 400){
				return cb(body, null, {
					statusCode: res.statusCode,
					sender: services.self,
					receiver: service
				})
			}
			cb(null, body, {
				statusCode: res.statusCode,
				sender: services.self,
				receiver: service
			})
		})
	}

	return {
		get: Promise.promisify(httpRequest.bind({method: "get"})),
		post: Promise.promisify(httpRequest.bind({method: "post"})),
		put: Promise.promisify(httpRequest.bind({method: "put"})),
		delete: Promise.promisify(httpRequest.bind({method: "delete"}))
	}
}

var getRandomService = function(serviceName, services){
	var serviceIds = Object.keys(services[serviceName]);
	return services[serviceName][serviceIds[Math.floor(Math.random() * serviceIds.length)]]
}