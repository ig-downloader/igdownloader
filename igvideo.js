const pasteButton = document.querySelector(".search-from_clipboard-paste");

pasteButton.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    document.querySelector(".search-from_input").value += text;
    // console.log("Text pasted.");
  } catch (error) {
    console.log("Failed to read clipboard. Using execCommand instead.");
    document.querySelector(".search-from_input").focus();
    const result = document.execCommand("paste");
    console.log("document.execCommand result: ", result);
  }
});

function toggleButtons() {
  // Hide the first button and show the second button
  let pastebtn = document.querySelector(".search-from_clipboard-paste");
  let clrBtn = document.querySelector(".clipboard-clear");

  // Toggle visibility
  pastebtn.style.display = "none";
  clrBtn.style.display = "block";
}

function clearInputAndToggle() {
  // Clear the input field
  document.querySelector(".search-from_input").value = "";

  // Toggle visibility between pastebtn and clrBtn
  let pastebtn = document.querySelector(".search-from_clipboard-paste");
  let clrBtn = document.querySelector(".clipboard-clear");

  if (pastebtn.style.display !== "none") {
    // Hide pastebtn and show clrBtn
    pastebtn.style.display = "none";
    clrBtn.style.display = "block";
  } else {
    // Hide clrBtn and show pastebtn
    pastebtn.style.display = "flex";
    clrBtn.style.display = "none";
  }
}

// Input, button, and UI elements
const inputData = document.querySelector(".search-from_input");
const subBtn = document.querySelector(".search-from_button");
const loadingtext = document.querySelector(".loading-text");
const videoContainer = document.querySelector(".result-div");
const resultDiv = document.querySelector(".outer-result-div");
const downloadBtn = document.getElementById("download-btn");

// Handle submit click
subBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const amtValue = inputData.value.trim();
  if (!amtValue) {
    alert("Please insert a valid Instagram link");
    return;
  }
  inputData.value = "";

  // Show loading indicator
  loadingtext.style.display = "block";
  resultDiv.style.display = "none";
  videoContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  // ✅ Use your fixed API
  const apiUrl = `https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${encodeURIComponent(
    amtValue
  )}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "86c072f781msh85f14a700e9b2b0p128e2cjsnf2e2ccde710c", //8b08490cf5msh54e1aed9629a6e7p12f444jsn84380ca40c13
      "x-rapidapi-host": "instagram-reels-downloader-api.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Parse JSON
    const result = await response.json();
    // console.log("✅ API JSON Response:", result);

    // Hide loading, show result container
    loadingtext.style.display = "none";
    resultDiv.style.display = "flex";

    // Display video if available
    if (
      result.data.medias[0].url &&
      result.data.medias[0].url.includes("http")
    ) {
      const video = document.createElement("video");
      video.src = result.data.medias[0].url;
      video.controls = true;
      video.width = 320;
      video.height = 600;
      videoContainer.appendChild(video);

      downloadBtn.href = result.data.medias[0].url;
      downloadBtn.download = "instagram_reel.mp4";
      downloadBtn.style.display = "inline-block";
    } else if (data.thumbnail) {
      // If no video, display thumbnail instead
      const img = document.createElement("img");
      img.src = data.thumbnail;
      img.width = 400;
      img.height = 600;
      videoContainer.appendChild(img);

      downloadBtn.href = data.thumbnail;
      downloadBtn.download = "instagram_reel.jpg";
      downloadBtn.style.display = "inline-block";
    } else {
      videoContainer.innerHTML = "<p>No downloadable media found.</p>";
    }
  } catch (err) {
    console.error("❌ Error fetching API:", err);
    loadingtext.style.display = "none";
    resultDiv.style.display = "flex";
    videoContainer.innerHTML = `<p style="color:red;">Failed to fetch data: ${err.message}</p>`;
  }
});
