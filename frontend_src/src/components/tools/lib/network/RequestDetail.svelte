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
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true">Headers</button
            >
        </li>
        {#if client.body != ""}
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false">Request</button
                >
            </li>
        {/if}

        {#if server}
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#contact"
                    type="button"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false">Response</button
                >
            </li>
        {/if}
    </ul>
    <div class="tab-content p-2" id="myTabContent">
        <div
            class="tab-pane fade show active"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
        >
            <h1>Client</h1>

            <HeaderDetail HTTPmessage={client}></HeaderDetail>
            <h1>Server</h1>
            {#if server}
                <HeaderDetail HTTPmessage={server}></HeaderDetail>
            {:else}
                Pending...
            {/if}
        </div>
        {#if client.body != ""}
            <div
                class="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
            >
                <BodyDetail HTTPmessage={client}></BodyDetail>
            </div>
        {/if}

        {#if server}
            <div
                class="tab-pane fade"
                id="contact"
                role="tabpanel"
                aria-labelledby="contact-tab"
            >
                <BodyDetail HTTPmessage={server}></BodyDetail>
            </div>
        {/if}
    </div>
</div>
