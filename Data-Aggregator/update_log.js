//Import the file system
var fs = require('fs');

//Going to update the log text file
exports.updateLogFile = function(message)
{
    //Read the file
    fs.readFile('./log.txt', function(err, logContent){
        //If there is an error throw err
        if(err)
        {
            throw err;
        }
        //Convert it to a string type and add a space
        logContent += "";

        //Create an array called lines from the log content, split by new lines
        var lines = logContent.split('\n');

        //This is the first line
        var firstLine = lines[0];

        //This gets the index in the array where the value is :
        var accessCounterIndex = firstLine.indexOf(':');

        //Slice the array starting from the index after the ":" and a space, this will only give me the indices other than the first line
        var numberOfAccesses = parseInt(firstLine.slice(accessCounterIndex+2));

        //We increment number accesses by 1 and update the first line
        lines[0] = "Number of times accessed: " + (numberOfAccesses + 1);

        //We add a new message after the current message in the log file
        var newLogContent = lines.join('\n') + message + '\n';

        //Add the new log content to the log txt
        fs.writeFile('log.txt', newLogContent, function(err){
            if(err)
            {
                throw err;
            }
        });
    });
};