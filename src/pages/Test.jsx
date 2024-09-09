import React, { useState } from "react";
import readXlsxFile from "read-excel-file";

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
            if(index == 0){
                setFile1(rows[5][1])
            }
            if(index == 1){
                setFile2(rows[5][1])
            }
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });

      
    }
  };

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
      <div className="header-1">
        TEST FUNCTION
      </div>
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
          <div><a href="./excel/ไฟล์ทดสอบ1.xlsx">ดาวน์โหลดไฟล์ทดสอบ1</a></div>
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
          />
          <div><a href="./excel/ไฟล์ทดสอบ2.xlsx">ดาวน์โหลดไฟล์ทดสอบ2</a></div>
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

      <div className="text-fuchsia-500">{result ? <>ผลรวมของไฟล์ 1 และ ไฟล์ 2 = {result}</> : <></>}</div>

    </>
  );
}
