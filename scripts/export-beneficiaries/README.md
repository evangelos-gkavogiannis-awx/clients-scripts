# Export Beneficiaries to CSV

This script fetches all beneficiaries from the Airwallex API and exports their key details into a `beneficiaries.csv` file.

---

## Setup Instructions

1. **Add your Airwallex API access token**

   Open `exportBeneficiaries.js` and:
   - replace the placeholder with your actual API token
   - replace the demo url with the production one

To obtain the access token you need to call the [Obtain Access token endpoint](https://www.airwallex.com/docs/api#/Authentication/API_Access/_api_v1_authentication_login/post) using your API keys (webapp > Account > Developer > API keys)


Run the script with `node export-beneficiaries.js`
A `beneficiaries.csv` will be created with the beneficiaries data
