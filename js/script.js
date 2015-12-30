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
    <input type='text' class='form-control custodian-input' placeholder='Custodians Address' value='" + custodian.address + "'> \
    <input type='text' class='form-control custodian-input' placeholder='Grant Value' value='" + custodian.amount + "'> \
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
    <input type='text' class='form-control' placeholder='Motion Hash' value='" + motion + "'> \
  </div> \
  "
  return field
}

function transactionFeeField (unit, fee) {
  
  var field = " \
  <div class='input-group'> \
    <span class='input-group-btn'> \
      <button class='btn btn-default' type='button'>" + unit + "</button> \
    </span> \
    <input type='text' class='form-control' placeholder='Fee Value' value='" + fee + "'> \
  </div>\
  "
  return field
}

function parkRateField (parkrates) {
  
  if (!parkrates) {
    var custodian = {address:"", amount:""}
  }
  
  var field = "<h2>" + parkrates.unit + "</h2>"
  
  field +=  '<input type="button" value="Add Park Rate" class="btn btn-pri" id="addParkRate">'
  
  for (index in parkrates.rates) {
    
    rates = parkrates.rates[index]
    
    field += " \
    <div class='input-group'> \
      <span class='input-group-btn'> \
        <button class='btn btn-default remove-field' type='button'>X</button> \
      </span> \
      <input type='text' class='form-control'  placeholder='Block Duration' value='" + rates.blocks + "'> \
      <input type='text' class='form-control'  placeholder='APR Value' value='" + rates.rate + "'> \
    </div> \
    "
  }

  return field
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
                alert(err)
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
              debugger
            }
            else {
              alert("votes.json missing")
            }
          });
          
          $(".vote-fields").css('visibility', 'visible');
        }
        else {
          alert(err.request.statusText)
        }
      });
    });
    
    $("#Save")
    
    
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