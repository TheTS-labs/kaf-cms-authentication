import { Databases, Query } from "node-appwrite";

export default async function getOrders(databases: Databases, ids: string[], dbId: string, collectionId: string) {
  return databases.listDocuments(dbId, collectionId, [ Query.equal('$id', ids) ]);
}