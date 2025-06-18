import { gql } from "apollo-server-express";

export const schema = gql`
  type Account {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  input AccountInput {
    name: String!
    email: String!
  }

  input AccountFilterInput {
    name: String
    page: Int
    perPage: Int
  }

  type AccountPagination {
    accounts: [Account!]!
    total: Int!
    page: Int!
    perPage: Int!
    totalPages: Int!
  }

  extend type Query {
    getAccountById(id: ID!): Account
    listAccounts(filter: AccountFilterInput): AccountPagination!
  }

  extend type Mutation {
    createAccount(input: AccountInput!): Account!
  }
`;
