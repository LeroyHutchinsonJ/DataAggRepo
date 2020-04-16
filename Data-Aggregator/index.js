var http = require("http");
var request = require("request");
var fs = require('fs');
var csv = require('csv');

//This will allow me to check the url of the data and see if it has json or csv at the end of it
var url = require('url');

var request_body = undefined;
var html_content = undefined;

//Since I am going to pick which one to use, i need two different variables, one for json one for csv
var csvRequestBody = undefined;
var jsonRequestBody = undefined;

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


//This gets the data from the link and puts it in request_body
request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(err, request_res, body)
    {
        jsonRequestBody = body;
    }
);

    //This gets the data from the link and puts it in request body
request('https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2019-06-10.csv',
    function(err, request_req, body)
    {
        //This is to parse the csv in a format that i can store in the requestBody variable
        csv.parse(body, function(err, data)
        {
            csvRequestBody = data;
        });

    });


http.createServer(function(req, res)
{
    //If the request body has something in it
    if(csvRequestBody && jsonRequestBody && html_content)
    {
        //Send out the result in html format
        res.writeHead(200, {'Content-Type' :'text/html'});

        //Parse the request url using the url package
        var requestUrl = url.parse(req.url);

        //Check the path of the request url
        switch(requestUrl.path)
        {
            case "/json":
                //Send out the json info after parsing json request body into actual json
                res.end(createHtmlStringFromJson(JSON.parse(jsonRequestBody)));
                break;
            case "/csv":
                //Send out the csv info, it is parsed inside of the function so I dont need to do it here
                res.end(createHtmlStringFromCsv(csvRequestBody));
                break;
        }
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