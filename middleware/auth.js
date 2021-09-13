const jwt = require('jsonwebtoken');
require('dotenv').config();



module.exports = (req, res, next)=> {
    
    try {
        console.log(req.params);
        const currentUser = req.body?.sauce?.userId || req.body.userId;
        // if (!currentUser){
        //     res.status(401).json({ message : 'Utilisateur non authentifié !'});
        //     return;
        // }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET_KEY);
        const userId = decodedToken.userId;
        if (currentUser && currentUser !== userId){
            res.status(401).json({ message : 'Utilisateur non authentifié'});
            return;
        }else {
            next();
        }

    }catch (error){
        res.status(401).json({ message : 'Utilisateur non authentifié'});
    }
};