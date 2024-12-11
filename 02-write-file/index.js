const fs = require("fs");
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;

stdout.write("Type your text. For exit Type 'exit' or press Ctrl+C\n");

fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
        fs.writeFile(filePath, '', (err) => {
            if (err) throw err;
        });
    }
});

stdin.on("data", (data) => {
    const input = data.toString().trim();
    if (input === "exit") {
        stdout.write("Goodbye!\n");
        process.exit();
    } else {
        fs.appendFile(filePath, data, (err) => {
            if (err) throw err;
        });
    }
});

process.on("SIGINT", () => {
    stdout.write("\nGoodbye!\n");
    process.exit();
});
