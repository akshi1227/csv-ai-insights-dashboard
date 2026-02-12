const fs = require('fs');
const csv = require('csv-parser');

const analyzeCsv = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const columnStats = {};

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);

                // Basic column stats update
                Object.keys(data).forEach(col => {
                    if (!columnStats[col]) {
                        columnStats[col] = {
                            type: isNaN(data[col]) ? 'string' : 'number',
                            nullCount: 0,
                            sampleValues: []
                        };
                    }

                    const val = data[col];
                    if (!val || val === '') {
                        columnStats[col].nullCount++;
                    }

                    // Keep first 5 non-null values as sample
                    if (val && columnStats[col].sampleValues.length < 5) {
                        columnStats[col].sampleValues.push(val);
                    }
                });
            })
            .on('end', () => {
                // Finalize summary
                const summary = {
                    rowCount: results.length,
                    columns: Object.keys(columnStats).map(col => ({
                        name: col,
                        type: columnStats[col].type,
                        nullCount: columnStats[col].nullCount,
                        sample: columnStats[col].sampleValues
                    })),
                    preview: results.slice(0, 20) // First 20 rows for frontend
                };
                resolve(summary);
            })
            .on('error', (err) => reject(err));
    });
};

module.exports = { analyzeCsv };
