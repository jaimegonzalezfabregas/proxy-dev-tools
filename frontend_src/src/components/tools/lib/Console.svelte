<script lang="ts">
    export let console_lines: ConsoleLine[];
    type ConsoleLineGroup =
        | {
              contents: any[];
              time: Date;
              type: "log" | "error";
              action: undefined;
              repetitions: Date[];
          }
        | {
              type: "reload_marker";
              index: number;
          };
    import { type ConsoleLine } from "./Console";

    $: if (console_lines[0] && console_lines[0].type == "reload_marker") {
        console_lines = console_lines.splice(1);
    }

    let collapsed_console_lines: ConsoleLineGroup[] = [];

    $: collapsed_console_lines = (() => {
        const result: ConsoleLineGroup[] = [];
        for (let i = 0; i < console_lines.length; i++) {
            const currentLine = console_lines[i];

            // If the result array is empty or the current line is different from the last one

            const last_line = result[i - 1];
            if (currentLine.type == "reload_marker") {
                result.push({ type: "reload_marker", index: i });
            } else if (
                result.length === 0 ||
                JSON.stringify(currentLine.contents) !==
                    JSON.stringify(last_line.contents)
            ) {
                // Add the current line to the result with a repetition count of 1
                result.push({
                    ...currentLine,
                    repetitions: [currentLine.time],
                });
            } else {
                // If it's the same as the last one, increment the repetition count
                result[result.length - 1].repetitions.push(currentLine.time);
                result[result.length - 1].time = currentLine.time;
            }
        }
        console.log(result);

        return result;
    })();
</script>

{#each collapsed_console_lines as line, i}
    {#if line.type == "reload_marker"}
        <div class="separator">
            <div class="d-flex justify-content-center">
                <div>
                    page reloaded
                    <a
                        on:click={() => {
                            console.log(line.index);
                            console_lines = console_lines.splice(line.index);
                        }}
                    >
                        remove older logs
                    </a>
                </div>
            </div>
        </div>
    {:else}
        <div class="line">
            <div class="float-end time px-2">
                {#if line.repetitions.length != 1}
                    (x{line.repetitions.length})
                {/if}
                {line.time.toLocaleTimeString()}
            </div>

            {#each line.contents as word}
                {JSON.stringify(word)}
            {/each}
        </div>
    {/if}
{:else}
    <div class="d-flex justify-content-center">
        <div class="p-3 grey-text">No se han emitido logs</div>
    </div>
{/each}

<style>
    .repetition_count {
        height: 100%;
    }
    .grey-text {
        color: grey;
    }
    .time {
        top: 0;
        position: relative;
    }
    .line {
        font:
            1rem Inconsolata,
            monospace;
        padding-left: 30px;
        border-bottom: solid 1px grey;
    }

    .separator {
        border-bottom: solid 1px grey;
        background-color: rgb(221, 220, 220);
    }
</style>
