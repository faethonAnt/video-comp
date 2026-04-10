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

async function loadVideos() {
  try {
    const response = await fetch("http://localhost:3000/admin/video", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    data.videos.forEach((video) => {
      document.getElementById("pending-list").innerHTML += `
    <div>
        <p>${video.title}</p>
        <button onclick="approveVideo(${video.id})">Approve</button>
        <button onclick="rejectVideo(${video.id})">Reject</button>
    </div>
`;
    });
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

async function approveVideo(id, data) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/video/${id}/approve`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (response.ok) {
      const res = await response.json();
      console.log("Success");
      return res;
    } else return res.status(500).json({ message: "somwthing weent wrong" });
  } catch (err) {
    console.error(err);
  }
}

async function rejectVideo(id, data) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/video/${id}/reject`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (response.ok) {
      const res = await response.json();
      console.log("Success");

      return res;
    } else return res.status(500).json({ message: "somwthing weent wrong" });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("login-btn").addEventListener("click", login);
