<script lang="ts">
    import { type Request } from "../../../../../data_types/network";
    import RequestDetail from "./network/RequestDetail.svelte";
    import Resizeable from "../UI/Resizeable.svelte";

    export let requests: Request[];

    $: console.log(requests);

    let selected_request: Request | undefined = undefined;
</script>

<Resizeable>
    <div slot="left">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col">Url</th>
                </tr>
            </thead>
            <tbody>
                {#each requests as request, i}
                    <tr on:click={() => (selected_request = request)}>
                        <th scope="row">{i}</th>

                        {#if request}
                            <td>{request.status_code}</td>
                            <td>{request.path}</td>
                        {:else}
                            <td>loading...</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div slot="right">
        {#if selected_request}
            <RequestDetail request={selected_request}></RequestDetail>
        {/if}
    </div>
</Resizeable>
