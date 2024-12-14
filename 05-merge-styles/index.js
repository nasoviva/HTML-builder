const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        return console.error(err);
    }

    let array = [];
    let cssFilesCount = 0;
    let dataCount = 0;

    files.forEach((file) => {
        const filePath = path.join(stylesPath, file.name);
        if (file.isFile() && path.extname(file.name) === '.css') {
            cssFilesCount++;
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    return console.error(err);
                }
                array.push(data);
                dataCount++;
                if (dataCount === cssFilesCount) {
                    fs.writeFile(bundlePath, array.join('\n'), 'utf-8', (err) => {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
            });
        }
    });
});