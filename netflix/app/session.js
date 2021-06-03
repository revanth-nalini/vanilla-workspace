checkIfLoggedIn = () =>{
    const currentToken = localStorage.getItem('token');
    if(currentToken){
        if(location.href.includes("/login.html") || location.href.includes("/register.html")){   // login
            location.href = "/";
        }
    } else{
        if(!location.href.includes("/login.html") && !location.href.includes("/register.html")){    // home page
            location.href = '/login.html'
        }
    }
}

logOut = () =>{
    localStorage.removeItem('token');
    location.href = '/login.html'
}

checkIfLoggedIn();

