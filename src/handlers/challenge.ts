import { Client, Databases } from "node-appwrite";
import getChallenge from "../lib/get_challenge";
import { Options } from "../options";
import sign from "../lib/sign";
import RequestError from "../lib/request_error";

export default async function challengeHandler(client: Client, options: Options) {
    const databases = new Databases(client);

    const expire = Date.now() + 10 * 60 * 1000;
    const challenge = await getChallenge(databases, options).catch(() => {
        throw new RequestError("REQUEST_FAILED");
    });
    const signature = sign({ orders: challenge, expire }, options.secret);

    return { orders: challenge, expire, signature };
}