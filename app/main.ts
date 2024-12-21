import { create_channel } from "./proxy.ts";
import { create_ws } from "./ws.ts";
import { start_frontend } from "./frontend.ts";


start_frontend(8080);
create_ws(8888, 8889);
create_channel(5501, "localhost", 5500);