document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Get all elements
    const statusSelect = document.getElementById("status");
    const fileWrapper = document.getElementById("file-input-wrapper");
    const causeWrapper = document.getElementById("cause-wrapper");
    const reasonWrapper = document.getElementById("reason-wrapper");

    function checkStatus() {
        const val = statusSelect.value;

        // 2. Reset everything to hidden first (Clean slate)
        fileWrapper.style.display = "none";
        causeWrapper.style.display = "none";
        reasonWrapper.style.display = "none";

        // 3. Apply logic based on selection
        if (val === "resolvido") {
            fileWrapper.style.display = "flex";  // Show File
            causeWrapper.style.display = "flex"; // Show Cause
        } 
        else if (val === "nao_resolvido") {
            reasonWrapper.style.display = "flex"; // Show Reason
        }
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", checkStatus);
        checkStatus(); // Check immediately on load
    }

});