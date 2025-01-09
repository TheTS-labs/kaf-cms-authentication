import { AppwriteRequest } from "./typings";
import axios, { proxyServer } from "./axios";
import challengeEndpoint, { authEndpointSchema } from "./endpoints/challenge";
import { Client } from "node-appwrite";
import loginEndpoint, { loginEndpointSchema } from "./endpoints/login";
import isProxyWorking from "./lib/proxy";
import { StatusCodes } from "http-status-codes";

export default async ({ req, res, log, error }: AppwriteRequest) => {
  log("[PROXY]", proxyServer);
  log("[CMS]", axios.defaults.baseURL);

  log("[PROXY] Checking proxy...");
  const result = await isProxyWorking();
  if (result !== true) {
    error("[PROXY] Proxy is not working", result);
    return res.json({
      "code": "PROXY_ERROR",
      "message": "The service is unavailable",
      "full": null
    }, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const client = new Client()
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers["x-appwrite-key"]);

  if (req.method == "POST" && req.path == "/challenge") {
    log("[CHALLENGE] Starting challenge using CMS...")

    log("[CHALLENGE] Validating body...")
    const validatedBody = await authEndpointSchema.safeParseAsync(JSON.parse(req.bodyText));
    if (!validatedBody.success) {
      return res.json({
        "code": "BAD_REQUEST",
        "message": validatedBody.error.message,
        "full": validatedBody.error.format()
      }, StatusCodes.BAD_REQUEST);
    }
    log("[CHALLENGE] Body validated.")

    const result = await challengeEndpoint(client, validatedBody.data, log, error);
    return res.json(...result);
  }

  if (req.method == "POST" && req.path == "/login") {
    log("[LOGIN] Starting login using CMS...")

    log("[LOGIN] Validating body...")
    const validatedBody = await loginEndpointSchema.safeParseAsync(JSON.parse(req.bodyText));
    if (!validatedBody.success) {
      return res.json({
        "code": "BAD_REQUEST",
        "message": validatedBody.error.message,
        "full": validatedBody.error.format()
      }, StatusCodes.BAD_REQUEST);
    }
    log("[LOGIN] Body validated.")
    
    const result = await loginEndpoint(client, validatedBody.data, log, error);
    return res.json(...result);
  }

  return res.json({
    "code": "NOT_FOUND",
    "message": "Invalid request",
    "full": null
  }, StatusCodes.NOT_FOUND);
};
