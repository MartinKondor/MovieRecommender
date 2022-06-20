'use strict';
(function ($) {
    // Prepare data
    function resetUI() {
        $("#emptyText").css("display", "none");
        $("#weFoundNothing").css("display", "none");
        $("#didYouMeanTitle").css("display", "none");
        $("#choosenMovie").css("display", "none");
        $("#loaderSign").hide();
        $("#movie-list").html("");
    }

    // Download data
    function load(callback) {
        resetUI();
        $("#loaderSign").show();

        $.getJSON("https://martinkondor.github.io/MovieRecommender/data/json/movies.json", function (moviesData) {
            $.getJSON("https://martinkondor.github.io/MovieRecommender/data/json/ratings.json", function (ratingsData) {
                let movies = new dfd.DataFrame(moviesData);
                let ratings = new dfd.DataFrame(ratingsData);
                let df = dfd.merge({ left: movies, right: ratings, on: ["movieId"], how: "inner"})
                callback(df);
            });
        });
    }

    function getMovieNameWords(title, callback) {
        let movieNameWords = [];
        let words = title.toLowerCase().trim().split(" ");
        for (let word of words) {
            if (word == "the") continue;
            movieNameWords.push(word);
        }
        callback(movieNameWords);
    }

    function findSimilarMovies(df, title) {
        let recommendedMovies = [];
        df.sortValues("rating", { inplace: true, ascending: false });
        
        // let movies = df.iloc({rows: ["0:5"]});
        // console.log(movies.values);

        // Get all ratings of the movie
        let ratings = [];
        for (let m of df.values) {
            if (m[1] != title) continue;
            ratings.push(m);
        }
        ratings = ratings.sort(function (a, b) {
            return a[4] < b[4];
        });

        // Get the top 5 ratings
        ratings = ratings.slice(0, 5);

        for (let rating of ratings) {
            let userid = rating[3];
            
            // Find movies rated by this user
            let userMovies = [];
            for (let m of df.values) {
                if (m[3] != userid || m[1] == title) continue;
                userMovies.push(m);
            }

            // Weight movies about the similarity of genres
            let scores = [];
            let genres = ratings[0][2].split("|");

            for (let m of userMovies) {
                let umGenres = m[2].split("|");
                let score = 0;

                for (let umg of umGenres) {
                    if (genres.includes(umg)) {
                        score += 1;
                    }
                }

                scores.push([m, score]);
            }

            // Sort by genre similiarity
            scores = scores.sort(function (a, b) {
                return a[1] < b[1];
            }).slice(0, 5);
            
            userMovies = [];
            for (let m of scores) {
                userMovies.push(m[0]);
            }

            userMovies = userMovies.sort(function (a, b) {
                return a[4] < b[4];
            }).slice(0, 5);

            for (let m of userMovies) {
                if (recommendedMovies.includes(m)) continue;
                recommendedMovies.push(m);
            }
        }

        // Adding recommendedMovies to html
        let alreadyUsedMovieTitles = [];
        let index = 0;

        for (let m of recommendedMovies) {
            if (alreadyUsedMovieTitles.includes(m[1])) continue;
            alreadyUsedMovieTitles.push(m[1]);

            $("#movie-list").html($("#movie-list").html() + `
                <div id="movie-${index}" class="movie-li" title="${m[1]}">
                    ${m[1]}
                </div>
            `);

            // Recommend similar to the choosen movie
            // $("#movie-list").on("click", `#movie-${index}`, createMovieCallback(df, index, m[1]));
            $("#movie-list").on("click", `#movie-${index}`, function () {});  // Remove old listeners
            $(`#movie-${index}`).css("pointer-events", "none");
            $(`#movie-${index}`).css("cursor", "pointer");

            index++;
        }

        $("#title").val(title);
        $("#year").val("");
        $("#loaderSign").hide();
    }

    function createMovieCallback(df, index, title) {
        return function() {
            resetUI();
            $("#loaderSign").show();

            $("#choosenMovie").html("If you like <strong>" + title + "</strong> you might like these");
            $("#choosenMovie").css("display", "block");

            findSimilarMovies(df, title);
        }
    }

    function findMovie(df, title, callback) {
        getMovieNameWords(title, function (movieNameWords) {
            let similarTitles = [];
            let similarTitlesWithPoints = [];

            for (let dfTitle of df.iloc({columns: [1]}).values) {
                dfTitle = dfTitle[0];
                let wordsOfDfTitle = []
                let wordsOfDfTitleTemp = dfTitle.toLowerCase().trim().split(" ");

                for (let w of wordsOfDfTitleTemp) {
                    if (w.trim() == "the") continue;
                    if (w.trim()[0] == "(") continue;
                    wordsOfDfTitle.push(w.trim());
                }

                let points = 0;

                for (let word of wordsOfDfTitle) {
                    if (movieNameWords.includes(word)) {
                        points += 1;
                    }
                }

                if (points != 0 && !similarTitles.includes(dfTitle)) {
                    similarTitles.push(dfTitle);
                    similarTitlesWithPoints.push([dfTitle, points]);
                }
            }

            similarTitlesWithPoints = similarTitlesWithPoints.sort(function (a, b) {
                return a[1] < b[1];
            });

            if (similarTitlesWithPoints.length == 0) {
                $("#weFoundNothing").css("display", "block");
                return;
            }

            $("#didYouMeanTitle").css("display", "block");
            let index = 0;

            for (let m of similarTitlesWithPoints) {
                $("#movie-list").html($("#movie-list").html() + `
                    <div id="movie-${index}" class="movie-li">
                        ${m[0]}
                    </div>
                `);
                
                // On Click for each movie
                $("#movie-list").on("click", `#movie-${index}`, createMovieCallback(df, index, m[0]));
                index++;
            }

            callback();
        });
    }
    // / Prepare data

    function search(title) {
        load(function (df) {
            findMovie(df, title, function () {
                $("#loaderSign").hide();                
            });
        });
    }

    function searchWithYear(title, year) {
        load(function (df) {
            
        });
    }

    function isYear(val){
        return !isNaN(val) && val.length === 4;
    }

    $("#submit").on("click", function () {
        let title = $("#title").val();
        let year = $("#year").val() || "";

        // Running criterias 
        if (title.length < 1) {
            /// TODO: Error messages
            return;
        }
        if (year.length != 0 && !isYear(year)) {
            /// TODO: Error messages
            return;
        }
        
        // Convert year if given to int
        let results = [];
        if (year.length != 0) {
            year = parseInt(year);
            results = searchWithYear(title, year);
        }
        else {
            results = search(title);
        }

        console.log(results);

    });

    resetUI();
    $("#emptyText").css("display", "block");

})(jQuery);
