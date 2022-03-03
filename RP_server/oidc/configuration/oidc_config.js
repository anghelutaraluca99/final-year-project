module.exports =  {
    // ... see /docs for available configuration
    clients: [{
      client_id: 'DEMO client',
      client_secret: 'secret',
      // application_type: 'web',
      redirect_uris:['http://localhost:4001/', 'http://localhost:4000/'],
      token_endpoint_auth_method: 'none',
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_basic',
      grant_types: ['authorization_code'],

    }],
    claims: {
      address: ['address'],
      email: ['email'],
      profile: ['name'],
    },
    interactions: {
      url(ctx, interaction) { // eslint-disable-line no-unused-vars
        return `http://localhost:3000/oidc_interaction/${interaction.uid}/`;
      },
    },

    cookies: {
      short: {
        httpOnly: true,
        overwrite: true,
        sameSite: 'lax'
      },
      long: {
        httpOnly: true,
        overwrite: true,
        sameSite: 'lax'
      },
      keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
    },
    // conformIdTokenClaims: false,
    features: {
      devInteractions: { enabled: false },
      // clientCredentials: {
      //   enabled: true
      // }
    },
    
    async findAccount(ctx, id) {
        return {
            accountId: id,
            // use: 'id_token',
            async claims(use, scope) { 
                return { sub: id }; 
            },
        }
    },
  };