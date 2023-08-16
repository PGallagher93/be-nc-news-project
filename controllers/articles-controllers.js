const { findArticleById, readArticles, findCommentsByArticleId } = require("../models/articles-models");
const{checkIdExists}= require("../models/check-id-models")

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

  const promises=[findCommentsByArticleId(article_id), checkIdExists(article_id)]
  
    Promise.all(promises).then((resolvedPromises) =>{
      const comments = resolvedPromises[0]
      res.status(200).send(comments)
      
    }).catch(next)
}

exports.patchVotes = (req, res, next) => {
  const {article_id} = req.params
}