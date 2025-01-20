import { Client, Databases, ID, Users } from "node-appwrite";
import { Options } from "../options";
import { VerifyBody } from "../typings";
import sign from "../lib/sign";
import RequestError from "../lib/request_error";
import solveChallenge from "../lib/solve_challenge";

export default async function verifyHandler(client: Client, req: VerifyBody, options: Options) {
    const databases = new Databases(client);
    const users = new Users(client);

    const { signature, ...challenge } = req.challenge;
    const valid_signature = sign(challenge, options.secret);
    if (signature !== valid_signature) {
        throw new RequestError("BAD_REQUEST");
    }

    if (Date.now() > challenge.expire) {
        throw new RequestError("BAD_REQUEST");
    }
  
    const answer = await solveChallenge(databases, challenge.orders, options.dbId, options.collectionId);
    if (answer.sort().toString() !== req.answer.sort().toString()) {
        throw new RequestError("BAD_REQUEST");
    }

    const user = await users.create(ID.unique());
    const token = await users.createToken(user.$id);

    return {
        secret: token.secret,
    }
}