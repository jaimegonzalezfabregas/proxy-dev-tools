<script lang="ts">
	import { type Request } from "../../data_types/network";
	import { type WSMessage } from "../../data_types/comunications";
	import { type ConsoleLine } from "../../data_types/console";
	import Frame from "./components/tools/Frame.svelte";
	import Modal from "./components/Modal.svelte";

	let state: "waiting_for_socket" | "connected_to_socket" | "socket_error" =
		"waiting_for_socket";

	let requests: Request[] = [];

	let page_html: string = "...";

	let console_lines: ConsoleLine[] = [];

	try {
		let socket = new WebSocket("ws://localhost:8888");
		// Connection opened
		socket.addEventListener("open", (event) => {
			state = "connected_to_socket";
		});

		socket.addEventListener("message", (event) => {
			let data: WSMessage = JSON.parse(event.data);

			switch (data.class) {
				case "network":
					requests[data.request_id] = data.request;
					break;
				case "relay":
					switch (data.msg.code) {
						case "start":
							console_lines = [
								...console_lines,
								{
									type: "reload_marker",
								},
							];
							break;
						case "console log":
							console_lines = [
								...console_lines,
								{
									contents: data.msg.elms,
									type: "log",
									time: new Date(),
								},
							];
							break;
						case "console error":
							console_lines = [
								...console_lines,
								{
									contents: data.msg.elms,
									type: "console error",
									time: new Date(),
								},
							];
							break;
						case "execute error":
							console_lines = [
								...console_lines,
								{
									...data.msg,
									type: "execute error",
									time: new Date(),
								},
							];
							break;
						case "inspector":
							page_html = data.msg.raw_html;
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
	<Frame bind:console_lines bind:requests bind:page_html></Frame>
{/if}
