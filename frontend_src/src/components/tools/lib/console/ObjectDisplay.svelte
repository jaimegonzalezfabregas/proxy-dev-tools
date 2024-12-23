<script lang="ts">
    import ObjectDisplay from "./ObjectDisplay.svelte";
    export let obj: any;

    let isFolded: boolean = true;
</script>

{#if obj}
    {#if typeof obj === "string"}
        <span>"{obj}"</span>
    {:else if typeof obj === "number"}
        <span class="number">{obj}</span>
    {:else if typeof obj === "boolean"}
        <span class="bool">{obj ? "true" : "false"}</span>
    {:else if Array.isArray(obj)}
        <div on:click={() => (isFolded = !isFolded)} class="array">
            {isFolded ? "►" : "▼"} Array ({obj.length})
        </div>
        {#if !isFolded}
            <span>[</span>
            {#each obj as item}
                <div style="margin-left: 30px">
                    {#if item}
                        <ObjectDisplay obj={item} />
                    {:else}
                        &ltElemento vacío&gt
                    {/if}
                    ,
                </div>
            {/each}
            <span>]</span>
        {/if}
    {:else if obj && typeof obj === "object"}
        <div on:click={() => (isFolded = !isFolded)} class="object">
            {isFolded ? "►" : "▼"} Object
        </div>
        {#if !isFolded}
            &lbrace;
            <div style="padding-left: 20px;">
                {#each Object.entries(obj) as [key, value]}
                    <div>
                        <strong>{key}:</strong>
                        <ObjectDisplay obj={value} />
                    </div>
                {/each}
            </div>
            &rbrace;
        {/if}
    {:else if obj === null}
        <span class="null">null</span>
    {:else}
        <span class="undefined">undefined</span>
    {/if}
{/if}

<style>
    h2 {
        font-family: monospace;
        color: #333;
    }
    pre {
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        padding: 10px;
        font-family: monospace;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    span {
        cursor: default;
    }

    .number {
        color: rgb(63, 160, 34);
    }
    .bool {
        color: rgb(40, 55, 187);
    }
    .null {
        color: rgb(187, 40, 143);
    }
    .undefined {
        color: rgb(40, 140, 187);
    }
    .array {
        color: rgb(211, 25, 25);
        cursor: pointer;
        display: inline;
    }
    .object {
        color: darkviolet;
        cursor: pointer;
        display: inline;
    }
</style>
