const express = require("express");
const {getTopics}= require("./controllers/topic-controllers")
const {handleCustomErrors, handleErrors} = require("./error.handlers")
const {getArticleById} = require("./controllers/articles-controllers")
const app = express();

app.get('/api/topics', getTopics)


app.get('/api/articles/:article_id', getArticleById)


app.use((req, res) => {
    res.status(404).send({msg: "not found"})
})

app.use(handleCustomErrors)

app.use(handleErrors)

module.exports = app



