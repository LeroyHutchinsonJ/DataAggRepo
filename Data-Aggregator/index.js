var http = require("http");
var request = require("request");
var fs = require('fs');
var request_body = undefined;

function createHtmlStringFromJson(retrievedData)
{
    //This creates the beginning of the html string
    var htmlString = '<html><head><link rel="stylesheet" type="text/css" href="index.css"><title>Data Aggregator</title></head><body><table>';

    //This adds a row to the html string
    htmlString += '<tr>';

    //This loops through the data and creates a col for each category that is not a json object
    for(var attribute in retrievedData[0])
    {
        if(typeof retrievedData[0][attribute] !=='object' )
        {
            htmlString += '<td>' + attribute + '</td>'
        }

    }
    htmlString += '</tr>';

    retrievedData.forEach(function(object){
        htmlString += '<tr>';
        for(var attribute in object)
        {
            if(typeof object[attribute] != 'object')
            {
                htmlString += '<td>' + object[attribute] + '</td>'
            }
        }
        htmlString += '</tr>';
    });
    htmlString += '</table></body></html>';

    return htmlString;
}



request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(err, request_res, body)
    {
        request_body = body;
    }
);

http.createServer(function(req, res)
{
    if(request_body)
    {
        /*
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.end(createHtmlStringFromJson(JSON.parse(request_body)));
         */
        //This posts the html page but for some reason it does not also post the stylesheet
        fs.readFile('index.html', function(err, data){
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(createHtmlStringFromJson(JSON.parse(request_body)));
            res.end();
        })
    }
    else {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('Nothing retrieved yet');

    }
}).listen(8080);