/// <reference types="Cypress" />
/*
import Sloth from '../../support/classes/Sloth';

const sloth = new Sloth();
const ssoUsername = 'jsmith@example.com';

const ssoPrefillBodyV2 = {
  user: {
    username: 'jsmith@example.com',
  },
  options: {
    credentialed: false,
  },
  patients: [
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'A1234Z',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '137.02',
    },
  ],
};
const qpPrefillBodyV2 = {
  user: {
    username: ssoUsername,
  },
  options: {
    credentialed: false,
  },
  patients: [
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'VZ091234',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '137.02',
    },
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'VZ091235',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '300.00',
    },
  ],
};
const ssoCredentialedBodyV2 = {
  user: {
    username: 'jsmith',
    guarantor_id: '123456789',
    firstname: 'Joe',
    lastname: 'Smith',
    phone: '888-555-1212',
    email: 'jsmith@example.com',
  },
  options: {
    credentialed: true,
  },
};
const qpPrefillBodyV3 = {
  user: {
    username: ssoUsername,
  },
  options: { allow_account_edit: false, view: 'iframe', launch_duration: '48s' },
  accounts: [
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'VZ091234',
      secondary_account_number: '1234',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '137.02',
    },
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'VZ091235',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '300.00',
    },
  ],
};
const hppPrefillBodyV3 = {
  user: {
    username: ssoUsername,
  },
  options: {},
  accounts: [
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'VZ091234',
      secondary_account_number: '1234',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '137.02',
    },
    {
      location_id: sloth.providerLocationId,
      firstname: 'Joe',
      lastname: 'Smith',
      account_number: 'VZ091235',
      email: 'test@site.com',
      phone: '4115551234',
      amount: '300.00',
    },
  ],
};

describe('SSO via Sloth', () => {
  it('Get HealthCheck', () => {
    sloth.getHealthCheck().then((response) => {
      cy.log(JSON.stringify(response));
      expect(response.status).to.equal(200);
    });
  });
  describe('SSO V2/Auth QuickPay Prefill', () => {
    it('SSO Minimum Request, Fetch Prefill Response, and validate Bearer token, logout', () => {
      sloth.postSSOInitialization(ssoPrefillBodyV2).then((response) => {
        expect(response.body.launchURL).to.exist;
        const launchURL = response.body.launchURL;
        expect(response.body.launchToken).to.exist;
        const launchToken = response.body.launchToken;
        cy.log(launchToken);
        cy.log(launchURL);
        expect(launchURL).to.contain(launchToken);
        expect(launchURL).to.contain('/iframe/#/sso/v2');

        sloth.getSSOFetchPrefill(launchToken).then((response) => {
          // cy.log(JSON.stringify(response.body));
          expect(response.body.token).to.be.a('string');
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.options).to.exist;
          expect(prefill.patients).to.exist;
          const patient = prefill.patients[0];
          expect(patient.location_id).to.be.equal(sloth.providerLocationId);
          expect(patient.firstname).to.be.equal(ssoPrefillBodyV2.patients[0].firstname);
          expect(patient.lastname).to.be.equal(ssoPrefillBodyV2.patients[0].lastname);
          expect(patient.account_number).to.be.equal(ssoPrefillBodyV2.patients[0].account_number);
          expect(patient.email).to.be.equal(ssoPrefillBodyV2.patients[0].email);
          expect(patient.phone).to.be.equal(ssoPrefillBodyV2.patients[0].phone);
          expect(patient.amount).to.be.equal(ssoPrefillBodyV2.patients[0].amount);

          sloth.validateToken(response.body.token).then((response) => {
            expect(response.status).to.be.eq(200);
          });
          sloth.logout(response.body.token).then((response) => {
            expect(response.status).to.be.eq(200);
          });
          sloth.validateToken(response.body.token).then((response) => {
            expect(response.status).to.be.eq(401);
          });
        });
      });
    });

    it(`Get Launch URL and Prefill Data with has_payment_plan`, () => {
      const prefillBody = qpPrefillBodyV2;
      prefillBody.patients[0].has_payment_plan = true;
      sloth.postSSOInitialization(prefillBody).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;

        sloth.getSSOFetchPrefill(launchToken).then((response) => {
          expect(response.body.prefillData).to.exist;
          cy.log('has_payment_plan');
          cy.log(JSON.stringify(response.body.prefillData.patients));
          const prefill = response.body.prefillData;
          expect(prefill.patients).to.exist;
          expect(prefill.patients[0].has_payment_plan).to.be.equal(true);
          expect(prefill.patients[1].has_payment_plan).to.equal(false);
        });
      });
    });

    it(`Get Launch URL and Prefill Data with view option full`, () => {
      const prefillBody = qpPrefillBodyV2;
      prefillBody.options.view = 'full';
      sloth.postSSOInitialization(prefillBody).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;
        expect(launchURL).to.not.contain('iframe');

        sloth.getSSOFetchPrefill(launchToken).then((response) => {
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.patients).to.exist;
        });
      });
    });

    it(`SPL - Get Launch URL and Redacted Prefill Data using 48h launch_duration`, () => {
      const prefillBody = qpPrefillBodyV2;
      prefillBody.options.launch_duration = '48h';
      sloth.postSSOInitialization(prefillBody).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;
        expect(launchURL).to.not.contain('iframe');

        sloth.getSSOFetchPrefill(launchToken).then((response) => {
          cy.log(JSON.stringify(response.body));
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.patients).to.exist;
          const account = prefill.patients[0];
          // account_number redacted?
          expect(account.account_number).not.to.equal(prefillBody.patients[0].account_number);
          const account_number = prefillBody.patients[0].account_number;
          const account_number_last = account_number.substring(account_number.length - 2);
          expect(account.account_number).to.eq(`*******${account_number_last}`);
          // secondary_account_number redacted?
          if (prefillBody.patients[0].secondary_account_number) {
            expect(account.secondary_account_number).not.to.equal(prefillBody.patients[0].secondary_account_number);
            const secondary_account_number = prefillBody.patients[0].secondary_account_number;
            const secondary_account_number_last = secondary_account_number.substring(
              secondary_account_number.length - 2
            );
            expect(account.secondary_account_number).to.eq(`*******${secondary_account_number_last}`);
          }
          // firstname redacted?
          expect(account.firstname).not.to.equal(prefillBody.patients[0].firstname);
          expect(account.firstname).to.eq(`*******`);
          // lastname redacted?
          expect(account.lastname).not.to.equal(prefillBody.patients[0].lastname);
          expect(account.lastname).to.eq(`*******`);
          // email redacted?
          expect(account.email).not.to.equal(prefillBody.patients[0].email);
          expect(account.email).to.eq(`*******`);
          // phone redacted?
          expect(account.phone).not.to.equal(prefillBody.patients[0].phone);
          expect(account.phone).to.eq(`*******`);
        });
      });
    });
  });

  describe('SSO V2/Auth Credential Prefill', () => {
    it(`Get Launch URL for Credentialed`, () => {
      const prefillBody = ssoCredentialedBodyV2;
      sloth.postSSOInitialization(prefillBody).then((response) => {
        expect(response.body.launchURL).to.exist;
        const launchURL = response.body.launchURL;
        expect(response.body.launchToken).to.exist;
        const launchToken = response.body.launchToken;

        sloth.getSSOFetchPrefill(launchToken).then((response) => {
          // cy.log(JSON.stringify(response.body));
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.user).to.exist;
          expect(prefill.user.username).to.equal(ssoCredentialedBodyV2.user.username);
          expect(prefill.user.guarantor_id).to.equal(ssoCredentialedBodyV2.user.guarantor_id);
          expect(prefill.user.phone).to.equal(ssoCredentialedBodyV2.user.phone);
          expect(prefill.user.email).to.equal(ssoCredentialedBodyV2.user.email);
          expect(prefill.options).to.exist;
          expect(prefill.options.credentialed).to.equal(true);
        });
      });
    });
  });

  describe('SSO V3/Auth QuickPay Prefill', () => {
    it('SSO Minimum Request, Fetch Prefill Response, and validate Bearer token, logout', () => {
      sloth.postSSOInitialization(qpPrefillBodyV3, sloth.ssoV3Settings).then((response) => {
        expect(response.body.launchURL).to.exist;
        const launchURL = response.body.launchURL;
        expect(response.body.launchToken).to.exist;
        const launchToken = response.body.launchToken;
        cy.log(launchToken);
        cy.log(launchURL);
        expect(launchURL).to.contain(launchToken);
        expect(launchURL).to.contain('/iframe/#/sso/v3');

        sloth.getSSOFetchPrefill(launchToken, sloth.ssoV3Settings).then((response) => {
          cy.log(JSON.stringify(response.body));
          expect(response.body.token).to.be.a('string');
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.options).to.exist;
          expect(prefill.accounts).to.exist;
          const account = prefill.accounts[0];
          expect(account.location_id).to.be.equal(sloth.providerLocationId);
          expect(account.firstname).to.be.equal(qpPrefillBodyV3.accounts[0].firstname);
          expect(account.lastname).to.be.equal(qpPrefillBodyV3.accounts[0].lastname);
          expect(account.account_number).to.be.equal(qpPrefillBodyV3.accounts[0].account_number);
          expect(account.email).to.be.equal(qpPrefillBodyV3.accounts[0].email);
          expect(account.phone).to.be.equal(qpPrefillBodyV3.accounts[0].phone);
          expect(account.amount).to.be.equal(qpPrefillBodyV3.accounts[0].amount);

          sloth.validateToken(response.body.token).then((response) => {
            expect(response.status).to.be.eq(200);
          });
          sloth.logout(response.body.token).then((response) => {
            expect(response.status).to.be.eq(200);
          });
          sloth.validateToken(response.body.token).then((response) => {
            expect(response.status).to.be.eq(401);
          });
        });
      });
    });
    it(`Get Launch URL and Prefill Data`, () => {
      const prefillBody = qpPrefillBodyV3;
      sloth.postSSOInitialization(prefillBody, sloth.ssoV3Settings).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;
        cy.log(launchToken);
        cy.log(launchURL);

        sloth.getSSOFetchPrefill(launchToken, sloth.ssoV3Settings).then((response) => {
          cy.log(JSON.stringify(response.body));
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.accounts[0].account_reference_number).to.exist;
          cy.log(JSON.stringify(prefill.accounts[0]));
        });
      });
    });

    it(`SPL - Get Launch URL and Redacted Prefill Data using 48h launch_duration`, () => {
      const prefillBody = qpPrefillBodyV3;
      prefillBody.options.launch_duration = '48h';
      sloth.postSSOInitialization(prefillBody, sloth.ssoV3Settings).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;
        cy.log(launchToken);
        cy.log(launchURL);

        sloth.getSSOFetchPrefill(launchToken, sloth.ssoV3Settings).then((response) => {
          cy.log(JSON.stringify(response.body));
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          const account = prefill.accounts[0];
          expect(account.account_reference_number).to.exist;
          expect(account.account_number).not.to.equal(prefillBody.accounts[0].account_number);
          // account_number redacted?
          const account_number = prefillBody.accounts[0].account_number;
          const account_number_last = account_number.substring(account_number.length - 2);
          expect(account.account_number).to.eq(`*******${account_number_last}`);
          // secondary_account_number redacted?
          if (prefillBody.accounts[0].secondary_account_number) {
            expect(account.secondary_account_number).not.to.equal(prefillBody.accounts[0].secondary_account_number);
            const secondary_account_number = prefillBody.accounts[0].secondary_account_number;
            const secondary_account_number_last = secondary_account_number.substring(
              secondary_account_number.length - 2
            );
            expect(account.secondary_account_number).to.eq(`*******${secondary_account_number_last}`);
          }

          // firstname redacted?
          expect(account.firstname).not.to.equal(prefillBody.accounts[0].firstname);
          expect(account.firstname).to.eq(`*******`);
          // lastname redacted?
          expect(account.lastname).not.to.equal(prefillBody.accounts[0].lastname);
          expect(account.lastname).to.eq(`*******`);
          // email redacted?
          expect(account.email).not.to.equal(prefillBody.accounts[0].email);
          expect(account.email).to.eq(`*******`);
          // phone redacted?
          expect(account.phone).not.to.equal(prefillBody.accounts[0].phone);
          expect(account.phone).to.eq(`*******`);
        });
      });
    });
  });

  describe('SSO V3/Auth HPP Prefill', () => {
    it(`HPP - Get Launch URL and Prefill Data`, () => {
      const prefillBody = hppPrefillBodyV3;
      sloth.postSSOInitialization(prefillBody, sloth.ssoV3HPPSettings).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;
        expect(launchURL).to.contain(`/sso/v3`);
        expect(launchURL).not.to.contain('/#/sso');
        cy.log(launchToken);
        cy.log(launchURL);

        sloth.getSSOFetchPrefill(launchToken, sloth.ssoV3HPPSettings).then((response) => {
          cy.log(JSON.stringify(response.body));
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.accounts).to.exist;
          const account = prefill.accounts[0];
          expect(account.firstname).to.exist;
          expect(account.firstname).to.equal(prefillBody.accounts[0].firstname);
          expect(account.lastname).to.exist;
          expect(account.lastname).to.equal(prefillBody.accounts[0].lastname);
        });
      });
    });

    // test launch_duration: '48s'
    it(`HPP - Get Launch URL and Redacted Prefill Data with launch_duration > 15m`, () => {
      const prefillBody = hppPrefillBodyV3;
      prefillBody.options.launch_duration = '24h';
      sloth.postSSOInitialization(prefillBody, sloth.ssoV3HPPSettings).then((response) => {
        const launchURL = response.body.launchURL;
        const launchToken = response.body.launchToken;
        cy.log(launchToken);
        cy.log(launchURL);

        sloth.getSSOFetchPrefill(launchToken, sloth.ssoV3HPPSettings).then((response) => {
          cy.log(JSON.stringify(response.body));
          expect(response.body.prefillData).to.exist;
          const prefill = response.body.prefillData;
          expect(prefill.options.launch_duration).to.equal('24h0m0s');
          expect(prefill.accounts).to.exist;
          const account = prefill.accounts[0];
          // account_number redacted?
          expect(account.account_number).not.to.equal(prefillBody.accounts[0].account_number);
          const account_number = prefillBody.accounts[0].account_number;
          const account_number_last = account_number.substring(account_number.length - 2);
          expect(account.account_number).to.eq(`*******${account_number_last}`);
          // secondary_account_number redacted?
          if (prefillBody.accounts[0].secondary_account_number) {
            expect(account.secondary_account_number).not.to.equal(prefillBody.accounts[0].secondary_account_number);
            const secondary_account_number = prefillBody.accounts[0].secondary_account_number;
            const secondary_account_number_last = secondary_account_number.substring(
              secondary_account_number.length - 2
            );
            expect(account.secondary_account_number).to.eq(`*******${secondary_account_number_last}`);
          }
          expect(account.firstname).to.exist;
          expect(account.firstname).not.to.equal(prefillBody.accounts[0].firstname);
          expect(account.lastname).to.exist;
          expect(account.lastname).not.to.equal(prefillBody.accounts[0].lastname);
        });
      });
    });
  });

  describe.skip('Sloth clientCred', () => {
    it(`Get clientCred`, () => {
      sloth.getClientCred().then((response) => {
        cy.log(JSON.stringify(response.body));
      });
    });
  });
});
*/
