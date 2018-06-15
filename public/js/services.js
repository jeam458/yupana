'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1')
  .factory('Record', function($resource){
  	return $resource('/records')
  })
  .factory('RecordFilter', function($resource){
    return $resource('/records/:product_id/:customer_id/:type/:startDate/:endDate')
  })
  .factory('EtnobotanicaFilter', function($resource){
    return $resource('/etnobotanicas/:especie/:startDate/:endDate')
  })
  .factory('TransectoFilter', function($resource){
    return $resource('/transectos/:altitud/:startDate/:endDate')
  })
  .factory('Product', function($resource){
  	return $resource('/products')
  })
  .factory('Customer', function($resource){
  	return $resource('/customers')
  })
  .factory('Parteusada', function($resource){
  	return $resource('/partesusadas')
  })
  .factory('Especie', function($resource){
  	return $resource('/especies')
  })
  .factory('Especie1', function($resource){
  	return $resource('/especies/:id')
  })
  .factory('Etnobotanica', function($resource){
  	return $resource('/etnobotanicas')
  })
  .factory('Transecto', function($resource){
  	return $resource('/transectos')
  })
  .factory('TipoVegetacion', function($resource){
  	return $resource('/tiposvegetacion')
  })
  .factory('FormaBiologica', function($resource){
  	return $resource('/formasbiologicas')
  })
  .factory('FormaUso', function($resource){
  	return $resource('/formasuso')
  })
  
  .factory('SessionService', function($resource) {
  return $resource('/api/sessions');
})
  .factory('ComputeQuantityInService', function($resource) {
    return $resource('/compute/productsin/:product_id/:startDate/:endDate');
})
  .factory('StockService', function($resource) {
    return $resource('/stock/:startDate/:endDate');
})
  .factory('User', function($resource) {
    return $resource('/user');
})

  ;
