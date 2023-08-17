const {
  findArticleById,
  readArticles,
  findCommentsByArticleId,
  insertComment,
  updateVotes,
} = require("../models/articles-models");
const { checkIdExists } = require("../models/check-id-models");
const { checkTopicExists } = require("../models/check-topic-models.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  findArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by: sortBy } = req.query;
  
  const promises = [readArticles(sortBy, topic)];

  if (topic) {
    promises.push(checkTopicExists(topic));
  }
  
  Promise.all(promises)
    .then((resolvedPromises) => {
      if (!resolvedPromises[0].length) {
        return next({ status: 404, msg: "not found" });
      }
      const articles = resolvedPromises[0];
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [
    findCommentsByArticleId(article_id),
    checkIdExists(article_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];

      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  const promises = [
    checkIdExists(article_id),
    insertComment(comment, article_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(201).send({ comment: resolvedPromises[1] });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;

  const promises = [checkIdExists(article_id), updateVotes(votes, article_id)];

  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(200).send({ article: resolvedPromises[1] });
    })
    .catch(next);
};
