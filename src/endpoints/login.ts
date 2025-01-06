import { Client, Users } from "node-appwrite";
import { z } from "zod";
import { Logger } from "../typings";
import axios from "../axios";

export const loginEndpointSchema = z.object({
    username: z.string(),
    code: z.string().max(6),
});

export default async function loginEndpoint(client: Client, req: z.infer<typeof loginEndpointSchema>, log: Logger, error: Logger): Promise<[string, number]> {
    log("[LOGIN] Preparing request...")

    log("[LOGIN] Getting user...")
    const users = new Users(client);

    const user = await users.get(req.username).catch(() => error("[LOGIN] User not found"));
    if (!user) {
        error("[LOGIN] Failed to get user");
        return ["Failed to get user", 500]
    }

    if (!user.status) {
        error("[LOGIN] User blocked");
        return ["User blocked", 403];
    }
    
    const response = await axios.post("/api/authenticate", req);
    if (response.status != 200) {
        error("[LOGIN] CMS request failed", response.status, response.data);
        return ["CMS request failed", response.status];
    }

    log("[LOGIN] User found.", user.$id);

    const token = await users.createSession(user.$id).catch((err) => error("[LOGIN] Failed to create session", err));
    if (!token?.secret) {
        error("[LOGIN] Failed to create session");
        return ["Failed to create session", 500];
    }

    const info = await axios.get("/api/users/me", { data: req, headers: { Authorization: `Bearer ${response.data.idToken}` } });
    if (info.status != 200) {
        error("[LOGIN] CMS request failed", info.status);
        return ["CMS request failed", info.status];
    }

    log("[LOGIN] Setting user info...")
    await users.updateEmail(user.$id, info.data.data.email).catch((err) => error("[LOGIN] Failed to update user email", err));
    await users.updatePhone(user.$id, `+${info.data.data.phone}`).catch((err) => error("[LOGIN] Failed to update user phone", err));
    await users.updateName(user.$id, info.data.data.name).catch((err) => error("[LOGIN] Failed to update user name", err));
    await users.updatePhoneVerification(user.$id, true).catch((err) => error("[LOGIN] Failed to update user phone verification", err));

    log("[LOGIN] Request successful.")
    
    return [JSON.stringify({
        secret: token.secret,
        cms_token: response.data.idToken
    }), 200];
}