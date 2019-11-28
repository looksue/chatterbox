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
  
  // make event listener for list elements
  $(document).on("click", "li", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    // get the article
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

//save an article
$(document).on("click", "#save", function() {
  // Grab the id associated with the article from the Save link
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/save/" + thisId,
    data: {
      title: $(this).data("title"),
      link: $(this).data("link")
    }
  });
});
