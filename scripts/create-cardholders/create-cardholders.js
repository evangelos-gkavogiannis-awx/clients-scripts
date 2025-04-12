const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');

const API_URL = 'https://api-demo.airwallex.com/api/v1/issuing/cardholders/create';
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiY2xpZW50IiwiZGMiOiJISyIsImRhdGFfY2VudGVyX3JlZ2lvbiI6IkhLIiwiaXNzZGMiOiJVUyIsImp0aSI6ImZmZDYwOTU5LWQwM2EtNDMzYS1hZDY0LWJkYjU0MTFkYjUwZCIsInN1YiI6ImY5MjE5NTMwLTFhNzAtNDlkMy05ZjMzLTBlYzljNjBiNzlmMiIsImlhdCI6MTc0NDQ5NzQxOSwiZXhwIjoxNzQ0NDk5MjE5LCJhY2NvdW50X2lkIjoiMjZjNmNmNGEtMWVhZC00YjM0LWI2MWEtNDEwNTE2ODBiZGU4IiwiYXBpX3ZlcnNpb24iOiIyMDI0LTA5LTI3IiwicGVybWlzc2lvbnMiOlsicjphd3g6KjoqIiwidzphd3g6KjoqIl19.Pw9LiNL_oSh5FNFWRCDzp1xG5nBgutndKerHmK1Z6UA'; // 🔁 Replace with your real token

const cardholders = [];

fs.createReadStream('cardholders_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    const payload = {
      type: row.entity_type, // INDIVIDUAL or COMPANY
      email: row.email,
      individual: {
        name:{
          first_name: row.first_name,
          last_name: row.last_name,
        },
        date_of_birth: row.date_of_birth, // format: YYYY-MM-DD
        nationality: row.nationality,
        express_consent_obtained: 'yes',
        address: {
          line1: row.address_street,
          city: row.address_city,
          postcode: row.address_postcode,
          country: row.address_country_code
        },
        identification_number: row.identification_number,
        identification_type: row.identification_type // E.g., "PASSPORT", "NATIONAL_ID"
      }
    };

    cardholders.push(payload);
  })
  .on('end', async () => {
    console.log(`Loaded ${cardholders.length} cardholders from CSV.`);

    for (const [index, payload] of cardholders.entries()) {
      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'x-api-version': '2024-09-27',
            'Content-Type': 'application/json'
          }
        });

        console.log(` [${index + 1}] Cardholder created:`, response.data.id || response.data);
      } catch (error) {
        console.log(payload)
        console.error(`[${index + 1}] Error creating cardholder:`, error.response?.data || error.message);
      }
    }
  });
