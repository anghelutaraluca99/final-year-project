import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const ValidateFingerprint = async () => {
  const fpPromise = FingerprintJS.load({ monitoring: false });

  // Get the visitor identifier when you need it.
  const fp = await fpPromise;
  const result = await fp.get();

  const res = await fetch("http://localhost:3000/user/validate_fingerprint", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  const validate_fingerprint = await res.json();

  if (!validate_fingerprint?.error) {
    // Device is already trusted
    return true;
  } else {
    // Ask user if device should be trusted
    return false;
  }
};

export const SaveFingerprint = async () => {
  const fpPromise = FingerprintJS.load({ monitoring: false });

  // Get the visitor identifier when you need it.
  const fp = await fpPromise;
  const result = await fp.get();
  // Save fingerprint
  const res = await fetch("http://localhost:3000/user/save_fingerprint", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  const save_fingerprint = await res.json();

  if (!save_fingerprint?.error) {
    // fingerprint was saved
    return true;
  } else {
    // fingerprint could not be saved
    return false;
  }
};

export const GetFingerprint = async () => {
  const fpPromise = FingerprintJS.load({ monitoring: false });

  const fp = await fpPromise;
  const fingerprint = await fp.get();

  return fingerprint;
};
