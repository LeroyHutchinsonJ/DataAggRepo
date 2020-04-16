//Import the file system
var fs = require('fs');

//Going to update the log text file
exports.updateLogFile = function(message)
{
    fs.readFile('./log.txt', function(err, logContent){
        //If there is an error throw err
        if(err)
        {
            throw err;
        }
        logContent += logContent + "";

    });
};