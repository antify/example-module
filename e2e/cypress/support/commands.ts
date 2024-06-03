/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('loadFixtures', () => {
	if (Cypress.env('PLAYGROUND_RUN_IN_DOCKER')) {
		cy.exec('docker exec e2e-playground sh -c "pnpm db load-fixtures core"', {timeout: 10000, log: true})
			.its('stderr')
			.should('eq', '');
	} else {
		cy.exec('cd ../ && pnpm db load-fixtures core', {timeout: 10000, log: true})
			.its('stderr')
			.should('eq', '');
	}
});

Cypress.Commands.add('truncateCars', () => {
	if (Cypress.env('PLAYGROUND_RUN_IN_DOCKER')) {
		cy.exec('docker exec e2e-playground sh -c "pnpm db truncate core --collections=cars"', {timeout: 10000, log: true})
			.its('stderr')
			.should('eq', '');
	} else {
		cy.exec('cd ../ && pnpm db truncate core --collections=cars', {timeout: 10000, log: true})
			.its('stderr')
			.should('eq', '');
	}
});
