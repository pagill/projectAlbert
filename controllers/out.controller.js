const Catatan = require('../models/out.model.js');
const Log = require('../models/log.model.js');

const redis = require('redis');

const {buildSchema} = require('graphql');
const expressGraphql = require('express-graphql');

const buat = async (req, res) => {
    try{
        const newCatatan = new Catatan({
            tanggal : req.body.tanggal,
            pengeluaran : req.body.pengeluaran,
            nominal : req.body.nominal
        });

    const result = await newCatatan.save();

    const newLog = new Log({
        autoid : result._id,
        tanggal : result.tanggal,
        pengeluaran : result.pengeluaran,
        nominal : result.nominal,
        keterangan : 'inserted'
    });

    await newLog.save();

    res.json(result);

    }catch(err){
        res.status(500).json({
            error : err
        });
    }

};

const ubah = async (req, res) => {
    try{
        const where = {
            _id : req.params.id
        };

        const data = {};

        console.log(req.params.id);

        if(req.body.tanggal) data.tanggal = req.body.tanggal;
        if(req.body.pengeluaran) data.pengeluaran = req.body.pengeluaran;
        if(req.body.nominal) data.nominal = req.body.nominal;

        const mauDiubah = await Catatan.findOneAndUpdate(where, {$set:data}, {useFindAndModify: false});

        const logBefore = new Log({
            autoid : mauDiubah._id,
            tanggal : mauDiubah.tanggal,
            pengeluaran : mauDiubah.pengeluaran,
            nominal : mauDiubah.nominal,
            keterangan : 'before update'
        });

        await logBefore.save();

        const result = await Catatan.findOne({_id:req.params.id});

        const logAfter = new Log({
            autoid : result._id,
            tanggal : result.tanggal,
            pengeluaran : result.pengeluaran,
            nominal : result.nominal,
            keterangan : 'after update'
        });

        await logAfter.save();
        

        res.json(result);
    }catch(err){
        res.status(500).json({error:err});
    }
};

const hapus = async (req, res) => {
    const where = {
        _id : req.params.id
    };

    try{
         const logBefore = await Catatan.findOne({_id:req.params.id});

        const dataLog = new Log({
            autoid : logBefore._id,
            tanggal : logBefore.tanggal,
            pengeluaran : logBefore.pengeluaran,
            nominal : logBefore.nominal,
            keterangan : 'deleted'
        });

        await dataLog.save();

        const result = await Catatan.deleteOne(where);
        res.json(result);
    }catch(err){
        res.status(500).json({error:err});
    }
};

const cari = async (req, res) => {
    const dataRedis = redis.createClient();

    //cek ada data di redis ga
    dataRedis.get('dataPengeluaran', async (err, result) => {
        if(err) throw err;

        if(result){
    //         //kalo ada di redis ambil ini
            const data = JSON.parse(result);
            let total = 0;
            for(let i = 0;i<data.length;i++){
                total = total+ parseInt(data[i].nominal);
             //   console.log(result[i].nominal);
            }
            res.json({dataPengeluaran:data, from :'REDIS'});
        }
        else{
            //kalo ga ada di redis ambil dari db
            try{
                const balikan = await Catatan.find({});
                console.log(balikan);
                let total = 0;
        
                for(let i = 0;i<balikan.length;i++){
                    total = total+ parseInt(balikan[i].nominal);
                    console.log(balikan[i].nominal);
                }
                
                const jsonPengeluaran = JSON.stringify(balikan);

                //SET ke REDIS
               dataRedis.set('dataPengeluaran', jsonPengeluaran);
                
                res.json({"Total Pengeluaran" : total, balikan, from :'MONGO'});
                
            }catch(err){
                res.status(500).json({
                    message: 'Error : ' + err
                });
            }   
        }
    });

    
};

module.exports = {
                    buat:buat,
                    ubah:ubah,
                    hapus:hapus,
                    cari:cari
}