let mongoose = require("mongoose");
let Post = require("../models/Post");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
const { expect } = require("chai");
let should = chai.should();

chai.use(chaiHttp);

describe("Posts", () => {
  describe("/ GET Post", () => {
    it("should get post with id",  async() => {
      let id = "641379d1036113ebfcde87b3";
      const res = await chai.request(server).get("/api/posts/" + id)
      res.should.have.status(200);
      res.body.data.should.have.property("_id").equal(id);
      res.body.data.should.have.property("title");
      res.body.data.should.have.property("description");
    });
  });
  describe('/POST post',()=>{
    it("should create a post with given title and description",async()=>{
        let postData = {
            title:'Sample title5',
            description:'Sample description5'
        };
        const res =  await chai.request(server).post('/api/posts').set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTM2NjQxZjQxZTJjZjMzOGJmY2FkNyIsImVtYWlsIjoicmV1bmlvbjJAeW9wbWFpbC5jb20iLCJpYXQiOjE2Nzg5OTM1MDR9.l9c4khH5z5CQXhpApRLYnjgr-OXw7LII4pgIfFiB-F8').send(postData);

        res.should.have.status(200);
        console.log(res.body.data);
        res.body.data.should.have.property('title').equal(postData.title);
        res.body.data.should.have.property('description').equal(postData.description);
        res.body.data.should.have.property('PostId');
        res.body.data.should.have.property('CreatedTime');
    })
  })
});
