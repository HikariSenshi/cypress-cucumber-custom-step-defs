

/*
class SSO {
    constructor() {
        this.cypressEnv = Cypress.env();
        this.environment = this.cypressEnv[this.cypressEnv.env]; // get env vars for indicated env

        this.providerLocationId = this.environment.SSO_SPI.providerLocationId;
        this.slothAuthPathV2 = '/api/v2/auth';
        this.slothAuthPathV3 = '/api/v3/auth';

        // Local Env Settings
        this.ssoV2Settings = {
            slothURL: this.environment.SSO_SPI.slothURL, // 'https://sloth.salucro.local:31018',
            slothAuthPath: this.slothAuthPathV2,
            providerSlug: this.environment.SSO_SPI.providerSlug,
            clientID: this.environment.SSO_SPI.providerClientID,
            clientSecret: this.environment.SSO_SPI.providerClientSecret,
            grantType: 'client_credentials',
            scope: 'patient guest',
        };
        this.ssoCredentialV2Settings = {
            slothURL: this.environment.SSO_SPI.slothURL,
            slothAuthPath: this.slothAuthPathV2,
            providerSlug: this.environment.SSO_SPI.providerSlug,
            clientID: this.environment.SSO_SPI.providerClientID,
            clientSecret: this.environment.SSO_SPI.providerClientSecret,
            grantType: 'client_credentials',
            scope: 'patient guest',
        };
        this.ssoV3Settings = {
            slothURL: this.environment.SSO_SPI.slothURL,
            slothAuthPath: this.slothAuthPathV3,
            providerSlug: this.environment.SSO_SPI.providerSlug,
            clientID: this.environment.SSO_SPI.providerClientID,
            clientSecret: this.environment.SSO_SPI.providerClientSecret,
            grantType: 'client_credentials',
            scope: 'patient guest',
        };
        this.ssoV3HPPSettings = {
            slothURL: this.environment.SSO_SPI.slothURL,
            slothAuthPath: this.slothAuthPathV3,
            providerSlug: this.environment.SSO_SPI.providerSlug,
            clientID: this.environment.SSO_SPI.providerClientID,
            clientSecret: this.environment.SSO_SPI.providerClientSecret,
            grantType: 'client_credentials',
            scope: 'hpp',
        };

        // this should come in the request - only here for testing
        this.body = {
            source_refnum: 'abc123',
            options: {
                allow_account_edit: false,
            },
            patients: [
                {
                    location_id: 2,
                    firstname: 'Joe',
                    lastname: 'Smith',
                    account_number: 'A1234Z',
                    email: 'test@site.com',
                    phone: '4115551234',
                    amount: '137.02',
                },
            ],
        };
    }

    getHealthCheck(body = this.body, settings = this.ssoV2Settings) {
        // let options = this.getHealthCheckRequestOptions(settings);
        // options.body = body;
        return cy.request(this.getHealthCheckRequestOptions(body, settings));
    }

    postSSOInitialization(body = this.body, settings = this.ssoV2Settings) {
        let options = this.postSSOInitializationRequestOptions(settings);
        options.body = body;
        return cy.request(options);
    }

    getSSOFetchPrefill(launchToken, settings = this.ssoV2Settings) {
        let options = this.getSSOFetchRequestOptions(settings);
        options.url += `?launchToken=${launchToken}`;

        return cy.request(options); // return the async promise
    }

    validateToken(token, settings = this.ssoV2Settings) {
        let options = this.getValidateRequestOptions(token, settings);
        return cy.request(options); // return the async promise
    }

    logout(token, settings = this.ssoV2Settings) {
        let options = this.getLogoutRequestOptions(token, settings);
        return cy.request(options); // return the async promise
    }

    getClientCred(settings = this.ssoV2Settings) {
        let options = this.getClientCredRequestOptions(settings);
        return cy.request(options); // return the async promise
    }

    getHealthCheckRequestOptions(body, settings) {
        const { slothURL } = settings;
        cy.log(slothURL + '/');
        let options = {
            url: slothURL + '/',
            method: 'GET',
            body,
        };
        return options;
    }

    postSSOInitializationRequestOptions(settings) {
        const { slothURL, slothAuthPath, providerSlug, clientID, clientSecret, grantType, scope } = settings;
        cy.log(slothURL + slothAuthPath + '/sso/' + providerSlug);
        let options = {
            url: slothURL + slothAuthPath + '/sso/' + providerSlug,
            method: 'POST',
            body: {},
            headers: {
                'X-Sal-ClientID': clientID,
                'X-Sal-ClientSecret': clientSecret,
                'X-Sal-GrantType': grantType,
                'X-Sal-Scope': scope,
                'Content-Type': 'application/json',
            },
        };
        return options;
    }

    getSSOFetchRequestOptions(settings) {
        const { slothURL, slothAuthPath, providerSlug, clientID, clientSecret, grantType, scope } = settings;
        let options = {
            url: slothURL + slothAuthPath + '/' + providerSlug + '/patientPortalPrefill',
            method: 'GET',
            body: {},
            headers: {
                'X-Sal-ClientID': clientID,
                'X-Sal-ClientSecret': clientSecret,
                'X-Sal-GrantType': grantType,
                'X-Sal-Scope': scope,
                'Content-Type': 'application/json',
            },
        };
        return options;
    }

    getValidateRequestOptions(token, settings) {
        const { slothURL, slothAuthPath } = settings;
        cy.log(slothURL + slothAuthPath + '/validate');
        let options = {
            url: slothURL + slothAuthPath + '/validate',
            method: 'GET',
            body: {},
            headers: {
                Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
        };
        return options;
    }

    getLogoutRequestOptions(token, settings) {
        const { slothURL, slothAuthPath } = settings;
        cy.log(slothURL + slothAuthPath + '/logout');
        let options = {
            url: slothURL + slothAuthPath + '/logout',
            method: 'POST',
            body: {},
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return options;
    }

    getClientCredRequestOptions(settings) {
        const { slothURL, slothAuthPath, providerSlug, clientID, clientSecret, grantType, scope } = settings;
        cy.log(slothURL + slothAuthPath + '/clientCred');
        let options = {
            url: slothURL + slothAuthPath + '/clientCred',
            method: 'POST',
            body: {},
            headers: {
                'X-Sal-ClientID': clientID,
                'X-Sal-ClientSecret': clientSecret,
                'X-Sal-GrantType': grantType,
                'X-Sal-Scope': 'api scope1',
                'Content-Type': 'application/json',
            },
        };
        return options;
    }
}

export default SSO;
*/
