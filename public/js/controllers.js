'use strict';


/* Controllers */

angular.module('myApp.controllers', ['geolocation', 'angular-jwt', 'AngularGM']).
controller('LoginCtrl', function($scope, $rootScope, $location, SessionService, jwtHelper, Decodificado) {

    $scope.user = { username: '', password: '' };


    $scope.login = function() {
        $scope.user = SessionService.save($scope.user, function(success) {
            if (success.token != "") {
                $rootScope.loggedIn = true;
                $location.path('/etnobotacias');
                Decodificado.data = jwtHelper.decodeToken(success.token);
                toastr.options.progressBar = true;
                toastr.success('Bienvenido !');


            } else {
                $scope.loginError = true;
                toastr.options.progressBar = true;
                toastr.error('Usuario o contraseña incorrectos');
            }
        });
    };
})

.factory("Decodificado", function() {
        return {
            data: {}
        }
    })
    .factory("Especiee", function() {
        return {
            data: {}
        }
    })

.controller('LogoutCtrl', function($rootScope, $location, SessionService) {
    (new SessionService()).$delete(function(success) {
        $rootScope.loggedIn = false;
        $location.path('/login');
        toastr.options.progressBar = true;
        toastr.success('Gracias por su visita !');
    });
})

.controller('principalCtrl', ['$scope', '$location', '$route', 'Especie', 'Etnobotanica', 'Transecto', function($scope, $location, $route, Especie, Etnobotanica, Transecto) {
    $scope.etnobotanicas = Etnobotanica.query();
    $scope.transectos = Transecto.query();
    $scope.especies = Especie.query();


    $scope.icons = {
        gray: '/img/flowers.png',
        red: '/img/flowers1.png',
    }

    $scope.options = {
        map: {
            center: new google.maps.LatLng(-13.53195, -71.967463),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        },
        highlighted: {
            icon: $scope.icons.red
        },
        unhighlighted: {
            icon: $scope.icons.gray
        },
    };

    $scope.filters = {
        name: null,
        male: true,
        female: true
    }
    $scope.filters1 = {
        especie: null,
        fecha: null,
        _id: true
    }



    $scope.getMarkerOptions = function(person) {
        var opts = { title: person.especie };
        if (person._id in $scope.filteredPeople) {
            return angular.extend(opts, $scope.options.highlighted);
        } else {
            return angular.extend(opts, $scope.options.unhighlighted);
        }
    };

    $scope.filterPeople = function() {
        $scope.filteredPeople = {};
        angular.forEach($scope.people, function(person) {
            var nameMatch = ($scope.filters1.especie) ? ~person.especie.indexOf($scope.filters1.especie) : true;
            var fechaMatch = ($scope.filters1.fecha) ? ~person.fecha.indexOf($scope.filters1.fecha) : true;
            /*var isMale = person.gender === 'male';
            var genderMatch = ($scope.filters.male && isMale) ||
                              ($scope.filters.female && !isMale);*/
            if (nameMatch && fechaMatch) {
                $scope.filteredPeople[person._id] = person;
            }
        });
        $scope.$broadcast('gmMarkersUpdate', 'people');
    };

    $scope.triggerOpenInfoWindow = function(etno) {
        $scope.markerEvents = [{
            event: 'openinfowindow',
            ids: [etno._id]
        }, ];
    }


    $scope.$watch('people', function() {
        $scope.filterPeople();
    });
    $scope.people = $scope.etnobotanicas;
    //$scope.people = [{"id":1,"name":"Gianna Hodges","gender":"male","location":{"lat":4,"lng":21}},{"id":2,"name":"Isabella Davidson","gender":"female","location":{"lat":21,"lng":-11}},{"id":3,"name":"Aubrey Mercer","gender":"female","location":{"lat":-13,"lng":-22}},{"id":4,"name":"Hailey Milton","gender":"female","location":{"lat":-18,"lng":-17}},{"id":5,"name":"Charlotte Davidson","gender":"female","location":{"lat":18,"lng":7}},{"id":6,"name":"Isabella Higgins","gender":"male","location":{"lat":-15,"lng":-23}},{"id":7,"name":"Riley Brooks","gender":"male","location":{"lat":3,"lng":8}},{"id":8,"name":"Jessica Oldridge","gender":"female","location":{"lat":-25,"lng":-13}},{"id":9,"name":"Gianna Sheldon","gender":"male","location":{"lat":9,"lng":21}},{"id":10,"name":"Zoey Cook","gender":"female","location":{"lat":16,"lng":18}},{"id":11,"name":"Lily Turner","gender":"male","location":{"lat":3,"lng":-7}},{"id":12,"name":"Riley Hardman","gender":"male","location":{"lat":19,"lng":-14}},{"id":13,"name":"Bella Clapton","gender":"female","location":{"lat":1,"lng":-24}},{"id":14,"name":"Trinity Higgins","gender":"male","location":{"lat":2,"lng":-17}},{"id":15,"name":"Sydney Neal","gender":"male","location":{"lat":17,"lng":15}},{"id":16,"name":"Bailey Ford","gender":"female","location":{"lat":9,"lng":-7}},{"id":17,"name":"Hannah Hodges","gender":"male","location":{"lat":-1,"lng":-21}},{"id":18,"name":"Evelyn Sherlock","gender":"female","location":{"lat":-3,"lng":-7}},{"id":19,"name":"Evelyn Nelson","gender":"male","location":{"lat":20,"lng":15}},{"id":20,"name":"Maya Gibbs","gender":"male","location":{"lat":4,"lng":12}},{"id":21,"name":"Sofia Carter","gender":"female","location":{"lat":-13,"lng":-18}},{"id":22,"name":"Victoria Conors","gender":"male","location":{"lat":-13,"lng":15}},{"id":23,"name":"Savannah Galbraith","gender":"female","location":{"lat":15,"lng":-2}},{"id":24,"name":"Eva Brooks","gender":"female","location":{"lat":-6,"lng":-7}},{"id":25,"name":"Caroline White","gender":"female","location":{"lat":-10,"lng":9}},{"id":26,"name":"Audrey WifKinson","gender":"female","location":{"lat":-22,"lng":-2}},{"id":27,"name":"Faith Brown","gender":"male","location":{"lat":10,"lng":-7}},{"id":28,"name":"Serenity Nash","gender":"male","location":{"lat":4,"lng":5}},{"id":29,"name":"Mariah Nathan","gender":"female","location":{"lat":6,"lng":19}},{"id":30,"name":"Makayla White","gender":"female","location":{"lat":0,"lng":20}},{"id":31,"name":"Katherine Thornton","gender":"female","location":{"lat":-9,"lng":14}},{"id":32,"name":"Nevaeh Cramer","gender":"female","location":{"lat":9,"lng":-18}},{"id":33,"name":"Valeria Hoggarth","gender":"male","location":{"lat":20,"lng":17}},{"id":34,"name":"Aaliyah Carrington","gender":"male","location":{"lat":23,"lng":13}},{"id":35,"name":"Aaliyah Gilmore","gender":"female","location":{"lat":-25,"lng":6}},{"id":36,"name":"Faith Wesley","gender":"male","location":{"lat":-1,"lng":-11}},{"id":37,"name":"Emily Bush","gender":"male","location":{"lat":-24,"lng":19}},{"id":38,"name":"Jessica Gardner","gender":"female","location":{"lat":12,"lng":-22}},{"id":39,"name":"Elizabeth Crossman","gender":"female","location":{"lat":-3,"lng":-19}},{"id":40,"name":"Payton Ward","gender":"male","location":{"lat":-22,"lng":-3}},{"id":41,"name":"Jocelyn Freeman","gender":"female","location":{"lat":11,"lng":-15}},{"id":42,"name":"Serenity Hoggarth","gender":"female","location":{"lat":5,"lng":-17}},{"id":43,"name":"Kayla Vaughan","gender":"female","location":{"lat":20,"lng":9}},{"id":44,"name":"Arianna Hancock","gender":"male","location":{"lat":25,"lng":3}},{"id":45,"name":"Katherine Haig","gender":"male","location":{"lat":-2,"lng":-12}},{"id":46,"name":"Zoe Gerald","gender":"male","location":{"lat":-12,"lng":8}},{"id":47,"name":"Sofia Molligan","gender":"male","location":{"lat":16,"lng":7}},{"id":48,"name":"Mia Day","gender":"female","location":{"lat":13,"lng":17}},{"id":49,"name":"Amelia Carey","gender":"female","location":{"lat":10,"lng":-12}},{"id":50,"name":"Kimberly Gerald","gender":"female","location":{"lat":7,"lng":-8}}]
    console.log($scope.people);
}])

.controller('especiesctrl', ['$scope', '$location', '$route', 'Especie', 'Especie1', 'Especiee', '$http', '$window', '$rootScope', function($scope, $location, $route, Especie, Especie1, Especiee, fileReader, $http, $window, $rootScope) {
    $scope.especies = Especie.query();
    console.log($scope.especies.length);
    console.log(Especie.query());
    $scope.especie = { "_id": '', "especie_nombrecientifico": '', "especie_familia": '', "especie_nombrecomun": '', "especie_nombrelenguanativa": '', "type": 'especie', "_attachments": '' };
    /*zona especies */
    /*leer los archivos */
    $scope.especie1 = [];

    $scope.imageUpload = function(event) {
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function(e) {
        $scope.$apply(function() {
            $scope.img = e.target.result;
            $scope.especie._attachments = e.target.result;
        });
    }


    /*abrir modal vacio */
    $scope.openAddModal = function() {
        $scope.especie = {};
        $scope.img = undefined;
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
    };
    /*abrir modal con datos */
    /*$scope.getImage = function(data){
        return 'data:image/jpeg;base64,' + data;
    }*/


    $scope.procesaEspecie = function(especie) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        console.log(especie._id);
        //$scope.especie1 = Especie1.query({ id: especie._id });
        var data = Especie1.query({ id: especie._id });
        angular.copy(data, $scope.especie1)
        console.log($scope.especie1);
        //var lng = $scope.especie1.length;

        //console.log(lng);
        //console.log($scope.especie1[lng]);
        Especie1.especie = especie;
        $scope.especie = Especie1.especie;
        //$scope.especie.file = Especie1.img.img;
        //console.log($scope.especie1._id)
        //$scope.img = $scope.especie1._attachments;
        //console.log($scope.img);
        //especie._attachments.base64=especie._attachments["character.jpg"].data;
    }

    $scope.saveEspecie = function() {
        if ($scope.showUpdateBtn == false) {
            if ($scope.img == undefined) {
                toastr.error('Seleccione una imagen');
            } else {
                $scope.especie._id = $scope.especie.especie_nombrecientifico.toUpperCase();
                $scope.especie._attachments = { "character.jpg": { "content_type": 'image/jpeg', "data": $scope.img.substring(23) } };
                console.log($scope.especie);
                Especie.save($scope.especie, function() {
                    $('.modal.in').modal('hide')
                    toastr.success('la especie fue agregada');
                    $route.reload();
                })
            }
        } else {
            if ($scope.especie.img == undefined) {
                console.log($scope.especie);
                Especie.save($scope.especie, function() {
                    toastr.success('la especie fue actualizada');
                    $('#addModal').modal('hide');
                    $route.reload();

                })
            } else {
                $scope.especie._attachments = { "character.jgp": { content_type: 'image/jpeg', data: $scope.img.substring(23) } };
                console.log($scope.especie);
                Especie.save($scope.especie, function() {
                    toastr.success('la especie fue actualizada');
                    $('#addModal').modal('hide');
                    $route.reload();
                })

            }

        }

    }

    $scope.deleteEspecie = function(especie) {
        console.log(especie);
        Especie.delete(especie, function(data) {
            $route.reload();
        })
    }

}])



.controller('parteusadactrl', ['$scope', '$location', '$route', 'Parteusada', function($scope, $location, $route, Parteusada) {
    $scope.partesusadas = Parteusada.query()
    $scope.parteusada = { "parteusada_name": '', "type": 'parteusada' };

    /*zona especies */
    /*leer los archivos */

    /*abrir modal vacio */
    $scope.openAddModal = function() {
        $scope.parteusada = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
    };
    /*abrir modal con datos */
    $scope.procesaParteusada = function(especie) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        Parteusada.parteusada = parteusada;
        $scope.parteusada = Parteusada.parteusada;

    }

    $scope.saveParteusada = function() {
        Parteusada.save($scope.parteusada, function(data) {
            $route.reload()
            $('#addModal').modal('hide');
        })
    }

    $scope.deleteParteusada = function(parteusada) {
        Parteusada.delete(parteusada, function(data) {
            $route.reload()
        })
    }

}])

.controller('formasusoctrl', ['$scope', '$location', '$route', 'FormaUso', function($scope, $location, $route, FormaUso) {
    $scope.formasuso = FormaUso.query()
    $scope.formauso = { "formauso_name": '', "formauso_descripcion": '', "type": 'formauso' };

    /*zona especies */
    /*leer los archivos */

    /*abrir modal vacio */
    $scope.openAddModal = function() {
        $scope.formauso = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
    };
    /*abrir modal con datos */
    $scope.procesaFormauso = function(especie) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        FormaUso.formauso = formauso;
        $scope.formauso = FormaUso.formauso;
    }

    $scope.saveFormaUso = function() {
        FormaUso.save($scope.formauso, function() {
            $route.reload();
            $('#addModal').modal('hide');
        })
    }
    $scope.deleteFormaUso = function(formauso) {
        FormaUso.delete(formauso, function(data) {
            $route.reload();
        })
    }

}])

.controller('tipovegetacionctrl', ['$scope', '$location', '$route', 'TipoVegetacion', function($scope, $location, $route, TipoVegetacion) {
    $scope.tiposvegetacion = TipoVegetacion.query()
    $scope.tipovegetacion = { "tipovegetacion_name": '', "type": 'tipovegetacion' };

    /*zona especies */
    /*leer los archivos */

    /*abrir modal vacio */
    $scope.openAddModal = function() {
        $scope.tipovegetacion = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
    };
    /*abrir modal con datos */
    $scope.procesaTipovegetacion = function(especie) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        TipoVegetacion.tipovegetacion = tipovegetacion;
        $scope.tipovegetacion = TipoVegetacion.tipovegetacion;
    }

    $scope.saveTipovegetacion = function() {
        TipoVegetacion.save($scope.tipovegetacion, function() {
            $route.reload();
            $('#addModal').modal('hide');
        })
    }
    $scope.deleteTipovegetacion = function(tipovegetacion) {
        TipoVegetacion.delete(tipovegetacion, function(data) {
            $route.reload();
        })
    }

}])


.controller('formabiologicactrl', ['$scope', '$location', '$route', 'FormaBiologica', function($scope, $location, $route, FormaBiologica) {
    $scope.formasbiologicas = FormaBiologica.query()
    $scope.formabiologica = { "formabiologica_name": '', "type": 'formabiologica' };

    /*zona especies */
    /*leer los archivos */

    /*abrir modal vacio */
    $scope.openAddModal = function() {
        $scope.formabiologica = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
    };
    /*abrir modal con datos */
    $scope.procesaFormabiologica = function(especie) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        FormaBiologica.formabiologica = formabiologica;
        $scope.formabiologica = FormaBiologica.formabiologica;
    }

    $scope.saveFormabiologica = function() {
        FormaBiologica.save($scope.formabiologica, function() {
            $route.reload();
            $('#addModal').modal('hide');
        })
    }
    $scope.deleteFormabiologica = function(formabiologica) {
        FormaBiologica.delete(formabiologica, function(data) {
            $route.reload();
        })
    }

}])




.controller('SetUpCtrl', ['$scope', '$location', '$route', 'Product', 'Customer', 'mapService', function($scope, $location, $route, Product, Customer, mapService) {

        $scope.customers = Customer.query()
        $scope.products = Product.query()

        $scope.product = { "product_name": '', "model_number": '' };
        $scope.customer = { "customer_name": '', "location": null };


        $scope.saveProduct = function() {
            Product.save($scope.product, function(data) {
                $route.reload()
            })
        }

        $scope.deleteProduct = function(product) {
            Product.delete(product, function(data) {
                $route.reload()
            })
        }

        $scope.saveCustomer = function() {
            Customer.save($scope.customer, function(data) {
                $route.reload()
            })
        }

        $scope.deleteCustomer = function(customer) {
            Customer.delete(customer, function(data) {
                $route.reload()
            })
        }

        init();

        function init() {
            var domElement;

            mapService.getHtml5Location().then(function(coordinates) {
                domElement = document.getElementById('googleMap');

                var mapConfig = {
                    addListener: true,
                    addMarker: false,
                    coordinates: coordinates
                }

                mapService.bootstrapMap(domElement, mapConfig)
            });
        }






    }])
    .controller('RecordsCtrl', ['$scope', '$location', '$route', 'Record', 'Product', 'Customer', 'RecordFilter', '$modal', function($scope, $location, $route, Record, Product, Customer, RecordFilter, $modal) {
        $scope.recordsActive = 'active';
        $scope.filter = {
            type: '',
            "product_id": '',
            "customer_id": '',
            "startDate": '',
            "endDate": ''
        }
        $scope.record = {
            "quantity": '',
            "f_customer_id": '',
            "f_customer_name": '',
            "f_product_id": '',
            "f_product_model_number": '',
            "f_product_name": '',
            "date": '',
            "comment": ''
        }
        $scope.record.quantity = new Number();
        $scope.records = Record.query();
        $scope.products = Product.query();
        $scope.customers = Customer.query();

        $scope.addRecord = function() {

        }

        $scope.saveRecord = function() {
            Record.save($scope.record, function(data) {
                $route.reload();
            })
        }

        $scope.deleteRecord = function(record) {
            Record.delete(record, function(data) {
                $route.reload();
            })
        }


        $scope.today = function() {
            $scope.record.date = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.record.date = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = 'dd/MM/yyyy';

        $scope.filterRecords = function() {
            $scope.records = RecordFilter.query({
                product_id: $scope.filter.product_id,
                customer_id: $scope.filter.customer_id,
                type: $scope.filter.type,
                startDate: $scope.filter.startDate.toJSON(),
                endDate: $scope.filter.endDate.toJSON()
            });
        }

        $scope.openFilterStart = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = true;
        };

        $scope.openFilterEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = true;
        };

    }])

.factory('comun', function($http) {
    var comun = {};

    comun.tareas = [];

    comun.tarea = {};

    /***Sección de métodos remotos***/
    comun.getAll = function() {


        return comun.tareas;
    }

    comun.add = function(tarea) {
        comun.tareas.push(tarea);
    }

    comun.update = function(tarea) {
        var indice = comun.tareas.indexOf(tarea);
        comun.tareas[indice] = data;
    }

    comun.delete = function(tarea) {
        var indice = comun.tareas.indexOf(tarea);
        comun.tareas.splice(indice, 1);
    }

    return comun;
})

.controller('EtnobotaciasCtrl', ['$scope', '$location', '$route', 'Record', 'Product', 'Customer', 'EtnobotanicaFilter', '$modal', 'Especie', 'Parteusada', 'FormaUso', 'TipoVegetacion', 'FormaBiologica', 'Etnobotanica', 'mapService', 'Decodificado', 'comun', function($scope, $location, $route, Record, Product, Customer, EtnobotanicaFilter, $modal, Especie, Parteusada, FormaUso, TipoVegetacion, FormaBiologica, Etnobotanica, mapService, Decodificado, comun) {
    //$scope.recordsActive = 'active';

    $scope.showDeleteBtn = false;
    $scope.filter = {
        "especie": '',
        "startDate": '',
        "endDate": ''
    }
    $scope.record = {

    }
    $scope.coordenadas = {};
    $scope.etnobotanicas = Etnobotanica.query();
    $scope.etnobotanica = {};
    $scope.especies = Especie.query();
    $scope.partesusadas0 = Parteusada.query();
    $scope.formasuso = FormaUso.query();
    console.log($scope.formasuso);
    $scope.tiposvegetacion = TipoVegetacion.query();
    $scope.formasbiologicas = FormaBiologica.query();

    console.log($scope.etnobotanicas);



    $scope.ciclos = ['Semestral', 'Anual', 'Bianual', 'Perenne'];
    $scope.secultiva = ['Si', 'No'];
    $scope.semaneja = ['Si', 'No'];
    $scope.setolera = ['Si', 'No'];
    $scope.crecesola = ['Si', 'No'];
    $scope.sexos = ['Masculino', 'Femenino'];


    /*procedimientos de aprte y formas uso */
    $scope.ParteUsada = { parteUsada: '', formasUso: [] };
    $scope.partesusadas = comun.tareas;
    //comun.getAll();

    $scope.addformaU = function(parteformauso) {

        console.log(parteformauso);
        comun.add(parteformauso);
        $scope.partesusadas = comun.tareas;
        console.log($scope.partesusadas);
        $scope.ParteUsada = {};
        toastr.success("se agrego parte y formas de uso");
    }
    $scope.cancelar = function() {
        $scope.ParteUsada = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        toastr.warning("se cancelo el proceso");
    }
    $scope.eliminar = function(parteformauso) {
        var indice = $scope.partesusadas.indexOf(parteformauso);
        $scope.partesusadas.splice(indice, 1);
        $scope.ParteUsada = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        toastr.warning("se eliminó parte y formas de uso");
    }
    $scope.procesaformaU = function(parteformauso) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        $scope.ParteUsada = parteformauso;
    }
    $scope.modificar = function(parteformauso) {
        var indice = $scope.partesusadas.indexOf(parteformauso);
        $scope.partesusadas[indice] = parteformauso;
        $scope.ParteUsada = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        toastr.success("se modificó parte y formas de uso");
    }

    /*fin procedimientos de parte y formas uso */

    $scope.record.quantity = new Number();
    $scope.records = Record.query();

    $scope.openAddModal = function() {
        $scope.ParteUsada = {};
        $scope.etnobotanica = {};
        $scope.partesusadas = {};
        $scope.etnobotanica.experto = Decodificado.data.nombre + ' ' + Decodificado.data.apellido;
        var d = new Date();
        var n = d.getFullYear();
        $scope.etnobotanica.edad = n - Decodificado.data.anionacimiento;
        $scope.etnobotanica.sexo = Decodificado.data.sexo;
        $scope.coordenadas = undefined;
        init(undefined);
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        $scope.showAddBtn1 = true;
        $scope.showUpdateBtn1 = false;
        toastr.info("Para poder ingresar una ficha etnobotánica verifique la información que ingresa", "Atencion porfavor");
        toastr.info("La fecha es muy importante", "Atencion porfavor");
    };

    var utm;
    $scope.convertir = function(lat, lng) {
        utm = geoConverter.latLonToUTMXYZone(lat, lng);
        $scope.etnobotanica.utmzona = utm.zone;
        $scope.etnobotanica.utmx = utm.x;
        $scope.etnobotanica.utmy = utm.y;
    }

    $('#addEtnoModal').on('shown.bs.modal', function() {
        init($scope.coordenadas);
    });

    var coorenadasdefault = { lat: -13.53195, lng: -71.967463 };

    function init(coordenadas) {
        var domElement = document.getElementById('googleMap1');
        //domElement = document.getElementById('googleMap');
        var coords;
        var listener, marker;
        if (coordenadas == undefined) {
            listener = true;
            marker = false;
            coords = coorenadasdefault;
        } else if (coordenadas != undefined) {
            listener = true;
            marker = true;
            coords = { lat: coordenadas.lat, lng: coordenadas.lng }
        }
        var mapConfig = {
            addListener: listener,
            addMarker: marker,
            coordinates: coords
        }
        mapService.bootstrapMap(domElement, mapConfig)
    }





    /*function init(coordenadas) {
		   	var domElement=document.getElementById('googleMap1');
         mapService.getHtml5Location().then(function(coordinates) {
        //domElement = document.getElementById('googleMap');
        var coords;
        var listener,marker;
        if(coordenadas==undefined){
          listener=true;
          marker=false;
          coords=coordinates;
        }else if(coordenadas!=undefined )
        {
          listener=true;
          marker=true;
          coords={lat:coordenadas.lat,lng:coordenadas.lng}
        } else if(coordinates==undefined){
          listener=true;
          marker=false;
          coords=coorenadasdefault;
        }
				var mapConfig = {
					addListener: listener,
					addMarker: marker,
					coordinates: coords
				}
				mapService.bootstrapMap(domElement, mapConfig)
			});
		}*/


    $scope.$on('map-clicked', function(event, coordinates) {
        $scope.coordenadas = coordinates;
        console.log($scope.coordenadas);
        toastr.info($scope.coordenadas[0] + ", " + $scope.coordenadas[1], 'la ubicacion fue seleccionada!');
    });



    $scope.saveEtno = function() {
        $scope.etnobotanica.lat = $scope.coordenadas[0];
        $scope.etnobotanica.lng = $scope.coordenadas[1];
        $scope.etnobotanica.partesusadas = $scope.partesusadas;
        $scope.convertir(parseFloat($scope.etnobotanica.lat), parseFloat($scope.etnobotanica.lng));
        $scope.etnobotanica.type = "etnobotanica";
        console.log($scope.etnobotanica);
        Etnobotanica.save($scope.etnobotanica, function() {
            $route.reload();
            toastr.success("ficha etnobotánica agregada");
        })
    }

    $scope.actualizarEtno = function() {
        if ($scope.etnobotanica.lat != $scope.coordenadas.lat) {
            $scope.etnobotanica.lat = $scope.coordenadas[0];
            $scope.etnobotanica.lng = $scope.coordenadas[1];
        }
        $scope.etnobotanica.partesusadas = $scope.partesusadas;
        console.log($scope.etnobotanica);
        Etnobotanica.save($scope.etnobotanica, function() {
            $route.reload();
            toastr.success("ficha etnobotánica actualizada");
        })
    }

    $scope.procesaEtno = function(etnobotanica) {
        $scope.coordenadas = { lat: parseFloat(etnobotanica.lat), lng: parseFloat(etnobotanica.lng) };
        init($scope.coordenadas);
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        $scope.showAddBtn1 = false;
        $scope.showUpdateBtn1 = true;
        Etnobotanica.etnobotanica = etnobotanica;
        $scope.etnobotanica = Etnobotanica.etnobotanica;
        $scope.partesusadas = etnobotanica.partesusadas;
        //$scope.partesusadas=comun.tareas;
        comun.tareas = etnobotanica.partesusadas;
        $scope.convertir(parseFloat(etnobotanica.lat), parseFloat(etnobotanica.lng));

        if ($scope.etnobotanica.experto == "" || $scope.etnobotanica.experto == undefined) {
            toastr.warning("La ficha no tiene datos del experto, actualize para guardar nuevo experto comunitario", "Atención porfavor");
            $scope.etnobotanica.experto = Decodificado.data.nombre + ' ' + Decodificado.data.apellido;
            var d = new Date();
            var n = d.getFullYear();
            $scope.etnobotanica.edad = n - Decodificado.data.anionacimiento;
            $scope.etnobotanica.sexo = Decodificado.data.sexo;
        }
        console.log($scope.etnobotanica);
        /*FormaUso.formauso=formauso;
        $scope.formauso=FormaUso.formauso;*/
    }

    $scope.deleteEtno = function(etnobotanica) {
        Etnobotanica.delete(etnobotanica, function(data) {
            $route.reload();
            toastr.success("ficha etnobotánica eliminada");
        })
    }


    $scope.today = function() {
        $scope.record.date = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.record.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = 'dd/MM/yyyy';




    $scope.filterRecords = function() {
        console.log($scope.filter.startDate.toJSON());
        $scope.etnobotanicas = EtnobotanicaFilter.query({
            especie: $scope.filter.especie,
            startDate: $scope.filter.startDate.toJSON(),
            endDate: $scope.filter.endDate.toJSON()
        });
    }

    $scope.openFilterStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
    };

    $scope.openFilterEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };

}])

.controller('TransectosCtrl', ['$scope', '$location', '$route', 'Record', 'Transecto', 'Product', 'TransectoFilter', '$modal', 'Especie', 'mapService', 'Decodificado', 'comun', function($scope, $location, $route, Record, Transecto, Product, TransectoFilterFilter, $modal, Especie, mapService, Decodificado, comun) {
    //$scope.recordsActive = 'active';

    $scope.showDeleteBtn = false;
    $scope.filter = {
        "altitud": '',
        "startDate": '',
        "endDate": ''
    }
    $scope.record = {

    }
    $scope.coordenadas = {};
    $scope.coordenadas1 = {};
    $scope.transectos = Transecto.query();
    // console.log($scope.transectos);
    $scope.transecto = {};
    $scope.especies = Especie.query();
    console.log($scope.especies);
    $scope.Mensaje = "";
    //$scope.partesusadas0=Parteusada.query();
    //$scope.formasuso=FormaUso.query();
    //console.log($scope.formasuso);
    //$scope.tiposvegetacion=TipoVegetacion.query();
    //$scope.formasbiologicas=FormaBiologica.query();

    $scope.imageUpload = function(event) {
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function(e) {
        $scope.$apply(function() {
            $scope.img = e.target.result;
        });
    }



    /*$scope.ciclos = ['Semestral', 'Anual','Bianual','Perenne'];
    $scope.secultiva=['Si','No'];
    $scope.semaneja=['Si','No'];
    $scope.setolera=['Si','No'];
    $scope.crecesola=['Si','No'];*/
    $scope.sexos = ['Masculino', 'Femenino'];


    /*procedimientos  */
    $scope.conteoDetalle = { ncientifico: '', ncomun: '', conteo: '', dap: '', anchoMayor: '', anchoMenor: '' };
    $scope.detalleTransecto = comun.tareas;
    $scope.especiee = {};

    $scope.nombrecomun = function(especiee) {
        if (especiee != '') {
            $scope.conteoDetalle.ncientifico = especiee._id;
            $scope.conteoDetalle.ncomun = especiee.especie_nombrecomun;
        }
    }
    $scope.adddetalle = function(detalle) {

        comun.add(detalle);
        //$scope.detalleTransecto.push(detalle);
        $scope.detalleTransecto = comun.tareas;
        $scope.conteoDetalle = {};
        $scope.especiee = {};
        toastr.success("se agrego detalle de transecto");
    }
    $scope.cancelar = function() {
        $scope.conteoDetalle = {};
        $scope.especiee = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        toastr.warning("se cancelo el proceso");
    }
    $scope.eliminar = function(detalle) {
        var indice = $scope.detalleTransecto.indexOf(detalle);
        $scope.detalleTransecto.splice(indice, 1);
        $scope.conteoDetalle = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        toastr.warning("se eliminó detalle de transecto");
    }
    $scope.procesaformaU = function(detalle) {
        $scope.showAddBtn = false;
        $scope.showUpdateBtn = true;
        $scope.especiee = {};
        $scope.conteoDetalle = detalle;
    }
    $scope.modificar = function(detalle) {
        var indice = $scope.detalleTransecto.indexOf(detalle);
        $scope.detalleTransecto[indice] = detalle;
        $scope.conteoDetalle = {};
        $scope.especiee = {};
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        toastr.success("se modificó detalle transecto");
    }

    /*fin procedimientos  */

    $scope.record.quantity = new Number();
    $scope.records = Record.query();

    $scope.openAddModal = function() {
        $scope.conteoDetalle = {};
        $scope.especiee = {};
        $scope.transecto = {};
        $scope.detalleTransecto = {};
        $scope.transecto.colector = Decodificado.data.nombre + ' ' + Decodificado.data.apellido;
        $scope.Mensaje = "Transecto ingresado i/o modificado por " + $scope.transecto.colector;
        $scope.coordenadas = undefined;
        $scope.coordenadas1 = undefined;
        init(undefined);
        init1(undefined);
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        $scope.showAddBtn1 = true;
        $scope.showUpdateBtn1 = false;
        toastr.info("Para poder ingresar un transecto verifique la información que ingresa", "Atencion porfavor");
        toastr.info("si la fecha no se selecciona no se podra guardar transecto", "Atencion porfavor");
    };

    var utm, utm1;
    $scope.convertir = function(lat, lng) {
        utm = geoConverter.latLonToUTMXYZone(lat, lng);
        $scope.transecto.utmZonaI = utm.zone;
        $scope.transecto.utmXI = utm.x;
        $scope.transecto.utmYI = utm.y;
    }
    $scope.convertir1 = function(lat, lng) {
        utm1 = geoConverter.latLonToUTMXYZone(lat, lng);
        $scope.transecto.utmZonaF = utm1.zone;
        $scope.transecto.utmXF = utm1.x;
        $scope.transecto.utmYF = utm1.y;
    }


    $('#addEtnoModal').on('shown.bs.modal', function() {
        init($scope.coordenadas);
        init1($scope.coordenadas1);
    });

    var coorenadasdefault = { lat: -13.53195, lng: -71.967463 };

    function init(coordenadas) {
        var domElement = document.getElementById('googleMap1');
        //domElement = document.getElementById('googleMap');
        var coords;
        var listener, marker;
        if (coordenadas == undefined) {
            listener = true;
            marker = false;
            coords = coorenadasdefault;
        } else if (coordenadas != undefined) {
            listener = false;
            marker = true;
            coords = { lat: coordenadas.lat, lng: coordenadas.lng }
        }
        var mapConfig = {
            addListener: listener,
            addMarker: marker,
            coordinates: coords
        }
        mapService.bootstrapMap(domElement, mapConfig)
    }

    function init1(coordenadas) {
        var domElement = document.getElementById('googleMap2');
        //domElement = document.getElementById('googleMap');
        var coords;
        var listener, marker;
        if (coordenadas == undefined) {
            listener = true;
            marker = false;
            coords = coorenadasdefault;
        } else if (coordenadas != undefined) {
            listener = false;
            marker = true;
            coords = { lat: coordenadas.lat, lng: coordenadas.lng }
        }
        var mapConfig = {
            addListener: listener,
            addMarker: marker,
            coordinates: coords
        }
        mapService.bootstrapMap(domElement, mapConfig)
    }


    $scope.$on('map-clicked', function(event, coordinates) {
        //etnobotanica.latlong = coordinates;
        /* $scope.coordenadas= undefined;*/
        //$scope.coordenadas=coordinates;
        $scope.coordenadas1 = undefined;
        if ($scope.coordenadas == undefined || $scope.coordenadas != coordinates && $scope.coordenadas1 != undefined) {
            $scope.coordenadas = coordinates;
            $scope.coordenadas1 = undefined;
            toastr.info($scope.coordenadas[0] + ", " + $scope.coordenadas[1], 'la ubicacion inicial fue seleccionada!');
        } else if ($scope.coordenadas != undefined || $scope.coordenadas1 == undefined) {
            $scope.coordenadas1 = coordinates;
            toastr.info($scope.coordenadas1[0] + ", " + $scope.coordenadas1[1], 'la ubicacion final fue seleccionada!');
        }
        console.log($scope.coordenadas);

    });
    $scope.posicioninicial = function() {
        $scope.coordenadas = undefined;
        init(undefined);
        toastr.warning("se eliminó la ubicación inicial");
    }
    $scope.posicionfinal = function() {
        $scope.coordenadas1 = undefined;
        init1(undefined);
        toastr.warning("se eliminó la ubicación final");
    }



    $scope.saveTransecto = function() {
        if ($scope.img == undefined) {
            toastr.error('Seleccione una imagen');
            $scope.transecto.latI = $scope.coordenadas[0];
            $scope.transecto.lngI = $scope.coordenadas[1];
            $scope.transecto.latF = $scope.coordenadas1[0];
            $scope.transecto.lngF = $scope.coordenadas1[1];
            $scope.convertir(parseFloat($scope.transecto.latI), parseFloat($scope.transecto.lngI));
            $scope.convertir1(parseFloat($scope.transecto.latF), parseFloat($scope.transecto.lngF))
            $scope.transecto.type = "transecto";
            $scope.transecto.detalleTransecto = $scope.detalleTransecto;
            //$scope.transecto._attachments={"character.jpg":{"content_type":'image/jpeg',"data":$scope.img.substring(23)}};
            console.log($scope.transecto);
            Transecto.save($scope.transecto, function() {
                $route.reload();
                toastr.success("Transecto fue agregado");
            })
        } else {
            $scope.transecto.latI = $scope.coordenadas[0];
            $scope.transecto.lngI = $scope.coordenadas[1];
            $scope.transecto.latF = $scope.coordenadas1[0];
            $scope.transecto.lngF = $scope.coordenadas1[1];
            $scope.convertir(parseFloat($scope.transecto.latI), parseFloat($scope.transecto.lngI));
            $scope.convertir1(parseFloat($scope.transecto.latF), parseFloat($scope.transecto.lngF));
            $scope.transecto.type = "transecto";
            $scope.transecto.detalleTransecto = $scope.detalleTransecto;
            $scope.transecto._attachments = { "character.jpg": { "content_type": 'image/jpeg', "data": $scope.img.substring(23) } };
            console.log($scope.transecto);
            Transecto.save($scope.transecto, function() {
                $route.reload();
                toastr.success("Transecto fue agregado");
            })
        }

    }

    $scope.actualizarEtno = function() {
        console.log($scope.transecto);
        if ($scope.img == undefined) {
            if ($scope.transecto.latI != $scope.coordenadas.lat) {
                $scope.transecto.latI = $scope.coordenadas[0];
                $scope.transecto.lngI = $scope.coordenadas[1];
                $scope.convertir(parseFloat($scope.transecto.latI), parseFloat($scope.transecto.lngI));
            }
            if ($scope.transecto.latF != $scope.coordenadas1.lat) {
                $scope.transecto.latF = $scope.coordenadas1[0];
                $scope.transecto.lngF = $scope.coordenadas1[1];
                $scope.convertir1(parseFloat($scope.transecto.latF), parseFloat($scope.transecto.lngF))
            }
            $scope.transecto.detalleTransecto = $scope.detalleTransecto;
            //$scope.transecto._attachments={"character.jpg":{"content_type":'image/jpeg',"data":$scope.img.substring(23)}};
            console.log($scope.transecto);
            Transecto.save($scope.transecto, function() {
                $route.reload();
                toastr.success("Transecto fue modificado");
            })
        } else {
            if ($scope.transecto.latI != $scope.coordenadas.lat) {
                $scope.transecto.latI = $scope.coordenadas[0];
                $scope.transecto.lngI = $scope.coordenadas[1];
                $scope.convertir(parseFloat($scope.transecto.latI), parseFloat($scope.transecto.lngI));
            }
            if ($scope.transecto.latF != $scope.coordenadas1.lat) {
                $scope.transecto.latF = $scope.coordenadas1[0];
                $scope.transecto.lngF = $scope.coordenadas1[1];
                $scope.convertir1(parseFloat($scope.transecto.latF), parseFloat($scope.transecto.lngF))
            }
            $scope.transecto.detalleTransecto = $scope.detalleTransecto;
            $scope.transecto._attachments = { "character.jpg": { "content_type": 'image/jpeg', "data": $scope.img.substring(23) } };
            console.log($scope.transecto);
            Transecto.save($scope.transecto, function() {
                $route.reload();
                toastr.success("Transecto fue modificado");
            })
        }

    }

    $scope.procesaEtno = function(transecto) {
        if (transecto.latI != '') {
            $scope.coordenadas = { lat: parseFloat(transecto.latI), lng: parseFloat(transecto.lngI) };
        } else {
            $scope.coordenadas = undefined;
        }
        if (transecto.latF != '') {
            $scope.coordenadas1 = { lat: parseFloat(transecto.latF), lng: parseFloat(transecto.lngF) };
        } else {
            $scope.coordenadas1 = undefined;
        }

        init($scope.coordenadas);
        init1($scope.coordenadas1);
        $scope.showAddBtn = true;
        $scope.showUpdateBtn = false;
        $scope.showAddBtn1 = false;
        $scope.showUpdateBtn1 = true;
        Transecto.transecto = transecto;
        $scope.transecto = Transecto.transecto;
        $scope.detalleTransecto = transecto.detalleTransecto;
        $scope.convertir(parseFloat(transecto.latI), parseFloat(transecto.lngI));
        $scope.convertir1(parseFloat(transecto.latF), parseFloat(transecto.lngF));
        comun.tareas = transecto.detalleTransecto;

        if ($scope.transecto.colector == "" || $scope.transecto.colector == undefined) {
            toastr.warning("La ficha no tiene datos del experto, actualize para guardar nuevo experto comunitario", "Atención porfavor");
            $scope.transecto.colector = Decodificado.data.nombre + ' ' + Decodificado.data.apellido;
            $scope.Mensaje = "Transecto sera modificado por " + $scope.transecto.colector;
        } else {
            if ($scope.transecto.colector == Decodificado.data.nombre + ' ' + Decodificado.data.apellido) {
                $scope.Mensaje = "Transecto creado por" + $scope.transecto.colector + " sera modificado por el mismo colector";
            } else {
                $scope.Mensaje = "Transecto creado por " + $scope.transecto.colector + " sera modificado por " + Decodificado.data.nombre + ' ' + Decodificado.data.apellido;
            }
        }
        console.log(transecto);
        /*FormaUso.formauso=formauso;
        $scope.formauso=FormaUso.formauso;*/
    }

    $scope.deleteTrans = function(transecto) {
        Transecto.delete(transecto, function(data) {
            $route.reload();
            toastr.success("Transecto fue eliminado");
        })
    }


    $scope.today = function() {
        $scope.record.date = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.record.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = 'dd/MM/yyyy';




    $scope.filterRecords = function() {
        console.log($scope.filter.startDate.toJSON());
        $scope.transectos = TransectoFilterFilter.query({
            altitud: $scope.filter.altitud,
            startDate: $scope.filter.startDate.toJSON(),
            endDate: $scope.filter.endDate.toJSON()
        });
    }

    $scope.openFilterStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
    };

    $scope.openFilterEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };

}])


.controller('TransactionReportsCtrl', [function($scope) {

}])

.controller('UserCtrl', ['$scope', '$route', 'User', function($scope, $route, User) {
    $scope.users = User.query()
        //$scope.users =[];
    $scope.fuser = { "name": '', "password": '', "nombres": '', "apellidos": '', "roles": ['lector'], "anionacimiento": '', "sexo": '', "correo": '', "nro": '', "type": '', "id": '' };
    //$scope.fuser.username=User.query.username;
    //$scope.fuser.password=User.query.password;
    $scope.roless = ['admin', 'adminuser', 'lector'];
    $scope.sexo = ['Masculino', 'Femenino'];
    $scope.fuser.type = 'user';
    $scope.saveUser = function() {
        $scope.fuser.id = 'org.couchdb.user:' + $scope.fuser.name;
        console.log($scope.fuser.id);
        console.log($scope.fuser);
        if ($scope.fuser.name == '') { alert("Llene todos los datos porfavor"); } else {
            User.save($scope.fuser, function(data) {
                console.log('guardando usuario');
                $route.reload();
                $scope.fuser = {};
                toastr.success("el usuario se agrego satisfactoriamente");
            });
        }

    }

}])

.controller('StockReportsCtrl', ['$scope', '$route', '$location', 'Product', 'ComputeQuantityInService', 'StockService', function($scope, $route, $location, Product, ComputeQuantityInService, StockService) {
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.format = 'dd/MM/yyyy';
    $scope.products = [];

    $scope.load = function() {
        $scope.products = StockService.query({ startDate: $scope.startDate.toJSON(), endDate: $scope.endDate.toJSON() });
    }

    $scope.openStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
    };

    $scope.openEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };

}]);