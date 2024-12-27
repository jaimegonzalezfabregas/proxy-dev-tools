<script lang="ts">
    import ObjectDisplay from "./ObjectDisplay.svelte";
    import { onMount } from "svelte";

    export let line: {
        type: "execute error";
        ev: string;
        src: string;
        lineno: string;
        colno: string;
        time: Date;
        error: any;
    };

    let code: string = "";
    let errorLine: number = parseInt(line.lineno);
    let codeVisible: boolean = false;
    let codeFetched: boolean = false;

    async function fetchCode() {
        if (codeVisible) {
            // If code is already visible, hide it
            codeVisible = false;
            return;
        }

        if (!codeFetched) {
            try {
                const response = await fetch(line.src);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                code = await response.text();
                codeFetched = true;
            } catch (error) {
                console.error("Error fetching the code:", error);
            }
        }

        setTimeout(scrollToErrorLine, 1);

        // Toggle visibility of the code
        codeVisible = true;
    }

    function scrollToErrorLine() {
        const lineElement = document.getElementById(`line-${errorLine}`);
        if (lineElement) {
            lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
</script>

<strong>{line.ev}</strong>

<ObjectDisplay obj={line.error}></ObjectDisplay>

<span class="clickable" on:click={fetchCode}>
    (at {line.src}:{line.lineno}:{line.colno})
</span>

{#if codeVisible && codeFetched}
    <div class="code_preview m-3">
        {#each code.split("\n") as line, index}
            <div
                id={`line-${index + 1}`}
                class={index + 1 === errorLine ? "highlight" : ""}
            >
                {line}
            </div>
        {/each}
    </div>
{/if}

<style>
    .highlight {
        background-color: red; /* Highlight color for the error line */
        color: white; /* Text color for better contrast */
    }
    .clickable {
        cursor: pointer;
        color: blue;
        text-decoration: underline;
    }
    .code_preview {
        background-color: #2e2e2e; /* Dark background */
        color: #ffffff; /* White text */
        padding: 10px; /* Padding for better readability */
        border-radius: 5px; /* Rounded corners */
        overflow: auto; /* Scroll if content overflows */
        white-space: pre-wrap; /* Wrap long lines */
        height: 300px; /* Set height for the code preview */
    }
    .code_preview div {
        white-space: pre; /* Preserve whitespace for each line */
    }
</style>
