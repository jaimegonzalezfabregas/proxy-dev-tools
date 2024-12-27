<script lang="ts">
    import NodeDisplay from "./NodeDisplay.svelte";
    export let node;

    let isFolded: boolean = false;

    let auto_highlight: boolean = false;

    $: auto_highlight = node.rawAttrs
        ? node.rawAttrs.includes("proxy_dev_tools_highlight")
        : false;
</script>

{#if node._rawText && node._rawText.trim() != ""}
    <pre class="m-0">{node._rawText.trim()}</pre>
{:else if !node._rawText}
    <nodex class={auto_highlight ? "auto_highlighteable" : ""}>
        {#if node.childNodes.length != 0}
            <pre on:click={() => (isFolded = !isFolded)} class="m-0">{isFolded
                    ? "►"
                    : "▼"} &lt;<x class="tag">{node.rawTagName}</x
                >{node.rawAttrs ? " " + node.rawAttrs : ""}&gt;</pre>
            {#if !isFolded}
                <div class="ms-1 highlighteable">
                    <div class="ms-2">
                        <div class="ms-1">
                            <div class="ms-1">
                                {#each node.childNodes as child}
                                    <NodeDisplay node={child}></NodeDisplay>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="ms-3">
                <pre class="m-0">&lt;<x class="tag">/{node.rawTagName}</x
                    >&gt;</pre>
            </div>
        {:else}
            <pre class="m-0">&lt;<x class="tag">{node.rawTagName}</x
                >{node.rawAttrs ? " " + node.rawAttrs : ""}&gt;&lt;<x
                    class="tag">/{node.rawTagName}</x
                >&gt;</pre>
        {/if}
    </nodex>
{/if}

<style>
    .tag {
        color: blue;
    }

    .auto_highlighteable {
        background-color: rgba(0, 132, 255, 0.2) !important;
    }
    .highlighteable {
        border-left: solid 1px rgba(0, 0, 0, 0.275);
    }
    .highlighteable:hover:not(:has(.highlighteable:hover)) {
        border-left: solid 1px black;
        background-color: rgba(0, 0, 0, 0.04);
    }

    nodex {
        display: block;
    }
</style>
