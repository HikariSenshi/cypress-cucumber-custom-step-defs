import {Environment} from "../../lib/env/environment";
import FileStorage = Environment.FileStorage;
import ProviderEnvironmentManager from "../../lib/provider/env/ppenv";
import CypressStorage = Environment.CypressStorage;
import PPV4EnvironmentManager from "../../lib/project2/env/ppv4env";
import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Given(`Framework with browserify is configured`, () => {
  cy.visit('https://google.com')
});

When('I use Cypress Promise to test a table', async () => {
  cy.visit('https://www.w3schools.com/html/html_tables.asp', {timeout: 10000});

  let providerUserDataRows = await new Cypress.Promise((resolve, reject) => {
    let arr: Array<any> = [];
    console.log('before')
    cy.get('#customers').find('tbody').find('tr')
        .each(($el, index) => {
          console.log('each')
          console.log($el)
          arr.push($el);
        }).then(() => resolve(arr))
  });
  console.log('here')
  console.log(providerUserDataRows);

});

Then(`I also want to check environment module!`, () => {
  let fileStorage = new FileStorage('provider')

  let provEnvironmentManager = new ProviderEnvironmentManager(new FileStorage("provider"),
      new Environment.EnvironmentProfile(new CypressStorage().valueFromCypress("profile")));

  let p4env = new PPV4EnvironmentManager(new FileStorage("patientV4"),
      new Environment.EnvironmentProfile(new CypressStorage().valueFromCypress("profile")));

  cy.log(p4env.data.baseUrl);
  cy.log(provEnvironmentManager.data.baseUrl);

});

Then(/^I want to print <(.*)> to the console$/, function (param: string) {
  cy.log(param)
});
