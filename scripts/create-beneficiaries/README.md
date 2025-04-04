# Create Beneficiaries from CSV (Airwallex)

This script reads a CSV file and creates beneficiaries via the Airwallex API using the `/v1/beneficiaries/create` endpoint.

---

## Requirements

- Node.js
- NPM packages:
  - `axios`
  - `csv-parser`

## CSV Format Notes

If your CSV has additional fields or uses different field names, you will need to:
- Update the CSV column headers
- Modify the payload object inside the script to map those fields accordingly
