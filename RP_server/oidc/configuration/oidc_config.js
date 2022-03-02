module.exports =  {
    // ... see /docs for available configuration
    clients: [{
      client_id: 'DEMO client',
      // application_type: 'web',
      redirect_uris:['http://localhost:4001/', 'http://localhost:4000/'],
      token_endpoint_auth_method: 'none',
      response_types: ['code'],
    }],
    claims: {
      address: ['address'],
      email: ['email'],
      profile: ['name'],
    },
    interactions: {
      url(ctx, interaction) { // eslint-disable-line no-unused-vars
        return `/oidc_interaction/${interaction.uid}`;
      },
    },

    cookies: {
      keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
    },

    features: {
      devInteractions: { enabled: false }
    },
    
    async findAccount(ctx, id) {
        return {
            accountId: "test_account_ID",
            async claims(use, scope) { 
                return { sub: "test_account_ID" }; 
            },
        }
    },
  };