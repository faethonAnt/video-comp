//list of videos
let allVideos = [];

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
    allVideos = data.videos;
    renderVideos(allVideos);
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

function renderVideos(allVideos) {
  document.getElementById("videos-list").innerHTML = "";
  allVideos.forEach((video) => {
    let thumbnail = video.filePath.replace("public/", "/");
    //TODO add username for the uploader
    document.getElementById("videos-list").innerHTML += `
    <div class="card">
        <video src="${thumbnail}"></video>
        <div class="card-body">
          <h3>${video.title}</h3>
          <p>${video.createdAt}</p>
          <button class="vote-btn" onclick="voteVideo(${video.id})">👍 Vote</button>
        </div>
    </div>
`;
  });
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

function openUploadModal() {
  document.getElementById("upload-modal").style.display = "flex";
}

function closeUploadModal() {
  document.getElementById("upload-modal").style.display = "none";
}

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // no page reload

  const formData = new FormData(e.target);

  const response = await fetch("/video/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();

  if (response.ok) {
    closeUploadModal();
  } else {
    alert(data.message);
  }
});

loadVideos();
checkAuth();

document
  .getElementById("facebook-login-btn")
  .addEventListener("click", facebookLogin);

document
  .getElementById("upload-btn")
  .addEventListener("click", openUploadModal);

document
  .getElementById("cancel-btn")
  .addEventListener("click", closeUploadModal);

// LIST FILTERING
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    //using the data-filter attribute
    const filter = tab.dataset.filter;
    if (filter === "all") {
      renderVideos(allVideos);
    } else if (filter === "week") {
      const top5 = allVideos.slice(0, 5);
      renderVideos(top5);
    } else if (filter === "alltime") {
      const top10 = allVideos.slice(0, 10);
      renderVideos(top10);
    }
  });
});
