<script lang="ts">
    import Console from "./lib/Console.svelte";
    import Inspector from "./lib/Inspector.svelte";
    import Network from "./lib/Network.svelte";

    import { type Request } from "../../../../data_types/network";
    import { type ConsoleLine } from "./lib/Console.svelte";

    export let console_lines: ConsoleLine[];
    export let requests: Request[];
    export let page_html: string;
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
    <div class="tab-content contents" id="nav-tabContent">
        <div
            class="tab-pane fade show active"
            id="nav-inspector"
            role="tabpanel"
            aria-labelledby="nav-inspector-tab"
        >
            <Inspector bind:page_html ></Inspector>
        </div>
        <div
            class="tab-pane fade"
            id="nav-console"
            role="tabpanel"
            aria-labelledby="nav-console-tab"
        >
            <Console bind:console_lines></Console>
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

<style>
    .nav-tabs {
        height: 7vh;
    }
    .contents{
        height: 93vh;
        background-color: #eeeeee;
        overflow: auto;
    }
</style>
