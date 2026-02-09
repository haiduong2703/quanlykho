const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const exportToCSV = async (data, headers, filename) => {
  const exportDir = path.join(__dirname, '../../exports');

  // Create exports directory if not exists
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filepath = path.join(exportDir, filename);

  const csvWriter = createCsvWriter({
    path: filepath,
    header: headers
  });

  await csvWriter.writeRecords(data);
  return filepath;
};

module.exports = { exportToCSV };
