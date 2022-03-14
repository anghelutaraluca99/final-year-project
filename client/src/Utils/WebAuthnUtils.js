import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

// Takes user as parameter; user should have at least user.email set
export const Authenticate = async (email) => {
  try {
    let respObj = {};
    respObj.email = email;

    // GET authentication options
    const resp = await fetch("http://localhost:3000/user/pre_authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(respObj),
    });

    const parsedResp = await resp.json();

    if (parsedResp?.error !== undefined) {
      return { error: parsedResp?.error };
    }

    // eslint-disable-next-line
    let asseResp;
    try {
      // Pass the options to the authenticator and wait for a response
      respObj.asseResp = await startAuthentication(parsedResp);
    } catch (error) {
      console.log("Eroarea cealalta");
      if (error.name === "TypeError") {
        // No credentials found for given user on authenticator
        // Do not display this as an error as we do not with an attacker to gain this informaiton
        return { error: "Log in failed." };
      } else {
        if (error.name === "DOMException") {
          // User aborted login
          return { error: "Log in aborted." };
        } else {
          // For any other error type, return generic error
          return { error: "Log in aborted." };
        }
      }
    }

    const verificationResp = await fetch(
      "http://localhost:3000/user/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(respObj),
      }
    );

    // Wait for the results of verification
    const responseJSON = await verificationResp.json();
    if (responseJSON?.token && responseJSON?.user) {
      localStorage.setItem("jwt_token", responseJSON.token);
      return {
        message: "Login successful",
        user: responseJSON?.user,
      };
    }
    return { error: "Log in failed. Response from backend is invalid." };
  } catch (error) {
    return { error: error };
  }
};

export const Register = async (user) => {
  let respObj = {};
  respObj.name = user?.name;
  respObj.email = user?.email;
  respObj.username = user?.username;

  // GET registration options from the endpoint that calls
  // @simplewebauthn/server -> generateRegistrationOptions()
  const resp = await fetch("http://localhost:3000/user/pre_register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(respObj),
  });

  // Check for errors in response
  let parsedResp = await resp.json();
  if (typeof parsedResp?.error !== "undefined") {
    // If response contains an error
    console.log("Eroare inregistrare: ", parsedResp.error);
    return { error: parsedResp?.error };
  }

  // eslint-disable-next-line
  let attResp;
  try {
    // Pass the options to the authenticator and wait for a response

    respObj.attResp = await startRegistration(parsedResp);
  } catch (error) {
    if (error.name === "InvalidStateError") {
      console.log(
        "Error: Authenticator was probably already registered by user"
      );
      return {
        error: `Authenticator was already registered by user ${respObj.email}`,
      };
    } else {
      return { error: "Registration aborted" };
    }
  }

  // POST the response to the endpoint that calls
  // @simplewebauthn/server -> verifyRegistrationResponse()
  const verificationResp = await fetch("http://localhost:3000/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(respObj),
  });

  // Wait for the results of verification
  const verificationJSON = await verificationResp.json();

  // Log answer saved in 'verified'
  if (!verificationJSON?.error) {
    if (verificationJSON?.token) {
      localStorage.setItem("jwt_token", verificationJSON.token);
      return { message: "Registration successful." };
    }
    return { error: "Registration failed. User could not be returned." };
  } else {
    return { error: verificationJSON?.error };
  }
};

export const RegisterNewAuthenticator = async (user) => {
  // GET registration options from the endpoint that calls
  // @simplewebauthn/server -> generateRegistrationOptions()
  try {
    const resp = await fetch(
      "http://localhost:3000/user/pre_register_new_authenticator",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      }
    );

    let parsedResp = await resp.json();

    if (typeof parsedResp?.error !== "undefined") {
      // If response contains an error
      console.log(parsedResp.error);
      return { error: parsedResp?.error };
    } else {
      // eslint-disable-next-line
      let attResp;
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration(parsedResp);
      } catch (error) {
        if (error.name === "InvalidStateError") {
          console.log(
            "Error: Authenticator was probably already registered by user"
          );
          return { error: "Authenticator already registered by user." };
        } else {
          console.log(error);
          return { error: "Authenticator registration aborted." };
        }
      }

      // POST the response to the endpoint that calls
      // @simplewebauthn/server -> verifyRegistrationResponse()
      const verificationResp = await fetch(
        "http://localhost:3000/user/register_new_authenticator",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attResp: attResp }),
        }
      );

      // Wait for the results of verification
      const verificationJSON = await verificationResp.json();
      // Log answer saved in 'verified'
      if (!verificationJSON?.error) return verificationJSON;
      else
        return {
          error:
            "Authenticator registration failed. Authenticator response was not valid.",
        };
    }
  } catch (e) {
    return { error: "Authenticator registration failed." };
  }
};

export const AccountRecovery = async (user, fingerprint) => {
  let respObj = {};
  respObj.user = user;
  respObj.fingerprint = fingerprint;

  // GET registration options from the endpoint that calls
  // @simplewebauthn/server -> generateRegistrationOptions()
  const resp = await fetch("http://localhost:3000/user/pre_account_recovery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(respObj),
  });

  // Check for errors in response
  let parsedResp = await resp.json();
  if (typeof parsedResp?.error !== "undefined") {
    // If response contains an error
    return { error: parsedResp?.error };
  }

  // eslint-disable-next-line
  let attResp;
  try {
    // Pass the options to the authenticator and wait for a response

    respObj.attResp = await startRegistration(parsedResp);
  } catch (error) {
    if (error.name === "InvalidStateError") {
      return { error: `Authenticator already registered with ${user.email}.` };
    } else {
      return { error: "Account recovery aborted." };
    }
  }

  // POST the response to the endpoint that calls
  // @simplewebauthn/server -> verifyRegistrationResponse()
  const verificationResp = await fetch(
    "http://localhost:3000/user/account_recovery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(respObj),
    }
  );

  // Wait for the results of verification
  const verificationJSON = await verificationResp.json();

  // Log answer saved in 'verified'
  if (!verificationJSON?.error) {
    if (verificationJSON?.token && verificationJSON?.user) {
      localStorage.setItem("jwt_token", verificationJSON.token);
      return { message: "Account recovery successful.", user: user };
    }
    // no jtw token received back from BE
    return {
      error: "Could not recover account. Response from backend is invalid.",
    };
  } else {
    // BE returned error
    return { error: verificationJSON?.error };
  }
};
