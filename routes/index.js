var express = require('express');
var router = express.Router();
var db = require('../db');
var users = require('../users');
var sessions = require('../sessions')



router.get('/', function(req, res) {
    var username = sessions.getLoggedInUser(req.cookies['AuthSession']);
    res.render('index', { username: username });
});


router.post('/user', function(req, res) {
    users.insert(req.body, req.body.id, function(error, docs) {
        if (error) {
            res.json({ usuario: "" });
        } else {
            //console.log('saved ' + 'err ' + JSON.stringify(error) + ' docs ' + JSON.stringify(docs));
            res.json({ usuario: docs });
        }

    });
});

router.get('/user', function(req, res) {
    users.finduser(req.body.nombre, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
            console.log(docs);
        }
    })
})


router.get('/print/stock/:startDate/:endDate', function(req, res) {
    console.log('request log ' + JSON.stringify(req.params))

    var results = [];
    db.findAllProducts(function(error, docs) {
        var products = docs;
        var counter = docs.length;
        products.forEach(function(p) {

            var opts1 = {
                "options": {
                    startkey: [p._id, req.params.startDate],
                    endkey: [p._id, req.params.endDate]
                }
            }
            var opts2 = {
                "options": {
                    startkey: [p._id, req.params.startDate],
                    endkey: [p._id, req.params.endDate]
                },
                "product_name": p.product_name
            }

            db.findProductQuantityIn(opts1.options, function(error, qtyIn) {

                db.findProductQuantityOut(opts2.options, function(error, qtyOut) {
                    counter--;
                    results.push({ "product_name": opts2.product_name, "qtyIn": qtyIn, "qtyOut": qtyOut });
                    if (counter == 0) {
                        res.render('print_stock_reports', { products: results, printStartDate: req.params.startDate, printEndDate: req.params.endDate });
                    }
                });
            });

        });

    });

});

router.get('/compute/productsin/:product_id/:startDate/:endDate', function(req, res) {
    var opts = {
        startkey: [req.params.product_id, req.params.startDate],
        endkey: [req.params.product_id, req.params.endDate]
    }
    db.findProductQuantityIn(opts, function(error, result) {
        res.json(result);
    });
});

router.get('/stock/:startDate/:endDate', function(req, res) {
    var results = [];
    db.findAllProducts(function(error, docs) {
        var products = docs;
        var counter = docs.length;
        products.forEach(function(p) {

            var opts1 = {
                "options": {
                    startkey: [p._id, req.params.startDate],
                    endkey: [p._id, req.params.endDate]
                }
            }
            var opts2 = {
                "options": {
                    startkey: [p._id, req.params.startDate],
                    endkey: [p._id, req.params.endDate]
                },
                "product_name": p.product_name
            }

            db.findProductQuantityIn(opts1.options, function(error, qtyIn) {

                db.findProductQuantityOut(opts2.options, function(error, qtyOut) {
                    counter--;
                    results.push({ "product_name": opts2.product_name, "qtyIn": qtyIn, "qtyOut": qtyOut });
                    if (counter == 0) {
                        res.json(results);
                    }
                });
            });

        });

    });
});

router.get('/records', function(req, res) {
    db.findAllRecords(function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
        }
    })
})

router.get('/records/:product_id/:customer_id/:type/:startDate/:endDate', function(req, res) {
    var params = req.params;
    params.endtype = req.params.type;
    params.endproduct_id = req.params.product_id;
    params.endcustomer_id = req.params.customer_id;
    if (req.params.type == 'All') {
        params.type = null;
        params.endtype = {};
    }

    if (req.params.product_id == 'All') {
        params.product_id = null;
        params.endproduct_id = {};
    }

    if (req.params.customer_id == 'All') {
        req.params.customer_id = null;
        req.params.endcustomer_id = {};
    }

    console.log(JSON.stringify(params));

    var opts = {
        startkey: [params.product_id, params.customer_id, params.type, params.startDate],
        endkey: [params.endproduct_id, params.endcustomer_id, params.endtype, params.endDate]
    }
    console.log('options ' + JSON.stringify(opts))
    db.findFilteredRecords(opts, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            console.log('response is ' + JSON.stringify(docs));
            res.json(docs)
        }
    })
})

/*filtrar etnobotanica*/
router.get('/etnobotanicas/:especie/:startDate/:endDate', function(req, res) {
        var params = req.params;
        params.endespecie = req.params.especie;
        //params.endtype = req.params.type;
        //params.endproduct_id = req.params.product_id;
        //params.endcustomer_id = req.params.customer_id;
        if (req.params.especie == 'All') {
            params.especie = null;
            params.endespecie = {};
        }

        console.log(JSON.stringify(params));

        var opts = {
            startkey: [params.especie, params.startDate],
            endkey: [params.endespecie, params.endDate]
        }
        console.log('options ' + JSON.stringify(opts))
        db.findFilteredEtnobotanicas(opts, function(error, docs) {
            if (error) {
                res.send("error")
            } else {
                console.log('response is ' + JSON.stringify(docs));
                res.json(docs)
            }
        })
    })
    /*fin filtro  */
    /*filtro de transecto */
router.get('/transectos/:altidud/:startDate/:endDate', function(req, res) {
    var params = req.params;
    params.endaltitud = req.params.altitud;
    //params.endtype = req.params.type;
    //params.endproduct_id = req.params.product_id;
    //params.endcustomer_id = req.params.customer_id;
    if (req.params.altitud == 'All') {
        params.altitud = null;
        params.endaltitud = {};
    }

    console.log(JSON.stringify(params));

    var opts = {
        startkey: [params.altitud, params.startDate],
        endkey: [params.endaltitud, params.endDate]
    }
    console.log('options ' + JSON.stringify(opts))
    db.findFilteredTransectos(opts, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            console.log('response is ' + JSON.stringify(docs));
            res.json(docs)
        }
    })
})



/*fin del filtro transecto */

router.get('/records/:id', function(req, res) {

    db.findRecordById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
        }
    })
})

router.post('/records', function(req, res) {
    console.log('record post req body ' + JSON.stringify(req.body));
    var qty = req.body.quantity;
    req.body.quantity = new Number(qty);
    db.findCustomerById(req.body.f_customer_id, function(err, doc) {
        req.body.f_customer_name = doc.customer_name;

        db.findProductById(req.body.f_product_id, function(err, doc) {
            req.body.f_product_name = doc.product_name;
            req.body.f_product_model_number = doc.model_number;

            db.save(req.body, function(error, docs) {
                console.log('saved ' + 'err ' + error + ' docs ' + docs)
                res.json(req.body)
            })
        });
    });
})

router.delete('/records', function(req, res) {
    console.log('delete record req ' + req.query)
    db.database.remove(req.query._id, req.query._rev, function(err, result) {
        console.log('err ' + err)
        console.log('res ' + result)
        res.send(200, "OK")

    })

})

router.get('/products', function(req, res) {
    db.findAllProducts(function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
        }
    })
})

router.get('/products/:id', function(req, res) {
    db.findProductById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
        }
    })
})

router.post('/products', function(req, res) {
    console.log('request response is' + JSON.stringify(req.body));
    db.save(req.body, function(error, docs) {
        console.log('saved')
        res.send(200, "OK");
    })
})

router.delete('/products', function(req, res) {
        console.log('request response is' + JSON.stringify(req.query))
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('err ' + err)
            console.log('res ' + result)
            res.send(200, "OK")
        })

    })
    /*ESPECIES NOMBRE CIENTIFICO*/

router.get('/especies1', function(req, res) {
    db.findAllespecies1(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/especies1/:id', function(req, res) {
    db.findespecies1ById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            console.log("datos de la consulta", docs);
            res.json(docs);
        }
    })
})
router.post('/especies1', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('especie guardada');
        res.send(200, "OK");
    })
})
router.delete('/especies1', function(req, res) {
        console.log("delete request" + JSON.stringify(req.query));
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('error' + err)
            console.log('response' + result)
            res.send(200, "OK");
        })
    })
    /*especies */
router.get('/especies', function(req, res) {
    db.findAllespecies(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/especies/:id', function(req, res) {
    db.findespeciesById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            console.log("datos de la consulta", docs);
            res.json(docs);
        }
    })
})
router.put('/especies/:id', function(req, res) {
    db.findespeciesById(req.params.id, function(err, docs) {
        db.save(req.body, function(error, docs) {
            console.log('especie actualizada');
            res.send(200, "OK");
        })
    })
})

router.post('/especies', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('especie guardada');
        res.send(200, "OK");
    })
})
router.delete('/especies', function(req, res) {
    console.log("delete request" + JSON.stringify(req.query));
    db.database.remove(req.query._id, req.query._rev, function(err, result) {
        console.log('error' + err)
        console.log('response' + result)
        res.send(200, "OK");
    })
})

/*etnobotanica */
router.get('/etnobotanicas', function(req, res) {
    db.findAlletnobotanicas(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/etnobotanicas/:id', function(req, res) {
    db.findParteusadaByIdById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs);
        }
    })
})
router.post('/etnobotanicas', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('ficha etnobotanica guardada');
        res.send(200, "OK");
    })
})
router.delete('/etnobotanicas', function(req, res) {
        console.log("delete request" + JSON.stringify(req.query));
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('error' + err)
            console.log('response' + result)
            res.send(200, "OK");
        })
    })
    /*fin etnobotanica */
    /*transecto*/
router.get('/transectos', function(req, res) {
    db.findAlltransectos(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/transectos/:id', function(req, res) {
    db.findtransectoById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs);
        }
    })
})
router.post('/transectos', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('transecto guardado');
        res.send(200, "OK");
    })
})
router.delete('/transectos', function(req, res) {
    console.log("delete request" + JSON.stringify(req.query));
    db.database.remove(req.query._id, req.query._rev, function(err, result) {
        console.log('error' + err)
        console.log('response' + result)
        res.send(200, "OK");
    })
})

/*fin transecto */
/*partes usadas*/
router.get('/partesusadas', function(req, res) {
    db.findAllPartesUsadas(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/partesusadas/:id', function(req, res) {
    db.findParteusadaById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs);
        }
    })
})
router.post('/partesusadas', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('parte usada guardada');
        res.send(200, "OK");
    })
})
router.delete('/partesusadas', function(req, res) {
        console.log("delete request" + JSON.stringify(req.query));
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('error' + err)
            console.log('response' + result)
            res.send(200, "OK");
        })
    })
    /* formas uso */
router.get('/formasuso', function(req, res) {
    db.findAllformasuso(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs);
        }
    })
})

router.get('/formasuso/:id', function(req, res) {
    db.findformasusoById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs);
        }
    })
})
router.post('/formasuso', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('forma de uso guardada');
        res.send(200, "OK");
    })
})
router.delete('/formasuso', function(req, res) {
        console.log("delete request" + JSON.stringify(req.query));
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('error' + err)
            console.log('response' + result)
            res.send(200, "OK");
        })
    })
    /*tipos vegetacion */
router.get('/tiposvegetacion', function(req, res) {
    db.findAlltiposvegetacion(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/tiposvegetacion/:id', function(req, res) {
    db.findtiposvegetacionById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs);
        }
    })
})
router.post('/tiposvegetacion', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('tipo de vegetacion guardada');
        res.send(200, "OK");
    })
})
router.delete('/tiposvegetacion', function(req, res) {
        console.log("delete request" + JSON.stringify(req.query));
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('error' + err)
            console.log('response' + result)
            res.send(200, "OK");
        })
    })
    /* formas biologicas */
router.get('/formasbiologicas', function(req, res) {
    db.findAllformasbiologicas(function(error, docs) {
        if (error) {
            res.send("error");
        } else {
            res.json(docs)
        }
    })
})
router.get('/formasbiologicas/:id', function(req, res) {
    db.findformasbiologicasById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs);
        }
    })
})
router.post('/formasbiologicas', function(req, res) {
    console.log('------------------------------------');
    console.log('request response is' + req.body);
    console.log('------------------------------------');
    db.save(req.body, function(error, docs) {
        console.log('forma biologica guardada');
        res.send(200, "OK");
    })
})
router.delete('/formasbiologicas', function(req, res) {
        console.log("delete request" + JSON.stringify(req.query));
        db.database.remove(req.query._id, req.query._rev, function(err, result) {
            console.log('error' + err)
            console.log('response' + result)
            res.send(200, "OK");
        })
    })
    /*customers*/
router.get('/customers', function(req, res) {
    db.findAllCustomers(function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
        }
    })
})

router.get('/customers/:id', function(req, res) {
    db.findCustomerById(req.params.id, function(error, docs) {
        if (error) {
            res.send("error")
        } else {
            res.json(docs)
        }
    })
})

router.post('/customers', function(req, res) {
    console.log('request response is' + req.body)
    db.save(req.body, function(error, docs) {
        console.log('saved');
        res.send(200, "OK");
    })
})

router.delete('/customers', function(req, res) {
    console.log("delete request " + JSON.stringify(req.query));

    db.database.remove(req.query._id, req.query._rev, function(err, result) {
        console.log('error ' + err)
        console.log('response ' + result)
        res.send(200, "OK");
    })
});


router.post('/api/sessions', function(req, res) {
    sessions.login(req.body.username, req.body.password, function(err, cookie) {
        if (err) {
            //res.status(401).send({message: 'Correo electrónico y / o contraseña incorrectos'});
            res.json({ token: '' });
        } else {
            //console.log("cookie is "+cookie)
            //console.log(res.body);
            //res.cookie(cookie);
            res.json({ token: cookie });

            //res.send({token:cookie});
        }
    })
});



router.delete('/api/sessions', function(req, res) {
    sessions.removeLoggedInUser(req.cookies['AuthSession']);
    res.clearCookie('AuthSession');
    res.send(200, "OK");
})


module.exports = router;