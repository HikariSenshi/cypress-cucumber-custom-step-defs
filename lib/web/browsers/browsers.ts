export module Browsers{

    import Chainable = Cypress.Chainable;

    export interface Browser{

        url: Chainable<String>;

        checkUrlInclude(expected: string);
        checkUrlMatch(expected: string);
        checkTitleMatch(expected: string);
        checkTitleInclude(expected: string);
        setViewport(width: number, height: number);
        open(url: string, timeout?: number);
    }

    export class CypressBrowser implements Browser{

        url: Chainable<String>;

        constructor() {

        }
        setViewport(browserWidth: number, browserHeight: number){
            cy.viewport(browserWidth, browserHeight);
        }

        checkUrlMatch(expected: string): CypressBrowser {
            cy.url().should('eq', expected);
            return this;
        }

        checkUrlInclude(expected: string): CypressBrowser {
            cy.url().should('include', expected);
            return this;
        }

        checkTitleMatch(expected: string): CypressBrowser {
            cy.title().should('contain', expected)
            return this;
        }

        checkTitleInclude(expected: string): CypressBrowser {
            cy.url().should('include', expected)
            return this;
        }
        open(url: string, timeout: number): CypressBrowser {
            cy.visit(url, {timeout: timeout});
            return this;
        }

    }

}

