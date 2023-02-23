// service.js
const { google } = require('googleapis');
const path = require('path');

const getDriveService = () => {
  const KEYFILEPATH = path.join(__dirname, '47791b19f481bf27323eefd5877b09f95e0bf189');
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: 'v3', auth });
  return driveService;
};

module.exports = getDriveService;



