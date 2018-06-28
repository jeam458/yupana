var cradle = require('cradle')
var config = require('./config')
var nano = require('nano')('http://admin:123456@127.0.0.1:5984');
var _users = nano.use('_users');



var connection = new(cradle.Connection)(config.couchdb.baseUrl, config.couchdb.port, {
	auth:{"username": config.couchdb.username,"password":config.couchdb.password}
});

var db = connection.database('_users');

exports.database = db;


/*exports.save = function(user, callback) {
	db.save(user, function(error, result) {
		if( error ) callback(error)
			else callback(null, result);
	});
};*/
exports.insert= function(user,params,callback){
    _users.insert(user,user.id, function(err, body) {
	 if (err) {console.log(err);
	           callback(err)}
	 else{
		console.log(body);
		callback(null,body);
	 }
    });
};

exports.finduser = function(id, callback) {
     console.log(id);
	db.get('org.couch.user'+ id,{revs_info:true}, function(error, result){
		if( error ){
			callback(error)
		}else{
			var doc
			result.forEach(function (row){
				doc = row
			});
			callback(null, doc);
			console.log("datos");
			console.log(doc);
		}
	})
};








