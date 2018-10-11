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

module.exports = {
  sendAPIKey
};
