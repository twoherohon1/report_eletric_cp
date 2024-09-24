import { useRef, useState } from "react";
import "./App.css";
import LogoPEA from "./assets/img/LogoPEA.png";
import LogoBio from "./assets/img/LOGOBiogas.png";
import Solar from "./assets/img/solarcell.png";
import Test from "./pages/Test";
import readXlsxFile from "read-excel-file";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import domtoimage from "dom-to-image";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const divRef = useRef();

  const handleSnapshot = () => {
    domtoimage
      .toPng(divRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "snapshot.png";
        link.click();
      })
      .catch((error) => {
        console.error("Error taking snapshot:", error);
      });
  };

  let dataForGraph = [];

  const [datasets, setDatasets] = useState([
    {
      label: "กราฟค่าเฉลี่ยต่อเดือน",
      data: [],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ]);

  const [labels, setLabels] = useState([
    "PEA",
    "Biogas 550 kW",
    "Biogas 370 kW",
    "Biogas",
    "Solar 360 kW",
  ]);

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "กราฟแสดงค่าเฉลี่ยการใช้ไฟฟ้า(เดือน)",
      },
    },
  };

  const updateDataset = () => {
    // Change the dataset dynamically (example)
    setDatasets([
      {
        label: "กราฟค่าเฉลี่ยต่อเดือน",
        data: dataForGraph,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ]);
  };

  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [filePEA, setFilePEA] = useState(null);
  const [fileBio550, setFileBio550] = useState(null);
  const [fileBio370, setFileBio370] = useState(null);
  const [fileSolarDay, setFileSolarDay] = useState(null);
  const [fileSolarMonth, setFileSolarMonth] = useState(null);

  const [PEA, setPEA] = useState([]);
  const [BIO, setBIO] = useState([]);
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

  const handleFileUploadBio = (event) => {
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
          setBIO(diffs);
        })
        .catch((error) => {
          console.error(`Error reading file ${file.name}:`, error);
        });
    }
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
              element.value = (findDatae.value / 100) * element.value;
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
    const worksheet = workbook.addWorksheet("คำนวณรายชั่วโมง");

    const weekdays = [
      "วันอาทิตย์",
      "วันจันทร์",
      "วันอังคาร",
      "วันพุธ",
      "วันพฤหัสบดี",
      "วันศุกร์",
      "วันเสาร์",
    ];

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

    let sumPEAAvgMonth = 0;
    let sumBIOAvgMonth = 0;
    let sumBIO370AvgMonth = 0;
    let sumBIO550AvgMonth = 0;
    let sumSOLARAvgMonth = 0;
    let sumTotalAvgMonth = 0;

    let sumPEAkWhDMonth = 0;
    let sumBIOkWhDMonth = 0;
    let sumBIO370kWhDMonth = 0;
    let sumBIO550kWhDMonth = 0;
    let sumSOLARkWhDMonth = 0;
    let sumTotalkWhDMonth = 0;

    let peaHr = ["", "PEA", "", ""];
    let bioHr = ["", "Biogas kW", "", ""];
    let bio370Hr = ["", "Biogas 370 kW", "", ""];
    let bio550Hr = ["", "Biogas 550 kW", "", ""];
    let solarHr = ["", "Solar 360 kW", "", ""];

    let monthYear;

    worksheet.columns = headers.map((header) => ({
      header: header,
      key: header,
      width: 15, // Set width as needed
    }));

    worksheet.columns[0].width = 25;
    console.log(worksheet.columns);

    setSolar(solar.sort((a, b) => new Date(a.date) - new Date(b.date)));
    console.log(solar);

    for (let i = 0; i < PEA.length / 24; i++) {
      let peaSpilt = ["", "PEA", "", ""];
      let bioSpilt = ["", "Biogas kW", "", ""];
      let bio370Spilt = ["", "Biogas 370 kW", "", ""];
      let bio550Spilt = ["", "Biogas 550 kW", "", ""];
      let solarSpilt = ["", "Solar 360 kW", "", ""];
      let total = ["", "รวม", "", ""];

      let sumPEA = 0;
      let sumBIO = 0;
      let sumBIO370 = 0;
      let sumBIO550 = 0;
      let sumSolar = 0;

      for (let j = 0; j < 24; j++) {
        if (i == 0) {
          peaHr.push(
            PEA[i * 24 + j] && PEA[i * 24 + j].value ? PEA[i * 24 + j].value : 0
          );
          bioHr.push(
            BIO[i * 24 + j] && BIO[i * 24 + j].value ? BIO[i * 24 + j].value : 0
          );
          bio370Hr.push(
            BIO370[i * 24 + j] && BIO370[i * 24 + j].value
              ? BIO370[i * 24 + j].value
              : 0
          );
          bio550Hr.push(
            BIO550[i * 24 + j] && BIO550[i * 24 + j].value
              ? BIO550[i * 24 + j].value
              : 0
          );
          solarHr.push(
            solar[i * 24 + j] && solar[i * 24 + j].value
              ? solar[i * 24 + j].value
              : 0
          );
        } else {
          peaHr[j + 4] =
            peaHr[j + 4] +
            (PEA[i * 24 + j] && PEA[i * 24 + j].value
              ? PEA[i * 24 + j].value
              : 0);
          bioHr[j + 4] =
            bioHr[j + 4] +
            (BIO[i * 24 + j] && BIO[i * 24 + j].value
              ? BIO[i * 24 + j].value
              : 0);
          bio370Hr[j + 4] =
            bio370Hr[j + 4] +
            (BIO370[i * 24 + j] && BIO370[i * 24 + j].value
              ? BIO370[i * 24 + j].value
              : 0);
          bio550Hr[j + 4] =
            bio550Hr[j + 4] +
            (BIO550[i * 24 + j] && BIO550[i * 24 + j].value
              ? BIO550[i * 24 + j].value
              : 0);
          solarHr[j + 4] =
            solarHr[j + 4] +
            (solar[i * 24 + j] && solar[i * 24 + j].value
              ? solar[i * 24 + j].value
              : 0);
        }

        if (PEA[i * 24 + j] && PEA[i * 24 + j].value) {
          peaSpilt.push(
            PEA[i * 24 + j].value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        } else {
          peaSpilt.push("0.00");
        }

        if (BIO[i * 24 + j] && BIO[i * 24 + j].value) {
          bioSpilt.push(
            BIO[i * 24 + j].value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        } else {
          bioSpilt.push("0.00");
        }

        if (BIO370[i * 24 + j] && BIO370[i * 24 + j].value) {
          bio370Spilt.push(
            BIO370[i * 24 + j].value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        } else {
          bio370Spilt.push("0.00");
        }

        if (BIO550[i * 24 + j] && BIO550[i * 24 + j].value) {
          bio550Spilt.push(
            BIO550[i * 24 + j].value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        } else {
          bio550Spilt.push("0.00");
        }

        if (solar[i * 24 + j] && solar[i * 24 + j].value) {
          solarSpilt.push(
            solar[i * 24 + j].value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        } else {
          solarSpilt.push("0.00");
        }

        total.push(
          (
            (PEA[i * 24 + j] && PEA[i * 24 + j].value
              ? PEA[i * 24 + j].value
              : 0) +
            (BIO[i * 24 + j] && BIO[i * 24 + j].value
              ? BIO[i * 24 + j].value
              : 0) +
            (BIO370[i * 24 + j] && BIO370[i * 24 + j].value
              ? BIO370[i * 24 + j].value
              : 0) +
            (BIO550[i * 24 + j] && BIO550[i * 24 + j].value
              ? BIO550[i * 24 + j].value
              : 0) +
            (solar[i * 24 + j] && solar[i * 24 + j].value
              ? solar[i * 24 + j].value
              : 0)
          ).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
        sumPEA += parseFloat(
          PEA[i * 24 + j] && PEA[i * 24 + j].value ? PEA[i * 24 + j].value : 0
        );
        sumBIO += parseFloat(
          BIO[i * 24 + j] && BIO[i * 24 + j].value ? BIO[i * 24 + j].value : 0
        );
        sumBIO370 += parseFloat(
          BIO370[i * 24 + j] && BIO370[i * 24 + j].value
            ? BIO370[i * 24 + j].value
            : 0
        );
        sumBIO550 += parseFloat(
          BIO550[i * 24 + j] && BIO550[i * 24 + j].value
            ? BIO550[i * 24 + j].value
            : 0
        );
        sumSolar += parseFloat(
          solar[i * 24 + j] && solar[i * 24 + j].value
            ? solar[i * 24 + j].value
            : 0
        );
      }

      const [datePart, timePart] = PEA[i * 24].date.split(" ");
      const [day, month, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(".");
      const dateTransfrom = new Date(
        `${year}-${month}-${day}T${hours}:${minutes}:00`
      );
      const formattedDate = dateTransfrom.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const dayOfWeek = weekdays[dateTransfrom.getDay()];
      const result = `${formattedDate} ${dayOfWeek}`;
      if (!monthYear) {
        monthYear = month + "-" + year;
      }

      peaSpilt[0] = result;

      peaSpilt[2] = (sumPEA / 24).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      peaSpilt[3] = sumPEA.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      bioSpilt[2] = (sumBIO / 24).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      bioSpilt[3] = sumBIO.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      bio370Spilt[2] = (sumBIO370 / 24).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      bio370Spilt[3] = sumBIO370.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      bio550Spilt[2] = (sumBIO550 / 24).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      bio550Spilt[3] = sumBIO550.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      solarSpilt[2] = (sumSolar / 24).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      solarSpilt[3] = sumSolar.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      total[2] = (
        sumPEA / 24 +
        sumBIO / 24 +
        sumBIO370 / 24 +
        sumBIO550 / 24 +
        sumSolar / 24
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      total[3] = (
        sumPEA +
        sumBIO +
        sumBIO370 +
        sumBIO550 +
        sumSolar
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      sumPEAAvgMonth = sumPEAAvgMonth + peaSpilt[2];
      sumPEAkWhDMonth = sumPEAkWhDMonth + peaSpilt[3];

      sumBIOAvgMonth = sumBIOAvgMonth + bioSpilt[2];
      sumBIOkWhDMonth = sumBIOkWhDMonth + bioSpilt[3];

      sumBIO370AvgMonth = sumBIO370AvgMonth + bio370Spilt[2];
      sumBIO370kWhDMonth = sumBIO370kWhDMonth + bio370Spilt[3];

      sumBIO550AvgMonth = sumBIO550AvgMonth + bio550Spilt[2];
      sumBIO550kWhDMonth = sumBIO550kWhDMonth + bio550Spilt[3];

      sumSOLARAvgMonth = sumSOLARAvgMonth + solarSpilt[2];
      sumSOLARkWhDMonth = sumSOLARkWhDMonth + solarSpilt[3];

      sumTotalAvgMonth = sumTotalAvgMonth + total[2];
      sumTotalkWhDMonth = sumTotalkWhDMonth + total[3];

      worksheet.addRow(peaSpilt);
      worksheet.addRow(bio550Spilt);
      worksheet.addRow(bio370Spilt);
      worksheet.addRow(bioSpilt);
      worksheet.addRow(solarSpilt);
      worksheet.addRow(total);
      worksheet.addRow();

      const startRow = 2 + i * 7;
      const endRow = startRow + 6;
      worksheet.mergeCells(`A${startRow}:A${endRow}`);
    }

    peaHr[0] = monthYear;

    let peaHrSum = 0.0;
    let bio550HrSum = 0.0;
    let bio370HrSum = 0.0;
    let bioHrSum = 0.0;
    let solarHrSum = 0.0;
    let totalHrSum = 0.0;

    peaHr.forEach((item, index) => {
      if (index > 3) {
        peaHr[index] = (item / (PEA.length / 24)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        peaHrSum = peaHrSum + parseFloat(peaHr[index]);
      }
    });
    bio550Hr.forEach((item, index) => {
      if (index > 3) {
        bio550Hr[index] = (item / (PEA.length / 24)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        bio550HrSum = bio550HrSum + parseFloat(bio550Hr[index]);
      }
    });
    bio370Hr.forEach((item, index) => {
      if (index > 3) {
        bio370Hr[index] = (item / (PEA.length / 24)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        bio370HrSum = bio370HrSum + parseFloat(bio370Hr[index]);
      }
    });

    bioHr.forEach((item, index) => {
      if (index > 3) {
        bioHr[index] = (item / (PEA.length / 24)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        bioHrSum = bioHrSum + parseFloat(bioHr[index]);
      }
    });

    solarHr.forEach((item, index) => {
      if (index > 3) {
        solarHr[index] = (item / (PEA.length / 24)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        solarHrSum = solarHrSum + parseFloat(solarHr[index]);
      }
    });

    let sumHr = ["", "รวม", "", ""];
    for (let k = 0; k < 24; k++) {
      let sum =
        parseFloat(peaHr[k + 4]) +
        parseFloat(bio550Hr[k + 4]) +
        parseFloat(bio370Hr[k + 4]) +
        parseFloat(bioHr[k + 4]) +
        parseFloat(solarHr[k + 4]);

      totalHrSum = totalHrSum + parseFloat(sum);
      sumHr.push(sum);
    }

    peaHr[2] = (peaHrSum / 24).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    peaHr[3] = peaHrSum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    bio550Hr[2] = (bio550HrSum / 24).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    bio550Hr[3] = bio550HrSum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    bio370Hr[2] = (bio370HrSum / 24).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    bio370Hr[3] = bio370HrSum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    bioHr[2] = (bioHrSum / 24).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    bioHr[3] = bioHrSum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    solarHr[2] = (solarHrSum / 24).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    solarHr[3] = solarHrSum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    sumHr[2] = (totalHrSum / 24).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    sumHr[3] = totalHrSum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    dataForGraph = [];
    dataForGraph.push(parseFloat(peaHr[2]));
    dataForGraph.push(parseFloat(bio550Hr[2]));
    dataForGraph.push(parseFloat(bio370Hr[2]));
    dataForGraph.push(parseFloat(bioHr[2]));
    dataForGraph.push(parseFloat(solarHr[2]));
    console.log("dataForGraph", dataForGraph);
    updateDataset();

    worksheet.addRow(peaHr);
    worksheet.addRow(bio550Hr);
    worksheet.addRow(bio370Hr);
    worksheet.addRow(bioHr);
    worksheet.addRow(solarHr);
    worksheet.addRow(sumHr);
    worksheet.addRow();

    const startRow = 2 + (PEA.length / 24) * 7;
    const endRow = startRow + 6;
    worksheet.mergeCells(`A${startRow}:A${endRow}`);

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Yellow color
      };
      cell.font = {
        bold: true,
      };
    });

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
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
    console.log(BIO);
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
      <div className="header-1 text-center">
        Report สรุปการใช้ไฟฟ้าจาก [ PEA , Biogas , Solar ]
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="flex flex-col mx-5 my-3">
          <div className=" border-black flex flex-col justify-center items-center">
            <div>การไฟฟ้าส่วนภูมิภาค</div>
            <img src={LogoPEA} alt="Logo PEA" width={"300px"} />
          </div>
          <div className=" flex items-center">
            <input
              onChange={(event) => handleFileUploadPEA(event)}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="flex flex-col mx-5">
          <div className=" border-black flex flex-col justify-center items-center">
            <div>Biogas</div>
            <img src={LogoBio} alt="Logo BIO" width={"300px"} />
          </div>
          <div className="flex items-center">
            <input
              onChange={(event) => handleFileUploadBio(event)}
              type="file"
              className="file-input file-input-bordered file-input-accent w-full max-w-xs"
            />
          </div>
        </div>

        <div className="flex flex-col mx-5">
          <div className="border-black flex flex-col justify-center items-center">
            <div>Biogas 550W</div>
            <img src={LogoBio} alt="Logo BIO" width={"300px"} />
          </div>
          <div className="flex items-center">
            <input
              onChange={(event) => handleFileUploadBio550(event)}
              type="file"
              className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
            />
          </div>
        </div>

        <div className="flex flex-col mx-5">
          <div className=" border-black flex flex-col justify-center items-center">
            <div>Biogas 370W</div>
            <img src={LogoBio} alt="Logo BIO" width={"300px"} />
          </div>
          <div className="flex items-center">
            <input
              onChange={(event) => handleFileUploadBio370(event)}
              type="file"
              className="file-input file-input-bordered file-input-accent w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex w-full">
        <div className="flex w-1/2 my-10">
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

        <div className="flex w-1/2 my-10">
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
      </div>

      <div className="divider"></div>

      <div className="flex justify-center items-center">
        <button
          className="btn btn-secondary text-center"
          onClick={() => {
            createExcelFile();
          }}
        >
          {loading ? <>กำลังโหลดข้อมูล...</> : <>ประมลผล</>}
        </button>&nbsp; &nbsp; &nbsp;
        <button
          className="btn btn-secondary text-center"
          onClick={handleSnapshot}
        >
          บันทึกกราฟ
        </button>
      </div>

      <div className="flex justify-center items-center my-10">
        <div className="w-full bg-white" ref={divRef}>
          <div className="header-1 text-center">กราฟ</div>
          <Bar data={data} options={options} />
        </div>
      </div>

      <div>{isShow && <a href="./excel/ตัวอย่าง.xlsx">ดาวน์โหลดรีพอต</a>}</div>
    </>
  );
}

export default App;
