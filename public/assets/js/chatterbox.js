$(document).ready(function() {
  // set up the modal windows
  $("#modalQuestionSaved").modal(); // save a question
  $("#modalSavedQuestions").modal(); // saved questions
  $("#modalNotes").modal(); // notes

  // get the questions
  $.getJSON("/questions", function(data) {
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

  // display a question and its notes
  $(document).on("click", "li", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    // get the question
    $.ajax({
      method: "GET",
      url: "/questions/" + thisId
    })
      // print the note(s)
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append(
          "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
        );
        // If there's a note already
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // event listener for the save note button
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/questions/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
      console.log(data);
      $("#notes").empty();
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
