require('dotenv').config();

//import express from 'express';
const express= require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app= express();


//Consifgurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();



//Rutas
app.use('/api/usuarios', require ('./routes/usuarios'));
app.use('/api/hospitales', require ('./routes/hospitales'));
app.use('/api/medicos', require ('./routes/medicos'));
app.use('/api/login', require ('./routes/auth'));
app.use('/api/todo', require ('./routes/busquedas'));
app.use('/api/upload', require ('./routes/uploads'));


app.listen(process.env.PORT, () => {

    console.log('el servidor corriendo en puerto'+process.env.PORT);
});