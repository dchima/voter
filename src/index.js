const express =  require('express');
const axios = require('axios');
const cron = require('node-cron');
const FormData = require('form-data');
const http = require('http');
const https = require('https');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const app = express();
const httpsAgent = new https.Agent({ keepAlive: false });
const httpAgent = new http.Agent({ keepAlive: false });



cron.schedule('*/60 * * * * *', vote);
// vote();


async function execute(command) {
  const { stdout, stderr } = await exec(command);
  // console.log('command output: ', stdout, 'command error: ', stderr);
  return { stdout, stderr }
};

async function vote () {
  console.log('running vote task');
  const vpn_on = await execute('sudo protonvpn c -r');
  if (vpn_on.stderr) { console.log('did not connect vpn. killing function'); return; }
  console.log('connected to vpn');


  const url = 'https://africahousingawards.com/wp-admin/admin-ajax.php?action=totalpoll';

  const headers = {
    'Content-Type': 'multipart/form-data',
    Accept: '*/*',
    Connection: "keep-alive",
    Origin: 'https://africahousingawards.com',
    Referer: 'https://africahousingawards.com/poll/mortgage-bank-of-the-year/',
    'Accept-Encoding': 'gzip'
  };

  const formData = new FormData();
  formData.append('totalpoll[choices][21a69dea-a736-42e2-a44a-64cf03166163][]', '0ad8bcfd-0164-49bd-8501-fe43c10b4f25');
  formData.append('totalpoll[screen]', 'vote');
  formData.append('totalpoll[pollId]', '5018');
  formData.append('totalpoll[action]', 'vote');

  const response = await axios.post(
    url,
    formData,
    {
      headers: formData.getHeaders(),
      httpsAgent,
      httpAgent,
      // timeout: 100000
    },
  );

  if (response.data.includes('thankyou')) console.log('voted')
    else console.log('did not vote')
  
    const vpn_off = await execute('sudo protonvpn d');
    if (vpn_on.stderr) { console.log('did not disconnect vpn'); return; }
    console.log('disconnected from vpn');
    console.log('---------------------------------------')
    console.log('---------------------------------------')
};

// vote();


const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

