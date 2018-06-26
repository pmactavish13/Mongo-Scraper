$(document).ready(function () {

    // Handle Scrape button
    $("#scrape").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function (data) {
            var scrapeResult = [
                "<h3 class='text-center'>Scrape Successful!</h3>",
                "<h3 class='text-center'> Retrieved " + data.newArticleCount + " new articles!</h3>",
                "<hr></hr>",
                "<button class='btn viewArticles' id='viewArticles'>" + "VIEW ARTICLES</button>"
            ].join("");
            bootbox.dialog({
                message: scrapeResult,
                closeButton: true
            });
        })
    });

    //activate dynamically created modal button
    $(document).on("click", "#viewArticles", viewArticles);

    // view articles 
    function viewArticles() {
        $.ajax({
            method: "GET",
            url: "/view_articles",
            success: function () {
                window.location.href = "/view_articles";
            },
        }).done(function (data) {
            return (data);
        })
    };

    //activate dynamically created card button
    $(document).on("click", ".save", saveArticle);

    //Handle Save Article button
    function saveArticle() {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/save_article/" + thisId
        }).done(function (data) {
            location.reload()
        })
    };

    //activate dynamically created card button
    $(document).on("click", ".delete", deleteArticle);

    //delete save on Article 
    function deleteArticle() {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/delete_article/" + thisId
        }).done(function (data) {
            location.reload()
        })
    };

    //activate dynamically created card button
    $(document).on("click", ".notes", getNotes);

    function getNotes() {
        // Save the id from the tag
        var thisId = $(this).attr("data-id");
        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId,
            success: function (data) {
                notesGet(data, thisId);
            },
        })
    };

    // if notes, iterate through and push to notes modal
    function notesGet(notesModalData, thisId) {
        //store note being iterated through
        var currentNote
        // store all notes to push into modal
        var notesForModal = [];
        // check for notes
        if (!notesModalData.notesData.note.length) {
            console.log(notesModalData)
            // If no notes display a message
            currentNote = ["<li class='list-group-item'>No notes for this article yet.</li>"].join("");
            notesForModal.push(currentNote);
            getNotesModal(notesForModal, thisId)
        } else {
            console.log(notesModalData)
            for (var i = 0; i < notesModalData.notesData.note.length; i++) {
                //element to contain our noteText and a delete button
                currentNote = (
                    [
                        "<li class='list-group-item note'>" +
                        notesModalData.notesData.note[i].body +
                        "<button class='btn deleteNote' data-id='" + notesModalData.notesData.note[i]._id + "'>DELETE</button></li>"
                    ].join("")
                );
                // Add currentNote to the notesForModal array
                notesForModal.push(currentNote);
            }
            if (notesForModal.length === notesModalData.notesData.note.length) {
                getNotesModal(notesForModal, thisId)
            }
        }
    }

    //get Notes 
    function getNotesModal(notesList, thisId) {
        // make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId,
            success: function (data) {
                var modalContent = [
                    "<div class='container-fluid text-center'>",
                    "<h4 class='text-center'>Notes for Article: " + data.notesData.title + "</h4>",
                    "<hr></hr>",
                    "<ul class='list-group noteContainer'>" + notesList.join("") + "</ul>",
                    "<div class='form-group'>",
                    "<textarea class='form-control' id='bodyinput' rows='4' placeholder='New Note'></textarea>",
                    "<button class='btn saveNote' data-id=" + data.notesData._id + ">SAVE NOTE</button>",
                    "</div>",
                    "</div>"
                ].join("");
                bootbox.dialog({
                    message: modalContent,
                    closeButton: true
                });
                // var noteData = {
                //     _id: currentArticle,
                //     notes: data || []
                //   };
                //   // Adding some information about the article and article notes to the save button for easy access
                //   // When trying to add a new note
                //   $(".btn.saveNote").data("article", noteData)
            }
        })
    };

    //activate dynamically created modal button
    $(document).on("click", ".saveNote", saveNote);

    function saveNote() {
        var thisId = $(this).attr("data-id");
        // if ($.trim($(".bootbox-body textarea").val()) === "" || $.trim($(".bootbox-body textarea").val()) === "New Note") {
        //     $(".bootbox-body textarea").val("Please enter a note");
        //     return false;
        // } else {
            var newNote = $(".bootbox-body textarea").val().trim()
            //Handle Save Article button
            $.ajax({
                method: "POST",
                url: "/save_note/" + thisId,
                data: {body:$(".bootbox-body textarea").val().trim()}, 
                success: function(data) {
            
                // Log the response
     console.log(data)
                location.reload()
            }
            })
        //};
        //     var newNote = $(".bootbox-body textarea").val().trim();
        //     var noteData = {
        //         _id: thisId,
        //         noteText: newNote
        //     };

        //     $.post("/save_note", noteData).then(function (result) {
        //         console.log(result)

        //         // When complete, close the modal
        //         location.reload();
        //     });
        // }
    }

        //activate dynamically created card button
        $(document).on("click", ".deleteNote", deleteNote);

        //Handle Save Article button
        function deleteNote() {
            var thisId = $(this).attr("data-id");
            $.ajax({
                url: "/delete_note/" + thisId,
                method: "DELETE"
            }).then(function () {
                // When done, hide the modal
                //bootbox.hideAll();
                location.reload()
            });
        }
    });