const fs = require("fs");
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {

            if (file.isFile()) {

                const filePath = path.join(folderPath, file.name);

                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    const name = path.parse(file.name).name;
                    const ext = path.extname(file.name).slice(1);
                    const size = (stats.size / 1024).toFixed(3);

                    console.log(name + " - " + ext + " - " + size + "kb");
                });
            }
        })
    }
});
