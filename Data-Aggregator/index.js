var http = require("http");
var request = require("request");
var fs = require('fs');
var csv = require('csv');

//This imports the create_html file
var create_html = require('./create_html');

//Request comes from client, response goes to client
//This will allow me to check the url of the data and see if it has json or csv at the end of it
var url = require('url');


var html_content = undefined;

//Since I am going to pick which one to use, i need two different variables, one for json one for csv
var csvRequestBody = undefined;
var jsonRequestBody = undefined;

//Request data from the server every 2 seconds
setInterval( () => {
    //This gets the data from the link and puts it in request_body
    request('https://www.bnefoodtrucks.com.au/api/1/trucks', function (err, request_res, body) {
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
}, 2000);


    http.createServer( function(req, res)
    {
        //If the request body has something in it
        if(csvRequestBody && jsonRequestBody && html_content)
        {
            //Send out the result in html format
            res.writeHead(200, {'Content-Type' :'text/html'});

            //Parse the request url using the url package
            var requestUrl = url.parse(req.url);

            //This refreshes the data every 2 seconds
                //Check the path of the request url
                switch(requestUrl.path)
                {
                    case "/json":
                        //Send out the json info after parsing json request body into actual json
                        res.end(create_html.createHtmlStringFromJson(JSON.parse(jsonRequestBody), html_content));
                        break;
                    case "/csv":
                        //Send out the csv info, it is parsed inside of the function so I dont need to do it here
                        res.end(create_html.createHtmlStringFromCsv(csvRequestBody, html_content));
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