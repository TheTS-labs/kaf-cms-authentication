import { Users } from "node-appwrite";
import { Logger } from "./typings";
import RequestError from "./lib/request_error";
import fetch_user from "./lib/fetch_user";
import get_or_create_user from "./lib/get_or_create_user";

export default async function authorize(users: Users, authorization: string, log: Logger, error: Logger) {
    const cms_user = await fetch_user(authorization, error);
    const user = await get_or_create_user(users, cms_user, error);

    if (!user.status) {
        error("[APPWRITE] User account is blocked");
        throw new RequestError("ACCOUNT_BLOCKED");
    }

    const token = await users.createToken(user.$id).catch((err) => {
        error("[APPWRITE] Failed to generate user token", err);
        throw new RequestError("UNKNOWN");
    });

    return {
        code: "OK",
        message: "Login successful",
        full: { secret: token.secret }
    };
}