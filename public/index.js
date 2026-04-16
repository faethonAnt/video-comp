async function checkAuth() {
  try {
    const response = await fetch("http://localhost:3000/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.user) {
      document.getElementById("facebook-login-btn").style.display = "none";
    } else {
      document.getElementById("facebook-login-btn").style.display = "block";
    }
  } catch (err) {
    console.log("something went wrong");
  }
}

function facebookLogin() {
  window.location.href = "http://localhost:3000/auth/facebook";
}

async function loadVideos() {
  try {
    const response = await fetch("http://localhost:3000/video/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    document.getElementById("videos-list").innerHTML = "";
    data.videos.forEach((video) => {
      let thumbnail = video.filePath.replace("public/", "/");
      //TODO add username for the uploader
      document.getElementById("videos-list").innerHTML += `
    <div class="card">
        <video src="${thumbnail}"></video>
        <div class="card-body">
          <h3>${video.title}</h3>
          <p>${video.createdAt}</p>
          <button class="vote-btn" onclick="voteVideo(${video.id})">Vote</button>
        </div>
    </div>
`;
    });
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

async function voteVideo(id) {
  try {
    const response = await fetch(`http://localhost:3000/vote/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      loadVideos();
    }
  } catch (err) {
    console.log("Something went wrong");
  }
}

loadVideos();
checkAuth();

document
  .getElementById("facebook-login-btn")
  .addEventListener("click", facebookLogin);
