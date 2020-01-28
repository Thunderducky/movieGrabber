const mysql = require("mysql");
const inquirer = require("inquirer");
const axios = require("axios");
const chalk = require("chalk");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "dbpassword",
  database: "movieGrabberDB"
});
connection.connect(err => {
    if(err){ console.log(error)}
    else {
        movieGrabber();
    }
})
async function movieGrabber(){
    try {
        const userSearch = await askTheUserForAMovie();
        const movies = await searchForMovies(userSearch);
        const userChoice = await askUserToPickSpecificMovie(movies);
        const {Title, Year } = disambiguateMovie(userChoice);
        const movieInfo = await getInfoAboutThatSpecificMovie(Title, Year);
        const rating = await askTheUserForTheirRating(movieInfo);
        await storeItInTheDatabase(movieInfo, rating);
        const keepGoing = await askToContinue();
        if(keepGoing){
            movieGrabber();
        } else {
            console.log("Later!")
            connection.end();
        }
    } catch(err){
        console.log(err)
        connection.end();
    }
}
   
function askTheUserForAMovie(){
    return inquirer.prompt([{
        type: "input",
        message: "Type a movie to search for",
        name: "movie"
    }]).then(response => response.movie)
}
function searchForMovies(movieName){
    return axios.get(`http://www.omdbapi.com/?s=${movieName}&apikey=trilogy`).then(response => {
        return response.data.Search
            .filter(movie => movie.Type === "movie")
            .map(movie => {
                return {
                    Title: movie.Title, 
                    Year: movie.Year,
                    imdbID: movie.imdbID
                };
            });
    })
}
function askUserToPickSpecificMovie(movies){
    return inquirer.prompt([{
        name: "movieChoice",
        type: "rawlist",
        choices: movies.map(movie => movie.Title + "-" + movie.Year)
    }]).then(response => response.movieChoice);
}
function getInfoAboutThatSpecificMovie(movie, year){
    return axios.get(`http://www.omdbapi.com/?t=${movie}&y=${year}&apikey=trilogy`)
        .then(response => response.data);
}
function askTheUserForTheirRating(movie){
const movieInfo = `
    ${chalk.red(movie.Title)} - ${movie.Year} - ${movie.Runtime}
    ${movie.Plot}

    Please choose a rating
`
    return inquirer.prompt([{
        name: "rating",
        message: movieInfo,
        type: "list",
        choices: ["1","2","3","4","5"]
    }]).then(response => response.rating);
}
function storeItInTheDatabase(movieInfo, MyRating){
    const finalMovieData = {
        Title: movieInfo.Title,
        Rated: movieInfo.Rated,
        Runtime: movieInfo.Runtime,
        Plot: movieInfo.Plot,
        Year: movieInfo.Year,
        MyRating,
    };
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO movies SET ?", finalMovieData, function(err, data){
            if(err){
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}
function askToContinue(){
    return inquirer.prompt([{
        name: "keepGoing",
        message: "Do you want to continue?",
        type: "confirm",
        default: true
    }]).then(response => response.keepGoing);
}

function disambiguateMovie(choiceStr){
    const pieces = choiceStr.split("-");
    return {
        Title: pieces[0],
        Year: pieces[1]
    }
}


