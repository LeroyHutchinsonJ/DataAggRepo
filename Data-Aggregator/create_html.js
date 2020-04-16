


exports.createHtmlStringFromJson = function(retrievedData, html_content)
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

exports.createHtmlStringFromCsv = function(retrievedData, html_content)
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