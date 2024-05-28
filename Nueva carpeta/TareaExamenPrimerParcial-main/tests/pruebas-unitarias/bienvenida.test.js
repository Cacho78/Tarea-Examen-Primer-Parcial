const express = require('express');
const request = require('supertest');
const bienvenidaruta = require('../../rutas/bienvenidaruta');
const bienvenidaModel = require('../../autos/bienvenida');
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());
app.use('/bienvenida', bienvenidaruta);

describe('Pruebas Unitarias para listas', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/examen1parcial',{
            useNewUrlParser : true,            
        });
        await bienvenidaModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
      });

    //1er test : GET
    test('Deberia Traer todas las listas metodo: GET: getbienvenida', async() =>{
        await bienvenidaModel.create({ universidad: 'San Pablo Catolica', nombre: 'Maria Isabel Fernholz Soto', docente:'javier senteno'  });
        await bienvenidaModel.create({  materia: 'planfinanciero', empresa: 'Toyota', modelo: 'Corolla', año:  2023 });
        // solicitud - request
        const res =  await request(app).get('/bienvenida/getbienvenida');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test('Deberia agregar una nueva lista: POST: /crear', async() => {
        const nuevalista = {
            nombre: 'Maria Isabel Fernholz Soto', 
            universidad: 'San Pablo Catolica', 
            materia: 'planfinanciero'
        };
        const res =  await request(app)
                            .post('/bienvenida/crear')
                            .send(nuevalista);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre).toEqual(nuevalista.nombre);
    });

    test('Deberia actualizar una tarea que ya existe: PUT /editar/:id', async()=>{
        const listaCreada = await bienvenidaModel.create(
                                  { nombre: 'Carlos Montero Pantoja', 
                                    universidad: 'Adventista de Bolivia', 
                                    docente: 'Ximena Añaguaya' });
        const listaActualizar = {
            nombre: 'Carlos Montero Pantoja (editado)',
            ingredientes: 'Adventista de Bolivia (editado)',
            porciones: 'Ximena Ingrid Añaguaya Choque'
        };
        const res =  await request(app)
                            .put('/bienvenida/editar/'+listaCreada._id)
                            .send(listaActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre).toEqual(listaActualizar.nombre);                   

    });
   
    test('Deberia eliminar una tarea existente : DELETE /eliminar/:id', async() =>{
        const listaCreada = await bienvenidaModel.create(
            { nombre: 'Marcelo Montero Pantoja', 
              materia: 'Psicologia', 
              docente: 'javier pardo' });

        const res =  await request(app)
                                .delete('/bienvenida/eliminar/'+listaCreada._id);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensage :  'bienvenida eliminada'});
    });
});