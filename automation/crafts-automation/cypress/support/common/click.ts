/**
 * Clicks on the date input field and verifies the current month displayed.
 *
 * @param {string} monthName - The name of the month to verify after clicking.
 */
Cypress.Commands.add("clickDateInput", (monthName: string) => {
  cy.get("input[placeholder='Pick date']").click();
  cy.get(".flatpickr-current-month .cur-month").should("contain", monthName);
});
