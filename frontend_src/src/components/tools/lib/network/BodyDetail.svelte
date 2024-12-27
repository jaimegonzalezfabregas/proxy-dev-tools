<script lang="ts">
    import type { HTTPMessage } from "../../../../../../data_types/network";

    export let HTTPmessage: HTTPMessage;
</script>

{#if HTTPmessage.body}
    <pre class="m-2 p-2 text">{HTTPmessage.body}</pre>
{/if}

<style>
    .text {
        font:
            1rem Inconsolata,
            monospace;
        color: white;
        background-color: rgb(25, 35, 49);
    }
</style>
