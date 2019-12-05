$(document).ready(function() {
  // set up the modal windows
  $("#modalQuestionSaved").modal(); // save a question
  $("#modalSavedQuestions").modal(); // saved questions
  $("#modalNotes").modal(); // notes

  // get the questions
  $(document).on("click", "#getSavedQuestions", function() {
    $.getJSON("/Questions", function(data) {
      // do this for each
      for (var i = 0; i < data.length; i++) {
        // append the question on the page
        $("#questions").append(
          "<li data-id='" +
            data[i]._id +
            "'>" +
            data[i].title +
            "<br />" +
            data[i].link +
            "</li>" +
            "<br />" +
            "<br />"
        );
      }
    });
    $("#modalSavedQuestions").modal("open");
  });

  // display a question and its notes
  $(document).on("click", "li", function() {
    $("#modalNotes").empty();
    var thisId = $(this).attr("data-id");

    // get the question
    $.ajax({
      method: "GET",
      url: "/Questions/" + thisId
    })
      // print the note(s)
      .then(function(data) {
        console.log(data);
        $("#modalNotes").append("<h2>" + data.title + "</h2>");
        $("#modalNotes").append(
          "<h4>(click outside this window to close)</h4>"
        );
        $("#modalNotes").append("<input id='titleinput' name='title' >");
        $("#modalNotes").append(
          "<textarea id='bodyinput' name='body'></textarea>"
        );
        $("#modalNotes").append(
          "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
        );
        // If there's a note already
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
    $("#modalNotes").modal("open");
  });

  // event listener for the save note button
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/Questions/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
      console.log(data);
      $("#modalNotes").empty();
    });
    // clear out the note fields
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  // save a question
  $(".saveQuestion").on("click", function(element) {
    let title = $(this).attr("data-title");
    let link = $(this).attr("data-link");

    // make an object to hold the question
    let savedQuestion = {
      title,
      link,
      notes: null
    };

    fetch("/save", {
      // Send savedQuestion to MongoDB
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(savedQuestion)
    }).then(response => {
      console.log(response);
      $("#modalQuestionSaved").modal("open");
      $("#modalQuestionSaved .modal-content ").html(
        "<h4> Question Saved! </h4>"
      );
      setTimeout(() => $("#modalQuestionSaved").modal("close"), 1500);
      $(document.getElementById(link)).css("display", "none");
    });
  });
});
