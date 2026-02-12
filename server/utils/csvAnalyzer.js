const fs = require('fs');
const csv = require('csv-parser');
const { Readable } = require('stream');

const analyzeCsv = (input) => {
    return new Promise((resolve, reject) => {
        const results = [];
        let rowCount = 0;
        const columnStats = {};

        // Determine input stream: is it a file path (string) or a buffer?
        let stream;
        if (typeof input === 'string') {
            stream = fs.createReadStream(input);
        } else if (Buffer.isBuffer(input)) {
            stream = Readable.from(input);
        } else {
            return reject(new Error('Invalid input type for CSV analysis'));
        }

        stream
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
