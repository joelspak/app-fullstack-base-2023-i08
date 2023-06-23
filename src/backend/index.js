//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
//// /device es donde se postean los dispositivos
app.post('/device/',function(req,res){
    console.log("llego = "+req.body.id);
    if(req.body.texto==undefined || req.body.texto==null || req.body.texto.length<4){
        res.status(409);
        res.send("el texto no es valido");
    }else{
        
        res.status(200)
        res.send("Todo ok");
    }


});
//// Recorridos es donde se postean los cambios de estado de los dispositivos y se actualizan en la base de datos
app.post('/recorridos/',function(req,res){
    console.log("llego = " + req.body.id + " cambia a " + req.body.value);
    // update db con nuevo estado
     utils.query("update Devices SET state=" + req.body.value + " WHERE id=" + req.body.id, function(err, rsp, fields) {
     console.log(err)
        if (err) {
        res.status(409);
        res.send("error");
      } else {
        res.status(200);
        res.send("Todo ok");
      }
    }); 
});

//// Delete es donde se postean las eliminaciones de dispositivos, donde se eliminan de la base de datos
app.post('/delete/',function(req,res){
    console.log("llego delete = " + req.body.id);
    // eliminar en db fila con id=req.body.id
    utils.query("delete from Devices WHERE id=" + req.body.id, function(err, rsp, fields) {
           if (err) {
           res.status(409);
           res.send("error");
         } else {
           res.status(200);
           res.send("Todo ok");
         }
       }
    );
});

//// edit es donde se postean las ediciones de dispositivos, donde se editan en la base de datos
app.post('/edit/',function(req,res){
    console.log("llego edit = " + req.body.id + req.body.name + req.body.description);
    // editar en db fila con id=req.body.id
    console.log("update Devices SET name='" + req.body.name + "', description='" + req.body.description + "' WHERE id=" + req.body.id);
    utils.query("update Devices SET name='" + req.body.name + "', description='" + req.body.description + "' WHERE id=" + req.body.id, function(err, rsp, fields) {
              if (err) {
              res.status(409);
              res.send("error");
            } else {
              res.status(200);
              res.send("Todo ok");
            }
         });
});


////agregar es donde se postean las agregaciones de dispositivos, donde se agregan en la base de datos
app.post('/agregar/',function(req,res){
    console.log("llego agregar = " + req.body.id);
    // agregar en db fila con id=req.body.id
    utils.query("insert into Devices (name,description,state,type) values ('" + req.body.name + "','" + req.body.description + "',0," + req.body.type + ")", function(err, rsp, fields) {
                if (err) {
                res.status(409);
                    
                res.send("error");
                } else {
                res.status(200);
                res.send("Todo ok");
                }
            }
    );
});


/* app.get('/pepe/', function(req,res) {
    utils.query("select * from Devices",function(err,rsp,fields){
    
        res.send(JSON.stringify(rsp));
    }); 

});*/

// Get Devices es donde se obtienen los dispositivos de la base de datos
app.get('/devices/', function(req, res, next) {
    utils.query("select * from Devices",function(err,rsp,fields){
    res.send(JSON.stringify(rsp)).status(200);
});
    /* devices = [
        { 
            'id': 1, 
            'name': 'Lampara 1', 
            'description': 'Luz living', 
            'state': 0,  
            'type': 1, 
        },
        { 
            'id': 2, 
            'name': 'Ventilador 1', 
            'description': 'Ventilador Habitacion', 
            'state': 1, 
            'type': 2, 
            
        },
    ] */
    //res.send(JSON.stringify(devices)).status(200);
    
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
