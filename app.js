const express = require("express");
const {getTopics}= require("./controllers/topic-controllers");
const { getEndpoints } = require("./controllers/api-controller");

const app = express();

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)





module.exports = app



