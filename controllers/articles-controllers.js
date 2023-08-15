const { findArticleById, readArticles, findCommentsByArticleId } = require("../models/articles-models");


exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  findArticleById(article_id).then((article) => {
   
    res.status(200).send(article[0]);
  }).catch(next)
};

exports.getAllArticles = (req, res, next) => {
  readArticles().then((articles)=>{
   res.status(200).send(articles)
  })
}

exports.getCommentsByArticleId = (req, res, next) =>{
  const{article_id} = req.params
  
    findCommentsByArticleId(article_id).then((comments) =>{
      res.status(200).send(comments)
      
    }).catch(next)
}