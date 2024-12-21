<script>
</script>

<div class="container">
    <div class="centered-div">
        <slot></slot>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically */
        height: 100vh; /* Full viewport height */
    }

    .centered-div {
        padding: 20px;
        background-color: lightblue;
        border: 1px solid #000;
        text-align: center;
    }
</style>
