const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "typeDefs.graphql");

const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

const { ApolloServer } = require('apollo-server');


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({url} )=> {
    console.log(`🤖🤖 Server listening on ${url}`)
})
