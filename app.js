const express = require("express");
const {getTopics}= require("./controllers/topic-controllers")
const {getArticleById} = require("./controllers/articles-controllers")
const app = express();

app.get('/api/topics', getTopics)


app.get('/api/articles/:article_id', getArticleById)

app.use((req, res) => {
    res.status(404).send({msg: "not found"})
})

module.exports = app



