const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");


// REGISTER USER

registerForm.addEventListener("submit", function(event) {

  event.preventDefault();

  const email =
    document.getElementById("registerEmail").value;

  const password =
    document.getElementById("registerPassword").value;

  const attributeList = [];

  userPool.signUp(

    email,

    password,

    attributeList,

    null,

    function(err, result) {

      if (err) {

        alert(err.message || JSON.stringify(err));

        return;

      }

      alert("Registration successful!");

    }

  );

});


// LOGIN USER

loginForm.addEventListener("submit", function(event) {

  event.preventDefault();

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const authenticationData = {

    Username: email,

    Password: password

  };

  const authenticationDetails =
    new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

  const userData = {

    Username: email,

    Pool: userPool

  };

  const cognitoUser =
    new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {

    onSuccess: function(result) {

      alert("Login successful!");

      console.log(result);

    },

    onFailure: function(err) {

      alert(err.message || JSON.stringify(err));

    }

  });

});