document.addEventListener("DOMContentLoaded", () => {
  // Transition overlay
  const overlay = document.getElementById("transition-overlay");
  setTimeout(() => {
    overlay.classList.add("translate-y-full");
    setTimeout(() => (overlay.style.display = "none"), 1000);
  }, 3000);

  // Load selected photos
  const photoStrip = document.querySelector(".photo-strip");
  const selectedPhotos = JSON.parse(localStorage.getItem("selectedPhotos")) || [];
  selectedPhotos.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("w-full", "h-[150px]", "bg-cover", "bg-center");
    photoStrip.appendChild(img);
  });

  // Background selection logic
  const photoSave = document.querySelector(".photo-save");
  const backgroundOptions = document.querySelectorAll(".grid div");

  backgroundOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove selection from all images
      backgroundOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selection border & checkmark
      option.classList.add("selected");

      // Apply new background (remove default if any)
      photoSave.style.backgroundImage = option.style.backgroundImage || "none";
    });
  });

  // Adjust border radius
  document.getElementById("border-radius").addEventListener("input", (e) => {
    const borderRadius = e.target.value + "px";
    photoStrip.querySelectorAll("img").forEach((img) => (img.style.borderRadius = borderRadius));
  });

  // Save photo strip as image
  document.querySelector(".save-photo-strip-btn").addEventListener("click", () => {
    html2canvas(document.querySelector(".photo-save"), { useCORS: true, scale: window.devicePixelRatio }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "photo-strip.png";
      link.click();

      // Show modal and confetti
      const modal = document.getElementById("save-modal");
      modal.classList.remove("hidden");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  });

  // Home button logic
  document.querySelector(".home-btn").addEventListener("click", () => {
    window.location.href = "index.html"; // Redirect to home page
  });

  // Step navigation
  const steps = document.querySelectorAll(".step");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => (step.style.display = i === index ? "block" : "none"));
  }

  document.querySelector(".next-btn").addEventListener("click", () => {
    if (currentStep < steps.length - 1) showStep(++currentStep);
  });

  document.querySelector(".back-btn").addEventListener("click", () => {
    if (currentStep > 0) showStep(--currentStep);
  });

  showStep(currentStep); // Initialize step view
});
