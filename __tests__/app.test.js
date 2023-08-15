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
   
   
    test("GET 200: Returns an array containing expected objects for each item in table", () =>{
            return request(app).get("/api/topics").expect(200).then((response)=>{
                const {topics} = response.body
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String))
                    expect(topic).toHaveProperty("description", expect.any(String))
                })
                
            })
    })
     
})

describe("GET 404: not an api path", () => {
    
    test("sends a 404 status code and err msg when the inputted api path does not exist", () =>{
    return request(app).get("/api/notapath").expect(404).then(({body}) =>{
        const {msg} = body
        expect(msg).toBe("not found")
    })
})})