const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');

const API_URL = 'https://api-demo.airwallex.com/api/v1/beneficiaries/create';
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiY2xpZW50IiwiZGMiOiJISyIsImRhdGFfY2VudGVyX3JlZ2lvbiI6IkhLIiwiaXNzZGMiOiJVUyIsImp0aSI6IjYxMzgzZWU2LTQyMzEtNGEwNC05MWJjLTU0ODViM2VjYmRjZiIsInN1YiI6ImY5MjE5NTMwLTFhNzAtNDlkMy05ZjMzLTBlYzljNjBiNzlmMiIsImlhdCI6MTc0Mzc3ODU0MCwiZXhwIjoxNzQzNzgwMzQwLCJhY2NvdW50X2lkIjoiMjZjNmNmNGEtMWVhZC00YjM0LWI2MWEtNDEwNTE2ODBiZGU4IiwiYXBpX3ZlcnNpb24iOiIyMDI0LTA5LTI3IiwicGVybWlzc2lvbnMiOlsicjphd3g6KjoqIiwidzphd3g6KjoqIl19.SjguHiRQtPWQjAVhSGiLkfjvPuMDNWz59u7C9c83XBA'; // 🔁 Replace with your real token

const beneficiaries = [];

fs.createReadStream('create_beneficiary_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Map CSV row to request format
    const payload = {
      beneficiary: {
        address: {
          city: row.address_city,
          country_code: row.address_country_code,
          postcode: row.address_postcode,
          street_address: row.address_street
        },
        bank_details: {
          account_currency: row.bank_account_currency,
          account_name: row.bank_account_name,
          bank_country_code: row.bank_country_code,
          iban: row.bank_iban
        },
        company_name: row.company_name,
        entity_type: row.entity_type,
        first_name: row.first_name,
        last_name: row.last_name
      },
      transfer_methods: ["LOCAL"],
      nickname: row.nickname
    };

    beneficiaries.push(payload);
  })
  .on('end', async () => {
    console.log(`📄 Loaded ${beneficiaries.length} beneficiaries from CSV.`);

    for (const [index, payload] of beneficiaries.entries()) {
      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'x-api-version': '2024-09-27',
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ [${index + 1}] Beneficiary created:`, response.data.id || response.data);
      } catch (error) {
        console.error(`❌ [${index + 1}] Error creating beneficiary:`, error.response?.data || error.message);
      }
    }
  });
