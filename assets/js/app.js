
/*
* Scopely FrontEnd Challenge
* Date: 05/21/2013
* 
* Author: BaoQuoc Doan
* Email: baoquocdoan@gmail.com
* Github: mantone
* 
*/
$(document).ready(function() {


  //// Vars
  // endpoint for validation url
  var posturl = 'http://frontend.challenges.scopely.io/post';

  // sample data provided  :: This is normally should be loaded with an ajax call to some rest api associated with the user account and session
  var originalData = {"achievements":[{"id":100,"title":"Spell 3 \"Fruits\"","type":"daily","properties":{"goalName":"Count","goalCount":3,"rewardName":"Coins","rewardCount":50,"active":true}},{"id":101,"title":"Spell 3 \"Monsters\"","type":"daily","properties":{"goalName":"Count","goalCount":3,"rewardName":"Coins","rewardCount":50,"active":false}},{"id":102,"title":"Spell 3 \"Oceans\"","type":"daily","properties":{"goalName":"Count","goalCount":3,"rewardName":"Coins","rewardCount":50,"active":false}},{"id":103,"title":"Complete 4 Games","type":"daily","properties":{"goalName":"Count","goalCount":4,"rewardName":"Coins","rewardCount":100,"active":false}},{"id":104,"title":"Turn on Push Notifications","type":"standard","properties":{"goalName":"Count","goalCount":1,"rewardName":"Stars","rewardCount":1,"active":true}},{"id":105,"title":"Upload a profile pic","type":"standard","properties":{"goalName":"Count","goalCount":1,"rewardName":"Trophies","rewardCount":2,"active":true}},{"id":106,"title":"Spell a 7-letter word 75 times","type":"standard","properties":{"goalName":"Count","goalCount":75,"rewardName":"Trophies","rewardCount":1,"active":true}},{"id":107,"title":"Spell 3 \"Palindromes\"","type":"standard","properties":{"goalName":"Count","goalCount":3,"rewardName":"Trophies","rewardCount":2,"active":true}},{"id":108,"title":"Lock 25 Tiles","type":"standard","properties":{"goalName":"Count","goalCount":25,"rewardName":"Stars","rewardCount":5,"active":true}}]};
  
  // copy for state comparison
  var currentData = jQuery.extend(true, {}, originalData);

  // handlebars templates
  var dailysource = $("#daily-tbody-tpl").html();
  var standardsource = $("#standard-tbody-tpl").html();

  // compile templates
  var dailyTpl = Handlebars.compile(dailysource);
  var standardTpl = Handlebars.compile(standardsource);

  // add partials
  Handlebars.registerPartial("row", $("#row-partial").html());

  // func :: render
  var renderTemplate = function(dataSrc) {
    // apply data to templates
    $("#standard tbody").empty().append(dailyTpl(dataSrc));
    $("#daily tbody").empty().append(standardTpl(dataSrc));

    $('.save, .cancel').addClass('disabled');
  }

  // intial rendering of view
  renderTemplate(currentData);

  // update current state
  var updateJsonObjbyId = function(locate, changeActive) {
    for(var i = 0; i < currentData.achievements.length; i++)
    {
      if(currentData.achievements[i].id == locate)
      {
        if(changeActive == 'paused') {
          currentData.achievements[i].properties.active = false;
        } else {
          currentData.achievements[i].properties.active = true;
        }
      }
    }
  }

  //// talk to [scopely] - see if you are scopely  material....
  // if yes proceed to interview
  // if no figure out why....
  // func :: ajaxCors
  var ajaxCors = function( resquestUrl, jsonData){

    $.ajax({
      type: "POST",
      url: resquestUrl,
      contentType: "application/json",
      data: JSON.stringify(jsonData),
      dataType: "json",
      success: function( response ){
        console.log("SUCCESS:", response);

        // change ui
        $('.server-status').addClass('show').removeClass('hide');
        var successmsg = $('.server-status span').data('success');
        $('.server-status span').text(successmsg);
        $('.save').addClass('disabled');
      },
      error: function( error ){
        // Log any error.
        console.log( "ERROR:", error );

        // change ui
        $('.server-status').addClass('show').removeClass('hide');
        var errormsg = $('.server-status span').data('error');
        $('.server-status span').text(errormsg);
      },
      complete: function(){
      }
    });

  };

  //// interactions bindings ( clicks )
  // binding :: save click
  $("#user-action").on("click", "button.save:not(.disabled)", function(event) {
    ajaxCors(posturl, currentData);
  });

  // binding :: cancel click
  $("#user-action").on("click", "button.cancel:not(.disabled)", function(event) {
        renderTemplate(originalData);

        $('.server-status').addClass('show').removeClass('hide');
        var cancelMsg = $('.server-status span').data('cancel');
        $('.server-status span').text(cancelMsg);
  });

  // binding  :: status click
  $("table").on("click", ".status", function(event) {
      $('.server-status').addClass('hide').removeClass('show');
      $('.save, .cancel').removeClass('disabled');
      $(this).find('i').toggleClass("icon-check icon-pause");
      $(this).toggleClass("active paused");

      // @todo write more elegantly
      var currentState = $(this).attr('data-active-state');
      if(currentState == 'active') {
        $(this).attr('data-active-state', 'paused');
      } else {
        $(this).attr('data-active-state', 'active');
      }

      $(this).data('active-state', currentState == 'active' ? 'active' : 'paused');
      $(this).find('.name').text(currentState == 'active' ? 'PAUSED' : 'ACTIVE');
      
      updateJsonObjbyId($(this).parent().attr('data-achievement-id'), $(this).attr('data-active-state'));

  });

});




















