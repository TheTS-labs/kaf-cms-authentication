import axios from "../axios";

export default async function isProxyWorking(): Promise<true | any> {
    return axios.get("/").then(() => true).catch(err => err);
}