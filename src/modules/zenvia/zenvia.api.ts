import axios from 'axios';

const apiToken = 'YOUR_API_TOKEN';

export const zenviaApi = axios.create({
  baseURL: 'https://api.zenvia.com/v2',
  headers: {
    'X-API-TOKEN': apiToken,
  },
});
