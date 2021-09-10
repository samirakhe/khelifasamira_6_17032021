const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


// La fonction signup va crypté le mdp,va prendre le mdp crypté et créé un nouveau user avec
//ce mot de passe crypté le ladresse mail placé dans le corps de la requete,
// et va enreigstrer cet utilisateur dans la base de donné, on a donc notre logique de signup
exports.signup = ('',(req, res, next) => {
  if(passwordSchema.validate(req.body.password)){
    bcrypt.hash(req.body.password, 10)
    .then( hash => {// ici on a recup le hash du mot de passe quon va enregistré dans un nvo user , dans la bdd
      const user = new User({ //User = le model mongoose
        email: req.body.email, // comme adress email on va placer ladresse qui est fourni dans le corps de la requete
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


//dans cette fonction login on récupere l'utilisateur de la base qui correspond à l'adresse mail entré
//si on ne recoi pas de user( email pas bon), on renvoie une erreur,on compare ensuite le mdp entré avec
//le hash qui est gardé dans ma bdd,si la comparasion n'est pas bonne, on renvoie une erreur, mais si la
//colmparasion est bonne c'est que l'utilisateur a rentrer des identifiants corrects on va lui renvoyé
//ce qui est attendu par le front, à savoir son  userId et un token
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })     //fonction asynchrone,pour trouver un seul utilisateur de la bdd
    .then(user => {//ici on verifie si on a recuperer un user ou non
      if(!user) {
        return res.status(401).json({ error : ' Utilsiateur non trouvé'});
      }
      //mais si on arrive ici c'est quon a bien trouvé l'user, et on va utilise rbcrypt pour comparer 
      //le mpd envoyé par l'utilisateur qui essaie de se connecté, avec le hash qui est 
      //enreigistré avec le user qu'on a recu juste au dessus
      bcrypt.compare(req.body.password, user.password) // on veu comparer le mdp qui est envoyé avec la requete avec le hash qui est enreigtsré dans notre user
        .then(valid => { //ici on recoit un boolean pour savoir si la comparaison est valable ou non
          if (!valid){
            return res.status(401).json({ error : ' Mot de passe inccorect' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(// cette fonction sign prend 2arguments

              { userId: user._id }, //le 1er argument sera les données que l'on veut encodés 'payload '
              process.env.RANDOM_SECRET_KEY, //le 2eme argument c'est la clé secrète pour l'encodage
              { expiresIn: process.env.TOKEN_DELAY }//on apllique une expiration pour le token
            )
          })
        })
        .catch(error => res.status(500).json({ error }));
    }) 
    .catch(error => res.status(500).json({ error }));


};