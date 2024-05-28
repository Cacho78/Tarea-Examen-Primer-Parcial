const express = require('express');
const rutas = express.Router();
const bienvenidaModel = require('../autos/bienvenida');
const usuarioModel = require('../autos/Usuario');
const monitoreoModel = require('../autos/monitoreo');
const mongoose = require('mongoose');

//  EDPOINT 1. traer todo
rutas.get('/getbienvenida', async (req, res) =>{
    try {
        const bienvenida = await bienvenidaModel.find();
        res.json(bienvenida);

// bienvenida = wait

    } catch(error){
        res.status(500).json ({mensaje: error.mensage});
    }
})

//  EDPOINT 2. Crear
rutas.post('/crear', async (req, res) => {
    const bienvenida = new bienvenidaModel({
    
        universidad: req.body.universidad,
        nombre: req.body.nombre,
        docente: req.body.docente,
        materia: req.body.materia,
        empresa: req.body.empresa,
        año: req.body.año,
        usuario: req.body.usuario // asignacion al usuario
    })
    try {
        const nuevabienvenida = await bienvenida.save();
        res.status(201).json(nuevabienvenida);
    } catch (error) {
        res.status(400).json({ mensage :  error.message})
    }
});
//  ENDPOINT 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const bienvenidaEditada = await bienvenidaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!bienvenidaEditada)
            return res.status(404).json({ mensage : 'bienvenida no encontrada!!!'});
        else
            return res.status(201).json(bienvenidaEditada);

    } catch (error) {
        res.status(400).json({ mensage :  error.message})
    }
})
//  ENDPOINT 4. eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const bienvenidaEliminada = await bienvenidaModel.findByIdAndDelete(req.params.id);
       if (!bienvenidaEliminada)
            return res.status(404).json({ mensaje : 'bienvenida no encontrada!!!'});
       else 
            return res.json({mensage :  'bienvenida eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensage :  error.message})
    }
});

// ENDPOINT 5. obtener una lista por su ID

rutas.get('/lista/:id', async (req, res) => {
    try {
        const bienvenida = await bienvenidaModel.findById(req.params.id);
        if (!bienvenida)
            return res.status(404).json({ mensage : 'lista no encontrada!!!'});
        else 
            return res.json(bienvenida);
    } catch(error) {
        res.status(500).json({ mensage :  error.message})
    }
});
 // ENDPOINT 6. obtener lista por un modelo especifico
rutas.get('/bienvenidaPormodelo/:modelo', async (req, res) => {
    try {
        console.log(req.params.modelo);
        const bienbenidamodelos = await bienvenidaModel.find({ modelo: req.params.modelo});
        return res.json(bienbenidamodelos);
    } catch(error) {
        res.status(500).json({ mensage :  error.message})
    }
});
// ENDPOINT 7 - eliminar todas las recetas
rutas.delete('/eliminarTodos', async (req, res) => {
    try {
        await bienvenidaModel.deleteMany({});
        return res.json({mensage: "Todas las listas han sido eliminadas"});
    } catch(error) {
        res.status(500).json({ mensage :  error.message})
    }
});
// ENDPOINT 8. contar el numero total de recetas
rutas.get('/totallistas', async (req, res) => {
    try {
        const total = await bienvenidaModel.countDocuments();
        return res.json({totallistas: total });
    } catch(error) {
        res.status(500).json({ mensage :  error.message})
    }
});
// ENDPOINT 9. obtener listas ordenadas por nombre ascendente
// query.sort({ field: 'asc', test: -1 a 1 });
rutas.get('/ordenarlistas', async (req, res) => {
    try {
       const listasOrdenadas = await bienvenidaModel.find().sort({ nombre: -1});
       res.status(200).json(listasOrdenadas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

// - obtener lista por cantidad
rutas.get('/listasordenadas', async (req, res) => {
    try {
       const bienvenida = await bienvenidaModel.find({ lista : req.params.cantidad});
       res.status(200).json(recetas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

//endpoint 6 - obtener empresa por un toyota especifico
rutas.get('/empresa', async (req, res) => {
    try {
        const empresaToyota = await bienvenidaModel.find({ empresa: new RegExp(req.params.empresa, 'i')});
        return res.json(empresaToyota);
    } catch(error) {
        res.status(500).json({ mensage :  error.message})
    }
});

//REPORTES 1
rutas.get('listaporusuario/:usuarioId', async (peticion, respuesta) =>{
   const {usuarioId} = peticion.params;
   try{

       const usuario = await usuarioModel.findById(usuarioId);
       if (!usuario)
        return res.status(404).json({mensage: 'usuario no encontrado'});
        const lista = await bienvenidaModel.find({usuario: usuarioId}).populate('usuario');
        respuesta.json(lista);


   }catch(error){
    respuesta.status(500).json({mensage : error.message})
   }
});
//REPORTES 2
//sumar porciones de recetas por Usuarios
rutas.get('/listausuario', async (req, res) => {
    try {   
        const usuarios = await usuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async ( usuario1 ) => {
                const listas = await bienvenidaModel.find({ usuario: usuario1._id});
                const totallista = listas.reduce((sum, receta) => sum + listas.listas, 0);
                return {
                    usuario: {
                        _id: usuario1._id,
                        nombreusuario: usuario1.nombreusuario
                    },
                    totallista,
                    listas: listas.map( r => ( {
                        _id: r._id,
                        nombre: r.nombre,
                        universidad: r.universidad
                    }))
                }
            } )
        )
        res.json(reporte);
    } catch (error){
        res.status(500).json({ mensage :  error.message})
    }
})

module.exports = rutas;

