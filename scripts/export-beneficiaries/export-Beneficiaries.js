const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

const API_URL = 'https://api-demo.airwallex.com/api/v1/beneficiaries'; //replace with prod url
const TOKEN = 'your_access_token'; // Replace with your token

(async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const items = response.data.items;

    const records = items.map(item => {
      const b = item.beneficiary || {};
      const bank = b.bank_details || {};
      const address = b.address || {};
      const info = b.additional_info || {};

      return {
        id: item.id,
        nickname: item.nickname,
        entity_type: b.entity_type,
        first_name: b.first_name || '',
        last_name: b.last_name || '',
        date_of_birth: b.date_of_birth || '',
        account_name: bank.account_name || '',
        account_number: bank.account_number || '',
        account_currency: bank.account_currency || '',
        bank_name: bank.bank_name || '',
        iban: bank.iban || '',
        swift_code: bank.swift_code || '',
        bank_country_code: bank.bank_country_code || '',
        bank_account_category: bank.bank_account_category || '',
        city: address.city || '',
        country_code: address.country_code || '',
        street_address: address.street_address || '',
        postcode: address.postcode || '',
        mobile_number: info.personal_mobile_number || '',
        personal_id_number: info.personal_id_number || ''
      };
    });

    const parser = new Parser({
      quote: '', // ⛔️ This disables quote wrapping
      delimiter: ',', // (optional) set custom delimiter
      header: true
    });

    const csv = parser.parse(records);

    fs.writeFileSync('beneficiaries.csv', csv, { encoding: 'utf8' });
    console.log('✅ beneficiaries.csv created without quotes.');
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
})();
