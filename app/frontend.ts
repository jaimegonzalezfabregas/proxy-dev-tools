import { serve } from "https://deno.land/std@0.106.0/http/server.ts";
import { join, resolve, extname } from "https://deno.land/std/path/mod.ts";

const mimeTypes = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    // Add more MIME types as needed
};

export async function start_frontend(PORT, production) {
    if (production) {
        console.log("> Running frontend on port", PORT, " (open http://localhost:" + PORT + " to see the dev tools)");

        const server = serve({ port: PORT });
        const root = resolve(Deno.cwd(), './frontend_dist');

        for await (const req of server) {
            const url = new URL(req.url, `http://${req.headers.get("host")}`);
            const filePath = join(root, url.pathname);
            const ext = extname(filePath);
            const contentType = mimeTypes[ext] || "application/octet-stream"; // Default to binary if unknown

            try {
                console.log(filePath);
                const file = await Deno.open(filePath);
                req.respond({ body: file, headers: new Headers({ "Content-Type": contentType }) });
            } catch {
                req.respond({ status: 404, body: "File not found" });
            }
        }
    } else {
        console.log("> Running frontend on Vite's default port");

        const process = Deno.run({
            cmd: ["npm", "run", "dev"],
            cwd: "../frontend_src",
            stdout: "inherit",
            stderr: "inherit",
        });

        // Wait for the process to finish
        const status = await process.status();
        Deno.exit(status.code);
    }
}
