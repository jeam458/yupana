//couchdb design documents and map reduce functions

{
   "_id": "_design/products",
   "views": {
       "all": {
           "map": "function(doc){if(doc.product_name){emit(doc._id, {_id:doc._id, product_name:doc.product_name,model_number:doc.model_number});}}"
       },
       "quantityin": {
           "map": "function(doc){if(doc.f_product_id&&doc.f_customer_id&&doc.type=='In'){emit([doc.f_product_id, doc.date],doc.quantity);}}",
           "reduce": "function(keys,values){return sum(values);}"
       },
       "quantityout": {
           "map": "function(doc){if(doc.f_product_id&&doc.f_customer_id&&doc.type=='Out'){emit([doc.f_product_id, doc.date],doc.quantity);}}",
           "reduce": "function(keys,values){return sum(values);}"
       }
   }
}

{
   "_id": "_design/records",
   "views": {
       "all": {
           "map": "function(doc){if(doc.f_product_id&&doc.f_customer_id){emit([doc._id, doc.date], {_id:doc._id, f_product_id:doc.f_product_id,f_product_name:doc.f_product_name,f_product_model_number:doc.f_product_model_number,f_customer_id:doc.f_customer_id,f_customer_name:doc.f_customer_name,quantity:doc.quantity, date:doc.date, comment:doc.comment});}};"
       }
   }
}

{
   "_id": "_design/customers",
   "views": {
       "all": {
           "map": "function(doc){if(doc.customer_name){emit(doc._id, {_id:doc._id, _rev:doc._rev, customer_name:doc.customer_name, location: doc.location});}};"
       }
   }
}
/*partes usadas*/
{
   "_id": "_design/partesusadas",
   "views": {
       "all": {
           "map": "function(doc){if(doc.parteusada_name){emit(doc._id, {_id:doc._id, _rev:doc._rev, parteusada_name:doc.parteusada_name});}};"
       }
   }
}
/*forma de uso*/
{
   "_id": "_design/formasuso",
   "views": {
       "all": {
           "map": "function(doc){if(doc.formauso_name){emit(doc._id, {_id:doc._id, _rev:doc._rev, formauso_name:doc.formauso_name,formauso_descripcion:doc.formauso_descripcion});}};"
       }
   }
}
/*tipo de tiposvegetacion */
{
   "_id": "_design/tiposvegetacion",
   "views": {
       "all": {
           "map": "function(doc){if(doc.tipovegetacion_name){emit(doc._id, {_id:doc._id, _rev:doc._rev, tipovegetacion_name:doc.tipovegetacion_name});}};"
       }
   }
}
/* forma biologica */
{
   "_id": "_design/formasbiologicas",
   "views": {
       "all": {
           "map": "function(doc){if(doc.formabiologica_name){emit(doc._id, {_id:doc._id, _rev:doc._rev, formabiologica_name:doc.formabiologica_name});}};"
       }
   }
}
/* especie*/
{
   "_id": "_design/especies",
   "views": {
       "all": {
           "map": "function(doc){if(doc.especie_nombrecientifico){emit(doc._id, {_id:doc._id, _rev:doc._rev, especie_nombrecientifico:doc.especie_nombrecientifico,especie_familia:doc.especie_familia,especie_nombrecomun:doc.especie_nombrecomun,especie_nombrequechua:doc.especie_nombrequechua,especie_imagen:doc.especie_imagen});}};"
       }
   }
}

/*etonobotanica*/
{
   "_id": "_design/etnobotanica",
   "views": {
       "all": {
           "map": "function(doc){if(doc.especie && doc.fecha){emit([doc.especie, doc.fecha], {_id:doc._id, _rev:doc._rev,altitud:doc.altitud,altura:doc.altura,ciclovida:doc.ciclovida,colecta:doc.colecta,crecesola:doc.crecesola,curador:doc.curador,departamento:doc.departamento,distrito:doc.distrito,duplicado:doc.duplicado,edad:doc.edad,entorno:doc.entorno,especie:doc.especie,experto:doc.experto,fecha:doc.fecha,flor:doc.flor,formabiologica:doc.formabiologica,fruto:doc.fruto,herbario:doc.herbario,hojas:doc.hojas,lat:doc.lat,lng:doc.lng,localidad:doc.localidad,lugarencontrado:doc.lugarencontrado,observaciones:doc.observaciones,pais:doc.pais,partesusadas:doc.partesusadas,provincia:doc.provincia,raiz:doc.raiz,secultiva:doc.secultiva,semajena:doc.semajena,setolera:doc.setolera,semilla:doc.semilla,sexo:doc.sexo,suelo:doc.suelo,tallo:doc.tallo,utmx:doc.utmx,utmy:doc.utmy,utmzona:doc.utmzona,vegetacion:doc.vegetacion,type:doc.type});}};"
       }
   }
}



/*transectos */

{
   "_id": "_design/transecto",
   "views": {
       "all": {
           "map": "function(doc){if(doc.fecha){emit([doc.fecha], {_id:doc._id, _rev:doc._rev,fecha:doc.fecha,utmZonaI:doc.utmZonaI,utmXI:doc.utmXI,utmYI:doc.utmYI,altitudI:doc.altitudI,latI:doc.latI,lngI:doc.lngI,temperaturaI:doc.temperaturaI,utmZonaF:doc.utmZonaF,utmXF:doc.utmXF,utmYF:doc.utmYF,altitudF:doc.altitudF,latF:doc.latF,lngF:doc.lngF,temperaturaF:doc.temperaturaF,detalleTransecto:doc.detalleTransecto,_attachments:doc._attachments,type:doc.type});}};"
       }
   }
}


  