document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Get all elements
    const statusSelect = document.getElementById("status");
    const fileWrapper = document.getElementById("file-input-wrapper");
    const causeWrapper = document.getElementById("cause-wrapper");
    const reasonWrapper = document.getElementById("reason-wrapper");

    function checkStatus() {
        const val = statusSelect.value;

        fileWrapper.style.display = "none";
        causeWrapper.style.display = "none";
        reasonWrapper.style.display = "none";

        if (val === "resolvido") {
            fileWrapper.style.display = "flex";
            causeWrapper.style.display = "flex";
        } 
        else if (val === "nao_resolvido") {
            reasonWrapper.style.display = "flex";
        }
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", checkStatus);
        checkStatus();
    }

});