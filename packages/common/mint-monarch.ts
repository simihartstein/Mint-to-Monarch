
export type ValueRecord = {
  account: string,
  date: Date,
  value: number
}

export function parseMintCsv(accountName: string, csvDataString: string): ValueRecord[] {
  const csvLines = csvDataString.split('\n');

  if (csvLines.length === 0) {
    throw new Error("This doesn't look like a Mint CSV file");
  }

  const headers = csvLines[0].split(',');

  if (headers.length !== 2
    || headers[0] !== '"DATES"'
    || headers[1] !== '"Assets"'
  ) {
    throw new Error("This doesn't look like a Mint CSV file");
  }

  const csvDataLines = csvLines.slice(1);
  const records: ValueRecord[] = [];

  for (const line of csvDataLines) {
    if (line.length === 0)
      continue;
    // parse values removing leading and trailing quotes and $ and filtering ,
    const dateString = line.slice(1, line.indexOf(',') - 1);
    const amountString = line.slice(line.indexOf(',') + 3, -1).replace(',', '');
    
    const record: ValueRecord = {
      account: accountName,
      date: new Date(dateString),
      value: Number.parseFloat(amountString),
    }
    records.push(record);
  }

  return records;
}

export function valueRecordsToMonarchCsv(records: ValueRecord[]): string {

  let monarchCsvLines: string[] = ['"Date", "Amount", "Account Name"'];

  for (const record of records) {
    const formattedDate = `${record.date.getFullYear()}-${record.date.getMonth() + 1}-${record.date.getDate()}`;
    monarchCsvLines.push(`"${formattedDate}","${record.value.toFixed(2)}","${record.account}"`);
  }

  return monarchCsvLines.join('\n');
}
