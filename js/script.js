
var baseVote = {
  "custodians": [],
  "parkrates": [
    {
      "rates": [],
      "unit": "B"
    }
  ],
  "motions": [],
  "fees": {
    "S": 1,
    "B": 0.01
  }
}

var ghbranch = "gh-pages"
var repoName = "NuFeeder"

// general functions to do stuff

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

//Functions to generate pre-formed fields for displaying and entering voting data
function custodianField (custodian) {
  
  if (!custodian) {
    var custodian = {address:"", amount:""}
  }
  
  var field = " \
  <div class='input-group'> \
    <span class='input-group-btn'> \
      <button class='btn btn-default remove-field' type='button'>X</button> \
    </span> \
    <input type='text' class='form-control custodian-input custodian-address' placeholder='Custodians Address' value='" + custodian.address + "'> \
    <input type='text' class='form-control custodian-input custodian-amount' placeholder='Grant Value' value='" + custodian.amount + "'> \
  </div><!-- /input-group --> \
  "
  return field
}

function motionField (motion) {
  
  if (!motion) {
    var motion = ""
  }
  
  var field = " \
  <div class='input-group'> \
    <span class='input-group-btn'> \
      <button class='btn btn-default remove-field' type='button'>X</button> \
    </span> \
    <input type='text' class='form-control motion-hash' placeholder='Motion Hash' value='" + motion + "'> \
  </div> \
  "
  return field
}

function transactionFeeField (unit, fee) {
  
  var field = " \
  <div class='input-group'> \
    <span class='input-group-btn'> \
      <button class='btn btn-default transaction-fee-unit' type='button' value='" + unit + "'>" + unit + "</button> \
    </span> \
    <input type='text' class='form-control transaction-fee' placeholder='Fee Value' value='" + fee + "'> \
  </div>\
  "
  return field
}

function parkRateField (parkrates) {
  
  if (!parkrates) {
    var custodian = {address:"", amount:""}
  }
  
  var field = " \
              <div class=park-rate-container> \
                <input type='button' value='Add Park Rate' class='btn btn-pri' id='addParkRate'> \
                <div class='content-header'> \
                </div> \
              "
  
  
  for (index in parkrates.rates) {
    
    rates = parkrates.rates[index]
    
    field += " \
    <div class='input-group'> \
      <span class='input-group-btn'> \
        <button class='btn btn-default remove-field' type='button'>X</button> \
      </span> \
      <input type='text' class='form-control park-rate-block-duration'  placeholder='Block Duration' value='" + rates.blocks + "'> \
      <input type='text' class='form-control park-rate'  placeholder='APR Value' value='" + rates.rate + "'> \
    </div> \
    "
  }
  
  //container ending div
  field += "</div>"

  return field
}


//other fun things
function flash (message, type) {
  $(".flash").empty()
  $(".flash").fadeIn().append("<div class='alert "+type + " " + "alert-" + type + "'>" + message + "</div>").fadeOut( 5000, function() {});
}


(function ($) {
  $(document).ready(function () {

    //development checker
    $("input[name='development']").change(function () {
      if (this.checked) {
        ghbranch = "development"
      } else { ghbranch = "gh-pages"}

    });
    
    //Add commas to custodian amounts
    $("span.amount").digits()
    
    //when the user clicks login try to get the coting data from their repo and display it on the page
    $("#login-button").click(function () { 

      //verify the user has entered a username
      if ($("#username").val().length > 0) {
        var username = $("#username").val();
      } else {
        flash("Please enter your username before trying to login", "danger");
        return;
      }

      //verify the user has entered a password
      if ($("#password").val().length > 0) {
        var password = $("#password").val();
      } else {
        flash("Please enter your password before trying to login", "danger");
        return
      }
      
      var github = new Github({
        username: username,
        password: password,
        auth: "basic"
      });

      var repo = github.getRepo(username, repoName);  

      repo.show(function(err, repojson) {
        //check to see if we found the NuFeeder repo, else alert with the error message
        if (repojson) {
          //get the voting data from votes.json, else alert the user if the files doesn't exist
          repo.read(ghbranch, '_data/votes.json', function(err, data) {

            try {
              var votes = JSON.parse(data)  
            } 
            catch (err) {
              flash("parse JSON error:" + err, "danger")
              return
            } 
            
            //if we don't find a votes.json file we'll load up the base voting template
            if (err) {votes = baseVote}  
            
            //made it inside, lets hide the login page
            $(".login").hide()

            /* custodians */
            //make sure custodians container is clear
            $(".custodians").empty()

            //parse and display custodians fields
            for (index in votes.custodians) {
              custodian = votes.custodians[index]
              $(".custodians").append(custodianField(custodian));
            }
            
            /* motions */
            //make sure motions container is clear
            $(".motions").empty()

            //parse and display motion fields
            for (index in votes.motions) {
              motion = votes.motions[index]
              $(".motions").append(motionField(motion))
            }

            /*transaction fees */
            //make sure transacton fees container is clear
            $(".transactionfees").empty()

            //parse and display transaction fee fields

            for (unit in votes.fees) {
              fee = votes.fees[unit]
              $(".transactionfees").append(transactionFeeField(unit, fee))
            }

            /* park rates */
            //make sure park rates container is clear
            $(".parkrates").empty()

            for (index in votes.parkrates) {
              parkrateobj = votes.parkrates[index]

              $(".parkrates").append(parkRateField(parkrateobj));

            }

          });
          
          $(".vote-fields").css('visibility', 'visible');
          $("#save-button").css('visibility', 'visible');
        }
        else {
          flash("repo error: " + err.request.statusText, "danger")
        }
      });
    });
    
    
    /* saving the results after editing them when the user clicks save */
    $("#save-button").click(function () {
      
      var username = $("#username").val();
      var password = $("#password").val();
      
      var github = new Github({
        username: username,
        password: password,
        auth: "basic"
      });

      var repo = github.getRepo(username, repoName);  
      
      var savevotes = {custodians: [],
                   parkrates: [],
                   motions: [],
                   fees: {}
                  }
      // Get the current motions votes and add them to our new vote list              
      $(".motions").children().each(function () { 
                   
        savevotes.motions.push($(this).find(".motion-hash").val())
                  
        });
      
      //get the current custodians and add them to our new vote list
      $(".custodians").children().each(function () { 

        savevotes.custodians.push( {address : $(this).find(".custodian-address").val(), amount:  parseFloat($(this).find(".custodian-amount").val()) })

        });
      
      //get the current transaction fee votes and add them to the vote list
      $(".transactionfees").children().each(function () {
        
        savevotes.fees[$(this).find(".transaction-fee-unit").val()] = parseFloat($(this).find(".transaction-fee").val())
      
        });
      
      //get the current park rates and add them to the vote list
      $(".parkrates").children().each(function () {
        
        //the park rates object is a bit more complex. we'll set it up here first
        rateset = {"rates": [], "unit": ""}

        //todo: don't hard code this. bad bad bad!! When other units are added this will need to be handled better
        rateset["unit"] = "B"
        
        //iterate through all of the park rate input fields to generate the list
        $(".park-rate-container").children(".input-group").each(function () {
          
          rateset.rates.push( {"blocks" : parseInt($(this).find(".park-rate-block-duration").val()), "rate" : parseFloat($(this).find(".park-rate").val())} )
          
        });
        
        //set park rates
        savevotes.parkrates.push( rateset )
        
      });
      
      votesJSON = JSON.stringify(savevotes, null, 2)
      
      
      repo.write(ghbranch, '_data/votes.json', votesJSON, 'updating votes', function(err) {
        
        if (err) {
          flash("update repo error" + err.request.statusText, "danger")
          return
        }
        
        flash("Update Success", "success")
        
      });
      
    });
    
    
    /*general page actions*/
    
    // remove form fields
    $('body').on('click', '.remove-field', function() {
        $(this).parent().parent().remove();
    });

    // add custodian field
    $('body').on('click', '#addCustodian', function() {
       $(".custodians").append(custodianField());
    });
        
    // add motion field
    $('body').on('click', '#addMotion', function() {
       $(".motions").append(motionField());
    });
    
    // add park rate field
    $('body').on('click', '#addParkRate', function() {
       $(this).parent().append(" \
    <div class='input-group'> \
      <span class='input-group-btn'> \
        <button class='btn btn-default remove-field' type='button'>X</button> \
      </span> \
      <input type='text' class='form-control park-rate-block-duration'  placeholder='Block Duration' value=''> \
      <input type='text' class='form-control park-rate'  placeholder='APR Value' value=''> \
    </div> \
    ");
    });
    
  });
})(jQuery)
