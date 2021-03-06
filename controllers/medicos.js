const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {


    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre')
    res.json({
        ok: true,
        medicos

    })



    /*
    res.json({
        ok:true,
        msg: 'getMedicos'
    })*/
}
const getMedicoById = async(req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre')
        res.json({
            ok: true,
            medico

        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }




    /*
    res.json({
        ok:true,
        msg: 'getMedicos'
    })*/
}
const crearMedico = async(req, res = response) => {

    const uid = req.uid;


    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            //msg: 'crearMedico'
            medico: medicoDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }






    res.json({
        ok: true,

    })
}
const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;

    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id',

            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true })

        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medico: medicoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }




}
const borrarMedico = async(req, res = response) => {
    const id = req.params.id;



    try {

        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id',

            });
        }

        await Medico.findOneAndDelete(id);



        res.status(200).json({
            ok: true,
            msg: 'Medico eliminado',

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}