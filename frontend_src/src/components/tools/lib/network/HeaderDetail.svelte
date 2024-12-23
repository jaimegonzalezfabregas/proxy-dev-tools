<script lang="ts">
    import type { HTTPMessage } from "../../../../../../data_types/network";
    export let HTTPmessage: HTTPMessage;
</script>


<table class="table">
    <thead>
        <tr>
            <th>Key</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries(HTTPmessage.headers) as [key, value]}
            <tr>
                <td>{key}</td>
                <td>{value}</td>
            </tr>
        {/each}
    </tbody>
</table>
