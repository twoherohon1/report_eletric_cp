import { useState } from "react";
import "./App.css";
import LogoPEA from "./assets/img/LogoPEA.png";
import LogoBio from "./assets/img/LOGOBiogas.png";
import Solar from "./assets/img/solarcell.png";
import Test from "./pages/Test";
import readXlsxFile from "read-excel-file";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function App() {
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [filePEA, setFilePEA] = useState(null);
  const [fileBio550, setFileBio550] = useState(null);
  const [fileBio370, setFileBio370] = useState(null);
  const [fileSolarDay, setFileSolarDay] = useState(null);
  const [fileSolarMonth, setFileSolarMonth] = useState(null);

  const [PEA, setPEA] = useState([]);
  const [BIO370, setBIO370] = useState([]);
  const [BIO550, setBIO550] = useState([]);
  const [solar, setSolar] = useState([]);

  const handleFileUploadPEA = (event) => {
    const sums = [];
    let tempSum = 0;
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
          for (let i = 8; i < rows.length - 1; i++) {
            const value = rows[i][4];
            if (value !== null) {
              tempSum += value;
            }
            if ((i + 1) % 4 === 0) {
              sums.push({ date: rows[i][0] + "", value: tempSum });
              tempSum = 0;
            }
          }
          setPEA((oldSums) => [...oldSums, ...sums]);
          console.log(sums);
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleFileUploadBio370 = (event) => {
    const sums = [];
    let tempSum = 0;
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
          const diffs = [];

          for (let i = 1; i < rows.length; i++) {
            let diff = 0;

            let value;

            let valueNext;

            if (rows[i] != null && rows[i][1] != null) {
              value = rows[i][1];
            }
            if (rows[i + 1] != null && rows[i + 1][1] != null) {
              valueNext = rows[i + 1][1];
            }

            if (value !== null && valueNext !== null) {
              diff = valueNext - value;
              diffs.push({
                date: formatDate(rows[i][0]) + "",
                value: diff,
              });
            }
          }
          setBIO370(diffs);
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });
    }
  };

  const handleFileUploadBio550 = (event) => {
    const sums = [];
    let tempSum = 0;
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
          const diffs = [];

          for (let i = 1; i < rows.length; i++) {
            let diff = 0;

            let value;

            let valueNext;

            if (rows[i] != null && rows[i][1] != null) {
              value = rows[i][1];
            }
            if (rows[i + 1] != null && rows[i + 1][1] != null) {
              valueNext = rows[i + 1][1];
            }

            if (value !== null && valueNext !== null) {
              diff = valueNext - value;
              diffs.push({
                date: formatDate(rows[i][0]) + "",
                value: diff,
              });
            }
          }
          setBIO550(diffs);
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });
    }
  };

  const handleFileUploadSolarDay = async (event) => {
    console.log(event.target.files);

    Array.from(event.target.files).forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const buffer = e.target.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);
          const worksheet = workbook.getWorksheet(1);

          let rows = [];
          worksheet.eachRow((row, rowNumber) => {
            rows.push(row.values);
          });

          let newSums = [];

          rows.slice(2).forEach((row) => {
            const value = row[6];
            const day = row[1];

            if (value == null || value == undefined) {
              newSums.push({ date: day, value: 0 });
            } else {
              newSums.push({ date: day, value: value });
            }
          });
          setSolar((prevSolar) => [...prevSolar, ...newSums]);
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileUploadSolarMonth = (event) => {
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file)
        .then((rows) => {
          let newSums = [];

          rows.slice(2).forEach((row) => {
            const value = row[16];
            const day = row[0];

            if (value == null || value == undefined) {
              newSums.push({ date: day, value: 0 });
            } else {
              newSums.push({ date: day, value: value });
            }
          });

          solar.forEach((element) => {
            if (element.value === null || element.value === undefined) {
            } else {
              let findDatae = newSums.find(
                (data) => element.date.split(" ")[0] == data.date
              );
              element.value = ((findDatae.value / 100) * element.value)
            }
          });
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });
    }
  };

  const createExcelFile = async () => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");

    // Add column headers
    const headers = [
      "วันที่",
      "จาก",
      "Average",
      "kWh/Day",
      "00:00 - 01:00",
      "01:00 - 02:00",
      "02:00 - 03:00",
      "03:00 - 04:00",
      "04:00 - 05:00",
      "05:00 - 06:00",
      "06:00 - 07:00",
      "07:00 - 08:00",
      "08:00 - 09:00",
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
      "20:00 - 21:00",
      "21:00 - 22:00",
      "22:00 - 23:00",
      "23:00 - 00:00",
    ];

    worksheet.columns = headers.map((header) => ({
      header: header,
      key: header,
      width: 15, // Set width as needed
    }));

    setSolar(solar.sort((a, b) => new Date(a.date) - new Date(b.date)));
    console.log(solar);
     
    for (let i = 0; i < 31; i++) {
      let peaSpilt = ["", "PEA","", ""];
      let bio370Spilt = ["", "Biogas 370 kW","", ""];
      let bio550Spilt = ["", "Biogas 550 kW","", ""];
      let solarSpilt = ["", "Solar 360 kW","", ""];
      let total = ["", "รวม","", ""];
      
      let sumPEA = 0;
      let sumBIO370 = 0;
      let sumBIO550 = 0;
      let sumSolar = 0;


      for (let j = 0; j < 24; j++) {
        peaSpilt.push(PEA[(i * 24) + j].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        bio370Spilt.push(BIO370[(i * 24) + j].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        bio550Spilt.push(BIO550[(i * 24) + j].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        solarSpilt.push(solar[(i * 24) + j].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        total.push((PEA[(i * 24) + j].value + 0 + BIO550[(i * 24) + j].value + solar[(i * 24) + j].value)
          .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        )
        sumPEA += parseFloat(PEA[(i * 24) + j].value);
        sumBIO370 += parseFloat(BIO370[(i * 24) + j].value);
        sumBIO550 += parseFloat(BIO550[(i * 24) + j].value);
        sumSolar += parseFloat(solar[(i * 24) + j].value);

      }
      peaSpilt[0] = PEA[i * 24].date.split(" ")[0];

      peaSpilt[2]=(sumPEA/24).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      peaSpilt[3]=(sumPEA).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      bio370Spilt[2]=(sumBIO370/24).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      bio370Spilt[3]=(sumBIO370).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      bio550Spilt[2]=(sumBIO550/24).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      bio550Spilt[3]=(sumBIO550).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      solarSpilt[2]=(sumSolar/24).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      solarSpilt[3]=(sumSolar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      total[2] = ((sumPEA/24) + (sumBIO370/24) +(sumBIO550/24) +(sumSolar/24)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      total[3] = (sumPEA + sumBIO370 + sumBIO550 + sumSolar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      worksheet.addRow(peaSpilt);
      worksheet.addRow(bio550Spilt);
      worksheet.addRow(bio370Spilt);
      worksheet.addRow(solarSpilt);
      worksheet.addRow(total);
      worksheet.addRow();

      const startRow = 2 + (i * 6);
      const endRow = startRow + 5;   
      worksheet.mergeCells(`A${startRow}:A${endRow}`); 

      
    }

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Yellow color
      };
      cell.font = {
        bold: true,
      };
    });

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Use FileSaver to save the file
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "MyExcelFile.xlsx");
  };

  const validateFile = () => {
    setLoading(true);
    console.log(PEA);
    console.log(BIO370);
    console.log(BIO550);
    console.log(solar);
    let errors = [];

    if (filePEA == null) {
      errors.push("กรุณาระบุไฟล์ PEA");
    }
    if (fileBio550 == null) {
      errors.push("กรุณาระบุไฟล์ Bio550");
    }
    if (fileBio370 == null) {
      errors.push("กรุณาระบุไฟล์ Bio370");
    }
    if (fileSolarDay == null) {
      errors.push("กรุณาระบุไฟล์ Solar Day");
    }
    if (fileSolarMonth == null) {
      errors.push("กรุณาระบุไฟล์ Solar Month");
    }

    console.log(errors);

    if (errors.length > 0) {
      return errors.join(", ");
    } else {
      dowloadExcel();
    }
  };

  return (
    <>
      <div className="header-1">
        Report สรุปการใช้ไฟฟ้าจาก [ PEA , Biogas , Solar ]
      </div>
      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>การไฟฟ้าส่วนภูมิภาค</div>
          <img src={LogoPEA} alt="Logo PEA" width={"300px"} />
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUploadPEA(event)}
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>Biogas 550W</div>
          <img src={LogoBio} alt="Logo BIO" width={"300px"} />
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUploadBio550(event)}
            type="file"
            className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
          />
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>Biogas 370W</div>
          <img src={LogoBio} alt="Logo BIO" width={"300px"} />
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUploadBio370(event)}
            type="file"
            className="file-input file-input-bordered file-input-accent w-full max-w-xs"
          />
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>Solar 360 kW[รายวัน]</div>
          <img src={Solar} alt="Logo Solar" width={"300px"} />
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUploadSolarDay(event)}
            type="file"
            className="file-input file-input-bordered file-input-success w-full max-w-xs"
            multiple
          />
        </div>
      </div>

      <div className="flex w-full my-10">
        <div className="w-1/2 border-black flex flex-col justify-center items-center">
          <div>Solar 360 kW[รายเดือน]</div>
          <img src={Solar} alt="Logo Solar" width={"300px"} />
        </div>
        <div className="w-1/2 flex items-center">
          <input
            onChange={(event) => handleFileUploadSolarMonth(event)}
            type="file"
            className="file-input file-input-bordered file-input-success w-full max-w-xs"
          />
        </div>
      </div>

      <div className="divider"></div>


      <button
        className="btn btn-secondary text-center"
        onClick={() => {
          createExcelFile();
        }}
      >
        {loading ? <>กำลังโหลดข้อมูล...</> : <>ประมลผล</>}
      </button>

      <div>{isShow && <a href="./excel/ตัวอย่าง.xlsx">ดาวน์โหลดรีพอต</a>}</div>

      <Test />
    </>
  );
}

export default App;
