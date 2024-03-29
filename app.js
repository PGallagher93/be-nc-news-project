const express = require("express");
const { getTopics } = require("./controllers/topic-controllers");
const { handleCustomErrors, handleErrors } = require("./error-handlers");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  patchVotes,
} = require("./controllers/articles-controllers");
const { getEndpoints } = require("./controllers/api-controller");
const { postComment } = require("./controllers/articles-controllers");
const { deleteComment } = require("./controllers/comments-controllers");
const { getAllUsers } = require("./controllers/users-controllers");
const {patchComment} = require("./controllers/comments-controllers")
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", patchVotes);

app.patch("/api/comments/:comment_id", patchComment)

app.use((req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use(handleCustomErrors);

app.use(handleErrors);

module.exports = app;
