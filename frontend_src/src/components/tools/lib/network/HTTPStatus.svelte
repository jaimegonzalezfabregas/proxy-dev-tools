<script lang="ts">
    export let status_code: number;

    // Function to determine the badge class based on the status code
    function getBadgeClass(code: number): string {
        if (code >= 200 && code < 300) {
            return "bg-success"; // Success
        } else if (code >= 300 && code < 400) {
            return "bg-info"; // Redirection
        } else if (code >= 400 && code < 500) {
            return "bg-warning text-dark"; // Client Error
        } else if (code >= 500) {
            return "bg-danger"; // Server Error
        } else {
            return "bg-secondary"; // Other or unknown status
        }
    }
</script>

<span class="badge {getBadgeClass(status_code)}">{status_code}</span>
