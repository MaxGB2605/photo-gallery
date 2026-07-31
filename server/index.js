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
  const eventDatePattern = /^\d{4}-\d{2}-\d{2}$/; // Regular expression pattern for YYYY-MM-DD format

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

  //Date validation to make sure the eventDate is a valid date string
  if (eventDate !== undefined && typeof eventDate !== "string") {
    return response.status(400).json({
      error:
        "Event date should be a string. Pllease enter proper event date in the format YYYY-MM-DD.",
    });
  }

  //Date validation to make sure the eventDate is in the correct format YYYY-MM-DD
  if (eventDate !== undefined && !eventDatePattern.test(eventDate)) {
    return response.status(400).json({
      error:
        "Event date should be in the format YYYY-MM-DD. Please enter a valid event date.",
    });
  }

  //Date validation to make sure the eventDate is a valid date
  if (eventDate !== undefined) {
    
    const [year, month, day] = eventDate.split("-").map(Number);

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return response.status(400).json({
        error:
          "Event date is not valid calendar date. Please enter valid calendar date.",
      });
    }
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
