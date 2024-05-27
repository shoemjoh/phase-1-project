Description:

930reservation is a single page application (SPA) that allows a user to log travel experiences across different destinations. Submit a review of a hotel, restaurant, day activity, or night activity with the form and a specified destination, and 930 reservation will save and push the information to a json server to store. Access your saved reviews by clicking on a destination tile. The application is built with JavaScript, HTML, and CSS. 

Repo URL: 

https://github.com/shoemjoh/phase-1-project

Set-Up:

Currently, the app uses a "JSON Server" to store the data from the user. In future iterations of the project, we'd expect that to move to a real server. To set it up, you need to take the following steps.

First, install the json server terminal using: 
 npm install json-server

Second, create a file that will act as your data storage:
 touch db.json

Third, create and save and object in the file with the attribute "Destinations" that looks like the following:
{
  "destinations": []
}

Finally, run the following command from the same directory that db.json is in, which will start up the server and allow you to access it:
json-server --watch db.json

Additional Resources:
I use data attributes in some of my HTML elements in this project. See my blog post here detailing how they are used;
https://medium.com/@shoemjoh/adding-data-attributes-to-html-elements-aa0439049818





