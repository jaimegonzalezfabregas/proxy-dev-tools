<script lang="ts">
    import type { Request } from "../../../../../../data_types/network";
    import BodyDetail from "./BodyDetail.svelte";
    import HeaderDetail from "./HeaderDetail.svelte";
    import HttpStatus from "./HTTPStatus.svelte";

    export let request: Request;

    let client = request.client;
    $: client = request.client;
    let server = request.server;
    $: server = request.server;
</script>

<div class="m-1 mt-3">
    <HttpStatus status_code={request.status_code}></HttpStatus>
    <span class="px-3">{request.path}</span>
    <hr />

    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button
                class="nav-link active"
                id="headers-tab"
                data-bs-toggle="tab"
                data-bs-target="#headers"
                type="button"
                role="tab"
                aria-controls="headers"
                aria-selected="true">Headers</button
            >
        </li>
        {#if client.body != ""}
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="request-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#request"
                    type="button"
                    role="tab"
                    aria-controls="request"
                    aria-selected="false">Request</button
                >
            </li>
        {/if}

        {#if server}
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="response-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#response"
                    type="button"
                    role="tab"
                    aria-controls="response"
                    aria-selected="false">Response</button
                >
            </li>
        {/if}
    </ul>
    <div class="tab-content p-2" id="myTabContent">
        <div
            class="tab-pane fade show active"
            id="headers"
            role="tabpanel"
            aria-labelledby="headers-tab"
        >
            <h1>Client</h1>

            <HeaderDetail bind:HTTPmessage={client}></HeaderDetail>
            <h1>Server</h1>
            {#if server}
                <HeaderDetail bind:HTTPmessage={server}></HeaderDetail>
            {:else}
                Pending...
            {/if}
        </div>
        {#if client.body != ""}
            <div
                class="tab-pane fade"
                id="request"
                role="tabpanel"
                aria-labelledby="request-tab"
            >
                <BodyDetail bind:HTTPmessage={client}></BodyDetail>
            </div>
        {/if}

        {#if server}
            <div
                class="tab-pane fade"
                id="response"
                role="tabpanel"
                aria-labelledby="response-tab"
            >
                <BodyDetail bind:HTTPmessage={server}></BodyDetail>
            </div>
        {/if}
    </div>
</div>
