const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

const projectDistPath = path.join(__dirname, 'project-dist');
const newHtmlPath = path.join(projectDistPath, 'index.html');
const newStylePath = path.join(projectDistPath, 'style.css');
const newAssetsPath = path.join(projectDistPath, 'assets');

fs.rm(projectDistPath, { recursive: true, force: true }, (err) => {
    if (err) {
        return console.error(err);
    }
    createDir(projectDistPath);
    copyFile();
    updateHtml();
    copyStyle();
    copyDir(assetsPath, newAssetsPath);
});

function createDir(folder) {
    fs.mkdir(folder, { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
    });
}

function copyFile() {
    fs.copyFile(templatePath, newHtmlPath, (err) => {
        if (err) {
            return console.error(err);
        }
    });
}

function updateHtml() {
    fs.readFile(newHtmlPath, 'utf-8', (err, data) => {
        if (err) {
            return console.error(err);
        }
        fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                return console.error(err);
            }
            let updatedHtml = data;
            files.forEach((file) => {
                const componentPath = path.join(componentsPath, file.name);
                const componentName = `{{${path.parse(file.name).name}}}`;
                if (file.isFile() && path.extname(file.name) === '.html') {
                    fs.readFile(componentPath, 'utf-8', (err, newContent) => {
                        if (err) {
                            return console.error(err);
                        }
                        updatedHtml = updatedHtml.replaceAll(componentName, newContent);
                        fs.writeFile(newHtmlPath, updatedHtml, 'utf-8', (err) => {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    });
                }
            });
        });
    });
}

function copyStyle() {
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
                        fs.writeFile(newStylePath, array.join('\n'), 'utf-8', (err) => {
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

