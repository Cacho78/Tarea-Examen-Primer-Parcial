const mongoose = require('mongoose');
// esquema
const bienvenidaSchema = new mongoose.Schema({
    universidad: String,
    nombre: String,
    docente: String,
    materia: String,
    empresa: String,
    modelo : String,
    año: Number,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  
});
const bienvenidaModel = mongoose.model('Bienvenida',bienvenidaSchema, 'bienvenida');
module.exports = bienvenidaModel;