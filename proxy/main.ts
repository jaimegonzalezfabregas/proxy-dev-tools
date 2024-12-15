import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import { WebSocket } from "ws";
import { type WSMessage } from "../data_types/comunications.ts";
let mole_src: string = fs.readFileSync("../mole/mole.js");

import { type Request } from "../data_types/network.ts";

let request_list: Request[] = [];

function send_network_ws(request_id, s) {

    let payload: WSMessage = {
        class: "network",
        request_id,
        request: request_list[request_id]
    }

    s?.send(JSON.stringify(payload));
}

function create_channel(LOCAL_PORT: number, TARGET_HOST: string, TARGET_PORT: number, WS_PORT: number) {

    let global_socket;

    Deno.serve({ port: 8888, hostname: "localhost" }, (req) => {

        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        request_list = [];
        global_socket = socket;

        return response;
    });

    // Create an HTTP server
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);

        let request_i = request_list.length;
        request_list.push({
            status_code: 0,
            "path": parsedUrl.path,
            "client": {
                body: "",
                headers: req.headers
            },
            "server": null,
        })

        const options = {
            hostname: TARGET_HOST,
            port: TARGET_PORT,
            path: parsedUrl.path,
            method: req.method,
            headers: req.headers,
        };

        // Create a request to the target server
        const proxyRequest = http.request(options, (proxyResponse) => {

            request_list[request_i].status_code = proxyResponse.statusCode
            request_list[request_i].server = {
                body: "",
                headers: proxyResponse.headers,
            }

            send_network_ws(request_i, global_socket);

            // Set the response headers


            if (proxyResponse.headers["content-type"] && proxyResponse.headers["content-type"].includes("html")) {

                // Manually handle the response data from the target server
                proxyResponse.on('data', (chunk) => {
                    if (request_list[request_i].server != null) {

                        request_list[request_i].server.body += chunk;
                        send_network_ws(request_i, global_socket);

                    }
                });

                // End the response when the proxy response ends
                proxyResponse.on('end', () => {
                    if (request_list[request_i].server != null) {

                        const body = request_list[request_i].server.body.replace("</head>", "<script>" + mole_src + "</script></head>")

                        res.writeHead(proxyResponse.statusCode, { ...proxyResponse.headers, "content-length": body.length });
                        res.write(body);
                        res.end();
                        send_network_ws(request_i, global_socket);

                    }

                });
            } else {
                res.writeHead(proxyResponse.statusCode, proxyResponse.headers);

                // Manually handle the response data from the target server
                proxyResponse.on('data', (chunk) => {
                    if (request_list[request_i].server != null) {
                        request_list[request_i].server.body += chunk;
                        send_network_ws(request_i, global_socket);
                        res.write(chunk);
                    }
                });

                // End the response when the proxy response ends
                proxyResponse.on('end', () => {
                    res.end();
                });
            }


        });

        // Handle errors
        proxyRequest.on('error', (err) => {
            console.error('Proxy error:', err);
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Bad Gateway');
        });

        // Manually handle the request data from the client to the target server
        req.on('data', (chunk) => {
            request_list[request_i].client.body += chunk;
            send_network_ws(request_i, global_socket);
            proxyRequest.write(chunk);
        });

        // End the proxy request when the client request ends
        req.on('end', () => {
            proxyRequest.end();
        });
    });

    // Start the server
    server.listen(LOCAL_PORT, () => {
        console.log(`Proxy server is running on http://localhost:${LOCAL_PORT}`);
    });
}

create_channel(5501, "localhost", 5500, 8888);