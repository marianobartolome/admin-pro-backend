const { response } = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req,res) => {

    const desde = Number(req.query.desde) || 0;
    //console.log(desde);

 
                            
    const [usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)    //paginacion
            .limit(5),     //paginacion
        Usuario.countDocuments()
    ])

    res.json({
        ok:true,
        usuarios,
        total

    });
}

const crearUsuarios = async(req,res=response) => {

    const {email,password} = req.body;

    
    try {   

        const existeEmail= await Usuario.findOne({ email});

        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg:'El correo ya está registrado'
            })
        }

        const usuario= new Usuario(req.body);


        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync( password, salt);

        //Generar el token - JWT
        const token = await generarJWT(usuario.id); 


        //guardar usuario
        await usuario.save();

        res.json({
            ok:true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... revisar logs'
        })
    }
    
    
}

const actualizarUsuario = async(req,res=response) =>{

     //TODO: Validar token y comprobar si el usuario es correcto
    const uid=req.params.id;
    try {
        
       
        const usuarioDb = await Usuario.findById(uid);

        if(!usuarioDb){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }

        //Actualizaciones
        const {password,google, email, ...campos} = req.body;

        if(usuarioDb.email !== email){
           
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
     
        if(!usuarioDb.google){ //si es un correo de google no se actualiza
            campos.email = email;
        } else if(usuarioDb.email!==email){
            return res.status(400).json({
                ok:false,
                msg: 'Usuario de google no puede cambiar su correo'
            });
        }
        

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new:true });
        
        res.json({
            ok:true,
            usuario: usuarioActualizado
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'

        })
    }
}

const borrarUsuario = async(req,res=response) =>{

   const uid=req.params.id;

    try {
        
        const usuarioDb = await Usuario.findById(uid);

        if(!usuarioDb){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok:true,
            msg:'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error de delete',
            

        })
    }
}
module.exports = {
        getUsuarios,
        crearUsuarios,
        actualizarUsuario,
        borrarUsuario
}