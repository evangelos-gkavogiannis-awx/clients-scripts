/*
Assumptions
Your CSV file is called cardholders_for_cards.csv and each row has at least the column cardholder_id.
You may add any other properties per card (e.g., created_by, form factor, etc.) as columns in your CSV, if you wish them to differ per card.
You’ll need to replace the API token, x-on-behalf-of, and API version as required.
The script demonstrates basic error handling and sequential requests for clarity.
*/


const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');

const API_URL = 'https://api-demo.airwallex.com/api/v1/issuing/cards/create';
const TOKEN = 'YOUR_TOKEN'; // 🔁 Replace with your actual Bearer token
const X_ON_BEHALF_OF = 'YOUR_ACCOUNT_ID'; // 🔁 Replace with your x-on-behalf-of value
const API_VERSION = '2025-08-29';

const cardsToCreate = [];

fs.createReadStream('cardholders_for_cards.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Compose the payload per row
    const payload = {
      authorization_controls: {
        allowed_currencies: [],
        allowed_merchant_categories: [],
        allowed_transaction_count: 'MULTIPLE',
        blocked_transaction_usages: [],
        transaction_limits: {
          currency: 'EUR',
          limits: [
            {
              amount: 12,
              interval: 'MONTHLY'
            },
            {
              amount: 10000.0,
              interval: 'PER_TRANSACTION'
            }
          ]
        }
      },
      is_personalized: true,
      program: {
        purpose: 'COMMERCIAL',
        type: 'DEBIT'
      },
      created_by: row.created_by || 'YourName', // Or hardcode as necessary
      form_factor: row.form_factor || 'VIRTUAL',
      cardholder_id: row.cardholder_id,
      request_id: row.request_id || `${row.cardholder_id}-${Date.now()}`
    };

    cardsToCreate.push(payload);
  })
  .on('end', async () => {
    console.log(`Loaded ${cardsToCreate.length} cards to create from CSV.`);

    for (const [index, payload] of cardsToCreate.entries()) {
      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'x-on-behalf-of': X_ON_BEHALF_OF,
            'x-api-version': API_VERSION,
            'Content-Type': 'application/json'
          }
        });

        console.log(`[${index + 1}] Card created:`, response.data.id || response.data);
      } catch (error) {
        console.log(payload)
        console.error(`[${index + 1}] Error issuing card:`, error.response?.data || error.message);
      }
    }
  });