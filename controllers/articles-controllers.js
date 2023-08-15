const { findArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  findArticleById(article_id).then((article) => {
    if(!article.length){
        
        return Promise.reject({status: 404, msg: "not found"})
    }
    res.status(200).send(article[0]);
  }).catch(next)
};
