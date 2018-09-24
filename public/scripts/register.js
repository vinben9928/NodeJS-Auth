function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    $.post("/register", { email: email, password: password }, function(response) {
        try {
            var data = JSON.parse(response);
            if(data !== null) {
                if(data.success !== undefined && data.success !== null && data.success === true) {
                    alert("Account created successfully!");
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

    request.open("POST", "/register", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };

    request.send("user=" + JSON.stringify(user));*/
}