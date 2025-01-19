import { AppwriteRequest } from "./typings";
import { Client, Users } from "node-appwrite";
import RequestError from "./lib/request_error";
import authorize from "./handler";
import { StatusCodes } from "http-status-codes";

export default async ({ req, res, log, error }: AppwriteRequest) => {
  log("[ENV]", process.env);

  const client = new Client()
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers["x-appwrite-key"]);
  const users = new Users(client);

  if (req.method !== "POST" || req.path !== "/" || !req.headers.authorization) {
    const error = new RequestError("BAD_REQUEST").json();
    return res.json(...error);
  }

  try {
    const result = await authorize(users, req.headers.authorization, log, error);
    return res.json(result, StatusCodes.OK);
  } catch (err) {
    if (err instanceof RequestError) {
      return res.json(...err.json());
    }

    const error = new RequestError("UNKNOWN").json();
    return res.json(...error);
  }
};
