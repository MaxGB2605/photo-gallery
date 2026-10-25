//Getting the elemnts from HTML file
const albumsContainer = document.getElementById("albums-container");
console.log("Getting album container from HTML: ", albumsContainer);

async function loadAlbums() {
  try {
    console.log(
      "This is the test to check if FE is serving via Express server",
    );
    const response = await fetch("/albums");

    //Check BE for succesfull response
    if (!response.ok) {
      throw new Error(
        `Failed to fetch albums: ${response.status} ${response.statusText}`,
      );
    }

    const albums = await response.json();
    //albumsContainer.textContent = `Number of albums in DB: ${albums.length}`;

    if (albums.length === 0) {
      albumsContainer.textContent = "No albums available yet. Check back soon!";
    }

    //Loop to go through the albums and display them in the album container
    for (const album of albums) {
      const albumElement = createAlbumCard(album);
      albumsContainer.appendChild(albumElement);
      console.log("Current album: ", album);
    }

    console.log("FE loaded albums:", albums);
  } catch (error) {
    console.error("Error loading albums:", error);
    albumsContainer.textContent =
      "Sorry, we couldn't load the albums. Please try again later.";
  }
}

//Function to create an album card element from an album object
function createAlbumCard(album) {
  const albumElement = document.createElement("div");
  albumElement.classList.add("album-card");

  const imageElement = document.createElement("img");
  imageElement.src = album.cover_image;

  const titleElement = document.createElement("h2");
  titleElement.textContent = album.title;

  //Appending the elements to the album container\
  albumElement.appendChild(titleElement);
  albumElement.appendChild(imageElement);

  if (album.event_date) {
    const dateElement = document.createElement("p");
    dateElement.textContent = album.event_date;
    albumElement.appendChild(dateElement);
  }

  return albumElement;
}

loadAlbums();
