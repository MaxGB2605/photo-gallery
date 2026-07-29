async function loadAlbums() {
  console.log("This is the test to check if FE is serving via Express server");
  const response = await fetch("http://localhost:3000/albums");
  const albums = await response.json();
  console.log("FE loaded albums:", albums);
}

loadAlbums();
