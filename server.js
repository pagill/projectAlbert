const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT ||  3000;

app.use(bodyParser.json());

//const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/learning-mongodb';
const url = 'mongodb+srv://albert:albert89@cluster0-oss4o.mongodb.net/learning-mongodb?retryWrites=true&w=majority';

const connect = async () => {
    try{
        const db = mongoose.connect(url, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        });

        console.log('Successfully login to the database');
    }catch(err){
        console.log('Could not connect to the database');
        process.exit();
    }
};

connect();

app.get('/',  (req, res) => {
    res.json({message:'success'});
});


const rute = require('./routes/out.route.js');

rute.routes(app);

app.listen(PORT, () => console.log(`Server is running in PORT ${PORT} `));