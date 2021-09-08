/* eslint-disable linebreak-style */
const Sauce = require('../models/sauces');
const fs = require('fs');
const { Server } = require('http');

//LIKE ET DISLIKE///////////////////////////////////////////////////////////////////////////////////////
exports.likedSauce = (req, res, next) => {
  const bodyValue = req.body.likes;
  const usersLiked = req.body.usersLiked;
  const usersDisliked = req.body.usersDisliked;
  const liked = {
    userId: req.body.userId,
    like: req.body.likes
  }

  switch (bodyValue) {

    case ( like === 1 ):
    
      Sauce.updateOne({_id:req.params.id}, {$inc:{likes:+1}, $push:{usersLiked:req.body.userId}})
      .then(() => res.status(201).json({ message: 'like ajouté !' }))
      .catch((error) => res.status(400).json({ error }));
    
    break;
}
};
  
  /*
  TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
  const bodyInfos = req.body;
  console.log(bodyInfos);


  if(bodyInfos.like === 1){
    Sauce.updateOne({_id:req.params.id}, {$inc:{likes:+1}, $push:{usersLiked:req.body.userId}})
    .then(() => res.status(201).json({ message: 'like ajouté !' }))
    .catch((error) => res.status(400).json({ error }));
  }
  -------------------------------------------------------------------------------------
exports.likedSauce = (req, res) => {
  const sauce =  req.params.id;
  const usersLiked = req.body.usersLiked;
  const usersDisliked = req.body.usersDisliked;

  const liked = {
    userId: req.body.userId,
    like: req.body.likes
  }
    switch ( sauce ) {
    case (like === 1 ):
        //on ajoute l'utilisateur dans le tableau usersLiked dans la bdd;
        break;
    case (like === -1):
      //on ajoute l'utilisateur dans le tableau usersDisliked dans la bdd;
      break;
    default :
      // message si l'utilisateur a deja liké ou disliké
  }
  }*/
/////////////////////////////////////////////////////////////////////////////////////////////////
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    like :0,
    dislike:0,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res) => {
  const sauceObject = req.file ? // on utilise le ternaire pour savoir si req.file existe
  //sil existe on a type dobjet et sil existe pas on a un autre type
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    } : { ...req.body }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};







// ici dans un premier temps :  on trouve lobjet dans la base de données, ensuite
//quand on le trouve on extrait le nom du fichier a supprimé, ensuite
//avec ce nom de fichier on le supprime avec fs.unlik, puis
//dans le callback du f.unlik, une fois que la suppression du fichier est effectuée on
//on fait la suppression de lobjet dans la base en renvoyant les reponses selon si ca a fonctionné ou non

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce =>{
        const filename = sauce.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
