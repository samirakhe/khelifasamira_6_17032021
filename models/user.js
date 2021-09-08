const mongoose = require('mongoose');
const uniqueVlidator =require('mongoose-unique-validator');



const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})
//on applique le validator ay shcema avant d'en faire un model
userSchema.plugin(uniqueVlidator);

//on exporte ce shema sous forme de modele
module.exports =  mongoose.model( 'User', userSchema);