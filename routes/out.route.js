const outcome = require('../controllers/out.controller.js');

const routes = (app) => {
    app.post('/inputCatatan', outcome.buat );
    app.put('/ubahCatatan/:id', outcome.ubah);
    app.delete('/hapusCatatan/:id', outcome.hapus);
    app.get('/cariCatatan', outcome.cari);

};

module.exports = {routes}