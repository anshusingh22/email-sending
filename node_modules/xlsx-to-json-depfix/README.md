# node-xlsx-json

### Original Package is avalaible [here](http://github.com/DataGarage/node-xlsx-json)
This package has some improvements and it fixes [#26](https://github.com/DataGarage/node-xlsx-json/issues/26) 


Converting xlsx file to json files using nodejs

## Install

```
  npm install xlsx-to-json-depfix
```

## Usage

```javascript
  xlsxj = require("xlsx-to-json-depfix");
  xlsxj({
    input: "sample.xlsx", 
    output: "output.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });
```

### Specifying a target sheet

You can optionally provide a sheet name to extract from that sheet

```javascript
  xlsxj = require("xlsx-to-json-depfix");
  xlsxj({
    input: "sample.xlsx", 
    output: "output.json",
    sheet: "tags"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });
```

In config object, you have to enter an input path. But If you don't want to output any file you can set to `null`.

## License

MIT