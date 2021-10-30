const express =  require('express');
const axios = require('axios');
const cron = require('node-cron');
const FormData = require('form-data');
const http = require('http');
const https = require('https');


const app = express();
const httpsAgent = new https.Agent({ keepAlive: false });
const httpAgent = new http.Agent({ keepAlive: false });



cron.schedule('*/10 * * * * *', vote);
// vote();

async function vote () {
  console.log('running vote task');

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

  console.log(response);
};

// vote();


const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

