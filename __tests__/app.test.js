const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const db = require("../db/connection");
const endpointData = require("../endpoints.json");
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

        expect(endpoints).toEqual(endpointData);
      });
  });
});

describe("GET:/api/topics", () => {
  test("GET 200: Returns an array containing expected objects for each item in table", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET:/api/articles/:article_id", () => {
  test("Get 200: returns an article object corresponding to the inputted id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body;
        

        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article.article_id).toBe(1);
      });
  });
  test("GET 404: returns 404 status code and message when given a valid id that is not in the database", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("sends a 400 status code and a correct error msg when the inputted id parameter is not a valid type", () => {
    return request(app)
      .get("/api/articles/word")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET 404: not an api path", () => {
  test("sends a 404 status code and err msg when the inputted api path does not exist", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

