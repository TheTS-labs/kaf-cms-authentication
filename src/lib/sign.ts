import * as crypto from "crypto";

export default function sign(object: any, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(object))
    .digest('base64');
}