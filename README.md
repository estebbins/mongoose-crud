# Fruitcakes full CRUD Full stack app

- Use express to build a server
- Use mongoose to communicate with mongodb
- Full crud functionality on our fruits resource
- User authentication
- The ability to add comments to fruits
- Maybe gather data from a 3rd party API (time permitting)

This app will start as an API, that receives requests and sends JSON responses, but eventually we will add a views layer, that will render HTML in our browser. 

This is an MVC application. 
MVC: 
- Models - all of our data, what shape it's in and what resources we'r using(models), and how our resources relate to one another
- Views - all the different ways we can see our data, whether it's a JSON response, or an actual HTML response, this determines how our data can be viewed by the user
- Controllers - tell us what we can do and connect our views and our models. We can think of our routes as our controllers, because they determine how a user can interact with our resources.