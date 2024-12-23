<script lang="ts">
    import type { HTTPMessage } from "../../../../../../data_types/network";

    export let HTTPmessage: HTTPMessage;

    // Function to convert binary data to hex
    function toHexDump(data: Uint8Array): string {
        return Array.from(data)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join(" ");
    }

    // Determine the content type
    const contentType = HTTPmessage.headers["Content-Type"] || "";
    const isText = contentType.startsWith("text/");
    const isImage = contentType.startsWith("image/");
    const isBinary = !isText && !isImage;

    // Convert body to Uint8Array if it's binary
    let bodyContent;
    if (isBinary && HTTPmessage.body instanceof ArrayBuffer) {
        bodyContent = toHexDump(new Uint8Array(HTTPmessage.body));
    } else {
        bodyContent = HTTPmessage.body;
    }
</script>

{#if HTTPmessage.body}
    {#if isText}
        <div class="m-2 p-2 text">
            {bodyContent}
        </div>
    {:else if isImage}
        <img
            src={URL.createObjectURL(new Blob([HTTPmessage.body]))}
            alt="Image content"
        />
    {:else if isBinary}
        <pre class="m-2 p-2 text">{bodyContent}</pre>
    {/if}
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
