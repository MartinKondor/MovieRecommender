'use strict';
(function ($) {
    // Prepare data

    // Download data 
    $.getJSON("https://martinkondor.github.io/MovieRecommender/data/json/movies.json", function (data) {
        console.log(data);
    });

    // / Prepare data

    function search(title) {

    }

    function searchWithYear(title, year) {
        
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

})(jQuery);
