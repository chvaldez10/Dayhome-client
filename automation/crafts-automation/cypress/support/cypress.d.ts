declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<Element>;
    navigateToAttendancePage(): Chainable<Element>;
    traverseDate(
      month: number,
      monthName: string,
      year: number
    ): Chainable<Element>;
    clickDateInput(monthName: string): Chainable<Element>;
  }
}
