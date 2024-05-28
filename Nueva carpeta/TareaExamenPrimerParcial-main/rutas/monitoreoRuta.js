const express = require('express');
const rutas = express.Router();
const bienvenidaModel = require('../autos/bienvenida');
const usuarioModel = require('../autos/Usuario');
const monitoreoModel = require('../autos/monitoreo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

rutas.use(bodyParser.json());

//endpoint 1.  traer todas las placas
rutas.get('/getmonitoreo', async (req, res) => {
    try  {
        const monitoreo = await  monitoreoModel.find();
        res.json(monitoreo);
    } catch (error){
        res.status(500).json({mensage: error.message});
    }
});


// Endpoint 2. para crear una nueva placa
rutas.post('/crearmonitoreo', async (req, res) => {
    try {
        const { placa, tieneSoat, bienvenida } = req.body;

        const nuevoMonitoreo = new monitoreoModel({
            placa,
            tieneSoat,
            bienvenida
        });

        await nuevoMonitoreo.save();

        res.status(201).json({ message: 'Placa registrada exitosamente', data: nuevoMonitoreo });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la placa', error });
    }
});
//endpoint 3. Editar placa
rutas.put('/editarmonitoreo/:id', async (req, res) => {
    try {
        const monitoreo = await monitoreoModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!monitoreo)
            return res.status(404).json({ mensaGe : 'placa no encontrada!!!'});
        else
            return res.status(201).json(monitoreoEditado);

    } catch (error) {
        res.status(400).json({ mensage :  error.message})
    }
});

//ENDPOINT 4. eliminar placa
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const monitoreoEliminado = await monitoreoModel.findByIdAndDelete(req.params.id);
       if (!monitoreoEliminado)
            return res.status(404).json({ mensage : 'placa no encontrada!!!'});
       else 
            return res.json({mensage :  'placa eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensage :  error.message})
    }
});
module.exports = rutas;