import { Request } from "./network.ts"

export type WSMessage = {
    class: "network",
    request_id: number,
    request: Request
}