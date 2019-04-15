
"use strict";
/*global require*/

const express = require("express");
const app = express();
let fs = require('fs');

app.use(express.static('public'));
let getFileLines = function(bookTitile, fileName ){
  //read selected file
  let file = fs.readFileSync("books/" + bookTitile + "/"+fileName, "utf8");
  //split strings
  let lines = file.split("\n");
  return lines;
};

app.get('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  // set query for the server
  let params = req.query;
  let mode = params.mode;
  let title = params.title;
  //mode selector: info, description, reviews, allbooks
  if (mode == "info") {
    let json = {};
    let info = {};
    let lines = getFileLines(title, "info.txt");
    //get title, author, starts, and info
    info["title"] = lines[0];
    info["author"] = lines[1];
    info["stars"] = lines[2];
    json["info"] = info;
    //send JSON
    res.send(JSON.stringify(json));
  } else if (mode == "description") {
    let json = {};
    let file = fs.readFileSync("books/" + title + "/description.txt", "utf8");
    let description = file;
    json["description"] = description;
    res.send(JSON.stringify(json));
  } else if (mode == "reviews") {
    let json = {};
    let reviews = [];
    let files = fs.readdirSync("books/" + title + "/");
    for (let i = 0; i < files.length; i++) {
      if (files[i].slice(0, 6) == "review" && files[i].slice(-4) == ".txt") {
        let review = {};
        let lines = getFileLines(title, files[i]);
        //get name, stars, and review
        review["name"] = lines[0];
        review["stars"] = lines[1];
        review["review"] = lines[2];
        reviews.push(review);
      }
    }
    json["reviews"] = reviews;
    res.send(JSON.stringify(json));
  } else if (mode == "books") {
    let json = {};
    let books = [];
    let folders = fs.readdirSync("books/");
    for (let i = 0; i < folders.length; i++) {
      //get rid of hiden folders in macOs
      if (folders[i].slice(0, 1) != ".") {
        let pair = {};
        let lines = getFileLines(folders[i], "info.txt");
        //get title and folder
        pair["title"] = lines[0];
        pair["folder"] = folders[i];
        books.push(pair);
      }
    }
    json["books"] = books;
    res.send(JSON.stringify(json));
  }

});

app.listen(3000);