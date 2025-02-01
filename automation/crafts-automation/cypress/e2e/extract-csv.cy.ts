import { getCurrentDateParams } from "@utils/dateUtils";

describe("Extract CSV", () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");
  });

  Cypress.on("uncaught:exception", (err: Error, runnable: Mocha.Runnable) => {
    // returning false to prevent test from failing
    return false;
  });

  it("Extract csv files", () => {
    const USERNAME = Cypress.env("username");
    const PASSWORD = Cypress.env("password");
    const { monthIndex, year, monthName } = getCurrentDateParams();

    cy.login(USERNAME, PASSWORD);
    cy.navigateToAttendancePage();
    cy.traverseDate(monthIndex, monthName, year);
  });
});
