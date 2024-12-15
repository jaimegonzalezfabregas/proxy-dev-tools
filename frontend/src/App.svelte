<script lang="ts">
	import Console from "./lib/Console.svelte";
	import Inspector from "./lib/Inspector.svelte";
	import Network from "./lib/Network.svelte";
	import { type Request } from "../../data_types/network";
	import { type WSMessage } from "../../data_types/comunications";

	const socket = new WebSocket("ws://localhost:8888");
	// Connection opened
	socket.addEventListener("open", (event) => {
		// socket.send("Hello Server!");
	});

	let requests: Request[] = [];

	// Listen for messages
	socket.addEventListener("message", (event) => {
		let data: WSMessage = JSON.parse(event.data);
		console.log(data);

		switch (data.class) {
			case "network":
				requests[data.request_id] = data.request;
		}
	});
</script>

<main>
	<nav>
		<div class="nav nav-tabs" id="nav-tab" role="tablist">
			<button
				class="nav-link active"
				id="nav-inspector-tab"
				data-bs-toggle="tab"
				data-bs-target="#nav-inspector"
				type="button"
				role="tab"
				aria-controls="nav-inspector"
				aria-selected="true">Inspect</button
			>
			<button
				class="nav-link"
				id="nav-console-tab"
				data-bs-toggle="tab"
				data-bs-target="#nav-console"
				type="button"
				role="tab"
				aria-controls="nav-console"
				aria-selected="false">Console</button
			>
			<button
				class="nav-link"
				id="nav-network-tab"
				data-bs-toggle="tab"
				data-bs-target="#nav-network"
				type="button"
				role="tab"
				aria-controls="nav-network"
				aria-selected="false">Network</button
			>
		</div>
	</nav>
	<div class="tab-content" id="nav-tabContent">
		<div
			class="tab-pane fade show active"
			id="nav-inspector"
			role="tabpanel"
			aria-labelledby="nav-inspector-tab"
		>
			<Inspector></Inspector>
		</div>
		<div
			class="tab-pane fade"
			id="nav-console"
			role="tabpanel"
			aria-labelledby="nav-console-tab"
		>
			<Console></Console>
		</div>
		<div
			class="tab-pane fade"
			id="nav-network"
			role="tabpanel"
			aria-labelledby="nav-network-tab"
		>
			<Network bind:requests></Network>
		</div>
	</div>
</main>
