import sqlite3 from "sqlite3";
import { open } from "sqlite";

//Function to open DB connection
async function openDatabase() {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });
  return db;
}

//Creating and initializing DB
async function initializeDatabase() {
  const db = await openDatabase();

  await db.exec(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            cover_image TEXT,
            event_date TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP 
    )
`);
  console.log("Album table is ready");
}

//Query to get the albums
async function getAlbums() {
  const db = await openDatabase();

  const albums = await db.all(`
    SELECT * 
    FROM albums
    `);

  return albums;
}

//FUnction to add albums toDB
async function addAlbum(title, coverImage, eventDate) {
  const db = await openDatabase();

  await db.run(
    `
    INSERT INTO albums (title, cover_image, event_date)
    VALUES (?,?,?)
    `,
    [title, coverImage, eventDate],
  );
}

//This makes the initializeDatabase function available to other files that import this module
export { initializeDatabase, getAlbums, addAlbum };
