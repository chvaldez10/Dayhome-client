import { getExpectedDaysInMonth } from "@utils/dateUtils";
import { padNumber } from "@utils/helpers";

const attendanceRequestAlias = "attendanceJson";
const attendanceRequestUrl = "**/Attendance/GetJsonResultOnlineAttendance";
const tableRefreshTimeout = 20000;
type DatePickerPaceDelaySeconds = 1 | 2 | 3 | 4 | 5;

const datePickerPaceDelaySeconds: DatePickerPaceDelaySeconds = 5;
const datePickerPaceDelay = datePickerPaceDelaySeconds * 1000;

interface DownloadFileStats {
  exists: boolean;
  modifiedAt: number;
  size: number;
}

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
    const { expectedCraftsCsv: sourceDownloadFile } = Cypress.env() as {
      expectedCraftsCsv?: string;
    };

    if (!sourceDownloadFile) {
      throw new Error(
        "EXPECTED_CRAFTS_CSV must point to the CSV downloaded by the browser.",
      );
    }

    cy.log(`Traversing date for month: ${month} and year: ${year}`);
    cy.intercept("POST", attendanceRequestUrl).as(attendanceRequestAlias);
    cy.clickDateInput(monthName);

    expectedDays.forEach((day, numDays) => {
      numDays += 1;
      const dayPadded = padNumber(numDays);
      const outputFilename = `cypress/downloads/${year}-${monthPadded}-${dayPadded}.csv`;

      cy.get("#attendanceTable tbody").should("be.visible");
      cy.clickDateInput(monthName);
      cy.wait(datePickerPaceDelay);
      cy.get(`.flatpickr-day[aria-label="${day}"]`)
        .should("be.visible")
        .then(($day) => {
          const isAlreadySelected = $day.hasClass("selected");

          cy.wrap($day).click();
          cy.wait(datePickerPaceDelay);

          if (!isAlreadySelected) {
            cy.wait(`@${attendanceRequestAlias}`, {
              timeout: tableRefreshTimeout,
            })
              .its("response.statusCode")
              .should("eq", 200);
          }

          cy.get("#attendanceTable tbody", {
            timeout: tableRefreshTimeout,
          }).should("be.visible");
          cy.get("#attendanceTable_info", { timeout: tableRefreshTimeout })
            .should("be.visible")
            .and("contain", "entries");

          cy.task<DownloadFileStats>("getFileStats", sourceDownloadFile).then(
            (previousDownloadStats) => {
              cy.get("a.buttons-csv span")
                .contains("CSV")
                .should("be.visible")
                .click();

              cy.task("waitForFreshFile", {
                filePath: sourceDownloadFile,
                previousStats: previousDownloadStats,
                timeoutMs: tableRefreshTimeout,
              });

              cy.readFile(sourceDownloadFile, "binary", {
                timeout: tableRefreshTimeout,
              }).then((fileContent) => {
                cy.writeFile(outputFilename, fileContent, "binary");
                cy.wait(datePickerPaceDelay);
              });
            },
          );
        });
    });
  },
);
