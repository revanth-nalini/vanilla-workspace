window.onload = () => {
    fetchOriginals();
    fetchTrending();
    fetchTopRated();
    fetchGenre();
    // getWishList();
}


function getWishList (){
    fetch("http://localhost:3000/wishlist",{
        headers : {
            Authorization:`${localStorage.getItem(token)}`
        }
    })
    .then(response =>{
        if(response.ok)
            return response.json();
        else 
            throw new Error("WishList cannot be fetched")
    })
    .then(data=>{
        console.log(data);
    })
    .catch((error)=>{
        console.log(error)
    })
}

function fetchGenre(){
    var url = "https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";
    fetch(url)
    .then((response)=>{
        if(response.ok){
            return response.json();
        } else{
            throw new Error(response.statusText);
        }
    })
    .then((data)=>{
        showMovieGenre(data);
    })
    .catch((error)=>{
        console.log(error);
    });
}

function showMovieGenre(genres){
    genres.genres.forEach(  
        function(genre){  
            var movies = fetchGenreMovie(genre.id);
            movies.then(
                function(movies){
                    showGenreMovie(genre.name,movies);
                }
            )
            .catch(
                function(error){
                    console.log(error.statusText);
                }
            )
        }
    )
}

function fetchGenreMovie(genreId){
    var url = "https://api.themoviedb.org/3/discover/movie?";
    url +=  "api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
    url += `&with_genres=${genreId}`;
    return fetch(url)
    .then((response)=>{
        if(response.ok){
            return response.json();
        } else{
            throw new Error(response.statusText);
        }
    });
}

function showGenreMovie(genreName,movies){
    let allMovies = document.querySelector('.movies');
    let genreElement = document.createElement('div');
    genreElement.classList.add('movies-header');
    genreElement.innerHTML = `<h2>${genreName}</h2>`;
    let movieElement = document.createElement('div');
    movieElement.classList.add('movies-list');
    movieElement.setAttribute('id',genreName);
    for(var movie of movies.results){
        var imgElement = document.createElement('img');
        imgElement.setAttribute('data-id',movie.id);
        imgElement.src = `https://image.tmdb.org/t/p/original${movie["backdrop_path"]}`;
        imgElement.addEventListener('click',(e)=>{
            handleMovieSelection(e);
        });
        movieElement.appendChild(imgElement);
    }
    allMovies.appendChild(genreElement);
    allMovies.appendChild(movieElement);
}

function setPoster(url){
    fetch(url)
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error(response.statusText);
        }
    })
    .then((movies)=>{
        let posterElement = document.querySelector('.featured');
        let posterTitle = document.querySelector('#featured-title');
        let posterDescription = document.querySelector('.featured-desc');
        let randomNo = Math.floor(Math.random()*(Object.keys(movies.results).length-1));
        let posterPath = `https://image.tmdb.org/t/p/original${movies.results[randomNo].backdrop_path}`;
        posterElement.style.backgroundImage = `url(${posterPath})`;
        posterTitle.innerHTML = movies.results[randomNo].name;
        posterDescription.innerHTML=movies.results[randomNo].overview;
    })
    .catch((error)=>{
        console.log(error);
    })
}



function fetchOriginals(){
    var url = "https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
    fecthMovies(url,'.originals-list','poster_path');
    setPoster(url);
}

function fetchTrending(){
    var url = "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
    fecthMovies(url,'#trending','backdrop_path');
}

function fetchTopRated(){
    var url = "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
    fecthMovies(url,'#top_rated','backdrop_path');
}

function fecthMovies(url,element_selector,path_type){
    fetch(url)
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error(response.statusText);
        }
    })
    .then((data)=>{
        showMovies(data,element_selector,path_type);
    })
    .catch((error)=>{
        console.log(error);
    })
}


const setTrailers = (trailers) =>{
    const iframe = document.getElementById('movieTrailer');
    const movieNotFound = document.querySelector('.movieNotFound');
    if(trailers.length>0){
        movieNotFound.classList.add('d-none');
        iframe.classList.remove('d-none');
        iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
    }
    else{
        movieNotFound.classList.remove('d-none');
        iframe.classList.add('d-none')
    }
}

const handleMovieSelection = (e) => {
    const id = e.target.getAttribute('data-id');
    getMovieTrailer(id).then((data)=>{
        const results = data.results;
        const trailers = results.filter((result)=>{
            if(result.site=="YouTube" && result.type=="Trailer"){
                return true;
            } else{
                return false;
            }
        })
        setTrailers(trailers);
    });
    $('#trailerModal').modal('show');
}

async function getMovieTrailer(id){
    var url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
    return await fetch(url)
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error(response.statusText);
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}

function showMovies(movies,element_selector,path_type){
    var originalsList = document.querySelector(element_selector);
    for(var movie of movies.results){
        var imgElement = document.createElement('img');
        imgElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;
        imgElement.setAttribute('data-id',movie.id);
        imgElement.addEventListener('click',handleMovieSelection);
        originalsList.appendChild(imgElement);
        // var image = `<img src="https://image.tmdb.org/t/p/original${movie[path_type]}"></img>`
        // originalsList.innerHTML += image;
    }
}