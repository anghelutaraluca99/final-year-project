import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

// Takes user as parameter; user should have at least user.email set
export const Authenticate = async (user) => {
  try {
    let respObj = {};
    respObj.name = user?.name;
    respObj.email = user?.email;
    respObj.username = user?.username;

    // GET authentication options
    const resp = await fetch("http://localhost:3000/user/pre_authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(respObj),
    });

    // eslint-disable-next-line
    let asseResp;
    try {
      // Pass the options to the authenticator and wait for a response
      respObj.asseResp = await startAuthentication(await resp.json());
    } catch (error) {
      return false;
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
    if (responseJSON?.token) {
      localStorage.setItem("jwt_token", responseJSON.token);
      return true;
    }
    return false;
  } catch (error) {
    console.log("error: ", error);
    return false;
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
    console.log(parsedResp.error);
    return false;
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
    } else {
      console.log(error);
    }
    return false;
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
  if (!verificationJSON.error) {
    if (verificationJSON?.token) {
      localStorage.setItem("jwt_token", verificationJSON.token);
      return true;
    }
    return true;
  } else {
    return false;
  }
};

export const RegisterNewAuthenticator = async (user) => {
  // GET registration options from the endpoint that calls
  // @simplewebauthn/server -> generateRegistrationOptions()
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
      } else {
        console.log(error);
      }
      return { error: error };
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
    return verificationJSON;
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
    console.log(parsedResp.error);
    return false;
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
    } else {
      console.log(error);
    }
    // authenticator returned error
    return false;
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
    if (verificationJSON?.token) {
      localStorage.setItem("jwt_token", verificationJSON.token);
      return true;
    }
    // no jtw token received back from BE
    return false;
  } else {
    // BE returned error
    return false;
  }
};
