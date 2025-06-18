import Products from "../../models/products";
import Accounts from "../../models/accounts";
import { IProduct } from "../../interfaces/product";

export const mutations = {
  createProduct: async (_: any, { input }: { input: IProduct }) => {
    try {
      // Check if product with SKU already exists
      const existingProduct = await Products.findOne({ sku: input.sku });
      if (existingProduct) {
        throw new Error(`Product with SKU ${input.sku} already exists`);
      }
      
      // If accountId is provided, verify account exists
      if (input.accountId) {
        const account = await Accounts.findById(input.accountId);
        if (!account) {
          throw new Error(`Account with ID ${input.accountId} not found`);
        }
      }
      
      // Create new product
      const newProduct = new Products(input);
      await newProduct.save();
      
      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  purchaseProduct: async (_: any, { accountId, productId, quantity }: { accountId: string, productId: string, quantity: number }) => {
    try {
      // Validate account exists
      const account = await Accounts.findById(accountId);
      if (!account) {
        return {
          success: false,
          message: `Account with ID ${accountId} not found`,
          product: null
        };
      }
      
      // Validate product exists
      const product = await Products.findById(productId);
      if (!product) {
        return {
          success: false,
          message: `Product with ID ${productId} not found`,
          product: null
        };
      }
      
      // Validate sufficient stock
      if (product.stock < quantity) {
        return {
          success: false,
          message: `Insufficient stock. Requested: ${quantity}, Available: ${product.stock}`,
          product
        };
      }
      
      // Update stock
      product.stock -= quantity;
      await product.save();
      
      return {
        success: true,
        message: `Successfully purchased ${quantity} units of ${product.name}`,
        product
      };
    } catch (error: any) {
      console.error("Error processing purchase:", error);
      return {
        success: false,
        message: `Error processing purchase: ${error.message || 'Unknown error'}`,
        product: null
      };
    }
  },
};
