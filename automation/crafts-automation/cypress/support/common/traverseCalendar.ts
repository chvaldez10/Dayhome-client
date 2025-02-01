import { getExpectedDaysInMonth } from "@utils/dateUtils";
import { padNumber } from "@utils/helpers";

Cypress.Commands.add(
  "traverseDate",
  (month: number, monthName: string, year: number) => {
    const expectedDays = getExpectedDaysInMonth(month, year);
    const monthPadded = padNumber(month);
    const timeoutTime = 5000;
    const waitTime = 3000;

    cy.log(`Traversing date for month: ${month} and year: ${year}`);
    cy.clickDateInput(monthName);

    // GIVEN expected days array
    // WHEN we traverse the array and click on each day
    // THEN all days in the array should all exist
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
