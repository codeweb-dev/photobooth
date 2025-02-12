document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("load", () => {
        const overlay = document.getElementById("transition-overlay");
        setTimeout(() => {
        overlay.classList.add("translate-y-full");
        setTimeout(() => {
            overlay.style.display = "none";
        }, 1000);
        }, 3000); // Delay to ensure the overlay is visible first
    });

    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
        e.preventDefault();
        const overlay = document.getElementById("transition-overlay");
        overlay.style.display = "block";
        overlay.classList.remove("translate-y-full");
        setTimeout(() => {
            window.location.href = e.target.href;
        }, 1000);
        });
    });
});