const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

//Conditions password
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


//SIGN UP-----------------------------------------------------------------------------------------------------
exports.signup = ('',(req, res, next) => {
  if(passwordSchema.validate(req.body.password)){
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(() =>res.status(201).json({ message: 'Utilisateur créé'}))
        .catch((error) => res.status(401).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }));
  }else {
    return res.json({message: 'Votre mot de passe ne contient pas les caractères attendus'});
  };
});


//LOGIN---------------------------------------------------------------------------------------------------
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })  
    .then(user => {
      if(!user) {
        return res.status(401).json({ error : 'Adresse email ou mot de passe incorrect'});
      }
      bcrypt.compare(req.body.password, user.password) 
        .then(valid => { 
          if (!valid){
            return res.status(401).json({ error : 'Adresse email ou mot de passe incorrect' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.RANDOM_SECRET_KEY, 
              { expiresIn: process.env.TOKEN_DELAY }
            )
          })
        })
        .catch(error => res.status(500).json({ error }));
    }) 
    .catch(error => res.status(500).json({ error }));
};