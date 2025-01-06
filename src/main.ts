import { AppwriteRequest } from './typings';
import axios, { proxyServer } from './axios';
import challengeEndpoint, { authEndpointSchema } from './endpoints/challenge';
import { Client } from 'node-appwrite';
import loginEndpoint, { loginEndpointSchema } from './endpoints/login';

export default async ({ req, res, log, error }: AppwriteRequest) => {
  log("[PROXY]", proxyServer);
  log("[CMS]", axios.defaults.baseURL);

  const client = new Client()
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers['x-appwrite-key']);

  if (req.method == "POST" && req.path == "/challenge") {
    log("[CHALLENGE] Starting challenge using CMS...")
    log("[CHALLENGE] Validating body...")

    const validatedBody = await authEndpointSchema.safeParseAsync(JSON.parse(req.bodyText));
    if (!validatedBody.success) {
      return res.text(validatedBody.error.message, 400);
    }

    log("[CHALLENGE] Body validated.")

    const result = await challengeEndpoint(client, validatedBody.data, log, error);
    return res.text(...result);
  } else if (req.method == "POST" && req.path == "/login") {
    log("[LOGIN] Starting login using CMS...")
    log("[LOGIN] Validating body...")

    const validatedBody = await loginEndpointSchema.safeParseAsync(JSON.parse(req.bodyText));
    if (!validatedBody.success) {
      return res.text(validatedBody.error.message, 400);
    }

    log("[LOGIN] Body validated.")
    
    const result = await loginEndpoint(client, validatedBody.data, log, error);
    return res.text(...result);
  }

  return res.text("Not found", 404);
};
