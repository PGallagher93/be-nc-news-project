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

describe.only("GET:/api/articles/:article_id", () => {
  test("Get 200: returns an article object corresponding to the inputted id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;

        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article).toHaveProperty("comment_count");
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

describe("GET:/api/articles/:article_id/comments", () => {
  test("Get 200: returns an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;

        expect(comments).toHaveLength(2);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comment.article_id).toBe(3);
        });
      });
  });
  test("GET 200: response with a status code 200 and an empty array if the id is valid but no comments exist for it", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("GET 400: returns status code 400 and bad request message if sent an invalid id input", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("GET 404: returns a 404 code when a correct id is inputted but theres no item matching in the database", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("not found");
      });
  });
});

describe("GET 200: /api/articles", () => {
  test("returns the correct array of article objects with a comment count and ordered by date desc", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");

          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");

          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("The returning article objects have a key of comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});

describe("POST 201: /api/articles/:article_id/comments", () => {
  test("sends a 201 status and returns the posted comment after successfully inserting comment", () => {
    const inputComment = {
      username: "butter_bridge",
      body: "this is a comment",
    };

    return request(app)
      .post("/api/articles/4/comments")
      .send(inputComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;

        expect(comment[0]).toHaveProperty("comment_id", expect.any(Number));
        expect(comment[0]).toHaveProperty("votes", expect.any(Number));
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
        expect(comment[0]).toHaveProperty("article_id", expect.any(Number));
        expect(comment[0].body).toBe("this is a comment");
        expect(comment[0].author).toBe("butter_bridge");
      });
  });
  test("POST 201: ignores any extra keys that may be sent with the post", () => {
    const inputComment = {
      username: "butter_bridge",
      body: "this is a comment",
      unwantedKey: "no",
      thisShouldntBeHere: "sad",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(inputComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment[0]).toHaveProperty("comment_id", expect.any(Number));
        expect(comment[0]).toHaveProperty("votes", expect.any(Number));
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
        expect(comment[0]).toHaveProperty("article_id", expect.any(Number));
        expect(comment[0].body).toBe("this is a comment");
        expect(comment[0].author).toBe("butter_bridge");
      });
  });
  test("POST 400: returns status code 400 and bad request message if sent an invalid id input", () => {
    const comment = { username: "butter_bridge", body: "this is a comment" };

    return request(app)
      .post("/api/articles/hello/comments")
      .expect(400)
      .send(comment)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("POST 404: returns a 404 code when a correct id is inputted but theres no item matching in the database", () => {
    const comment = { username: "butter_bridge", body: "this is a comment" };
    return request(app)
      .post("/api/articles/999999/comments")
      .expect(404)
      .send(comment)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("not found");
      });
  });

  test("POST 400:returns status code 400 and a bad request message if no comment is sent", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("POST 404: returns status code 404 and a not found message when a comment is inserting with an unknown user name", () => {
    const comment = { username: "person1", body: "this is a comment" };
    return request(app)
      .post("/api/articles/999999/comments")
      .expect(404)
      .send(comment)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("not found");
      });
  });
});

describe("DELETE 204: /api/comments/:comment_id", () => {
  test("DELETE 204: deletes the selected comment and returns 204 status code", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE 404: returns a 404 status code and err msg when the inputted API path does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("DELETE 400: returns a 400 status code and a bad request message if passed an invalid id type", () => {
    return request(app)
      .delete("/api/comments/notanid")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("PATCH 200: /api/articles/:article_id", () => {
  test("patch 200: returns 200 status code and the updated article when sent correct input", () => {
    const inputVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(inputVotes)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article[0].article_id).toBe(1);
        expect(article[0].votes).toBe(101);
        expect(article[0]).toHaveProperty("title", expect.any(String));
        expect(article[0]).toHaveProperty("topic", expect.any(String));
        expect(article[0]).toHaveProperty("author", expect.any(String));
        expect(article[0]).toHaveProperty("body", expect.any(String));
        expect(article[0]).toHaveProperty("created_at", expect.any(String));
        expect(article[0]).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
  test("patch 200: returns 200 status code and the updated article when sent correct input with a negative number", () => {
    const inputVotes = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/2")
      .send(inputVotes)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article[0].article_id).toBe(2);
        expect(article[0].votes).toBe(-1);
        expect(article[0]).toHaveProperty("title", expect.any(String));
        expect(article[0]).toHaveProperty("topic", expect.any(String));
        expect(article[0]).toHaveProperty("author", expect.any(String));
        expect(article[0]).toHaveProperty("body", expect.any(String));
        expect(article[0]).toHaveProperty("created_at", expect.any(String));
        expect(article[0]).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
  test("patch 200: returns 200 status code and the updated article when sent input with extra keys", () => {
    const inputVotes = { inc_votes: 1, helloThere: "general Kenobi" };
    return request(app)
      .patch("/api/articles/1")
      .send(inputVotes)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article[0].article_id).toBe(1);
        expect(article[0].votes).toBe(101);
        expect(article[0]).toHaveProperty("title", expect.any(String));
        expect(article[0]).toHaveProperty("topic", expect.any(String));
        expect(article[0]).toHaveProperty("author", expect.any(String));
        expect(article[0]).toHaveProperty("body", expect.any(String));
        expect(article[0]).toHaveProperty("created_at", expect.any(String));
        expect(article[0]).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });

  test("PATCH 400: returns status code 400 and a bad request message if sent an invalid id type", () => {
    const inputVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/notanid")
      .send(inputVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("Patch 404: returns a 404 code when a correct id is inputted but theres no item matching in the database", () => {
    const inputVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999999")
      .expect(404)
      .send(inputVotes)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("not found");
      });
  });
  test("PATCH 400: returns a 400 code and a bad request message when a wrong data type is inputted", () => {
    const inputVotes = { inc_votes: "string" };
    return request(app)
      .patch("/api/articles/1")
      .send(inputVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("PATCH 200: /api/comments/:comment_id", () => {
  test("Patch 200: returns 200 status code and the updated comment when sent a positive inc vote", () => {
    const inputVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(inputVotes)
      .expect(200)
      .then((response) => {
        const { comment } = response.body;
        expect(comment[0].comment_id).toBe(1);
        expect(comment[0].votes).toBe(17);
        expect(comment[0]).toHaveProperty("body", expect.any(String));
        expect(comment[0]).toHaveProperty("article_id", expect.any(Number));
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
        expect(comment[0]).toHaveProperty("author", expect.any(String));
      });
  });
  test("Patch 200: returns 200 status code and the updated comment when sent a negative inc vote", () => {
    const inputVotes = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(inputVotes)
      .expect(200)
      .then((response) => {
        const { comment } = response.body;
        expect(comment[0].comment_id).toBe(1);
        expect(comment[0].votes).toBe(15);
        expect(comment[0]).toHaveProperty("body", expect.any(String));
        expect(comment[0]).toHaveProperty("article_id", expect.any(Number));
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
        expect(comment[0]).toHaveProperty("author", expect.any(String));
      });
  });
  test("Patch 200: returns 200 status code and the updated comment when sent a positive inc vote and an extra key", () => {
    const inputVotes = { inc_votes: 1, helloThere: "general Kenobi" };
    return request(app)
      .patch("/api/comments/1")
      .send(inputVotes)
      .expect(200)
      .then((response) => {
        const { comment } = response.body;
        expect(comment[0].comment_id).toBe(1);
        expect(comment[0].votes).toBe(17);
        expect(comment[0]).toHaveProperty("body", expect.any(String));
        expect(comment[0]).toHaveProperty("article_id", expect.any(Number));
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
        expect(comment[0]).toHaveProperty("author", expect.any(String));
      });
  });
  test("Patch 400: returns status code 400 and bad request message when sent an invalid id type", () => {
    const inputVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/notanid")
      .send(inputVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("Patch 404: returns a 404 code when a correct id type is inputted but does not exist", () => {
    const inputVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/99999999")
      .expect(404)
      .send(inputVotes)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("PATCH 400: returns a 400 code and a bad request message when a wrong data type is sent", () => {
    const inputVotes = { inc_votes: "string" };
    return request(app)
      .patch("/api/comments/1")
      .send(inputVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET 200: /api/users", () => {
  test("returns an array of user objects and a status code of 200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;

        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("get 200: /api/articles query by topic", () => {
  test("get 200: returns only the articles with the topic from the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("get 200: returns 200 status code and an empty articles array when passed a valid topic but none match it in the articles table", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });
  test("get 404: returns 404 status code and a not found message if topic could potential exist but does not currently", () => {
    return request(app)
      .get("/api/articles?topic=hello")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("GET 200: /api/articles sort_by query", () => {
  test("get 200: returns articles sorted by inputted query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("get 400: returns a 400 status code and bad request message when passed a sort by query that isnt a table column", () => {
    return request(app)
      .get("/api/articles?sort_by=lol")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("invalid sort query");
      });
  });
});

describe("GET 200: /api/articles order query", () => {
  test("get 200: returns articles sorted by inputted order query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("get 400: returns a 400 status code and error message when passed a order query that isnt either asc or desc", () => {
    return request(app)
      .get("/api/articles?order=lol")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("invalid order query");
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
