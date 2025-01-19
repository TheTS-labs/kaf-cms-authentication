import { Logger, CMSResponse } from "../typings";
import RequestError from "./request_error";

export default async function fetch_user(authorization: string, error: Logger): Promise<CMSResponse> {
    const info = await fetch(
        `${process.env.CMS_BASE_URL}/api/users/me`,
        { headers: { Authorization: authorization } }
    ).catch((err) => {
        error("[CMS] Unable to retrieve user details", err);
        throw new RequestError("REQUEST_FAILED");
    });

    if (!info.ok) {
        error("[CMS] CMS rejected request", info.status, info.body);
        throw new RequestError(
            "CMS_REJECTED",
            undefined,
            info.status,
            await info.json().catch(() => undefined)
        );
    }

    return info.json().catch(() => {
        error("[CMS] Unable to parse user details", info.body);
        throw new RequestError("UNKNOWN");
    });
}