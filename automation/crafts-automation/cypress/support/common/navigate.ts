// This command navigates to the attendance page.
// It logs the action and ensures the page is visible after visiting.
Cypress.Commands.add("navigateToAttendancePage", () => {
  cy.log(`Navigating to attendance page`);
  cy.visit(Cypress.env("attendancePageUrl")).then(() => {
    cy.get("body").should("be.visible");
  });
});
