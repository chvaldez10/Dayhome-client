declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<Element>;
    navigateToAttendancePage(): Chainable<Element>;
    traverseDate(
      month: number,
      year: number,
      monthName: string
    ): Chainable<Element>;
    clickDateInput(monthName: string): Chainable<Element>;
  }
}
