import Papa from 'papaparse';

/**
 * Parses a CSV file containing logs and maps them to the database structure.
 * @param {File} file - The uploaded CSV file object.
 * @returns {Promise<Object>} Resolves to { data, errors } where data contains valid rows and errors contains invalid rows.
 */
export function parseCSVFile(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = [];
        const errors = [];

        results.data.forEach((row, index) => {
          const rowNum = index + 1; // 1-indexed for user readability

          // Required columns check (by expected CSV header)
          if (!row.Timestamp || !row.IP_Address || !row.Request_Type || !row.Status_Code) {
            errors.push({ row: rowNum, reason: 'Missing required columns (Timestamp, IP_Address, Request_Type, or Status_Code)' });
            return;
          }

          // Data transformation
          const parsedTimestamp = new Date(row.Timestamp);
          const statusCode = parseInt(row.Status_Code, 10);
          
          // Validation
          if (isNaN(parsedTimestamp.getTime())) {
            errors.push({ row: rowNum, reason: 'Invalid Timestamp format' });
            return;
          }

          if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
            errors.push({ row: rowNum, reason: `Invalid Status_Code: ${row.Status_Code}` });
            return;
          }

          if (!row.Request_Type.trim()) {
            errors.push({ row: rowNum, reason: 'Request_Type cannot be empty' });
            return;
          }

          if (!row.IP_Address.trim()) {
            errors.push({ row: rowNum, reason: 'IP_Address cannot be empty' });
            return;
          }

          // Push valid transformed row
          data.push({
            timestamp: parsedTimestamp.toISOString(),
            ip_address: row.IP_Address.trim(),
            request_type: row.Request_Type.trim().toUpperCase(),
            status_code: statusCode,
            user_agent: row.User_Agent || '',
            session_id: row.Session_ID || null,
            location: row.Location || null
          });
        });

        resolve({ data, errors });
      },
      error: (error) => {
        resolve({ data: [], errors: [{ row: 'File', reason: `Failed to parse file: ${error.message}` }] });
      }
    });
  });
}
