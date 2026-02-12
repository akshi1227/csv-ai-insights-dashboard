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
                            type: 'unknown', // Will detect later
                            nullCount: 0,
                            sampleValues: [],
                            min: Infinity,
                            max: -Infinity,
                            sum: 0,
                            count: 0,
                            uniqueValues: new Set()
                        };
                    }

                    const val = data[col];
                    if (!val || val === '') {
                        columnStats[col].nullCount++;
                    } else {
                        // Type detection & Stats
                        const numVal = parseFloat(val);
                        if (!isNaN(numVal)) {
                            columnStats[col].type = 'number';
                            if (numVal < columnStats[col].min) columnStats[col].min = numVal;
                            if (numVal > columnStats[col].max) columnStats[col].max = numVal;
                            columnStats[col].sum += numVal;
                            columnStats[col].count++;
                        } else {
                            columnStats[col].type = 'string';
                            if (columnStats[col].uniqueValues.size < 50) { // Limit set size
                                columnStats[col].uniqueValues.add(val);
                            }
                        }

                        // Keep sample
                        if (columnStats[col].sampleValues.length < 5) {
                            columnStats[col].sampleValues.push(val);
                        }
                    }
                });
            })
            .on('end', () => {
                // Finalize summary
                const columns = Object.keys(columnStats).map(col => {
                    const stats = columnStats[col];
                    const safeStats = {
                        name: col,
                        type: stats.type,
                        nullCount: stats.nullCount,
                        sample: stats.sampleValues
                    };

                    if (stats.type === 'number' && stats.count > 0) {
                        safeStats.min = stats.min;
                        safeStats.max = stats.max;
                        safeStats.mean = stats.sum / stats.count;
                    } else {
                        safeStats.uniqueCount = stats.uniqueValues.size;
                    }
                    return safeStats;
                });

                // Update columnStats object structure for the map logic in fallback
                const finalizedStats = {};
                columns.forEach(c => finalizedStats[c.name] = c);

                const summary = {
                    rowCount: results.length,
                    columns: columns,
                    columnStats: finalizedStats, // Add this for fallback generator
                    preview: results.slice(0, 20)
                };
                resolve(summary);
            })
            .on('error', (err) => reject(err));
    });
};

module.exports = { analyzeCsv };
