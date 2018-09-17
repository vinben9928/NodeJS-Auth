function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = { email: email, password: password };
    const request = new XMLHttpRequest();

    request.open("POST", "/register", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    request.send("user=" + JSON.stringify(user));
}