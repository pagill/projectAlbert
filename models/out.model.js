const mongoose = require('mongoose');

const OutSchema = mongoose.Schema(
    {
        tanggal: {type : String, required : true },
        pengeluaran: {type : String, required : true},
        nominal: {type : Number, required : true}
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('CatatanPengeluaran', OutSchema);

