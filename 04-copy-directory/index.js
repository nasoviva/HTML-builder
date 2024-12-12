const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fs.rm(copyFolderPath, { recursive: true, force: true }, (err) => {
    if (err) {
        return console.error(err);
    }
    copyDir(folderPath, copyFolderPath);
});

function copyDir(source, dest) {
    fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
        fs.readdir(source, { withFileTypes: true }, (err, files) => {
            if (err)
                return console.error(err);
            else {
                files.forEach(file => {
                    const sourcePath = path.join(source, file.name);
                    const destPath = path.join(dest, file.name);
                    if (file.isDirectory()) {
                        copyDir(sourcePath, destPath);
                    } else if (file.isFile()) {
                        fs.copyFile(sourcePath, destPath, (err) => {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                });
            }
        });
    });
}

