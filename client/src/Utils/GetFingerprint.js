import FingerprintJS from '@fingerprintjs/fingerprintjs'

async function GetFingerprint() {

  const fpPromise = FingerprintJS.load({monitoring: false});

  const getAndPostFingerprint = async () => {
  // Get the visitor identifier when you need it.
    const fp = await fpPromise;
    const result = await fp.get();
    const fingerprintResp = await fetch('http://localhost:3000/user/fingerprint', {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
      });
    return fingerprintResp;
  };
  return await getAndPostFingerprint();  
}
export default GetFingerprint;