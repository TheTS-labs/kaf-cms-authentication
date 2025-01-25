import { Databases, Query, Models } from "node-appwrite";

type Document = Models.Document & { houseId?: string };

export default async function solveChallenge(databases: Databases, ids: string[], dbId: string, collectionId: string) {
    return databases.listDocuments(dbId, collectionId, [
        Query.equal('$id', ids),
        Query.select(["houseId"])
    ]).then(res => res.documents as Document[])
        .then(res => res.map(doc => Number(doc.houseId)));
}