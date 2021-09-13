const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: [true, 'Le nom de la sauce est obligatoire'] },
  manufacturer: { type: String, required: [true, 'Ce champs est obligatoire'] },
  description: { type: String, required: [true, 'Ce champs est obligatoire']  },
  mainPepper: { type: String, required: [true, 'Ce champs est obligatoire']  },
  imageUrl: { type: String, required: [true,'L\'image est obligatoire']  },
  heat: { type: Number, required: [true, 'Le champs Heat est obligatoire'] },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
});

module.exports = mongoose.model('Sauce', sauceSchema);