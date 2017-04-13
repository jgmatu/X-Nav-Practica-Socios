const TITLE = 0, CONTENT = 2;

function sociosUI() {
      $("body").html();
      request("socios.html", hSocios, hErr);

      request("myline.json", setAccordionMyLine, hErr);
      request("timeline.json", setAccordionTimeLine, hErr);
}

function setAccordionMyLine(json) {
      var hMsg = function (data) {
            var msg = $("#myline"),
            src = $.trim(data),
            html = $.parseHTML(src);

            for (var i = 0; i < json.length; i++) {
                  if (json[i].autor != user.name) {
                        continue;
                  }
                  var t = "tm"+i;
                  var c = "cm"+i;
                  var nodes = getNodes(t, c, html);

                  $("#myline").append(nodes);
                  showTopic(t, c, json[i]);
            }
            $("#myline").accordion({
                  collapsible: true
            });
            $("#myline").hide();
      }
      request("message.html", hMsg, hErr);
}

function setAccordionTimeLine(json) {
      var hMsg = function (data) {
            var msg = $("#timeline"),
            src = $.trim(data),
            html = $.parseHTML(src);

            for (var i = 0; i < json.length; i++) {
                  if (json[i].autor == user.name) {
                        continue;
                  }
                  var t = "tt"+i;
                  var c = "ct"+i;
                  var nodes = getNodes(t, c, html);

                  $("#timeline").append(nodes);
                  showTopic(t, c, json[i]);
            }
            $("#timeline").accordion({
                  collapsible: true
            });
            $("#timeline").hide();
      }
      request("message.html", hMsg, hErr);
}

function showTopic(t, c, msg) {
      $("#"+t).html(msg.autor);
      $("#"+c + " .avatar").attr("src", msg.avatar);
      $("#"+c + " .title").html("<h3 align='center'>" + msg.titulo + "</h3>");

      // TODO : contenido oculto... con boton para mostrar...
      $("#"+c + " .content").html(getContent(msg.contenido));
}


function getNodes(idT, idC, html) {
      var aux = new Array(html.length);

      $.each(html, function(i ,el) {
            aux[i] = el.cloneNode(true);
            if (i == TITLE) {
                  aux[i].setAttribute("id", idT);
            }
            if (i == CONTENT) {
                  aux[i].setAttribute("id", idC);
            }
      });
      return aux;
}

function getContent(content) {
      var str = "";
      for (var i = 0 ; i < content.length; i++) {
            str += " " + content[i] + "\n";
      }
      return str;
}

function hSocios (data) {
      setHTML(data);
      $( "input" ).checkboxradio();
      showEvents();
}

function showEvents() {
      showEffect("#timeline");
      $("#radio-1").click(function() {
          hideEffect("#myline");
          setTimeout(showEffect, 1100, "#timeline");
      });

      $("#radio-2").click(function() {
          hideEffect("#timeline");
          setTimeout(showEffect, 1100, "#myline");
      });
}

function showEffect(id) {
      $( id ).show("drop", {}, 1000);
}

function hideEffect(id) {
      $( id ).hide( "drop", {}, 1000);
}

function setHTML(data) {
      $("body").html(data);
      $("#title").html("Welcome to socios " + user.name);
      $(".avatar").attr("src", user.avatar);
      $(".name").html(user.name);
}
