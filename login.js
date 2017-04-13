var user = "?";

$( document ).ready(function() {
        $("#select").hide();
        $("#sign").click(function() {
                request("auth.json", hAuth, hErr);
        });

});

function request (uri, hdone, herr) {
        var req = $.ajax({
                type  : "GET",
                url   : uri,
                cache : false
        });
        req.done(hdone);
        req.fail(herr);
}

function hAuth (data) {
        if(isValidAuth(data)) {
                $("#login").hide();
                sociosUI(data);
        } else {
                alert("Bad Auth Try Again!")
        }
}

function isValidAuth(data) {
        var email = $( "#inputEmail" ).val();
        var password = $( "#inputPassword" ).val();

        for (var i = 0 ; i < data.length ; i++) {
                if (email == data[i].email && password == data[i].password) {
                        user = data[i];
                        return true;
                }
        }
        return false;
}

function hErr(jqXHR, textFail) {
        console.log("ERROR : " + jqXHR.responseText);
}
