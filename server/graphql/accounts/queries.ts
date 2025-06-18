import Accounts from "../../models/accounts";
import config from "../../config/app";

export const queries = {
  getAccountById: async (_: any, { id }: { id: string }) => {
    try {
      const account = await Accounts.findById(id);
      return account;
    } catch (error) {
      console.error("Error fetching account by ID:", error);
      throw new Error("Failed to fetch account");
    }
  },

  listAccounts: async (_: any, { filter = {} }: { filter: any }) => {
    try {
      const { name, page = config.pagination.page, perPage = config.pagination.perPage } = filter;
      
      // Build query
      const query: any = {};
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }
      
      // Calculate pagination
      const skip = (page - 1) * perPage;
      
      // Execute query with pagination
      const accounts = await Accounts.find(query)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 });
      
      // Get total count for pagination
      const total = await Accounts.countDocuments(query);
      const totalPages = Math.ceil(total / perPage);
      
      return {
        accounts,
        total,
        page,
        perPage,
        totalPages,
      };
    } catch (error) {
      console.error("Error listing accounts:", error);
      throw new Error("Failed to list accounts");
    }
  },
};
