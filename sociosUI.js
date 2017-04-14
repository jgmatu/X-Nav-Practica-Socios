const TITLE = 0, CONTENT = 2;
const MYLINE = "myline", TIMELINE = "timeline", UPDATE = "update";

function sociosUI() {
      $("body").html();
      request("socios.html", hSocios, hErr);
}

function hSocios (data) {
      setHTML(data);
      $( "input" ).checkboxradio();
      setRadioButtons();

      request("myline.json", handlerMessages(MYLINE), hErr);
      request("timeline.json", handlerMessages(TIMELINE), hErr);
      request("update.json", handlerMessages(UPDATE), hErr);
}

function setHTML(data) {
      $("body").html(data);
      $("#title").html("Welcome to socios " + user.name);
      $(".avatar").attr("src", user.avatar);
      $(".name").html(user.name);
}

function isInvalidTopic(id, autor, name) {
      return (id == MYLINE && autor != name) ||
             (id == TIMELINE && autor == name) ||
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

function handlerUpdate(update) {
      var total = numUpdate(update);

      if (total == 0) {
            return;
      }
      showDialogUpdateMessages(total);
}

function numUpdate(update) {
      var total = 0;

      for (var i = 0 ; i < update.length; i++) {
            if (update[i].autor != user.name) {
                  total = total + 1;
            }
      }
      return total;
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

function newTopic (i, idx) {
      return topic = {
            id : i,
            idT : "t"+i+idx,
            idC : "c"+i+idx
      };
}

function setBackGrondTopic (topic) {
      if (topic.id == UPDATE) {
            $("#"+topic.idT).css('background-color', 'rgba(255, 0, 0 , 0.2)');
            $("#"+topic.idC).css('background-color', 'rgba(0, 0, 255 , 0.2)');
      }
      if (topic.id == MYLINE || topic.id == TIMELINE) {
            $("#"+topic.idT).css('background-color', 'rgba(0, 0, 255, 0.2)');
            $("#"+topic.idC).css('background-color', 'rgba(0, 255, 0, 0.2)');
      }
}

function newContent (i, t, d) {
      return content = {
            idC   : i,
            txt   : t,
            date  : d
      }
}

function showTopicInMessageNodes(topic, msg) {
      $("#" + topic.idT).html(msg.autor);
      $("#" + topic.idC + " .avatar").attr("src", msg.avatar);
      $("#" + topic.idC + " .title").html(msg.titulo);

      var content = newContent(topic.idC, msg.contenido, msg.fecha);
      viewContent(content);
}

function viewContent (c) {
      var sContent = "#" + c.idC + " .content";
      var sDate    = "#" + c.idC + " .date";
      var sOpener  = "#" + c.idC + " .opener";
      var sCloser  = "#" + c.idC + " .closer";

      $(sContent).append(getContent(c.txt));
      $(sDate).html("Date : " + c.date);

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
                  aux[i].setAttribute("id", topic.idT);
            }
            if (i == CONTENT) {
                  aux[i].setAttribute("id", topic.idC);
            }
      });
      $("#"+topic.id).append(aux);
}

function getContent(content) {
      var str = "";

      for (var i = 0 ; i < content.length; i++) {
            str += " " + content[i] + "\n";
      }
      return str;
}

var showEffect = function ( id ) {
      $( id ).show("drop", {}, 1000);
}
var hideEffect = function(id) {
      $( id ).hide( "drop", {}, 1000);
}

function setRadioButtons() {
      $("#radio-1").click(function() {
            hideEffect("#"+MYLINE);
            request("update.json", handlerUpdate, hErr);
            setTimeout(showEffect, 1100, "#"+TIMELINE);
      });

      $("#radio-2").click(function() {
            hideEffect("#"+TIMELINE);
            hideEffect("#update");
            setTimeout(showEffect, 1100, "#"+MYLINE);
      });
      $("#msgUpdate").hide();
}

function showDialogUpdateMessages(total) {
      var id = "#msgUpdate";
      $( id ).attr('title', "You have " + total + " new messages");
      $( id ).dialog ({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                  "Show new messages" : function() {
                        $( this ).dialog( "close" );
                        showEffect("#update");
                  },
                  "Cancel" : function() {
                        $( this ).dialog( "close" );
                  }
            }
      });
}
