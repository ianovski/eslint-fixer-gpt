import fs from "fs";

export function readJsonFile(filePath: string): any {
  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(fileContents);
    return parsedData;
  } catch (error) {
    console.error("Error reading or parsing the JSON file:", error);
    return {};
  }
}
