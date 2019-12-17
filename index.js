require("dotenv").config({ path: "variables.env" });
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "typeDefs.graphql");

const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

const Question = require("./models/Question.js");
const Quizz = require("./models/Quizz.js");

const { ApolloServer } = require("apollo-server");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("💾💾💾Database connected");
  })
  .catch(e => {
    console.log(e);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    Question,
    Quizz
  })
});

server.listen().then(({ url }) => {
  console.log(`🤖🤖Server listening on ${url}`);
});
