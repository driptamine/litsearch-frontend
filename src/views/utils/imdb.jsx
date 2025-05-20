// REFERENCE: https://developer.imdb.com/documentation/api-documentation/calling-the-api/?ref_=side_nav#one-off-api-query-example-using-typescript
import { DataExchange } from "aws-sdk";
import { readFileSync } from "fs";

// Replace these 4 values with your own values
const assetId = "<Put your Asset ID here>";
const datasetId = "<Put your Dataset ID here>";
const revisionId = "<Put your Revision ID here>";
const apiKey = "<Put your API Key here>";

const path = "/v1";
const method = "POST";

// Query we saved earlier
const titanicRatingsQuery = readFileSync(
  "./titanicRatingsQuery.graphql",
  "utf-8"
);

const body = JSON.stringify({ query: titanicRatingsQuery });

const dataExchangeClient = new DataExchange({ region: "us-east-1" });

(async () => {
  try {
    const response = await dataExchangeClient
      .sendApiAsset({
        AssetId: assetId,
        Body: body,
        DataSetId: datasetId,
        RequestHeaders: { "x-api-key": apiKey },
        Method: method,
        Path: path,
        RevisionId: revisionId,
      })
      .promise();
    console.log(JSON.stringify(JSON.parse(response.Body!), null, 4));
  } catch (error: any) {
    console.error(`Request failed with error: ${error}`);
  }
})();
