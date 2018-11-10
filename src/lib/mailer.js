const sgMail = require('@sendgrid/mail');
const config = require('../config');
const CONFIG = config[process.env.NODE_ENV || 'development'];
const Promise = require('bluebird');

// for costumized mails
const sg = require('sendgrid')(CONFIG.SENDGRID.SENDGRID_API_KEY);
const sgMailHelper = require('sendgrid').mail;

const internals = {};
internals.send = (msg) => {
  return new Promise((resolve) => {
    sgMail.setApiKey(CONFIG.SENDGRID.SENDGRID_API_KEY);
    sgMail.send(msg)
      .then((result) => {
        const res = result || {};
        res.success = true;
        resolve(res);
      })
      .catch((error) => {
        const res = error || {};
        res.success = false;
        resolve(res);
      });
  });
};

function simpleMail (sender, receiver, subject, htmlMessage, cc = null)  {
  const msg = {
    to: receiver,
    from: sender,
    subject: subject,
    html: htmlMessage
  };
  sgMail.setApiKey(CONFIG.SENDGRID.SENDGRID_API_KEY);
  return sgMail.send(msg);
}

function bulkSimpleMail (emails) {
  const messages = emails.map((email) => {
    return {
      to: email.receiver,
      from: email.sender,
      subject: email.subject,
      html: email.htmlMessage
    };
  });

  return Promise.map(messages, internals.send);
}

function mailWithCC (sender, receiver, subject, htmlMessage, cc, senderName) {
  const sgSender = new sgMailHelper.Email(sender, senderName||'');
  const sgReceiver = new sgMailHelper.Email(receiver);
  const sgContent = new sgMailHelper.Content('text/html', htmlMessage);
  const sgSubject = subject;
  const mailObj = new sgMailHelper.Mail(sgSender, sgSubject, sgReceiver, sgContent);
  for (let i = 0; i < cc.length; i++) {
    mailObj.personalizations[i].addCc(new sgMailHelper.Email(cc[i]));
  }
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mailObj.toJSON()
  });
  const sendMessageAPI = Promise.promisify(sg.API);
  return sendMessageAPI(request);
}


module.exports = {
  simpleMail,
  bulkSimpleMail,
  mailWithCC
};
