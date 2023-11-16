// @Copyright Simi Hartstein

export type ValueRecord = {
  account: string,
  date: Date,
  value: number
}

type MonarchTransaction = {
  date: Date,
  merchant: string,
  category: string,
  account: string,
  originalStatement: string,
  notes: "",
  amount: number,
  tags: ""
}

export function parseMintCsv(accountName: string, csvDataString: string): ValueRecord[] {
  const csvLines = csvDataString.split('\n');

  if (csvLines.length === 0) {
    throw new Error("This doesn't look like a Mint account balance CSV file");
  }

  const headers = csvLines[0].split(',');

  if (headers.length !== 2
    || headers[0] !== '"DATES"'
    || (headers[1] !== '"Assets"' && headers[1] !== '"Debts"')
  ) {
    throw new Error("This doesn't look like a Mint account balance CSV file");
  }

  const isDebt = headers[1] === '"Debts"';

  const csvDataLines = csvLines.slice(1);
  const records: ValueRecord[] = [];

  for (const line of csvDataLines) {
    if (line.length === 0)
      continue;
    // parse values removing leading and trailing quotes and $ and filtering ,
    const dateString = `1 ${line.slice(1, line.indexOf(',') - 1)}`;
    const amountString = line.slice(line.indexOf(',') + 2, -1).replaceAll(',', '').replaceAll('$', '');
    
    const record: ValueRecord = {
      account: accountName,
      date: new Date(dateString),
      value: Number.parseFloat(amountString),
    }
    if (isDebt) {
      record.value *= -1
    }
    records.push(record);
  }
  return records;
}


export function valueRecordsToMonarchAccountBalanceCsv(records: ValueRecord[]): string {

  let monarchCsvLines: string[] = ['"Date", "Amount", "Account Name"'];

  for (const record of records) {
    const formattedDate = formatDate(record.date);
    monarchCsvLines.push(`"${formattedDate}","${record.value.toFixed(2)}","${record.account}"`);
  }

  return monarchCsvLines.join('\n');
}

export function valueRecordsToMonarchTrasactionCsv(records: ValueRecord[]): string {

  const monarchCsvLines: string[] = [];
  monarchCsvLines.push("Date,Merchant,Category,Account,Original Statement,Notes,Amount,Tags");

  if (records.length === 0) {
    throw new Error("No account history found");
  }

  // add 0 value for initial transaction
  records.unshift({
    account: records[0].account,
    date: records[0].date,
    value: 0
  });

  let i = 0;
  while (i < records.length - 1) {
    const t = valueRecordToTransaction(records[i], records[i + 1]);
    if (t.amount === 0) {
      i++;
      continue;
    }
    monarchCsvLines.push(
      `${formatDate(t.date)},${t.merchant},${t.category},${t.account},${t.originalStatement},${t.notes},${t.amount.toFixed(2)}` // tags can be omitted
    );
    i++;
  }
  return monarchCsvLines.join('\n');
}


function formatDate(date: Date): string {
  return`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function valueRecordToTransaction(startRecord: ValueRecord, endRecord: ValueRecord): MonarchTransaction {
  return {
    account: endRecord.account,
    amount: endRecord.value - startRecord.value,
    category: "Balance Adjustments",
    date: endRecord.date,
    merchant: "Mint-to-Monarch",
    originalStatement: "Balance Adjustments",
    notes: "",
    tags: "",
  }
}