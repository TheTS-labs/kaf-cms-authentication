import { Client, Users } from "node-appwrite";
import { z } from "zod";
import { Logger } from "../typings";
import axios from "../axios";

export const authEndpointSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default async function challengeEndpoint(client: Client, req: z.infer<typeof authEndpointSchema>, log: Logger, error: Logger): Promise<[string, number]> {
    log("[CHALLENGE] Preparing request...")

    log("[CHALLENGE] Getting user...")
    const users = new Users(client);
    const user = await users.get(req.username).catch(async () => {
        log("[CHALLENGE] User not found, creating...")
    
        const user = await users.create(req.username).catch((err) => {
        error("[CHALLENGE] Failed to create user", err);
        });

        return user;
    });

    if (!user) {
        error("[CHALLENGE] Failed to create/get user");
        return ["Failed to create/get user", 500];
    }

    if (!user.status) {
        error("[CHALLENGE] User blocked");
        return ["User blocked", 403];
    }

    const response = await axios.post("/api/preAuthenticate", req);
    if (response.status != 200) {
        error("[CHALLENGE] Request failed: CMS", response.status);
        return [response.statusText, response.status];
    }

    log("[CHALLENGE] User found/created.", user.$id);
    log("[CHALLENGE] Request successful.")
    
    return ["SMS sent", 200];
}