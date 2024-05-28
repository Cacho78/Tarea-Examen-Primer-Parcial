const mongoose = require('mongoose');
// esquema
const monitoreoSchema = new mongoose.Schema({
    placa: String,
    tieneSoat:String,
    bienvenida :  { type: mongoose.Schema.Types.ObjectId, ref: 'Bienvenida' }
});
const monitoreoModel = mongoose.model('monitoreo',monitoreoSchema, 'monitoreo');
module.exports = monitoreoModel
