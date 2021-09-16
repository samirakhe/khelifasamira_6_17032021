const {body} = require('express-validator');

//Champs requis
const sauceValidator = (req) => {
    return [
        body('sauce.userId').notEmpty().withMessage('Vous devez préciser le propriétaire de la sauce'),
        body('sauce.name').notEmpty().withMessage('Le nom de la sauce est obligatoire'),
        body('sauce.manufacturer').notEmpty().withMessage('Le champs Manufacturer est obligatoire'),
        body('sauce.description').notEmpty().withMessage('Le champs description est obligatoire'),
        body('sauce.mainPepper').notEmpty().withMessage('Le champs mainPepper est obligatoire'),
        body('sauce.heat').notEmpty().withMessage('Le champs heat est obligatoire'),
        body('sauce.heat').isInt({ min:1, max:10 }).withMessage('Le champs heat doit avoir une valeur minimum de 1 et maximum 10')
       
    ];
};

module.exports = sauceValidator;