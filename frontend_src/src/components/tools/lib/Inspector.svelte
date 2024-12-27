<script lang="ts">
    import { parse } from "node-html-parser";
    import NodeDisplay from "./inspector/NodeDisplay.svelte";

    export let page_html: string;

    let ast = null;

    $: ast = parse(page_html);
</script>

<!-- <pre>{JSON.stringify(ast)}</pre> -->

<NodeDisplay node={ast}></NodeDisplay>