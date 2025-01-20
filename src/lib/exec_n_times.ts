export default function execNTimes<T>(func: () => T, n: number) {
    return Array.from({ length: n }, func);
}