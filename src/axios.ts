import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

export const proxyServer = `${process.env.PROXY_URL}:${process.env.PROXY_PORT}`;

const proxyAgent = new SocksProxyAgent(
    `socks://${process.env.PROXY_USER}:${process.env.PROXY_PASS}@${proxyServer}`,
    { timeout: 3000 }
);

export default axios.create({
    baseURL: process.env.CMS_BASE_URL!,
    validateStatus: () => true,
    timeout: 5000,
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent,
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "okhttp/4.9.0"
    }
});