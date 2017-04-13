const TITLE = 0, CONTENT = 2;
const MYLINE = "myline", TIMELINE = "timeline", UPDATE = "update";

function sociosUI() {
      $("body").html();

      request("socios.html", hSocios, hErr);
      request("myline.json", handlerMessages(MYLINE), hErr);
      request("timeline.json", handlerMessages(TIMELINE), hErr);
}

function hSocios (data) {
      setHTML(data);
      $( "input" ).checkboxradio();
      showEventsLine();
}

function setHTML(data) {
      $("body").html(data);
      $("#title").html("Welcome to socios " + user.name);
      $(".avatar").attr("src", user.avatar);
      $(".name").html(user.name);
}

function isInvalidTopic(id, autor, name) {
      return (id == MYLINE && autor != name) || (id == TIMELINE && autor == name) ||
                  (id == UPDATE && autor == name);
}

var handlerMessages = function(id) {
      return function handlerJson(json) {
            var hMsg = function (data) {
                  var msg = $("#"+id),
                  src = $.trim(data),
                  messageHTML = $.parseHTML(src);

                  for (var i = 0; i < json.length; i++) {
                        if (isInvalidTopic(id, json[i].autor, user.name)) {
                              continue;
                        }
                        var topic = newTopic(id, i);
                        setMessageNodesInDOM(topic, messageHTML);
                        setBackGrondTopic(topic);
                        showTopicInMessageNodes(topic, json[i]);
                  }
                  setAccordion(id);
            }
            request("message.html", hMsg, hErr);
      }
}

function setAccordion(id) {
      $("#"+id).accordion({
            collapsible: true,
            active: false,
            heightStyle: "content"
      }).sortable({
            axis: "y",
            handle: "h3",
            stop: function( event, ui ) {
                  // IE doesn't register the blur when sorting
                  // so trigger focusout handlers to remove .ui-state-focus
                  ui.item.children( "h3" ).triggerHandler( "focusout" );

                  // Refresh accordion to handle new order
                  $( this ).accordion( "refresh" );
            }
      });
      $("#"+id).hide();
}

function newTopic (id, i) {
      return topic = {
            i : id,
            t : "t"+id+i,
            c : "c"+id+i
      };
}

function setBackGrondTopic (topic) {
      if (topic.i == UPDATE) {
            $("#"+topic.t).css('background-color', 'rgba(255, 0, 0 , 0.5)');
            $("#"+topic.c).css('background-color', 'rgba(0, 0, 255 , 0.5)');
      }
      if (topic.i == MYLINE || topic.i == TIMELINE) {
            $("#"+topic.t).css('background-color', 'rgba(0, 0, 255, 0.5)');
            $("#"+topic.c).css('background-color', 'rgba(0, 255, 0, 0.5)');
      }
}

function showTopicInMessageNodes(topic, msg) {
      $("#" + topic.t).html(msg.autor);
      $("#" + topic.c + " .avatar").attr("src", msg.avatar);
      $("#" + topic.c + " .title").html(msg.titulo);

      viewContent(topic.c, msg.contenido, msg.fecha);
}

function viewContent (c, content, date) {
      var sContent = "#" + c + " .content";
      var sDate    = "#" + c + " .date";
      var sOpener  = "#" + c + " .opener";
      var sCloser  = "#" + c + " .closer";

      $(sContent).append(getContent(content));
      $(sDate).html("Date : " + date);

      var effectShow = function() {
            $(sContent).show( "bounce", {} , 500);
            $(sDate).show( "bounce", {} , 500);
      }

      var effectHide = function() {
            $(sContent).hide("bounce", {}, 500);
            $(sDate).hide( "bounce", {} , 500);
      }

      $(sOpener).on("click", function(){
            effectShow();
      });

      $(sCloser).on("click", function(){
            effectHide();
      })

      $(sContent).hide();
      $(sDate).hide();
}

function setMessageNodesInDOM(topic, html) {
      var aux = new Array(html.length);

      $.each(html, function(i ,el) {
            aux[i] = el.cloneNode(true);
            if (i == TITLE) {
                  aux[i].setAttribute("id", topic.t);
            }
            if (i == CONTENT) {
                  aux[i].setAttribute("id", topic.c);
            }
      });
      $("#"+topic.i).append(aux);
}

function getContent(content) {
      var str = "";
      for (var i = 0 ; i < content.length; i++) {
            str += " " + content[i] + "\n";
      }
      return str;
}

function showEventsLine() {
      var showEffect = function (id) {
            $( id ).show("drop", {}, 1000);
      }
      var hideEffect = function(id) {
            $( id ).hide( "drop", {}, 1000);
      }

      showEffect("#timeline");

      $("#radio-1").click(function() {
          hideEffect("#myline");
          setTimeout(showEffect, 1100, "#timeline");
          showDialog("#msgUpdate", showEffect);
      });

      $("#radio-2").click(function() {
          hideEffect("#timeline");
          hideEffect("#update");
          setTimeout(showEffect, 1100, "#myline");
      });

      $("#msgUpdate").hide();
}

var isUpdated = false;
function showDialog(id, showEffect) {
      $( id ).dialog ({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                  "Show messages update" : function() {
                        $( this ).dialog( "close" );
                        if (!isUpdated) {
                              request("update.json", handlerMessages(UPDATE), hErr);
                        }
                        setTimeout(showEffect, 1100, "#update");
                        isUpdated = true;
                  },
                  "Cancel" : function() {
                        $( this ).dialog( "close" );
                  }
            }
      });
}
