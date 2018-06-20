var cradle = require('cradle')
var config = require('./config')
var path = require('path')
var fs = require('fs')

var connection = new(cradle.Connection)(config.couchdb.baseUrl, config.couchdb.port, {
    auth: { "username": config.couchdb.username, "password": config.couchdb.password }
});

var db = connection.database(config.couchdb.databaseName);
//var db=config.couchdb.url;
exports.database = db;

exports.save = function(record, callback) {
    record.created_at = new Date();
    db.save(record, function(error, result) {
        if (error) callback(error)
        else callback(null, result);
    });
};

exports.findAllRecords = function(callback) {
    db.view('records/all', function(error, result) {
        if (error) {
            console.log('returned error is ' + error)
            callback(error)
        } else {
            //console.log('returned result is '+result)
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    });
}

exports.findRecordById = function(id, callback) {
    db.view('records/all', { key: id }, function(error, result) {
        if (error) {
            callback(error)
        } else {
            var doc
            result.forEach(function(row) {
                doc = row
            });
            callback(null, doc);
        }
    })
};

exports.findAllProducts = function(callback) {
    db.view('products/all', function(error, result) {
        if (error) {
            console.log('returned error is ' + error)
            callback(error)
        } else {
            //console.log('returned result is '+result)
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    });
}

exports.findProductById = function(id, callback) {

    db.view('products/all', { key: id }, function(error, result) {
        if (error) {
            callback(error)
        } else {
            var doc
            result.forEach(function(row) {
                doc = row
            });
            callback(null, doc);
        }
    })
};
/*especies*/
exports.findAllespecies = function(callback) {
    db.view('especies/all', { attachments: true }, function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            var attachment;
            var cabeza = 'data:image/jpeg;base64,';
            console.log(result);
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    })
}
exports.findespeciesById = function(id, callback) {
    db.view('especies/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc = []
            result.forEach(function(row) {
                var downloadPath = path.join(__dirname, './imgs/character_dow.jpg')
                var writeStream = fs.createWriteStream(downloadPath);
                var img = db.getAttachment(row._id, 'character.jpg', function(err) {
                    if (err) {
                        console.dir(err)
                        return
                    }
                    console.log('imageneeeees')
                    console.dir('download image', downloadPath)
                })
                img.pipe(writeStream)
                console.log(writeStream.path)
                console.log(row)
                row._attachments = writeStream.path
                doc.push(row);
                console.log("salidaaaaa")
                console.log(doc)
            });
            callback(null, doc);
        }
    })
};
/*fichas etnobotacias */
exports.findAlletnobotanicas = function(callback) {
    db.view('etnobotanica/all', function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    })
}
exports.findetnobotanicaById = function(id, callback) {
    db.view('etnobotanica/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc
            result.forEach(function(row) {
                doc = row;
            });
            callback(null, doc);
        }
    })
};
exports.findFilteredEtnobotanicas = function(opts, callback) {
        db.view('etnobotanica/all', opts, function(error, result) {
            if (error) {
                console.log('returned error is ' + error)
                callback(error)
            } else {
                //console.log('returned result is '+result)
                var docs = [];
                result.forEach(function(row) {
                    /*console.log(row);*/
                    docs.push(row);
                });
                callback(null, docs);
            }
        });
    }
    /*transecto */

exports.findAlltransectos = function(callback) {
    db.view('transecto/all', function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    })
}
exports.findtransectoById = function(id, callback) {
    db.view('transecto/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc
            result.forEach(function(row) {
                doc = row;
            });
            callback(null, doc);
        }
    })
};
exports.findFilteredTransectos = function(opts, callback) {
    db.view('transecto/all', opts, function(error, result) {
        if (error) {
            console.log('returned error is ' + error)
            callback(error)
        } else {
            //console.log('returned result is '+result)
            var docs = [];
            result.forEach(function(row) {
                /*console.log(row);*/
                docs.push(row);
            });
            callback(null, docs);
        }
    });
}

/* fin transecto*/
/*ESPECIES NOMBRE CIENTIFICO */
/*partes usadas*/
exports.findAllPartesUsadas = function(callback) {
    db.view('partesusadas/all', function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    })
}
exports.findParteusadaById = function(id, callback) {
    db.view('partesusadas/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc
            result.forEach(function(row) {
                doc = row;
            });
            callback(null, doc);
        }
    })
};
/* tipo de vegetacion */
exports.findAlltiposvegetacion = function(callback) {
    db.view('tiposvegetacion/all', function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    })
}
exports.findtiposvegetacionById = function(id, callback) {
    db.view('tiposvegetacion/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc
            result.forEach(function(row) {
                doc = row;
            });
            callback(null, doc);
        }
    })
};
/* fomas biologicas */
exports.findAllformasbiologicas = function(callback) {
    db.view('formasbiologicas/all', function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    })
}
exports.findformasbiologicasById = function(id, callback) {
    db.view('formasbiologicas/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc
            result.forEach(function(row) {
                doc = row;
            });
            callback(null, doc);
        }
    })
};
/* formas de uso */
exports.findAllformasuso = function(callback) {
    db.view('formasuso/all', function(error, result) {
        if (error) {
            console.log('------------------------------------');
            console.log('el error es' + error);
            console.log('------------------------------------');
        } else {
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
                /*console.log(docs);*/
            });
            callback(null, docs);
        }
    })
}
exports.findformasusoById = function(id, callback) {
    db.view('formasuso/all', { key: id }, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var doc
            result.forEach(function(row) {
                doc = row;
            });
            callback(null, doc);
        }
    })
};
/*customers*/
exports.findAllCustomers = function(callback) {
    db.view('customers/all', function(error, result) {
        if (error) {
            console.log('returned error is ' + error)
            callback(error)
        } else {
            //console.log('returned result is '+result)
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    });
}

exports.findCustomerById = function(id, callback) {
    db.view('customers/all', { key: id }, function(error, result) {
        if (error) {
            callback(error)
        } else {
            var doc
            result.forEach(function(row) {
                doc = row
            });
            callback(null, doc);
        }
    })
};

exports.findProductQuantityIn = function(opts, callback) {
    db.view('products/quantityin', opts, function(error, result) {
        if (error) {
            callback(error)
        } else {
            var doc
            result.forEach(function(row) {
                doc = row
            });
            callback(null, doc);
        }
    })
};

exports.findProductQuantityOut = function(opts, callback) {
    db.view('products/quantityout', opts, function(error, result) {
        if (error) {
            callback(error)
            console.log('error is ' + error)
        } else {
            var doc
            result.forEach(function(row) {
                doc = row
                console.log("row is " + row);
            });
            callback(null, doc);
        }
    })
};

exports.findFilteredRecords = function(opts, callback) {
    db.view('records/all', opts, function(error, result) {
        if (error) {
            console.log('returned error is ' + error)
            callback(error)
        } else {
            //console.log('returned result is '+result)
            var docs = [];
            result.forEach(function(row) {
                docs.push(row);
            });
            callback(null, docs);
        }
    });
}