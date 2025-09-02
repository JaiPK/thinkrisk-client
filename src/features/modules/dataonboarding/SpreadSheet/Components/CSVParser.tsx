import React, { useState } from 'react';
import * as Papa from 'papaparse';

interface ValueDataType {
  value: string;
  dataType: string;
}

const CSVParser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ValueDataType[][]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //setFile(event.target.files?.item(0));
    if (event.target.files?.item(0)) {
      setFile(event.target.files?.item(0));
    }
    //console.log(event.target.files?.item(0));
  };
  const handleParse = () => {
    if (!file) {
      return;
    }
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const headers: any = results.meta.fields;
        const parsedData: ValueDataType[][] = [];
        results.data.forEach((row:any) => {
          const parsedRow: ValueDataType[] = [];
          headers.forEach((header:any) => {
            const value = row[header];
            let dataType = typeof value;
            if (dataType === 'string') {
              if (!isNaN(Number(value))) {
                dataType = 'number';
              } else if (value === 'true' || value === 'false') {
                dataType = 'boolean';
              }
            }
            parsedRow.push({ value, dataType });
          });
          parsedData.push(parsedRow);
        });
        setData(parsedData);
      },
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleParse}>Parse</button>
      {data.map((row, index) => (
        <div key={index}>
          {row.map((col) => (
            <div key={col.value}>
              {col.value} ({col.dataType})
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CSVParser;
