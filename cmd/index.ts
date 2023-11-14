import fs from "fs";
import process from "process";
import { parseMintCsv, valueRecordsToMonarchAccountBalanceCsv } from "../src/mint-monarch";

const fsPromises = fs.promises;

main();

async function main(): Promise<void> {
  if (process.argv.length !== 5) {
    console.log(`\nUsage: ${process.argv0} accountName inputMintFile outputMonarchFile\n`);
    return;
  }
  const accountName = process.argv[2];
  const inputFile = process.argv[3];
  const outFile = process.argv[4];

  const mintCsvString = await fsPromises.readFile(inputFile, "utf-8");
  const records = parseMintCsv(accountName, mintCsvString);
  const monarchCsvString = valueRecordsToMonarchAccountBalanceCsv(records);

  await fsPromises.writeFile(outFile, monarchCsvString, "utf-8");

  console.log(`\nWrote Monarch csv file to ${outFile}\n`);
}



