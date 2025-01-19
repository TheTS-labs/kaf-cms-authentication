import { Users } from "node-appwrite";
import { CMSResponse, Logger } from "../typings";
import RequestError from "./request_error";

export default async function get_or_create_user(users: Users, cms_user: CMSResponse, error: Logger) {
    const existing_user = await users.get(cms_user.data.id.toString()).catch(() => {
        error("[APPWRITE] User not found. Attempting to create...");
    })

    if (existing_user) {
        return existing_user;
    }

    const new_user = await users.create(
        cms_user.data.id.toString(),
        cms_user.data.email,
        `+${cms_user.data.phone}`,
        undefined,
        cms_user.data.name
    ).catch((err) => {
        error("[APPWRITE] Failed to create user", err);
        throw new RequestError("ACCOUNT_CREATION_FAILED");
    });

    await users.updatePhoneVerification(new_user.$id, true).catch((err) => {
        error("[APPWRITE] Failed to mark phone number as verified", err);
        throw new RequestError("ACCOUNT_CREATION_FAILED");
    });

    return new_user;
}