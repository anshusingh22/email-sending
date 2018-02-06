const fs = require('fs');
const xlsx = require('xlsx');
const cvcsv = require('csv');

exports = module.exports = XLSX_json;

function XLSX_json(config, callback) {
    if (!config.input) {
        throw new Error('ERROR: You need to specify an input file!');
    }

    const cv = new CV(config, callback);

}

function CV(config, callback) {
    const wb = this.load_xlsx(config.input);
    const ws = this.ws(config, wb);
    const csv = this.csv(ws);
    this.cvjson(csv, config.output, callback);
}

CV.prototype.load_xlsx = function (input) {
    return xlsx.readFile(input);
};

CV.prototype.ws = function (config, wb) {
    let target_sheet = config.sheet;

    if (target_sheet == null)
        target_sheet = wb.SheetNames[0];

    ws = wb.Sheets[target_sheet];
    return ws;
};

CV.prototype.csv = function (ws) {
    return csv_file = xlsx.utils.make_csv(ws)
};

CV.prototype.cvjson = function (csv, output, callback) {
    let record = [];
    let header = [];

    cvcsv()
        .from.string(csv)
        .transform(function (row) {
            row.unshift(row.pop());
            return row;
        })
        .on('record', function (row, index) {

            if (index === 0) {
                header = row;
            } else {
                let obj = {};
                header.forEach(function (column, index) {
                    obj[column.trim()] = row[index].trim();
                });
                record.push(obj);
            }
        })
        .on('end', function (count) {
            // when writing to a file, use the 'close' event
            // the 'end' event may fire before the file has been written
            if (output !== null) {
                let stream = fs.createWriteStream(output, {flags: 'w'});
                stream.write(JSON.stringify(record));
                callback(null, record);
            } else {
                callback(null, record);
            }

        })
        .on('error', function (error) {
            console.error(error.message);
        });
};