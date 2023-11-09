// Copyright Simi Hartstein
import { useCallback, useState } from "react";
import "./App.css";
import venmoCode from "./Venmo.jpg";
import { parseMintCsv, valueRecordsToMonarchCsv } from "./mint-monarch";

function App() {
  const [accountName, setAccountName] = useState<string>("");
  const [mintCsvText, setMintCsvText] = useState<string | undefined>(undefined);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const [monarchCsvText, setMonarchCsvText] = useState<string | undefined>(
    undefined
  );

  const onFileSelected = useCallback(
    (event: any) => {
      const inputMintFile: File = event.target.files[0];
      inputMintFile.text().then(setMintCsvText);
    },
    [setMintCsvText]
  );

  const handleSubmit = useCallback(
    (event: any) => {
      event.preventDefault();
      setErrorText("");
      setMonarchCsvText("");
      try {
        const records = parseMintCsv(accountName, mintCsvText!);
        const monarchText = valueRecordsToMonarchCsv(records);
        setMonarchCsvText(monarchText);
      } catch (err: any) {
        setErrorText(err.message);
      }
    },
    [accountName, mintCsvText, setMonarchCsvText, setErrorText]
  );

  const onSaveMonarch = useCallback(() => {
    const blob = new Blob([monarchCsvText!], { type: "Utf-8" });
    const monarchUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `Monarch-${accountName}.csv`;
    link.href = monarchUrl;
    link.click();
  }, [accountName, monarchCsvText]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Mint to Monarch account history CSV converter.
        </h2>
        <div>This tool can assist in migrating account history from Mint to Monarch.</div>
        <div>No data is uploaded. All data is processed locally.</div>
        <div className="App-see-below">See instructions at the bottom.</div>
        <form className="App-form" onSubmit={handleSubmit}>
          <div>
            <label className="App-form-label">Account Name:</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div>
            <label className="App-form-label">Mint CSV File:</label>
            <input type="file" accept=".csv" onChange={onFileSelected} />
          </div>
          <input
            className="App-form-submit"
            type="submit"
            value="Convert to Monarch CSV"
            disabled={!accountName || !mintCsvText}
          />
        </form>
        <label className="err-label">{errorText ? `Error: ${errorText}` : ""}</label>
        <textarea value={monarchCsvText} readOnly />
        <button className="App-form-submit saveButton" onClick={onSaveMonarch} disabled={!monarchCsvText}>
          Save Monarch CSV
        </button>
        <div className="plug-text">
          If this helped you, please consider donating so I can make more tools like this.
        </div>
        <img src={venmoCode} className="App-logo" alt="logo" />
      </header>
      <div className="App-instructions">
        <h1>Instructions</h1>
        <h3>1. Download a Mint account history CSV</h3>
        <ul>
          <li>Log in to Mint on the browser.</li>
          <li>Navigate to "Trends."</li>
          <li>Expand "Assets" and Select "Over time."</li>
          <li>
            Select one account (Monarch only supports adding history for one account at a time).
          </li>
          <li>
            Select "All Time" or whatever range you want to transfer to Monarch.
          </li>
          <li>Scroll to the bottom of the screen, click "Export to CSV". This will download trends.csv</li>
          <li>Rename trends.csv to something more meaningful so you know which account it is for.</li>
          <li>Repeat this for each account you'd like to transfer 😩</li>
        </ul>
        <h3>2. Use this website to convert your Mint CSV to a Monarch CSV.</h3>
        <ul>
          <li>Enter the name of the account you are transferring.</li>
          <li>Click the "Browse..." button and select a CSV you downloaded from Mint.</li>
          <li>Click the "Convert to Monarch CSV button". You should see the result in the window.</li>
          <li>Click the "Save Monarch CSV" button to save the file to your computer.</li>
          <li>Repeat for each CSV 😩</li>
        </ul>
        <h3>3. Upload CSV to Monarch</h3>
        <ul>
          <li>Follow the official instructions here:
            <a className="monarch-instruction-link" href="https://help.monarchmoney.com/hc/en-us/articles/14882425704212">https://help.monarchmoney.com/hc/en-us/articles/14882425704212</a>
          </li>
          <li>Repeat for each CSV 😩</li>
          <li>Success!!! 🥳</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
