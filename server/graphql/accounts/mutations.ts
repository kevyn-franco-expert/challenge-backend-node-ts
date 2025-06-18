import Accounts from "../../models/accounts";
import { IAccount } from "../../interfaces/account";

export const mutations = {
  createAccount: async (_: any, { input }: { input: IAccount }) => {
    try {
      // Check if account with email already exists
      const existingAccount = await Accounts.findOne({ email: input.email });
      if (existingAccount) {
        throw new Error(`Account with email ${input.email} already exists`);
      }
      
      // Create new account
      const newAccount = new Accounts(input);
      await newAccount.save();
      
      return newAccount;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },
};
