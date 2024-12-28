import { create_channel } from "./proxy.ts";
import { create_ws } from "./ws.ts";
import { start_frontend } from "./frontend.ts";

const CLIENT_WS_PORT = 8888;
const RELAY_WS_PORT = 8889;

// Default port values
const DEFAULT_FRONTEND_PORT = 5173;
const DEFAULT_CHANNEL_PORT = 5501;

// Function to display help message
function displayHelp() {
    console.log("Usage: <host>:<port> [options]");
    console.log("Options:");
    console.log("  --frontend-port <port>   Set the frontend port (default: " + DEFAULT_FRONTEND_PORT + "). This will host the tools. When developemnt mode is on it cant be changed from 5173");
    console.log("  --channel-port <port>    Set the channel port (default: " + DEFAULT_CHANNEL_PORT + "). This will allow you to access your app");
    console.log("  --development            Will run 'npm run dev' on the frontend project instead of serving the static build. This option will not work outside developement enviroment");
    console.log("  --help                   Show this help message");
}

// Function to parse command-line arguments
function parseArgs() {
    const args = {
        frontendPort: DEFAULT_FRONTEND_PORT,
        channelPort: DEFAULT_CHANNEL_PORT,
        targetHost: "",
        targetPort: 0,
        productionMode: true, // Default to production mode
    };

    // Check if the first argument is provided
    if (Deno.args.length < 1) {
        console.error("Error: Missing required argument <host>:<port>");
        displayHelp();
        Deno.exit(1);
    }

    // Parse the first argument for host and port
    const [host, portStr] = Deno.args[0].split(":");
    if (!host || !portStr) {
        console.error("Error: Invalid format for <host>:<port>");
        displayHelp();
        Deno.exit(1);
    }

    args.targetHost = host;
    args.targetPort = Number(portStr);
    if (isNaN(args.targetPort)) {
        console.error("Error: Port must be a valid number");
        displayHelp();
        Deno.exit(1);
    }

    // Parse additional arguments
    for (let i = 1; i < Deno.args.length; i++) {
        const arg = Deno.args[i];
        switch (arg) {
            case "--frontend-port":
                args.frontendPort = Number(Deno.args[++i]) || DEFAULT_FRONTEND_PORT;
                break;
            case "--channel-port":
                args.channelPort = Number(Deno.args[++i]) || DEFAULT_CHANNEL_PORT;
                break;
            case "--development":
                args.productionMode = false; // Set to development mode
                break;
            case "--help":
                displayHelp();
                Deno.exit(0);
                break;
            default:
                console.error(`Error: Unknown argument ${arg}`);
                displayHelp();
                Deno.exit(1);
        }
    }

    return args;
}

// Parse command-line arguments
const { frontendPort, channelPort, targetPort, targetHost, productionMode } = parseArgs();

// Start services with specified or default ports
start_frontend(frontendPort, productionMode);
create_ws(CLIENT_WS_PORT, RELAY_WS_PORT); // Always use default WebSocket ports
create_channel(channelPort, targetHost, targetPort);
