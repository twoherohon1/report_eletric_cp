import React, { useState } from "react";
import readXlsxFile from "read-excel-file";

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
          console.log(rows);
          if (index == 0) {
            // console.log(calculateBio(rows));
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

      if(data[i]!= null && data[i][1] != null){
        value = data[i][1];
      }
      if(data[i+1] != null && data[i+1][1] != null){
        valueNext = data[i+1][1];
      }

      if (value !== null && valueNext !== null) {
        diff = valueNext - value;
        diffs.push(diff.toFixed(2)); 
      }
    }

    return diffs;
  }

  function prepareDataSolar(data){
    
  }

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
            onChange={(event) => handleFileUpload1(0, event)}
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
            onChange={(event) => handleFileUpload(1, event)}
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
