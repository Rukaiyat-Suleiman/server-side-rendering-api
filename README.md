# Server-side-rendering-api
Setup:  
clone the repo  
run ```npm install```   
### WEB server/ Servers and APIs 1
Run script ```npm start web-server``` to start the web server  
The index.html should be rendered on the base route and the 404 on any others.


### API server/ Servers and APIs 2
Run script ```npm start api-server``` to start the web server  
./api-server/items.json is the fake database  
Make all requests to /items.  


Supported routes and functions:  

GET /items - Gets all items from the JSON file  
GET /items/:id - Gets a specific item by ID  
POST /items - Creates a new item and appends it to the array  
PUT /items/:id - Updates an existing item in the array  
DELETE /items/:id - Removes an item from the array  

Sample JSON post request:  
```
{
  "name": "Product Name",
  "price": 29.99,
  "size": "m"
}
```