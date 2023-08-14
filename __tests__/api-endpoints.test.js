const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const db = require("../db/connection");
const fs = require("fs/promises");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET: /api", () => {
  test("GET 200: returns an JSON object containing required API endpoint data", () => {


    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body;

        const expectedOutput = {
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all articles",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: "2018-05-30T15:59:13.341Z",
                  votes: 0,
                  comment_count: 6,
                },
              ],
            },
          },
        };
       
        
        expect(endpoints).toEqual(expectedOutput);
      });
  });
});
