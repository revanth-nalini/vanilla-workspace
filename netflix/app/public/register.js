let registerForm = document.getElementById("register-form");
let apiUrl = "https://netflix-carbon-api.herokuapp.com";

registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let payload = {
        name: registerForm.name.value,
        email: registerForm.email.value,
        password: registerForm.password.value
    }
    fetch(apiUrl+"/register",{
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
            throw new Error("Register Error");
    })
    .then((response)=>{
        location.href = `/login.html?existingEmail=${payload.email}&registered=true`
    })
    .catch(error=>{
        location.href = `/login.html?existingEmail=${payload.email}`
    })
})