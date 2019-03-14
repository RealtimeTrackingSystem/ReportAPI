function sendAPIKey (client, organization) {
  const mailString
    = `
      <p>Greetings!</p>
      </br>
      <p>You are now regsitered to REPORT API</p>
      <p>Here are your credentials: </p>
      <p>Email: ${client.email}</p>
      <p>Subscription Type: ${client.subscriptionType}</p>
      <p>Organization Name: ${organization ? organization.name : '-'}</p>
      <p>API KEY: ${client.apiKey}</p>
      </br>
      <p>Thank you very much</p>
      <p>Sincerely,</p>
      <p>REPORT API</p>
    `;
  return mailString;
}

function reporterNewReport (report, reporter) {
  const mailString 
    = `
    <p>Good Day ${reporter.gender == 'M' ? 'Mr.' : 'Ms.'} ${reporter.fname},</p>
    </br>
    <p>Your Report Has Been Sent</p>
    <p>Report Details: </p>
    <p>Title: ${report.title}</p>
    <p>Description: ${report.description}</p>
    <p>Location: ${report.location}</p>
    <p>Urgency: ${report.urgency}</p>
    <p>Coordinates: (${report.long}, ${report.lat})</p>
    </br>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailString;
}

function hostNewReport (report, host) {
  const mailString 
    = `
    <p>Greetings HOST: ${host.name}</p>
    </br>
    <p>You Received a new Report</p>
    <p>Report Details: </p>
    <p>Title: ${report.title}</p>
    <p>Description: ${report.description}</p>
    <p>Location: ${report.location}</p>
    <p>Urgency: ${report.urgency}</p>
    <p>Coordinates: (${report.long}, ${report.lat})</p>
    </br>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailString;
}

function reporterReportUpdate (report, reporter) {
  const mailString
    = `
    <p>Good Day ${reporter.gender == 'M' ? 'Mr.' : 'Ms.'} ${reporter.fname},</p>
    </br>
    <p>Your Report Has Been Updated to: ${report.status}</p>
    <p>Report Details: </p>
    <p>Title: ${report.title}</p>
    <p>Description: ${report.description}</p>
    <p>Location: ${report.location}</p>
    <p>Urgency: ${report.urgency}</p>
    <p>Coordinates: (${report.long}, ${report.lat})</p>
    </br>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailString;
}

function hostReportUpdate (report, host) {
  const mailString
    = `
    <p>Greetings HOST: ${host.name}</p>
    </br>
    <p>You have updated the report to: ${report.status}</p>
    <p>Report Details: </p>
    <p>Title: ${report.title}</p>
    <p>Description: ${report.description}</p>
    <p>Location: ${report.location}</p>
    <p>Urgency: ${report.urgency}</p>
    <p>Coordinates: (${report.long}, ${report.lat})</p>
    </br>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailString;
}

function hostRequestApproved (reporter) {
  const mailString
    = `
    <p>Good Day ${reporter.gender == 'M' ? 'Mr.' : 'Ms.'} ${reporter.fname},</p>
    </br>
    <p>Your request to join host has been approved</p>
    </br>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailString;
}

function hostRequestRejected (reporter) {
  const mailString
    = `
    <p>Good Day ${reporter.gender == 'M' ? 'Mr.' : 'Ms.'} ${reporter.fname},</p>
    </br>
    <p>Your request to join host has been rejected</p>
    </br>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailString;
}

module.exports = {
  sendAPIKey,
  reporterNewReport,
  hostNewReport,
  reporterReportUpdate,
  hostReportUpdate,
  hostRequestApproved,
  hostRequestRejected
};
