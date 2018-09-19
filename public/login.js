function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    $.post("/login", { email: email, password: password }, function(response) {
        try {
            var data = JSON.parse(response);
            if(data !== null) {
                if(data.access_token !== undefined && data.access_token !== null) {
                    window.localStorage.setItem("node_jwt_token_webb", data.access_token.toString());
                    alert("Login successful!");
                }
                else if(data.error !== undefined && data.error !== null) {
                    alert("ERROR:\n" + data.error.toString());
                }
                else {
                    alert("ERROR:\nBad response!");
                }
            }
            else {
                alert("ERROR:\nBad response!");
            }
        }
        catch (error) {
            alert("ERROR:\n" + error.toString());
        }
    });

    /*const user = { email: email, password: password };
    const request = new XMLHttpRequest();

    request.open("POST", "/login", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };

    request.send("user=" + JSON.stringify(user));*/
}