const mongoose = require('mongoose');

const logSchema = mongoose.Schema(
    {
        autoid: {type: String},
        tanggal: {type : String},
        pengeluaran: {type : String},
        nominal: {type : Number},
        keterangan: {type : String}
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('LogCatatanPengeluaran', logSchema);

