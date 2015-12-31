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
                <div class='content-header'> \
                  <h1 class='park-rate-unit'>" + parkrates.unit + "</h1> \
                  <input type='button' value='Add Park Rate' class='btn btn-pri' id='addParkRate'> \
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
function alert (message, type) {
  
  $(".flash").text(message).fadeOut( 4000, function() {});
  
}


(function ($) {
  $(document).ready(function () {

    //when the user clicks login try to get the coting data from their repo and display it on the page
    $("#login-button").click(function () { 

      //verify the user has entered a username
      if ($("#username").val().length > 0) {
        var username = $("#username").val();
      } else {
        alert("Please enter your username before trying to login");
        return;
      }

      //verify the user has entered a password
      if ($("#password").val().length > 0) {
        var password = $("#password").val();
      } else {
        alert("Please enter your password before trying to login");
        return
      }
      
      var github = new Github({
        username: username,
        password: password,
        auth: "basic"
      });

      var repo = github.getRepo(username, "NuFeeder");  

      repo.show(function(err, repojson) {
        //check to see if we found the NuFeeder repo, else alert with the error message
        if (repojson) {
          //get the voting data from votes.json, else alert the user if the files doesn't exist
          repo.read('gh-pages', 'votes.json', function(err, data) {
            if (data) {
              //try to parse the voting data, alert the user of errors if it doesn't parse
              try {
                var votes = JSON.parse(data)  
              } 
              catch (err) {
                alert("parse JSON error:" + err)
                return
              } 
              
              //made it inside, lets hide the login page
              $("#login").hide()
              
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
            }
            else {
              alert("votes.json missing")
            }
          });
          
          $(".vote-fields").css('visibility', 'visible');
          $("#save-button").css('visibility', 'visible');
        }
        else {
          alert("repo error:" + err.request.statusText)
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

      var repo = github.getRepo(username, "NuFeeder");  
      
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

        savevotes.custodians.push( {address : $(this).find(".custodian-address").val(), amount:  parseInt($(this).find(".custodian-amount").val()) })

        });
      
      //get the current transaction fee votes and add them to the vote list
      $(".transactionfees").children().each(function () {
        
        savevotes.fees[$(this).find(".transaction-fee-unit").val()] = parseInt($(this).find(".transaction-fee").val())
      
        });
      
      //get the current park rates and add them to the vote list
      $(".parkrates").children().each(function () {
        
        //the park rates object is a bit more complex. we'll set it up here first
        rateset = {"rates": [], "unit": ""}

        rateset["unit"] = $(this).find('h2').text()
        
        //iterate through all of the park rate input fields to generate the list
        $(".park-rate-container").children(".input-group").each(function () {
          
          rateset.rates.push( {"blocks" : parseInt($(this).find(".park-rate-block-duration").val()), "rate" : parseInt($(this).find(".park-rate").val())} )
          
        });
        
        //set park rates
        savevotes.parkrates.push( rateset )
        
      });
      
      votesJSON = JSON.stringify(savevotes, null, 2)
      
      repo.write('gh-pages', 'votes.json', votesJSON, 'updating votes', function(err) {
        
        if (err) {
          alert("update repo error" + err.request.statusText)
          return
        }
        
        alert("Update Success", "success")
        
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
      <input type='text' class='form-control'  placeholder='Block Duration' value=''> \
      <input type='text' class='form-control'  placeholder='APR Value' value=''> \
    </div> \
    ");
    });
    
  });
})(jQuery)