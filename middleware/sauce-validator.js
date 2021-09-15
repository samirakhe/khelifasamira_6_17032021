const {body} = require('express-validator');

const sauceValidator = (req) => {
    return [
        body('sauce.name').notEmpty().withMessage('Le nom de la sauce est obligatoire'),
        body('sauce.manufacturer').notEmpty().withMessage('Le champs Manufacturer est obligatoire'),
        body('sauce.description').notEmpty().withMessage('Le champs description est obligatoire'),
        body('sauce.mainPepper').notEmpty().withMessage('Le champs mainPepper est obligatoire'),
        body('sauce.heat').notEmpty().withMessage('Le champs heat est obligatoire')
    ];
};

module.exports = sauceValidator;