const {findArticleById} = require("../models/articles-models")


exports.getArticleById = (req, res, next) => {
    findArticleById(id)
}