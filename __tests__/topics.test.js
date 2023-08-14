const app = require("../app")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const request = require("supertest")
const db = require("../db/connection")

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("GET:/api/topics", () => {
    test("GET 200: returns a 200 status code", () => {
        return request(app).get("/api/topics").expect(200)
    })
})