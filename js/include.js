document.addEventListener("DOMContentLoaded", () => {
    fetch("components/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        })
        .catch(error => console.error("Header load error:", error));
});

