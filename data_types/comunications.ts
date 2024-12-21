import { Request } from "./network.ts"

export type WSMessage = {
    class: "network",
    request_id: number,
    request: Request
} | {
    class: "relay",
    msg: { code: "start" } | { code: "console log" | "console error", elms: any[] } | { code: "execute error", ev: any, src: string, lineno: number, colno: number, error: any }
}