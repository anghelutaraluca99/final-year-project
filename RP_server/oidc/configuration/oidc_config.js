const usersQueries = require("../../models/database_queries/users_queries");
const { users } = require("../../models/schemas");

module.exports = {
  // ... see /docs for available configuration
  clients: [
    {
      client_id: "Dogs As A Service",
      client_secret: "secret",
      // application_type: 'web',
      redirect_uris: ["http://localhost:4001/", "http://localhost:4000/"],
      token_endpoint_auth_method: "none",
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_basic",
      grant_types: ["authorization_code"],
    },

    {
      client_id: "Cats As A Service",
      client_secret: "secret",
      // application_type: 'web',
      redirect_uris: ["http://localhost:5001/", "http://localhost:5000/"],
      token_endpoint_auth_method: "none",
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_basic",
      grant_types: ["authorization_code"],
    },
  ],
  claims: {
    username: ["username"],
    email: ["email"],
    name: ["name"],
  },
  interactions: {
    url(ctx, interaction) {
      // eslint-disable-line no-unused-vars
      return `http://localhost:3000/oidc_interaction/${interaction.uid}/`;
    },
  },

  cookies: {
    short: {
      httpOnly: true,
      overwrite: true,
      sameSite: "lax",
    },
    long: {
      httpOnly: true,
      overwrite: true,
      sameSite: "lax",
    },
    keys: [
      "some secret key",
      "and also the old rotated away some time ago",
      "and one more",
    ],
  },

  features: {
    devInteractions: { enabled: false },
  },

  async findAccount(ctx, id) {
    let user;
    try {
      user = await usersQueries.getUser(id);
    } catch (e) {
      console.log("In config, error: ", e);
    }

    if (user) {
      return {
        accountId: id,
        async claims(use, scope) {
          return {
            sub: id,
            email: user?.email,
            name: user?.name,
            username: user?.username,
          };
        },
      };
    } else {
      return {
        accountId: id,
        async claims(use, scope) {
          return {
            sub: id,
          };
        },
      };
    }
  },
};
