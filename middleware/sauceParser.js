const sauceParser = (req,res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    req.body.sauce = sauce;
    next();
}

module.exports = sauceParser;