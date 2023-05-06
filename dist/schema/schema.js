const { gql } = require("@apollo/server");
export const typeDefs = gql `
  type Book {
    title: String
    author: String
  }

  type Student {
    name: String
  }

  type Query {
    books: [Book]
    students: [Student]
  }
`;
