if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../../util/e2e-helpers');
  const Timeouts = require('../../util/timeouts.js');
  const DisabilityHelpers = require('../../util/disability-helpers');
  const LoginHelpers = require('../../util/login-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      DisabilityHelpers.initClaimsListMock();

      LoginHelpers.logIn(client, '/disability-benefits/track-claims', 3);

      // Claim is visible
      client
        .url(`${E2eHelpers.baseUrl}/disability-benefits/track-claims`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Track Claims: Vets.gov')
        .waitForElementVisible('a.claim-list-item', Timeouts.normal);

      // Combined claim link
      client
        .click('a.claims-combined')
        .waitForElementVisible('.claims-status-upload-header', Timeouts.normal);
      client
        .expect.element('.claims-status-upload-header').text.to.equal('Claim status update');
      client
        .click('.va-modal-body .usa-button')
        .waitForElementNotPresent('.claims-status-upload-header', Timeouts.normal);

      // Verify text on page
      client
        .expect
        .element('.your-claims h1')
        .text.to.equal('Your Claims');

      client
        .expect
        .element('.claim-list-item-header')
        .text.to.equal('Disability Compensation Claim');

      // Click to detail view
      client
        .click('a.claim-list-item:first-child')
        .assert.urlContains('/your-claims/11/status');

      client.end();
    }
  );
}
