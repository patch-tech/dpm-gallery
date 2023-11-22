# Customer-facing dashboard with Snowflake

This demo app shows how to build a production-grade dashboard with Snowflake data. To ensure the page loads very fast initially and when users change filters or time grains, the data is served from Patch's high performance query engine.

The stack includes:
- Snowflake as the origin data source
- Patch's data packages as the query interface
- Patch's high performance serving layer (i.e. the data package is in [Accelerated mode](https://docs.dpm.sh/building-online-apps/)
- [Tremor charts](https://www.tremor.so/)

## Running the app

Prerequisites:
1. Ensure you have a Patch account - https://cloud.dpm.sh/login. 
2. Install the Patch `dpm` CLI utility - https://github.com/patch-tech/dpm#installation.
3. Log into the `dpm` CLI by running `dpm login` and follow the prompts. This will save credentials on your file system that will be used to authorize queries.

Then, to run the app locally:
1. Clone this repo.
2. In the ` engagement-dashboard-snowflake` directory, run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000/` in your browser.
