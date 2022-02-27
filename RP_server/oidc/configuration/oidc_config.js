module.exports =  {
    // ... see /docs for available configuration
    clients: [{
      client_id: 'development-implicit',
      application_type: 'web',
      token_endpoint_auth_method: 'none',
      response_types: ['id_token'],
      grant_types: ['implicit'],
      redirect_uris: ['http://localhost:8080'], // this fails two regular validations http: and localhost
    }],
    claims: {
      address: ['address'],
      email: ['email'],
      profile: ['name'],
    },
    interactions: {
      url(ctx, interaction) { // eslint-disable-line no-unused-vars
        return `http://localhost:8080/interaction/${interaction.uid}`;
      },
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