import { Client, Users } from "node-appwrite";
import { z } from "zod";
import { Logger, Result } from "../typings";
import axios from "../axios";
import { StatusCodes } from "http-status-codes";

export const authEndpointSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default async function challengeEndpoint(
    client: Client, req: z.infer<typeof authEndpointSchema>, log: Logger, error: Logger
): Promise<[Result, number]> {
    log("[CHALLENGE] Preparing request...");

    log("[CHALLENGE] Retrieving user details...");
    const users = new Users(client);
    const user = await users.get(req.username).catch(async () => {
        log("[CHALLENGE] User not found. Attempting to create user...");
    
        const user = await users.create(req.username).catch((err) => {
            error("[CHALLENGE] Failed to create user", err);
        });

        return user;
    });

    if (!user) {
        return [{
            code: "USER_ERROR",
            message: "Unable to create user",
            full: null
        }, StatusCodes.INTERNAL_SERVER_ERROR];
    }

    log("[CHALLENGE] User retrieved successfully", user.$id);

    if (!user.status) {
        error("[CHALLENGE] User account is blocked");
        return [{
            code: "USER_ERROR",
            message: "User account is blocked",
            full: null
        }, StatusCodes.FORBIDDEN];
    }

    log("[CHALLENGE] Sending request to CMS for challenge...");
    const response = await axios.post("/api/preAuthenticate", req).catch((err) => {
        error("[CHALLENGE] Failed to communicate with CMS", err);
    });

    if (!response) {
        return [{
            code: "CMS_ERROR",
            message: "Failed to communicate with CMS",
            full: null
        }, StatusCodes.INTERNAL_SERVER_ERROR];
    }

    if (response.status !== StatusCodes.OK) {
        error("[CHALLENGE] CMS returned an unsuccessful status", response.status);
        return [{
            code: "CMS_ERROR",
            message: "CMS returned an error",
            full: response.data
        }, response.status];
    }

    log("[CHALLENGE] CMS challenge request successful");
    
    return [{
        code: "OK",
        message: "SMS sent successfully",
        full: null
    }, StatusCodes.OK];
}
