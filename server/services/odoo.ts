import * as xmlrpc from "xmlrpc";

import config from '../config/app'

const {
    odoo: { url, db, uid, password }
} = config

const client = xmlrpc.createClient({ url });

interface IOdooClient {
  name: string;
  email: string;
  vat?: string;
  street?: string;
  phone?: string;
}

class OdooService {
  getOdooClientInfo = async (email: string) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "search_read",
          [[["email", "=", email]]],
          { fields: ["name", "vat", "email", "street", "phone"] },
        ],
        (err: any, value: any) => {
          if (err) reject(err);
          else resolve(value);
        }
      );
    });
  };

  createOdooClient = async (clientData: IOdooClient) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "create",
          [clientData],
        ],
        (err: any, value: any) => {
          if (err) reject(err);
          else resolve(value);
        }
      );
    });
  };

  updateOdooClient = async (id: number, clientData: Partial<IOdooClient>) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "write",
          [[id], clientData],
        ],
        (err: any, value: any) => {
          if (err) reject(err);
          else resolve(value);
        }
      );
    });
  };

  createOrUpdateOdooClient = async (clientData: IOdooClient) => {
    try {
      // Check if client exists
      const existingClients: any[] = await this.getOdooClientInfo(clientData.email) as any[];
      
      if (existingClients && existingClients.length > 0) {
        // Update existing client
        const clientId = existingClients[0].id;
        await this.updateOdooClient(clientId, clientData);
        return clientId;
      } else {
        // Create new client
        return await this.createOdooClient(clientData);
      }
    } catch (error) {
      console.error("Error in createOrUpdateOdooClient:", error);
      throw error;
    }
  };
}

export default new OdooService();
