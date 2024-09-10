import React, { useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import ExcelJS from "exceljs";

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [solar, setSolar] = useState([]);

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
          // console.log(rows);
          if (index == 0) {
            // solarMonth(rows);
            // calculatePEA(rows);
            console.log(calculateBio(rows));
          }
          if (index == 1) {
            setFile2(rows[5][1]);
          }
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });
    }
  };
  const handleFileUpload2 = async (index, event) => {
    console.log(event.target.files);

    Array.from(event.target.files).forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const buffer = e.target.result; // Read data as ArrayBuffer
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer); // Load Excel file data
          const worksheet = workbook.getWorksheet(1); // Select the first sheet

          let rows = [];
          worksheet.eachRow((row, rowNumber) => {
            rows.push(row.values); // Push each row's values to the array
          });

          solarDay(rows); // Call solarDay function
        };
        reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
      }
    });
  };

  useEffect(() => {
    solar.forEach((element) => {
      console.log(element);
    });
  }, [solar]);

  function solarDay(data) {
    let newSums = [];

    data.slice(2).forEach((row) => {
      const value = row[6];
      const day = row[1];

      if (value == null || value == undefined) {
        newSums.push({ date: day, value: 0 });
      } else {
        newSums.push({ date: day, value: value });
      }
    });
    setSolar((prevSolar) => [...prevSolar, ...newSums]);
  }
  function solarMonth(data) {
    let newSums = [];

    data.slice(2).forEach((row) => {
      // Skip the first two rows
      const value = row[16];
      const day = row[0];

      if (value == null || value == undefined) {
        // Check if value is null or undefined
        newSums.push({ date: day, value: 0 });
      } else {
        newSums.push({ date: day, value: value });
      }
    });
    // console.log(newSums);
    calculateSolar(newSums);
    // Use the previous state and append new data to it
    // setSolar((prevSolar) => [...prevSolar, ...newSums]);
    // return newSums;
  }

  function calculateSolar(data) {
    // console.log(data);

    let refSolar = data;
    solar.forEach((element) => {
      if (element.value === null || element.value === undefined) {
      } else {
        let findDatae = data.find((data) => element.date.split(" ")[0] == data.date);
        element.value = (((findDatae.value)/100) * element.value).toFixed(2) ;
      }
    });
    console.log(solar);
    
  }

  function calculatePEA(data) {
    const sums = [];
    let tempSum = 0;

    for (let i = 8; i < data.length - 1; i++) {
      const value = data[i][4]; // ค่าใน index สุดท้าย

      if (value !== null) {
        tempSum += value;
      }

      // ถ้าครบ 4 แถว (1 ชั่วโมง) ให้บันทึกผลรวมและเริ่มใหม่
      if ((i + 1) % 4 === 0) {
        sums.push(tempSum.toFixed(2)); // บันทึกผลรวมโดยแสดงทศนิยมสองตำแหน่ง
        tempSum = 0; // เริ่มต้นสะสมค่าครั้งถัดไป
      }
    }

    return sums;
  }

  function calculateBio(data) {
    const diffs = [];

    for (let i = 1; i < data.length; i++) {
      let diff = 0;

      let value;

      let valueNext;

      if (data[i] != null && data[i][1] != null) {
        value = data[i][1];
      }
      if (data[i + 1] != null && data[i + 1][1] != null) {
        valueNext = data[i + 1][1];
      }

      if (value !== null && valueNext !== null) {
        diff = valueNext - value;
        diffs.push(diff.toFixed(2));
      }
    }

    return diffs;
  }

  function prepareDataSolar(data) {}

  const validateFile = () => {
    setLoading(true);
    let errors = [];

    if (file1 == null) {
      errors.push("กรุณาระบุไฟล์ file1");
    }
    if (file2 == null) {
      errors.push("กรุณาระบุไฟล์ file2");
    }

    console.log(file1);

    if (errors.length > 0) {
      return errors.join(", ");
    } else {
      setResult(file1 + file2);
    }
  };

  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="header-1">TEST FUNCTION</div>
      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>ไฟล์ทดสอบ1</div>
          {/* <img src={LogoPEA} alt="Logo PEA" width={"300px"} /> */}
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUpload(0, event)}
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
          <div>
            <a href="./excel/ไฟล์ทดสอบ1.xlsx">ดาวน์โหลดไฟล์ทดสอบ1</a>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>ไฟล์ทดสอบ2</div>
          {/* <img src={LogoBio} alt="Logo BIO" width={"300px"} /> */}
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUpload2(1, event)}
            type="file"
            className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
            multiple
          />
          <div>
            <a href="./excel/ไฟล์ทดสอบ2.xlsx">ดาวน์โหลดไฟล์ทดสอบ2</a>
          </div>
        </div>
      </div>

      <button
        className="btn btn-secondary text-center"
        onClick={() => {
          validateFile();
        }}
      >
        ประมลผล
      </button>

      <div className="text-fuchsia-500">
        {result ? <>ผลรวมของไฟล์ 1 และ ไฟล์ 2 = {result}</> : <></>}
      </div>
    </>
  );
}
