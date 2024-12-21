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

let inputData = document.querySelector(".search-from_input");

// console.log(inputData);

let subBtn = document.querySelector(".search-from_button");
const loadingtext = document.querySelector(".loading-text");

subBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  var amtValue = inputData.value;
  if (amtValue === null) {
    alert("please insert correct link");
  }
  // console.log(amtValue);

  loadingtext.style.display = "block";

  const apiUrl = `https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info-rapidapi?url=${encodeURIComponent(
    amtValue
  )}`;

  const videoContainer = document.querySelector(".result-div");
  const resultDiv = document.querySelector(".outer-result-div");
  const downloadBtn = document.getElementById("download-btn");

  const data = null;

  resultDiv.style.display = "none";

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      resultDiv.style.display = "flex";
      loadingtext.style.display = "none";

      // Parse the JSON response
      const result = JSON.parse(this.responseText);
      // console.log(result);

      // Check if the response contains a video URL
      if (result && result.download_url) {
        // Clear previous content
        videoContainer.innerHTML = "";

        // Create a video element and set its source
        const videoElement = document.createElement("video");
        videoElement.setAttribute("controls", true);
        videoElement.setAttribute("width", "320");
        videoElement.setAttribute("height", "600");

        const videoSource = document.createElement("source");
        videoSource.setAttribute("src", result.download_url);
        videoSource.setAttribute("type", "video/mp4");

        videoElement.appendChild(videoSource);
        videoContainer.appendChild(videoElement);

        downloadBtn.href = result.download_url;
        downloadBtn.download = "igdownloader.mp4"; // Set the video URL to the download link
        downloadBtn.style.display = "inline-block";
      } else if (result && result.thumb) {
        loadingtext.style.display = "none";
        // If a video is not available, show the image instead
        // videoContainer.innerHTML = `<img src="${result.thumb}" alt="Instagram Image" width="640">`;

        const imgElement = document.createElement("img");
        imgElement.setAttribute("width", "400");
        imgElement.setAttribute("height", "600");
        imgElement.setAttribute("src", result.thumb);

        // const videoSource = document.createElement('source');
        // videoSource.setAttribute('src', result.video_url);
        // videoSource.setAttribute('type', 'video/mp4');

        videoContainer.appendChild(imgElement);

        downloadBtn.href = result.thumb;
        downloadBtn.download = "igdownloader.jpg"; // Set the video URL to the download link
        downloadBtn.style.display = "inline-block";
      } else {
        // If no video or image URL is found
        videoContainer.innerHTML =
          "<p>No video or image found for the provided URL.</p>";
      }
    }
  });

  // Set the required headers for RapidAPI
  xhr.open("GET", apiUrl);
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "2fb2b77548mshd30adc954a5b093p124718jsn1df3a6f03413"
  );
  xhr.setRequestHeader(
    "x-rapidapi-host",
    "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com"
  );

  // Send the request
  xhr.send(data);
});
