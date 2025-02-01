import { getExpectedDaysInMonth } from "@utils/dateUtils";
import { padNumber } from "@utils/helpers";

Cypress.Commands.add(
  "traverseDate",
  /**
   * Traverses through the days of a specified month and year,
   * clicking on each day and downloading a corresponding CSV file.
   *
   * @param {number} month - The month to traverse (1-12).
   * @param {string} monthName - The name of the month (e.g., "January").
   * @param {number} year - The year to traverse.
   */
  (month: number, monthName: string, year: number) => {
    const expectedDays = getExpectedDaysInMonth(month, year);
    const monthPadded = padNumber(month);
    const timeoutTime = 5000;
    const waitTime = 3000;

    cy.log(`Traversing date for month: ${month} and year: ${year}`);
    cy.clickDateInput(monthName);

    expectedDays.forEach((day, numDays) => {
      numDays += 1;
      const dayPadded = padNumber(numDays);
      const outputFilename = `cypress/downloads/${year}-${monthPadded}-${dayPadded}.csv`;

      cy.clickDateInput(monthName);
      cy.get(`[aria-label='${day}']`).should("exist").click();
      cy.wait(timeoutTime);
      cy.get("a.buttons-csv span").contains("CSV").click();

      cy.readFile(Cypress.env("expectedCraftsCsv"), "binary", {
        timeout: timeoutTime,
      }).then((fileContent) => {
        cy.writeFile(outputFilename, fileContent, "binary");
      });

      cy.wait(waitTime);
    });
  }
);
