const fcm = require('fcm-notification');
const path = require('path');
// var FCM = new fcm(path.resolve(__dirname, '../..', 'firebase-service-account.json'));
let FCM = new fcm(process.env.FCM_API_KEY);
const Promise = require('bluebird');


FCM = Promise.promisifyAll(FCM);

/*
Example usage:
var token = 'fcm-token';
 
var message = {
  data: {    //This is only optional, you can send any data
    reportId: '5bea0fd2e6820c000f8345a7',
    reportName: 'Test'
  },
  notification:{
    title : 'Title of notification',
    body : 'Body of notification'
  },
  android: {
    ttl: 3600 * 1000,
    notification: {
      icon: 'ic_menu_gallery',
      'click_action' : '.ReportDetailActivity', 
      'body' : 'new Report update !', 
      'title' : 'new Report update !',
      color: '#f45342',
      sound : 'default'
    },
  },
  token : token
};

FCM.sendAsync(message)
  .then(console.log);

*/
module.exports = FCM;
