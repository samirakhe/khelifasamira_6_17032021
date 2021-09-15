const fs = require('fs');
const { Server } = require('http');
const Sauce = require('../models/sauces');
const {validationResult} = require('express-validator');

////////////////// LIKE ET DISLIKE----------------------------------------------------------------------
exports.likedSauce = (req, res, next) => {
  const likeValue = req.body.like;
  const usersLiked = req.body.usersLiked;
  const usersDisliked = req.body.usersDisliked;
  const liked = {
    userId: req.body.userId,
    like: req.body.likes
  }
  switch (likeValue) {
    //l'opérateur $inc de mongodb nous permet d'incrementer une valeur
    case 1:
      Sauce.updateOne({_id:req.params.id}, {$inc:{likes:+1}, $push:{usersLiked:req.body.userId}})
          .then(() => res.status(201).json({ message: 'like ajouté !' }))
          .catch((error) => res.status(400).json({ error })); 
      break;
    
    case -1:
        Sauce.updateOne({_id:req.params.id}, {$inc:{dislikes:+1}, $push:{usersDisliked:req.body.userId}})
            .then(() => res.status(201).json({ message: 'dislike ajouté !' }))
            .catch((error) => res.status(400).json({ error })); 
        break;

    case 0:
          Sauce.findOne({_id:req.params.id})
              .then((sauce) => {
                if( 
                  sauce.usersLiked.includes(req.body.userId)){
                  Sauce.updateOne({_id:req.params.id}, {$inc:{likes:-1}, $pull:{usersLiked:req.body.userId}})
                  .then(()=>res.status(200).json({ message: 'like supprimé !' }))

                }else { 
                  Sauce.updateOne({_id:req.params.id}, {$inc:{dislikes:-1}, $pull:{usersDisliked:req.body.userId}})
                  .then(()=>res.status(201).json({ message: 'dislike supprimé !' }))        
              }
            })
            .then(() => res.status(201).json({ message: 'tout est ok !' }))
            .catch((error) => res.status(400).json({ error })); 
  }
};
/////////////////////////C R U D -----------------------------------------------------------------------------


//POST
exports.createSauce = (req, res) => {
  if (!req.file){
    return res.status(400).json({ messages : 'Insérer une image' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    const messages = errors.array().map(error => {
      return error.msg;
    })
    fs.unlinkSync(`images/${req.file.filename}`);
    return res.status(400).json({ messages });
  }
  const sauceObject = req.body.sauce;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

//PUT
exports.modifySauce = (req, res) => {

  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body }
  if(req.file){
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images')[1];
      fs.unlinkSync('images/'+ filename);
    })
    .catch((error) => res.status(404).json({ error }));
  }

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};


//DELETE
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

//GET
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//GET
exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
