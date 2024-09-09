import { useState } from "react";
import "./App.css";
import LogoPEA from "./assets/img/LogoPEA.png";
import LogoBio from "./assets/img/LOGOBiogas.png";
import Solar from "./assets/img/solarcell.png";
import Test from "./pages/Test";

function App() {
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [filePEA, setFilePEA] = useState(null);
  const [fileBio550, setFileBio550] = useState(null);
  const [fileBio370, setFileBio370] = useState(null);
  const [fileSolarDay, setFileSolarDay] = useState(null);
  const [fileSolarMonth, setFileSolarMonth] = useState(null);

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      if (index == 0) {
        setFilePEA(file);
      } else if (index == 1) {
        setFileBio550(file);
      } else if (index == 2) {
        setFileBio370(file);
      } else if (index == 3) {
        setFileSolarDay(file);
      } else if (index == 4) {
        setFileSolarMonth(file);
      }

      // readXlsxFile(file)
      //   .then((rows) => {
      //   })
      //   .catch((error) => {
      //     console.error(`Error reading file ${file.name}:`, error);
      //   });
    }
  };

  const dowloadExcel = () => {
    setTimeout(() => {
      setLoading(false);
      window.open("./excel/ตัวอย่าง.xlsx","_blank");
    }, 3000);
  };

  const validateFile = () => {
    setLoading(true);
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
            onChange={(event) => handleFileUpload(0, event)}
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
            onChange={(event) => handleFileUpload(1, event)}
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
            onChange={(event) => handleFileUpload(2, event)}
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
            onChange={(event) => handleFileUpload(3, event)}
            type="file"
            className="file-input file-input-bordered file-input-success w-full max-w-xs"
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
            onChange={(event) => handleFileUpload(4, event)}
            type="file"
            className="file-input file-input-bordered file-input-success w-full max-w-xs"
          />
        </div>
      </div>

      <div className="divider"></div>

      <button
        className="btn btn-secondary text-center"
        onClick={() => {
          validateFile();
        }}
      >
        {loading ? <>กำลังโหลดข้อมูล...</> : <>ประมลผล</>}
      </button>

      <div>{isShow && <a href="./excel/ตัวอย่าง.xlsx">ดาวน์โหลดรีพอต</a>}</div>

      <Test/>
    </>
  );
}

export default App;
