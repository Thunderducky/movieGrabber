-- Title: "Frozen",
-- Year: "2013",
-- Rated: "PG",
-- Released: "27 Nov 2013",
-- Runtime: "102 min",
-- Genre: "Animation, Adventure, Comedy, Family, Fantasy, Musical",
-- Director: "Chris Buck, Jennifer Lee",
-- Writer: "Jennifer Lee (screenplay by), Hans Christian Andersen (story inspired by: "The Snow Queen" by), Chris Buck (story by), Jennifer Lee (story by), Shane Morris (story by)",
-- Actors: "Kristen Bell, Idina Menzel, Jonathan Groff, Josh Gad",
-- Plot: "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.",
-- Language: "English, Norwegian",
-- Country: "USA",
-- Awards: "Won 2 Oscars. Another 78 wins & 57 nominations.",
-- Poster: "https://m.media-amazon.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SX300.jpg",

DROP DATABASE IF EXISTS movieGrabberDB;
CREATE DATABASE movieGrabberDB;

USE movieGrabberDB

CREATE TABLE movies(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Rated VARCHAR(255) NOT NULL,
    Year INT NOT NULL,
    Runtime VARCHAR(255) NOT NULL,
    Plot TEXT NOT NULL,
    MyRating INT NOT NULL
);