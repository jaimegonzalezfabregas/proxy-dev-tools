<script lang="ts">
    import { type Request } from "../../../data_types/network";
    import RequestDetail from "./RequestDetail.svelte";
    import Resizeable from "./UI/Resizeable.svelte";

    export let requests: Request[];

    $: console.log(requests);

    let selected_request: Request | undefined = undefined;
</script>

<Resizeable>
    <div slot="left">
        {#each requests as request}
            <div on:click={() => (selected_request = request)}>
                {request.status_code}
                {request.path}
            </div>
        {/each}
    </div>
    <div slot="right">
        <RequestDetail request={selected_request}></RequestDetail>
    </div>
</Resizeable>
