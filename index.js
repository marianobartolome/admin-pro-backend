require('dotenv').config();

const express= require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app= express();

//Base de datos
dbConnection();


//Consifgurar CORS
app.use(cors());


//Rutas
app.get('/', (req,res) => {
    res.json({
        ok:true,
        msg: 'Hola Mundo'
    });
});

app.listen(process.env.PORT, () => {

    console.log('el servidor corriendo en puerto'+process.env.PORT);
});