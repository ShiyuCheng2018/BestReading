
"use strict";

(function () {
    window.onload = function(){
        fetchBooks();
        getHome();
    };

    let getHome = function(){
        let home = document.getElementById("back");
        let allBooks = document.getElementById("allbooks");
        let singleBook = document.getElementById("singlebook");
        home.style.cursor = "pointer";
        //when home is clicked, allbooks shows and singlebook hidden
        home.addEventListener("click", function () {
            allBooks.style.display = "inline";
            singleBook.style.display = "none";
        });
    };


    let fetchBooks = function () {
        let allBooks = document.getElementById("allbooks");
        let singleBook = document.getElementById("singlebook");
        //singlebook is hided
        singleBook.style.display = "none";
        // this function is for fecthing the allbooks from the server
        let url = "http://localhost:3000/?mode=books";
        fetch(url)
            .then(checkStatus)
            .then(function (responseText) {
                let responseObj = JSON.parse(responseText);
                //add all books with their cover pics to the allbooks div
                for(let book = 0; book < responseObj["books"].length; book++){
                    //get books' titles and folders
                    let bookTitle = responseObj["books"][book]["title"];
                    let bookFolder = responseObj["books"][book]["folder"];
                    //inject the book name and img to allbooks
                    let div = document.createElement("div");
                    div.className = "book "+bookFolder;
                    let title = document.createElement("p");
                    title.innerText = bookTitle;
                    let imgTag = document.createElement("img");
                    imgTag.src = "books/"+bookFolder+"/cover.jpg";
                    div.appendChild(imgTag);
                    div.appendChild(title);
                    allBooks.appendChild(div);

                }
                //select all books
                let books = document.querySelectorAll(".book");
                //add eventlisteners to every single book
                for (let book = 0; book < books.length; book ++ ){
                    books[book].style.cursor = "pointer";
                    books[book].addEventListener("click", singleBookClickHandler);
                }
            })
            .catch(function (error) {
                console.log("has an error: " + error);
            });
    };

    let singleBookClickHandler = function(){
        let bookFolder = this.className.slice(5, this.className.length);
        let singleBook = document.getElementById("singlebook");
        let allBooks = document.getElementById("allbooks");

        //not didplay allbooks but th eselected book
        allBooks.style.display = "none";
        singleBook.style.display = "inline";

        // get all divs from HTML file
        let titleDiv = document.getElementById("title");
        let authorDiv = document.getElementById("author");
        let infoStarsDiv = document.getElementById("stars");
        let imgDiv = document.getElementById("cover");
        let descriptionDiv = document.getElementById("description");
        let reviewSection = document.getElementById("reviews");
        imgDiv.src = "books/"+bookFolder+"/cover.jpg";

        //get all URLs
        let urlInfo = "http://localhost:3000/?mode=info"+"&title="+bookFolder+"/";
        let urlDescription = "http://localhost:3000/?mode=description"+"&title="+bookFolder+"/";
        let urlReviews = "http://localhost:3000/?mode=reviews"+"&title="+bookFolder+"/";

        //start to fetch infos, descriptions, and reviews from books
        fetchInfo(urlInfo, titleDiv, authorDiv, infoStarsDiv);
        fetchDescription(urlDescription, descriptionDiv);
        fetchRevies(urlReviews, reviewSection);

    };

    let clear = function(parent){
        //this is a clear function
        if (parent.hasChildNodes()){
            parent.innerHTML = "";
        }
    };

    let fetchRevies = function(url, reviewSection){
        fetch(url)
            .then(checkStatus)
            .then(function (responseText) {
                let responseObj = JSON.parse(responseText);
                let reviews = responseObj["reviews"];
                //clear reviews from previouse the select book
                clear(reviewSection);
                for (let i = 0; i < reviews.length; i++){
                    //get name, stars, and review
                    let name = reviews[i]["name"];
                    let stars = reviews[i]["stars"];
                    let review = reviews[i]["review"];
                    //create divs
                    let nameDiv = document.createElement("h3");
                    let starsDiv = document.createElement("span");
                    let reviewDiv = document.createElement("p");
                    //inject name, star, and reviews to div
                    nameDiv.innerText = name;
                    starsDiv.innerText = " "+stars;
                    nameDiv.appendChild(starsDiv);
                    reviewDiv.innerText = review;
                    //inject to HTML file
                    reviewSection.appendChild(nameDiv);
                    reviewSection.appendChild(reviewDiv);
                }
            })
            .catch(function (error) {
                console.log("has an error: "+error);
            });

    };

    let fetchDescription = function(url, descriptionDiv){
        fetch(url)
            .then(checkStatus)
            .then(function (responseText) {
                let responseObj = JSON.parse(responseText);
                let description = responseObj["description"];
                descriptionDiv.innerText = description;
            })
            .catch(function (error) {
                console.log("has an error: "+error);
            });
    };

    let fetchInfo = function(url, titleDiv, authorDiv, infoStarsDiv){
        fetch(url)
            .then(checkStatus)
            .then(function (responseText) {
                let responseObj = JSON.parse(responseText);
                let info = responseObj["info"];
                //get the info of title, author and starts
                let title = info["title"];
                let author = info["author"];
                let stars = info["stars"];
                //inject title, author and starts
                titleDiv.innerHTML = title;
                authorDiv.innerHTML = author;
                infoStarsDiv.innerHTML = stars;
            })
            .catch(function (error) {
                console.log("has an error: " + error);

            });
    };

    let checkStatus = function(response) {
        // this function is to check the response data
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } else if (response.status == 404) {
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(new Error(response.status+": "+response.statusText));
        } else if (response.status == 410) {
            return Promise.reject(new Error(response.status+": "+response.statusText));
        } else {
            return Promise.reject(new Error(response.status+": "+response.statusText));
        }
    };
})();