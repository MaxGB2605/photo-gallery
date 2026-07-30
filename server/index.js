//Express framework for web server
import express from "express";
import { initializeDatabase, getAlbums, addAlbum } from "./db.js";

//Create an object for web server appllication
const app = express();
const PORT = 3000;

//Telling expres to use the static files from the FE client folder (Middleware)
app.use(express.static("../client"));
app.use(express.json()); //Middleware to parse JSON data in the request body

//routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

//register the route on the server
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);

//POST routes
app.post(ALBUM_ROUTE, handleCreateAlbumRequest);

function serverStarted() {
  console.log("BE Server is started and listening on port " + PORT);
}

//functions for the routes in the server
function handleHomePageRequest(request, response) {
  console.log("Browser requested Home Page on port " + PORT);
  response.send(
    "Welcome to Moonlight Dance Studio Photo Gallery Back End Server",
  );
}

async function handleAlbumsRequest(request, response) {
  console.log("Browser requested Albums on port " + PORT);
  const albums = await getAlbums();
  response.json(albums);
}

//Function to create an album in the albums table in the DB
async function handleCreateAlbumRequest(request, response) {
  console.log("Browser requested to create an album on port " + PORT);

  const title = request.body.title;
  const coverImage = request.body.coverImage;
  const eventDate = request.body.eventDate;

  //Validation for the title field to make sure it is a string and not empty
  if (typeof title !== "string") {
    return response
      .status(400)
      .json({ error: "Title must be a string. Please add the title." });
  }

  if (!title || title.trim() === "") {
    return response
      .status(400)
      .json({ error: "Title is required. Please add the title." });
  }

  await addAlbum(title, coverImage, eventDate);

  response.json({
    message: "Album created successfully!",
  });
}

//Initialize DB before starting the server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, serverStarted);
}

//Start server after initializing the database
startServer();
