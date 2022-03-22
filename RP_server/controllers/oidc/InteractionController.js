module.exports = async (req, res) => {
  const oidc = req.oidc;
  try {
    const interactionDetails = await oidc.interactionDetails(req, res);
    const { uid, prompt, params, session } = interactionDetails;

    console.log("------- Prompt: ", JSON.stringify(prompt, 0, 2));
    console.log("------- Params: ", JSON.stringify(params, 0, 2));

    if (prompt?.name === "consent") {
      let resp = {
        message: "OIDC login successful!",
        uid: uid,
        scope: params.scope,
      };
      return res.status(200).send(resp);
    } else
      return res
        .status(303)
        .redirect(
          `http://localhost:8080/oidc_interaction/${uid}/${params?.client_id}/${prompt?.name}`
        );
  } catch (err) {
    return err;
  }
};
