var http = require("http");
var request = require("request");
var fs = require('fs');
var request_body = undefined;
var csv = require('csv');
var html_content = undefined;

//This is the json data and the csv data
var jsonRequestData = undefined;
var csvRequestData = undefined;

function createHtmlStringFromJson(retrievedData)
{
    //Now I have to split the html data into  beginning + middle + end, I am going to edit the middle.(see line 81 or so)

    //This is where the body tags start
    var body_begin_index = html_content.indexOf('<body>');

    //This is where the body tags end
    var body_end_index = html_content.indexOf('</body>');

    //This is the strings before the body tag
    var string_until_body = html_content.slice(0, body_begin_index + 6);

    //This is the strings after the body tag
    var string_from_body = html_content.slice(body_end_index);

    //This creates the beginning of the html string
    var htmlString = '<table>\n';

    //This adds a row to the html string
    htmlString += '<tr>\n';

    //This loops through the data and creates a col for each category that is not a json object
    for(var attribute in retrievedData[0])
    {
        if(typeof retrievedData[0][attribute] !=='object' )
        {
            htmlString += '<td>' + attribute + '</td>\n'
        }

    }
    htmlString += '</tr>\n';

    retrievedData.forEach(function(object){
        htmlString += '<tr>\n';
        for(var attribute in object)
        {
            if(typeof object[attribute] != 'object')
            {
                htmlString += '<td>' + object[attribute] + '</td>\n'
            }
        }
        htmlString += '</tr>\n';
    });
    htmlString += '</table>';
    console.log(string_from_body.toString());
    //The string_until_body gets everything before the body tag, the string after body is everything after the body tag
    return string_until_body + htmlString + string_from_body;
}

function createHtmlStringFromCsv(retrievedData)
{
    //This is where the body tags start
    var body_begin_index = html_content.indexOf('<body>');

    //This is where the body tags end
    var body_end_index = html_content.indexOf('</body>');

    //This is the strings before the body tag
    var string_until_body = html_content.slice(0, body_begin_index + 6);

    //This is the strings after the body tag
    var string_from_body = html_content.slice(body_end_index );



    var htmlString = "<table>\n";
        htmlString += "<tr>\n";
    retrievedData[0].forEach(function(attribute){
        htmlString += "<td> " + attribute + " <td/>\n";
    });

    htmlString += "<td/>";

    //Chop off the column names from the data
    var data = retrievedData.slice(1);

    //I should think of the data object as an object that holds an array, and that array is filled with string arrays at each of its indices
    data.forEach(function (row) {

        htmlString += "<tr> \n";
        row.forEach(function(cell)
        {
            htmlString += "<td>" + cell + "<td/>\n";
        });
        htmlString += "<tr\>\n"
    });

    htmlString += "<table/>\n";

    return string_until_body + htmlString + string_from_body;
}

/*
//This is to get the raw string data from the link
request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(err, request_res, body)
    {
        request_body = body;
    }
);
*/

//The csv function is an external module that i need to be able to parse csv string into an object
request('https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2019-06-10.csv',
    function(err, request_req, body)
    {
        csv.parse(body, function(err, data)
        {
            request_body = data;
        });

    });


http.createServer(function(req, res)
{
    //If the request body has something in it
    if(request_body && html_content)
    {
        res.writeHead(200, {'Content-Type' :'text/html'});
        //request_body is the string that the link returns, JSON.parse turns the string into a json object
       // res.end(createHtmlStringFromJson(JSON.parse(request_body)))
        res.end(createHtmlStringFromCsv(request_body));
    }
    else {
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end('Nothing retrieved yet');

    }
}).listen(8080);

//So this takes the data from the html file and puts in the html_content variable, all the data INCLUDING THE STYLE DATA
fs.readFile('./index.html', function(err, html) {
    //If there is an error throw the error
    if(err)
    {
        throw err;
    }
    html_content = html;

});