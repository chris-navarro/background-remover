const imageInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");
const resultImage = document.getElementById("resultImage");
const downloadLink = document.getElementById("downloadLink");
const loadingStatus = document.getElementById("loadingStatus");

removeBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please select an image file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // 1. Show loader, disable button, hide previous results
  loadingStatus.style.display = "flex";
  removeBtn.disabled = true;
  removeBtn.innerText = "Processing...";
  resultImage.src = "";
  downloadLink.style.display = "none";

  try {
    const response = await fetch("http://127.0.0.1:8000/remove-bg", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned status code ${response.status}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // 2. Display the final results
    resultImage.src = imageUrl;
    downloadLink.href = imageUrl;
    downloadLink.style.display = "block"; // Changed to block for proper right-alignment
    
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing your image.");
  } finally {
    // 3. Always hide the loader and restore the button state
    loadingStatus.style.display = "none";
    removeBtn.disabled = false;
    removeBtn.innerText = "Remove Background";
  }
});