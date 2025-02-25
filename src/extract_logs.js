const fs = require('fs');
const readline = require('readline');
const path = require('path');

if (process.argv.length < 3) {
    console.error("Usage: node extract_logs.js <YYYY-MM-DD>");
    process.exit(1);
}

const date = process.argv[2];
const logFilePath = "logs_2024.log"; // Update this path if needed
const outputDir = "output";
const outputFile = path.join(outputDir, `output_${date}.txt`);

// Debug: Print the log file path
console.log("Log file path:", logFilePath);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Check if the log file exists
if (!fs.existsSync(logFilePath)) {
    console.error(`Error: Log file not found at ${logFilePath}`);
    process.exit(1);
}

// Create output write stream
const writeStream = fs.createWriteStream(outputFile, { flags: 'w' });

// Read the log file line-by-line
const readStream = fs.createReadStream(logFilePath);
const rl = readline.createInterface({ input: readStream });

rl.on('line', (line) => {
    if (line.startsWith(date)) {
        writeStream.write(line + '\n');
    }
});

rl.on('close', () => {
    console.log(`Logs for ${date} extracted successfully to ${outputFile}`);
    writeStream.end();
});

rl.on('error', (err) => {
    console.error("Error reading file:", err);
    process.exit(1);
});

writeStream.on('error', (err) => {
    console.error("Error writing file:", err);
    process.exit(1);
});