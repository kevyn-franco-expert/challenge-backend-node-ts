import { gql } from "apollo-server-express";

export const schema = gql`
  type Product {
    _id: ID!
    name: String!
    sku: String!
    stock: Int!
    accountId: ID
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    sku: String!
    stock: Int!
    accountId: ID
  }

  extend type Query {
    getProductById(id: ID!): Product
    listProductsByAccountId(accountId: ID!): [Product!]!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product!
    purchaseProduct(accountId: ID!, productId: ID!, quantity: Int!): PurchaseResponse!
  }

  type PurchaseResponse {
    success: Boolean!
    message: String!
    product: Product
  }
`;
