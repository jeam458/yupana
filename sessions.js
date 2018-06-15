var config = require('./config')
var jwt = require('jwt-simple');
var moment = require('moment');
var databaseUrl = config.couchdb.url
var nanoDb = require('nano')({ url: databaseUrl })
var nano = require('nano')('http://admin:123456@127.0.0.1:5984');
var db = nano.use('_users')


, loggedInUsers = {}

, addLoggedInUser = exports.addLoggedInUser = function(authSession, user) {
    loggedInUsers[authSession] = user;
}

, getLoggedInUser = exports.getLoggedInUser = function(authSession) {
    return loggedInUsers[authSession]
}

, removeLoggedInUser = exports.removeLoggedInUser = function(authSession) {
    delete loggedInUsers[authSession]
}

, login = exports.login = function(username, password, callback) {
    nanoDb.auth(username, password, function(err, body, headers) {
        if (err) {
            return callback(err);
        }
        db.get('org.couchdb.user:' + username, { revs_info: true }, function(err, body) {
            if (!err)
                callback(null, createJWT(body));
        });
        /*callback(null, createJWT(body));*/
    });
}

function createJWT(user) {
    var payload = {
        nombre: user.nombres,
        apellido: user.apellidos,
        anionacimiento: user.anionacimiento,
        sexo: user.sexo,
        correo: user.correo,
        telefono: user.nro,
        iat: moment().unix(),
        exp: moment().add(365, 'days').unix()
    };
    return jwt.encode(payload, 'JWT Token Secret');
}