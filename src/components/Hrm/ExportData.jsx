import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportData = (tableData, columns) => {
  // Exclude the "Action" column
  const filteredColumns = columns.filter(col => col.header !== 'Action');

  const exportData = tableData.map(row => {
    const filteredRow = {};
    filteredColumns.forEach(col => {
      filteredRow[col.header] = row[col.accessor]; // `accessor` must match row keys
    });
    return filteredRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'ExportedData.xlsx');
};