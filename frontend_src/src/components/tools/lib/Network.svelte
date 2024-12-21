<script lang="ts">
    import { type Request } from "../../../../../data_types/network";
    import RequestDetail from "./RequestDetail.svelte";
    import Resizeable from "../UI/Resizeable.svelte";

    export let requests: Request[];

    let selected_request: Request | undefined = undefined;
</script>

<Resizeable>
    <div slot="left">
        {#each requests as request}
            <button on:click={() => (selected_request = request)}>
                {request.status_code}
                {request.path}
            </button>
        {/each}
    </div>
    <div slot="right">
        {#if selected_request}
            <RequestDetail request={selected_request}></RequestDetail>
        {/if}
    </div>
</Resizeable>
