import processed from "./sampleFiles/processedMetadata.js";
import retrieved from "./sampleFiles/retrievedMetadata.js";

import processMetadata from "./pgMetadataProcessor.js";

describe("Format Metadata Tests", () => {
  it("Should return correctly formatted metadata given sample input", () => {
    const result = processMetadata(retrieved);
    expect(result).toEqual(processed);
  });

  it("Throws an error on null or empty data", () => {
    const metadataTest = () => {
      processMetadata([]);
    };

    expect(metadataTest).toThrowError("Metadata is null or empty");
  });

  it("Throws an error on non array input", () => {
    const metadataTest = () => {
      processMetadata({});
    };

    expect(metadataTest).toThrowError(
      "Invalid data format. Column Data must be an array"
    );
  });

  it("Should match the snapshot", () => {
    const result = processMetadata(retrieved);
    expect(result).toMatchSnapshot();
  });
});
