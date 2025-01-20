import { AppwriteRequest, VerifyBody } from "./typings";
import { Client } from "node-appwrite";
import { StatusCodes } from "http-status-codes";
import challengeHandler from "./handlers/challenge";
import OPTIONS from "./options";
import verifyHandler from "./handlers/verify";
import RequestError from "./lib/request_error";

export default async ({ req, res, log, error }: AppwriteRequest) => {
  const client = new Client()
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers["x-appwrite-key"]);

  if (req.method !== "POST") {
    return res.json({}, StatusCodes.METHOD_NOT_ALLOWED);
  }

  try {
    if (req.path === "/challenge") {
      const result = await challengeHandler(client, OPTIONS);
      return res.json(result);
    }
  
    if (req.path === "/verify" && req.bodyJson) {
      const result = await verifyHandler(client, req.bodyJson as unknown as VerifyBody, OPTIONS);
      return res.json(result);
    }
  } catch (err) {
    if (err instanceof RequestError) {
      return res.json(err.json(), err.status);
    }

    const error = new RequestError("UNKNOWN");
    return res.json(error.json(), error.status);
  }

  return res.text("", StatusCodes.NOT_FOUND);
};
