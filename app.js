const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Sauce = require('./models/sauces');
const stuffSauces = require('./routes/sauces');

const userRoutes = require('./routes/user');

const app = express();


app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb+srv://samira:piiquantep678@cluster0.b4owy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', stuffSauces);
app.use('/api/auth', userRoutes);
module.exports = app;