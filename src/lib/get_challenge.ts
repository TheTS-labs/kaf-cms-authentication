import { randomInt } from "crypto";
import { Databases } from "node-appwrite";
import execNTimes from "./exec_n_times";
import getOrders from "./get_orders";
import { Options } from "../options";

export default async function getChallenge(databases: Databases, options: Options ) {
  for (let i = 0; i < options.maxAttempts; i++) {
    const ids = execNTimes(() => randomInt(options.firstOrder, options.lastOrder).toString(), options.n);
    const records = await getOrders(databases, ids, options.dbId, options.collectionId);

    if (records.total === 10) {
      return ids;
    }
  }

  throw new Error("Unable to generate a valid challenge");
}