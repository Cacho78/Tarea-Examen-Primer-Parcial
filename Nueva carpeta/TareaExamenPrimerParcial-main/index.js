// importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const autoRutas = require('./rutas/autoRutas');
const UsuarioModel = require('./autos/Usuario');
const monitoreoRutas = require('./rutas/monitoreoRuta');
require('dotenv').config();
const app = express();

// rutas
const bienvenidaruta = require('./rutas/bienvenidaruta');

//configuracion de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//manejo de JSON
app.use(express.json());
//Conexion con Mongodb
mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Conexion exitosa');
    app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
}
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensage: 'No existe el token de autenticacion'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await  UsuarioModel.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};

app.use('/auth', autoRutas);
app.use('/bienvenida', autenticar, bienvenidaruta);
 app.use('/monitoreo', autenticar, monitoreoRutas);


//utilizar las rutas de recetas
// app.use('/recetarios', recetaRutas);