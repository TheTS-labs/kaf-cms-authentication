import { Client, Users } from "node-appwrite";
import { z } from "zod";
import { Logger, Result } from "../typings";
import axios from "../axios";
import { StatusCodes } from "http-status-codes";

export const loginEndpointSchema = z.object({
    username: z.string(),
    code: z.string().max(5),
});

export default async function loginEndpoint(
    client: Client, req: z.infer<typeof loginEndpointSchema>, log: Logger, error: Logger
): Promise<[Result, number]> {
    log("[LOGIN] Starting login process...");

    log("[LOGIN] Fetching user account...");
    const users = new Users(client);

    const user = await users.get(req.username).catch(() => error("[LOGIN] Unable to retrieve user account"));
    if (!user) {
        return [{
            code: "USER_ERROR",
            message: "The specified user does not exist",
            full: null
        }, StatusCodes.INTERNAL_SERVER_ERROR];
    }

    log("[LOGIN] User found", user.$id);

    if (!user.status) {
        error("[LOGIN] User account is blocked");
        return [{
            code: "USER_ERROR",
            message: "User account is blocked",
            full: null
        }, StatusCodes.FORBIDDEN];
    }
    
    log("[LOGIN] Validating user credentials...");
    const response = await axios.post("/api/authenticate", req).catch((err) => {
        error("[LOGIN] Failed to communicate with CMS", err);
    });

    if (!response) {
        return [{
            code: "CMS_ERROR",
            message: "Failed to communicate with CMS",
            full: null
        }, StatusCodes.INTERNAL_SERVER_ERROR];
    }
    
    if (response.status !== 200) {
        error("[LOGIN] CMS returned an error", response.status, response.data);
        return [{
            code: "CMS_ERROR",
            message: "Authentication failed",
            full: response.data
        }, response.status];
    }

    log("[LOGIN] Generating user token...");
    const token = await users.createToken(user.$id).catch((err) => error("[LOGIN] Failed to generate user token", err));
    if (!token?.secret) {
        return [{
            code: "TOKEN_ERROR",
            message: "Unable to generate login token",
            full: null
        }, StatusCodes.INTERNAL_SERVER_ERROR];
    }

    log("[LOGIN] Fetching additional user information...");
    const info = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${response.data.idToken}` }
    }).catch((err) => {
        error("[LOGIN] Failed to retrieve user information from CMS", err);
    });

    if (!info) {
        return [{
            code: "CMS_ERROR",
            message: "Unable to fetch user information",
            full: null
        }, StatusCodes.INTERNAL_SERVER_ERROR];
    }

    if (info.status !== 200) {
        error("[LOGIN] Error while fetching user information", info.status);
        return [{
            code: "CMS_ERROR",
            message: "Failed to retrieve user information",
            full: info.data
        }, info.status];
    }

    log("[LOGIN] Updating user profile...");
    await users.updateEmail(user.$id, info.data.data.email).catch((err) => error("[LOGIN] Unable to update user email address", err));
    await users.updatePhone(user.$id, `+${info.data.data.phone}`).catch((err) => error("[LOGIN] Unable to update user phone number", err));
    await users.updateName(user.$id, info.data.data.name).catch((err) => error("[LOGIN] Unable to update user name", err));
    await users.updatePhoneVerification(user.$id, true).catch((err) => error("[LOGIN] Failed to mark phone number as verified", err));

    log("[LOGIN] Login completed successfully");
    
    return [{
        code: "OK",
        message: "Login was successful",
        full: {
            cms_id: info.data.data.id,
            secret: token.secret,
            cms_token: response.data.idToken
        }
    }, StatusCodes.OK];
}
