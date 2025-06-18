import Products from "../../models/products";

export const queries = {
  getProductById: async (_: any, { id }: { id: string }) => {
    try {
      const product = await Products.findById(id);
      return product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Failed to fetch product");
    }
  },

  listProductsByAccountId: async (_: any, { accountId }: { accountId: string }) => {
    try {
      const products = await Products.find({ accountId });
      return products;
    } catch (error) {
      console.error("Error listing products by account ID:", error);
      throw new Error("Failed to list products");
    }
  },
};
