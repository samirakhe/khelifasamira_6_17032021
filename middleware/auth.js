const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET_KEY);
        const userId = decodedToken.userId;
        if (!userId ) {
            return res
                .status(401)
                .json({ message: "Utilisateur non authentifié" });
        } else {
            req.user = userId;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
