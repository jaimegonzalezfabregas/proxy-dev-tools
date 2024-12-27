<script lang="ts">
    import NodeDisplay from "./NodeDisplay.svelte";
    export let node;

    let isFolded: boolean = false;

    let auto_highlight = node.rawAttrs
        ? node.rawAttrs.includes('proxy_dev_tools_highlight="true"')
        : false;
</script>

{#if node._rawText && node._rawText.trim() != ""}
    <pre class="m-0">{node._rawText.trim()}</pre>
{:else if !node._rawText}
    {#if node.childNodes.length != 0}
        <pre on:click={() => (isFolded = !isFolded)} class="m-0">{isFolded
                ? "►"
                : "▼"} &lt;<x class="tag">{node.rawTagName}</x>{node.rawAttrs
                ? " " + node.rawAttrs
                : ""}&gt;</pre>
        <div
            class="ms-1 highlighteable {auto_highlight
                ? 'auto_highlighteable'
                : ''}"
        >
            <div class="ms-2">
                <div class="ms-1">
                    {#if !isFolded}
                        <div class="ms-1">
                            {#each node.childNodes as child}
                                <NodeDisplay node={child}></NodeDisplay>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="ms-3">
            <pre class="m-0">&lt;<x class="tag">/{node.rawTagName}</x>&gt;</pre>
        </div>
    {:else}
        <pre class="m-0">&lt;<x class="tag">{node.rawTagName}</x>{node.rawAttrs
                ? " " + node.rawAttrs
                : ""}&gt;&lt;<x class="tag">/{node.rawTagName}</x>&gt;</pre>
    {/if}
{/if}

<style>
    .tag {
        color: blue;
    }

    .auto_highlighteable {
        background-color: rgba(0, 132, 255, 0.1);
    }
    .highlighteable {
        border-left: solid 1px rgba(0, 0, 0, 0.275);
    }
    .highlighteable:hover:not(:has(.highlighteable:hover)) {
        border-left: solid 1px black;
        background-color: rgba(0, 0, 0, 0.04);
    }

    .auto_highlighteable:hover:not(:has(.auto_highlighteable:hover)) {
        border-left: solid 1px black;
        background-color: rgba(0, 132, 255, 0.3);
    }
</style>
