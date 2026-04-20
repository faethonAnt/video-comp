async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // * THIS MEANS TRUE WHEN WE GET 200
      document.getElementById("login-form").style.display = "none";
      document.getElementById("pending-list").style.display = "block";
      document.getElementById("lottery-draw").style.display = "block";
      loadVideos();
    }
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

// async function loadVideos() {
//   try {
//     const response = await fetch("http://localhost:3000/admin/video", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await response.json();
//     document.getElementById("pending-list").innerHTML = "";
//     data.videos.forEach((video) => {
//       document.getElementById("pending-list").innerHTML += `
//     <div>
//         <p>${video.title}</p>
//         <button onclick="approveVideo(${video.id})">Approve</button>
//         <button onclick="rejectVideo(${video.id})">Reject</button>
//     </div>
// `;
//     });
//   } catch (err) {
//     console.log("Something went wrong", err);
//   }
// }

async function loadVideos() {
  try {
    const response = await fetch("http://localhost:3000/admin/video", {
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
  allVideos.forEach((video) => {
    let thumbnail = video.filePath.replace("public/", "/");
    document.getElementById("pending-list").innerHTML += `
      <div>
          <video src="${thumbnail}"></video>
          <p>${video.title}</p>
          <button onclick="approveVideo(${video.id})">Approve</button>
          <button onclick="rejectVideo(${video.id})">Reject</button>
      </div>
      `;
  });
}

async function approveVideo(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/video/${id}/approve`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (response.ok) {
      const res = await response.json();
      console.log("Success");
      loadVideos();
      return res;
    } else return console.log("Something went wrong");
  } catch (err) {
    console.error(err);
  }
}

async function rejectVideo(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/video/${id}/reject`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (response.ok) {
      const res = await response.json();
      console.log("Success");
      loadVideos();
      return res;
    } else return console.log("Something went wrong");
  } catch (err) {
    console.error(err);
  }
}

async function drawLottery() {
  try {
    const response = await fetch(`http://localhost:3000/admin/lottery/draw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const res = await response.json();
      alert(res.message);
      return res;
    }
  } catch (err) {
    console.error(err);
  }
}
document.getElementById("login-btn").addEventListener("click", login);

document.getElementById("lottery-draw").addEventListener("click", drawLottery);

document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetch("/admin/logout");
  window.location.href = "/admin-panel/";
});
