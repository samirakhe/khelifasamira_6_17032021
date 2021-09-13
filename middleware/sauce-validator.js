const {check} = require('express-validator');

exports.sauceValidator = (req) => {
    return [
        check('image').notEmpty().withMessage('Le nom de la sauce est obligatoire')
        // body('manufacturer').notEmpty().withMessage('Le champs Manufacturer est obligatoire'),
        // body('description').notEmpty().withMessage('Le champs description est obligatoire'),
        // body('mainPepper').notEmpty().withMessage('Le champs mainPepper est obligatoire'),
        // body('imageUrl').notEmpty().withMessage('L\'image est obligatoire'),
        // body('heat').notEmpty().withMessage('Le champs heat est obligatoire')
    ];
};