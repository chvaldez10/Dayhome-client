Cypress.Commands.add("clickDateInput", (monthName: string) => {
  cy.get("input[placeholder='Pick date']").click();
  cy.get(".flatpickr-current-month .cur-month").should("contain", monthName);
});
