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
          Mint to Monarch account history csv converter.
        </h2>
        <div>No data is uploaded. All data is processed locally.</div>
        <div className="App-see-below">See instructions below.</div>
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
          If this helped you, please consider donating so I can make more projects like this.
        </div>
        <img src={venmoCode} className="App-logo" alt="logo" />
      </header>
      <div className="App-instructions">
        <h1>Instructions</h1>
        <div>
          <h3>To Download Mint CSV</h3>
          <ul>
            <li>Login to Mint on the browser</li>
            <li>Navigate to "Trends"</li>
            <li>Expand "Assets" and Select "Over time"</li>
            <li>
              Select one account (Monarch only supports one account at a time)
            </li>
            <li>
              Select "All Time" or whatever range you want to transfer to Monarch.
            </li>
            <li>Scroll to the bottom of the screen, click "Export to CSV"</li>
          </ul>
        </div>
        <h3>
          To Upload CSV to Monarch
        </h3>
        <div>Follow instructions here: 
          <a className="monarch-instruction-link" href="https://help.monarchmoney.com/hc/en-us/articles/14882425704212">https://help.monarchmoney.com/hc/en-us/articles/14882425704212</a>
        </div>
      </div>
    </div>
  );
}

export default App;
