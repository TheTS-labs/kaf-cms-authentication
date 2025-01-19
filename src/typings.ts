import { StatusCodes } from "http-status-codes";
import { JSONRequestError } from "./lib/request_error";

export interface Request {
  bodyText: string;
  bodyJson: Record<string, unknown> | string;
  headers: Record<string, string>;
  scheme: "http" | "https";
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  url: string;
  host: string;
  port: string;
  path: string;
  queryString: string;
  query: Record<string, string | string[]>;
}

export interface Response {
  empty: () => void;
  json: (data: any, statusCode?: StatusCodes, headers?: Record<string, string>) => void;
  binary: (data: Buffer, statusCode?: StatusCodes, headers?: Record<string, string>) => void;
  redirect: (url: string, statusCode?: StatusCodes, headers?: Record<string, string>) => void;
  text: (content: string, statusCode?: StatusCodes, headers?: Record<string, string>) => void;
}

export interface Logger {
  (message?: any, ...optionalParams: any[]): void;
}

export interface AppwriteRequest {
  req: Request;
  res: Response;
  log: Logger;
  error: Logger;
}

export interface CMSResponse {
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    username: string;
  }
}