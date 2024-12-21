import { WebSocket } from "ws";
import { type WSMessage } from "../data_types/comunications.ts";
import { reset_request_list } from "./proxy.ts"

let global_send_socket = null;

export function send_network_ws(request_id, request) {

    let payload: WSMessage = {
        class: "network",
        request_id,
        request
    }

    global_send_socket?.send(JSON.stringify(payload));
}

export function send_relay(msg, s: WebSocket | null) {

    let payload: WSMessage = {
        class: "relay",
        msg,
    }

    global_send_socket?.send(JSON.stringify(payload));
}

export function create_ws(CLIENT_PORT: number, RELAY_PORT: number) {

    console.log("> frontend WS exposed on port", CLIENT_PORT);
    console.log("> mole WS served on", RELAY_PORT);


    Deno.serve({ port: CLIENT_PORT, hostname: "localhost" }, (req) => {

        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        reset_request_list();

        socket.addEventListener("open", () => {
            global_send_socket = socket;
        });

        socket.addEventListener("close", () => {
            global_send_socket = null;
        });

        return response;
    });

    Deno.serve({ port: RELAY_PORT, hostname: "localhost" }, (req) => {

        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.addEventListener("message", (event) => {
            send_relay(JSON.parse(event.data), global_send_socket)
        });


        return response;
    });
}
