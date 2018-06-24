$(document).ready(function () {

    // Handle Scrape button
    $("#scrape").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function (data) {
            console.log(data)
            bootbox.alert("<h3 class='text-center'>Retrieved " + data.newArticleCount + " new articles!</h3>"
                + "<button class='btn-primary' id='viewArticles'>" + "VIEW ARTICLES</button>");
            
        })
    });

    //activate dynamically created modal button
    $(document).on("click", "#viewArticles", viewArticles);

    // view articles 
    function viewArticles () {

        $.ajax({
            method: "GET",
            url: "/view_articles",
            success: function() {
                window.location.href = "/view_articles";
            },
        }).done(function (data) {
            console.log(data)
            return ( data );
        })
    };

    //activate dynamically created modal button
//$(document).on("click", ".save", viewArticles);

    //Handle Save Article button
    $(".save").on("click", function() {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/articles/save/" + thisId
        }).done(function(data) {
            window.location = "/view_articles"
        })
    });

    // //Handle Delete Article button
    // $(".delete").on("click", function() {
    //     var thisId = $(this).attr("data-id");
    //     $.ajax({
    //         method: "POST",
    //         url: "/articles/delete/" + thisId
    //     }).done(function(data) {
    //         window.location = "/saved"
    //     })
    // });

    // //Handle Save Note button
    // $(".saveNote").on("click", function() {
    //     var thisId = $(this).attr("data-id");
    //     if (!$("#noteText" + thisId).val()) {
    //         alert("please enter a note to save")
    //     }else {
    //       $.ajax({
    //             method: "POST",
    //             url: "/note/save/" + thisId,
    //             data: {
    //               text: $("#noteText" + thisId).val()
    //             }
    //           }).done(function(data) {
    //               // Log the response
    //               console.log(data);
    //               // Empty the notes section
    //               $("#noteText" + thisId).val("");
    //               $(".modalNote").modal("hide");
    //               window.location = "/saved"
    //           });
    //     }
    // });

    // //Handle Delete Note button
    // $(".deleteNote").on("click", function() {
    //     var noteId = $(this).attr("data-note-id");
    //     var articleId = $(this).attr("data-article-id");
    //     $.ajax({
    //         method: "DELETE",
    //         url: "/note/delete/" + noteId + "/" + articleId
    //     }).done(function(data) {
    //         console.log(data)
    //         $(".modalNote").modal("hide");
    //         window.location = "/saved"
    //     })
    // });

});