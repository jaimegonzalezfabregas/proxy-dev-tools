import http from "node:http";
import url from "node:url";
import fs from "node:fs";


import { type Request } from "../data_types/network.ts";
import { send_network_ws } from "./ws.ts";

let request_list: Request[] = [];

export function reset_request_list() {
    request_list = [];
}

export function create_channel(LOCAL_PORT: number, TARGET_HOST: string, TARGET_PORT: number) {

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

        send_network_ws(request_i, request_list[request_i]);


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

            send_network_ws(request_i, request_list[request_i]);

            // Set the response headers

            if (proxyResponse.headers["content-type"] && proxyResponse.headers["content-type"].includes("html")) {

                // Manually handle the response data from the target server
                proxyResponse.on('data', (chunk) => {
                    if (request_list[request_i].server != null) {

                        request_list[request_i].server.body += chunk;
                        send_network_ws(request_i, request_list[request_i]);

                    }

                });

                // End the response when the proxy response ends
                proxyResponse.on('end', () => {
                    if (request_list[request_i].server != null) {
                        let mole_src: string = fs.readFileSync("./mole/mole.js");

                        const body = request_list[request_i].server.body.replace("</head>", "<script>" + mole_src + "</script></head>")

                        res.writeHead(proxyResponse.statusCode, { ...proxyResponse.headers, "content-length": body.length });
                        res.write(body);
                        res.end();
                        send_network_ws(request_i, request_list[request_i]);

                    }

                });
            } else {
                res.writeHead(proxyResponse.statusCode, proxyResponse.headers);

                // Manually handle the response data from the target server
                proxyResponse.on('data', (chunk) => {
                    if (request_list[request_i].server != null) {
                        request_list[request_i].server.body += chunk;
                        send_network_ws(request_i, request_list[request_i]);
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
            send_network_ws(request_i, request_list[request_i]);
            proxyRequest.write(chunk);
        });

        // End the proxy request when the client request ends
        req.on('end', () => {
            proxyRequest.end();
        });
    });

    // Start the server
    server.listen(LOCAL_PORT, () => {
        console.log("> Proxy exposed on port", LOCAL_PORT);
        console.log(`> Proxy will target ${TARGET_HOST}:${TARGET_PORT}`);

    });
}

