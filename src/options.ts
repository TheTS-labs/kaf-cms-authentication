const OPTIONS: Options = {
    firstOrder: Number(process.env.FIRST_ORDER!),
    lastOrder: Number(process.env.LAST_ORDER!),
    secret: process.env.HMAC_SECRET!,
    maxAttempts: Number(process.env.GET_CHALLENGE_MAX_ATTEMPTS!),
    n: Number(process.env.GET_CHALLENGE_N!),
    dbId: process.env.DB_ID!,
    collectionId: process.env.CMS_ORDERS_COLLECTION_ID!,
};

export interface Options {
    firstOrder: number;
    lastOrder: number;
    secret: string;
    maxAttempts: number;
    n: number;
    dbId: string;
    collectionId: string;
}

export default OPTIONS;