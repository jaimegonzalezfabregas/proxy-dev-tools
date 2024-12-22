<script lang="ts">
    let window_width: Number = 0;
    let isResizing = false;
    let leftPanelWidth = 700; // Initial width of the left panel

    function startResize(event) {
        isResizing = true;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    }

    function resize(event) {
        if (isResizing) {
            leftPanelWidth = event.clientX; // Update the width based on mouse position
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
</script>

<svelte:window bind:innerWidth={window_width} />

<div class="side2side_container">
    <div class="panel left" style="width: {leftPanelWidth}px;">
        <slot name="left"></slot>
    </div>
    <div class="resizer" on:mousedown={startResize}></div>
    <div class="panel right" style="width: {window_width - leftPanelWidth}px;">
        <slot name="right"></slot>
    </div>
</div>

<style>
    .side2side_container {
        display: flex;
        height: 100vh; /* Full height */
    }

    .panel {
        overflow: auto; /* Allow scrolling if content overflows */
    }

    .resizer {
        min-width: 5px; /* Width of the resizer */
        width: 5px; /* Width of the resizer */
        cursor: ew-resize; /* Change cursor to indicate resizing */
        background: #ccc; /* Color of the resizer */
    }
</style>
