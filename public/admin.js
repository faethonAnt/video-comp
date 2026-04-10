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
    }
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

document.getElementById("login-btn").addEventListener("click", login);
