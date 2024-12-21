<script lang="ts">
	import { type Request } from "../../data_types/network";
	import { type WSMessage } from "../../data_types/comunications";
	import { type ConsoleLine } from "../../data_types/console";
	import Frame from "./components/tools/Frame.svelte";
	import Modal from "./components/Modal.svelte";

	let state: "waiting_for_socket" | "connected_to_socket" | "socket_error" =
		"waiting_for_socket";

	let requests: Request[] = [];

	let console_lines: ConsoleLine[] = [];

	try {
		let socket = new WebSocket("ws://localhost:8888");
		// Connection opened
		socket.addEventListener("open", (event) => {
			state = "connected_to_socket";
		});

		socket.addEventListener("message", (event) => {
			let data: WSMessage = JSON.parse(event.data);
			console.log("recieved data from socket", data);

			switch (data.class) {
				case "network":
					requests[data.request_id] = data.request;
					break;
				case "relay":
					console.log("relay case", data.msg.code);

					switch (data.msg.code) {
						case "start":
							console_lines.push({
								type: "reload_marker",
							});
							console_lines = console_lines;
							break;
						case "console log":
							console_lines.push({
								contents: data.msg.elms,
								type: "log",
								time: new Date(),
								action: undefined,
							});
							console_lines = console_lines;
							break;
						case "console error":
							console_lines.push({
								contents: data.msg.elms,
								type: "error",
								time: new Date(),
								action: undefined,
							});
							console_lines = console_lines;
							break;
						case "execute error":
							console_lines.push({
								contents: [data.msg.error],
								type: "error",
								time: new Date(),
								action: undefined,
							});
							console_lines = console_lines;

							break;
					}
			}
		});
	} catch (error) {
		state = "socket_error";
	}

	// Listen for messages
</script>

{#if state == "waiting_for_socket"}
	<Modal>Connecting to backend...</Modal>
{:else if state == "socket_error"}
	<Modal>Connection error</Modal>
{:else if state == "connected_to_socket"}
	<Frame bind:console_lines bind:requests></Frame>
{/if}
