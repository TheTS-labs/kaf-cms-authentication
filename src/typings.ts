export interface Request {
  bodyText: string; // Raw request body as text
  bodyJson: Record<string, unknown> | string; // Parsed JSON object or raw string if not JSON
  headers: Record<string, string>; // Object containing lowercase string keys and their values
  scheme: 'http' | 'https'; // Protocol used in the request, based on x-forwarded-proto header
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD'; // HTTP methods
  url: string; // Full request URL
  host: string; // Hostname from the request
  port: string; // Port number from the request
  path: string; // Path part of the URL
  queryString: string; // Raw query parameter string
  query: Record<string, string | string[]>; // Parsed query parameters, with support for arrays
}

export interface Response {
  empty: () => void; // Function to send an empty response
  json: (data: Record<string, unknown>) => void; // Function to send a JSON response
  binary: (data: Buffer) => void; // Function to send a binary response
  redirect: (url: string, statusCode?: number) => void; // Function to send a redirect response
  text: (content: string, statusCode?: number, headers?: Record<string, string>) => void; // Function to send a plain text or HTML response
}

export interface Logger {
  (message?: any, ...optionalParams: any[]): void; // Function to log messages
}

export interface AppwriteRequest {
  req: Request;
  res: Response;
  log: Logger;
  error: Logger;
}