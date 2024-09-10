import React, { useEffect, useRef } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const GenerateExcel = ({ data }) => {
  const workbookRef = useRef(null);

  useEffect(() => {
    if (data) {
      const workbook = new ExcelJS.Workbook();
      workbookRef.current = workbook;

      // Create worksheets
      const worksheet1 = workbook.addWorksheet('1 สิงหาคม 2024');
      const worksheet2 = workbook.addWorksheet('2 สิงหาคม 2024');

      // Define column headers
      const headers = [
        'เวลา',
        'PEA',
        'Biogas 550 kW',
        'Biogas 370 kW',
        'Solar 360 kW',
        'รวม',
      ];

      // Set column widths
      worksheet1.columns.forEach((column, index) => {
        column.width = 15;
      });
      worksheet2.columns.forEach((column, index) => {
        column.width = 15;
      });

      // Add data to worksheets
      const data1 = data.filter(item => item.date.startsWith('01/08/2024'));
      const data2 = data.filter(item => item.date.startsWith('02/08/2024'));

      worksheet1.addRow(headers);
      data1.forEach(item => {
        const row = worksheet1.addRow([
          item.date.split(' ')[1],
          item.pea,
          item['biogas 550 kW'],
          item['biogas 370 kW'],
          item['solar 360 kW'],
          item.total,
        ]);
        row.numberFormat = '@'; // Format as text to preserve leading zeros
      });

      worksheet2.addRow(headers);
      data2.forEach(item => {
        const row = worksheet2.addRow([
          item.date.split(' ')[1],
          item.pea,
          item['biogas 550 kW'],
          item['biogas 370 kW'],
          item['solar 360 kW'],
          item.total,
        ]);
        row.numberFormat = '@'; // Format as text to preserve leading zeros
      });

      // Save workbook
      workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(new Blob([buffer]), 'data.xlsx');
      });
    }
  }, [data]);

  return null; // This component doesn't render anything
};

export default GenerateExcel;