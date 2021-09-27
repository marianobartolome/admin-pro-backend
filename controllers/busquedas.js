const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

//const bcrypt = require('bcryptjs');

//const Busqueda = require('../models/usuario');

//const { generarJWT } = require('../helpers/jwt');


const getTodo = async(req,res = response) => {

    const busca = req.params.busca;

    const regex = new RegExp( busca, 'i');  //busqueda insensible
   
    

 
                       
    const [usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({  nombre: regex  }),

        Medico.find({  nombre: regex  }),

        Hospital.find({  nombre: regex  }),
    ]);

    res.json({
        ok:true,
        usuarios,
        medicos,
        hospitales

    });
}

const getDocumentosColeccion = async(req,res = response) => {

    const tabla = req.params.tabla;
    
    const busca = req.params.busca;

    const regex = new RegExp( busca, 'i');  //busqueda insensible
   
    let data = [];

    switch (tabla) {
        case 'medicos':
            data= await Medico.find({  nombre: regex  })
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data= await Hospital.find({  nombre: regex  })
                            .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data= await Usuario.find({  nombre: regex  });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg:'La tabla tiene que ser usuarios/medicos/hospitales'
            });
         
    }

 
                       
    res.json({
        ok: true,
        resultados:data
    })  
}

module.exports = {
        getTodo,
        getDocumentosColeccion
        
}