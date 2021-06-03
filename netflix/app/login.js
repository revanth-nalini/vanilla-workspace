let loginForm = document.getElementById("login-form");
let apiUrl = "https://netflix-carbon-api.herokuapp.com";

const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const existingEmail = urlParams.get('existingEmail');
const registered = urlParams.get('registered');
if(existingEmail) loginForm.email.value = existingEmail;
if(registered) document.getElementById('registered-success').style.display="block";



loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let payload = {
        email: loginForm.email.value,
        password: loginForm.password.value
    }
    fetch(apiUrl+"/login",{
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if(response.ok)
            return response.json();
        else
            throw new Error("Login Error");
    })
    .then((response)=>{
        var errormsg = document.getElementById('login-success');
        if(response.status=='valid'){
            errormsg.style.display= "none";
            localStorage.setItem('token',response.token);
            location.href = "/"
        } else{
            errormsg.style.display= "block";
        }
    })
    .catch(error=>{
        var errormsg = document.getElementById('login-success');
        errormsg.style.display= "block";
    })
});