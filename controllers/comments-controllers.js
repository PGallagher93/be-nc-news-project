const { checkCommentIdExists } = require("../models/check-id-models");
const { destroyComment } = require("../models/comments-models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  const promises = [
    checkCommentIdExists(comment_id),
    destroyComment(comment_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(204).send();
    })
    .catch(next);
};
