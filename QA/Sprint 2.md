Sunday 4:45 PM
Hi we completed Sprint 1. Lets continue with Sprint 2

Perfect! Welcome to Sprint 2. 🎉

First, congratulations on finishing Sprint 1. That was an important milestone because we now have a working backend. Instead of just writing code, you've built the foundation of a real web application.

Sprint 1 Review

Here's what we accomplished:

✅ Created an Express server
✅ Learned what package.json and node_modules are
✅ Started the server with app.listen()
✅ Created our first route
✅ Connected to SQLite
✅ Queried the database
✅ Returned JSON from the backend

You now have three major pieces of the architecture working together:

Browser
↓
Frontend (HTML/CSS/JavaScript)
↓
Backend (Express)
↓
SQLite Database

This matches the architecture we planned at the beginning of the project.

Sprint 2 Goal

Today we're going to connect the Frontend to the Backend.

Up until now:

Browser
↓
Frontend

Backend
↓
Database

The frontend and backend existed...

…but they weren't talking to each other.

Sprint 2 is where your application starts behaving like a real full-stack application.

Success Criteria

By the end of Sprint 2, you should be able to explain:

What fetch() is
Why browsers can't access SQLite directly
What a Promise is
Why async/await exists
How JSON travels from backend to frontend
How to display data from the backend on a webpage
How to handle loading and error states
How to debug requests using the browser's Network tab

If you can explain those concepts, you've truly learned Sprint 2—not just copied code.

Before We Write Any Code

Let's answer one important question.

Where does the data live?

Imagine your gallery has 10,000 photos.

Should the browser open the SQLite database directly?

Option A
Browser
│
▼
SQLite
Option B
Browser
│
▼
Express Server
│
▼
SQLite

Which one should we use?

The answer is Option B.

Why?

Because the database is the Single Source of Truth. The browser should never have direct access to it. The backend acts like a receptionist in an office:

"Tell me what you need, and I'll get it from the database."

This keeps your data secure, lets you validate requests, and allows you to change the database later without breaking the frontend.

Our Sprint 2 Roadmap

We'll build this one step at a time:

Part 1 — Understanding fetch()
What is an HTTP request?
What is fetch()?
GET vs POST (high level)
Part 2 — Understanding Promises
Why network requests take time
Synchronous vs asynchronous code
What a Promise really is
Part 3 — async / await
Why it's easier to read than .then()
How it works under the hood
Part 4 — Request Albums

We'll call our backend:

GET /albums

and receive something like:

[
{
"id": 1,
"title": "Spring Showcase"
},
{
"id": 2,
"title": "Holiday Ball"
}
]
Part 5 — Update the DOM

We'll learn how to take that JSON and create HTML dynamically.

Part 6 — Error Handling

We'll handle situations like:

Backend is offline
Database fails
Empty album list
Network timeout
QA Perspective

Since you're a QA engineer, I want to add something we didn't include in Sprint 1.

At the end of every feature we'll ask:

Functional Tests

Does the request succeed?
Is the correct status code returned?
Is the JSON valid?

Negative Tests

What happens if the server is stopped?
What happens if the database is empty?
What if the backend returns malformed JSON?

This way, you're learning to think like both a developer and a QA engineer.

Today's First Lesson

We are not going to start by writing fetch().

Instead, we'll first answer one question:

What actually happens between clicking a webpage and seeing data appear on the screen?

Once you understand that journey, fetch() becomes much easier to grasp.

I'm excited to continue this project with you. Your approach throughout Sprint 0 and Sprint 1 has been exactly what good engineers do—you've consistently asked why before how. That understanding will make the code much easier to remember than simply memorizing syntax.

So let's officially begin Sprint 2: Frontend Talks to Backend. 🚀

this is how it is now, should i change structure?

awesome, i can see my html:

Perfect — this confirms exactly what is happening. 👍 And this is a very good error to have at this stage, because it demonstrates the difference we were just discussing.

Let's read your Console from top to bottom.

1. The browser successfully reached your server
   You have:

GET http://localhost:3000/albums 404 (Not Found)
This means:

Browser
│
│ GET /albums
▼
Express Server ✅
So the server is running and the browser reached it.

This is not a network error.

2. Express doesn't have an /albums route
   The 404 means Express essentially says:

"I received your request, but I don't have a route that matches /albums."

Right now, your Express server probably has no route like:

app.get("/albums", ...);
So Express returns:

404 Not Found
This is exactly what we expected at this point.

3. Now look at your second error
   You have:

Uncaught (in promise) SyntaxError:
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
This is also very interesting.

Your frontend currently does:

const response = await fetch("http://localhost:3000/albums");
const albums = await response.json();
The browser receives a 404 response.

But then your JavaScript says:

"I don't care what the status is. Try to parse the response as JSON."

The problem is that Express's default 404 response is apparently HTML, something beginning with:

<!DOCTYPE html>

Your code then tries to do:

response.json()
But this is not JSON.

So JavaScript says:

"I expected JSON, but I found <."

That's why you get:

Unexpected token '<'
The < is the beginning of:

<!DOCTYPE html>

This is exactly why we discussed response.ok
Remember our earlier discussion?

We said we should eventually do:

const response = await fetch(...);

if (!response.ok) {
// Handle HTTP error
}

const albums = await response.json();
Now you've just experienced why.

Your current code effectively says:

fetch()
│
▼
Did I receive ANY response?
│
▼
Yes
│
▼
Parse it as JSON
│
▼
💥 But it's actually HTML
What we want is:

fetch()
│
▼
HTTP response received
│
▼
Is response.ok true?
│
├── YES ──► Parse JSON
│
└── NO ───► Handle HTTP error
🎯 But I don't want to fix this yet
We actually have a more important task first.

We need to create the /albums endpoint in your backend.

Right now:

Browser
│
│ GET /albums
▼
Express
│
│ ❌ No /albums route
▼
404 Not Found
We need to create:

Browser
│
│ GET /albums
▼
Express
│
│ app.get("/albums")
▼
SQLite
│
│ Find albums
▼
Express
│
│ res.json(albums)
▼
Browser
Then your existing frontend code:

const response = await fetch("http://localhost:3000/albums");
const albums = await response.json();

console.log(albums);
should finally receive actual JSON.

One important observation from your screenshot
Your error stack shows:

loadAlbums @ main.js:7
That confirms that your main.js is definitely executing.

So we've successfully completed this chain:

✅ Browser loads index.html
↓
✅ Express serves index.html
↓
✅ Browser requests main.js
↓
✅ Express serves main.js
↓
✅ main.js executes
↓
✅ loadAlbums() runs
↓
✅ fetch() sends GET /albums
↓
✅ Express receives request
↓
❌ Express has no /albums route yet
↓
404
That's actually excellent progress. We're now at the exact point where frontend and backend meet.

Next step: Let's create the /albums GET route in Express.
Before we write it, I want you to look at your current server/index.js and show me the code you have there now. We'll add the route to your actual code, rather than me guessing what you've already built.

//Express framework for web server
import express from "express";

//Create an object for web server appllication
const app = express();
const PORT = 3000;

//Telling expres to use the static files from the client folder
app.use(express.static("../client"));

//routes in the BE server
const HOME_ROUTE = "/";

function serverStarted() {
console.log("BE Server is started and listening on port " + PORT);
}

//register the route on the server
app.get(HOME_ROUTE, handleHomePageRequest);

//Start the server and listen on the port
app.listen(PORT, serverStarted);

//functions for the routes in the server
function handleHomePageRequest(request, response) {
console.log("Browser requested Home Page on port " + PORT);
response.send(
"Welcome to Moonlight Dance Studio Photo Gallery Back End Server",
);
}

Great! This is a nice, clean starting point. 👍 And now I can see an important detail we need to address before adding /albums.

Your current index.js has two different things handling the / route.

You have:

app.use(express.static("../client"));
and:

app.get(HOME_ROUTE, handleHomePageRequest);
Remember, HOME_ROUTE is:

const HOME_ROUTE = "/";
So both are interested in:

GET /
Because express.static() comes first, it finds client/index.html and serves it. That's why you see your HTML in the browser. Your handleHomePageRequest() isn't actually being reached for the browser's / request.

That's okay for now, but it's important to understand.

Now let's add /albums
We want this flow:

Browser
│
│ GET /albums
▼
Express
│
│ app.get("/albums", ...)
▼
Our handler function
│
│ query database
▼
SQLite
But we're going to take this one step at a time.

First, let's create the route without the database.
This will allow us to prove that:

Browser → Express → /albums route → Browser

is working.

Add this near your other route:

const ALBUMS_ROUTE = "/albums";

app.get(ALBUMS_ROUTE, handleAlbumsRequest);
Then add the handler:

function handleAlbumsRequest(request, response) {
console.log("Browser requested albums");
response.json([]);
}
So your code will look approximately like this:

// Express framework for web server
import express from "express";

// Create an object for web server application
const app = express();
const PORT = 3000;

// Telling Express to use the static files from the client folder
app.use(express.static("../client"));

// Routes in the BE server
const HOME_ROUTE = "/";
const ALBUMS_ROUTE = "/albums";

function serverStarted() {
console.log("BE Server is started and listening on port " + PORT);
}

// Register the routes on the server
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUMS_ROUTE, handleAlbumsRequest);

// Start the server and listen on the port
app.listen(PORT, serverStarted);

// Functions for the routes in the server
function handleHomePageRequest(request, response) {
console.log("Browser requested Home Page on port " + PORT);

response.send(
"Welcome to Moonlight Dance Studio Photo Gallery Back End Server",
);
}

function handleAlbumsRequest(request, response) {
console.log("Browser requested albums");

response.json([]);
}
🧠 Why are we returning []?
Because we aren't connecting the database yet.

We're temporarily saying:

"The /albums endpoint exists, and right now there are zero albums."

The response will be valid JSON:

[]
That's an empty JavaScript array represented as JSON.

This is useful because your frontend already has:

const albums = await response.json();
console.log(albums);
Now it should receive:

[]
instead of the HTML 404 page.

The expected flow
After you save index.js and restart your server:

Browser
│
│ GET /albums
▼
Express
│
│ Finds /albums route
▼
handleAlbumsRequest()
│
│ response.json([])
▼
Browser
│
▼
[]
Your Console should then show:

[]
And your Network tab should show:

albums 200
🎯 That's our next milestone.

Don't connect SQLite yet. First, let's prove that your frontend can successfully call a backend endpoint and receive valid JSON.

Add the /albums route and handler, restart your Express server, refresh the browser, and tell me what you get in the Console and Network tab.

network albums was 304, but in console log was empty array

Perfect! 🎉 That means our test worked.

Let's interpret the two results:

Network tab: 304
A 304 Not Modified is not an error. It means the browser is using its cached version because the resource hasn't changed.

So:

GET /albums
Status: 304
means the request reached your server successfully, and the browser determined that it could reuse the existing response.

Console:
[]
This is exactly what we expected because we temporarily wrote:

response.json([]);
So the complete flow is now working:

Browser
│
│ GET /albums
▼
Express
│
│ finds /albums route
▼
handleAlbumsRequest()
│
│ response.json([])
▼
Browser
│
▼
[]
🎯 This is our first successful Frontend → Backend → Frontend communication!

The important part is that we haven't even involved SQLite yet. We proved each layer independently:

Browser
│
│ fetch("/albums")
▼
Express
│
│ /albums route
▼
Response
│
│ JSON
▼
Browser
One thing to notice
Earlier, you had:

404 Not Found
and then:

Unexpected token '<'
Now you have:

304
[]
The difference is:

Before
fetch()
│
▼
Express
│
▼
404 HTML page
│
▼
response.json()
│
▼
💥 Error
Now
fetch()
│
▼
Express
│
▼
/albums route
│
▼
JSON []
│
▼
response.json()
│
▼
[]
That's a big milestone. 👏

Next step: Connect /albums to SQLite
Now we're ready to replace this:

response.json([]);
with something that actually asks the database:

"Give me all the albums."

The flow will become:

Browser
│
│ GET /albums
▼
Express
│
│ handleAlbumsRequest()
▼
SQLite
│
│ SELECT albums
▼
Express
│
│ response.json(albums)
▼
Browser
This is where we finally connect all three parts of your application:

Frontend → Backend → Database → Backend → Frontend

Before we do that, I want to see your current database setup in server/index.js because we need to work with the SQLite code you already created in Sprint 1 rather than introduce duplicate database logic.

i didn't create it , i forgot, i just marked what should i created. here is full file"
//Express framework for web server
import express from "express";

//Create an object for web server appllication
const app = express();
const PORT = 3000;

//Telling expres to use the static files from the client folder
app.use(express.static("../client"));

//routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

function serverStarted() {
console.log("BE Server is started and listening on port " + PORT);
}

//register the route on the server
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);

//Start the server and listen on the port
app.listen(PORT, serverStarted);

//functions for the routes in the server
function handleHomePageRequest(request, response) {
console.log("Browser requested Home Page on port " + PORT);
response.send(
"Welcome to Moonlight Dance Studio Photo Gallery Back End Server",
);
}

function handleAlbumsRequest(request, response) {
console.log("Browser requested Albums on port " + PORT);
response.json([]);
}

//Creating the table for database
/_
id
title
cover_image
event_date
created_at
_/

Ah, yes — now I see where we are. 😊 And actually, this is a good point to stop and make sure we don't accidentally skip an important Sprint 1 piece.

Your current server/index.js is clean:

app.get(ALBUM_ROUTE, handleAlbumsRequest);

function handleAlbumsRequest(request, response) {
console.log("Browser requested Albums on port " + PORT);
response.json([]);
}
Right now, we're returning a hard-coded empty array:

response.json([]);
So the next goal is to replace that with real data from SQLite.

But before we do that, there's an important question:

Did you already create the albums table in your db.sqlite database during Sprint 1?

From your comment:

//Creating the table for database
/_
id
title
cover_image
event_date
created_at
_/
it looks like we planned the table but didn't actually implement it yet.

I think we should now do this in the following order:

STEP 1
Connect Node/Express to SQLite
↓
STEP 2
Create albums table if it doesn't exist
↓
STEP 3
Add some test album records
↓
STEP 4
Change GET /albums
↓
Query SQLite
↓
Return albums as JSON
↓
STEP 5
See real albums in browser console
The final flow will be:

                 Browser
                    │
                    │ GET /albums
                    ▼
              Express Route
                    │
                    ▼
          handleAlbumsRequest()
                    │
                    │ SQL query
                    ▼
                 SQLite
                    │
                    │ album rows
                    ▼
          handleAlbumsRequest()
                    │
                    │ response.json(albums)
                    ▼
                 Browser
                    │
                    ▼
            console.log(albums)

One thing I recommend
Let's not jump straight into writing the SQLite code yet.

You are learning JavaScript and backend development, and I want you to understand the connection we're creating. We should first establish:

What exactly is a database connection?

You already have sqlite3 and sqlite in your server dependencies from our earlier setup. The sqlite package gives us a Promise-based API, which works nicely with the async/await you're learning now.

So the next lesson will be:

"How does our Express server connect to db.sqlite, and what does open() actually do?"

Then we'll create the albums table and insert our first test album.

That will give us the complete chain we've been working toward:

Browser → fetch() → Express → SQLite → Express → JSON → Browser

And we'll be able to see actual album data in your Console instead of [].

great. My question is should creat table be in the index.js file or it should be separate file related only to db?

Great question. This is exactly the kind of architectural decision we should make before writing the code.

My recommendation for your project is:

Keep database-related code in a separate file/module, not inside index.js.

Your index.js should primarily be responsible for the Express server and routes.

A clean structure would be:

photo-gallery-project/
│
├── client/
│ ├── css/
│ ├── js/
│ └── index.html
│
└── server/
├── index.js ← Express server + routes
├── db.js ← Database connection
├── db.sqlite ← SQLite database
└── package.json
Why?
Think of each file as having a job.

index.js
│
│ "A request came in for /albums"
▼
Database function
│
│ "I'll ask SQLite for the albums"
▼
SQLite
│
│ returns data
▼
Database function
│
▼
index.js
│
│ response.json(...)
▼
Browser
So:

index.js
Responsible for:

Starting Express

Defining routes

Receiving HTTP requests

Sending HTTP responses

Example:

app.get("/albums", handleAlbumsRequest);
db.js
Responsible for:

Connecting to SQLite

Creating tables

Running database queries

Returning database results

For example, conceptually:

const albums = await getAlbums();
The route shouldn't need to know how SQLite works.

What about creating the table?
I would also put that in the database-related file, but there's an important distinction.

There are two different database responsibilities:

1. Database initialization
   This includes:

Create database connection
Create tables if they don't exist 2. Database operations
This includes:

Get albums
Get one album
Create album
Update album
Delete album
For our small V1 project, we can initially keep these together in db.js:

server/
├── index.js
├── db.js
└── db.sqlite
Later, if the application grows, we might separate them:

server/
├── index.js
├── db/
│ ├── connection.js
│ ├── init.js
│ └── albumQueries.js
└── db.sqlite
But I don't recommend doing that yet. It would add complexity without giving us much benefit at this stage.

One thing I would change from our earlier plan
I originally suggested putting the database initialization directly into index.js, but now that we're actually building the project, I think separating it into db.js is better for your learning and for the architecture.

It reinforces an important backend principle:

Separate responsibilities.

Your architecture becomes:

                 Browser
                    │
                    │ HTTP request
                    ▼
              ┌───────────┐
              │ index.js  │
              │ Express   │
              │ Routes    │
              └─────┬─────┘
                    │
                    │ calls DB function
                    ▼
              ┌───────────┐
              │   db.js   │
              │ SQLite    │
              └─────┬─────┘
                    │
                    ▼
               db.sqlite

That's a very good foundation for a beginner full-stack project.

🎯 My recommendation for Sprint 2
Let's create:

server/db.js
and put the SQLite connection and database initialization there.

Then index.js will use functions from db.js to retrieve albums.

This will also give you a chance to learn an important JavaScript concept next: exporting functions from one module and importing them into another.

That's a natural next step for your project because you're already using ES modules with:

import express from "express";
So we'll extend that same concept to your own code.

done

Perfect! 👍

Now we have:

server/
├── index.js
├── db.js ← database responsibility
├── db.sqlite
└── package.json
Let's build db.js one piece at a time.

Step 1 — Import the SQLite libraries
At the top of db.js, add:

import sqlite3 from "sqlite3";
import { open } from "sqlite";
Why two imports?
This is a good place to understand the roles:

sqlite3
│
└── The actual SQLite database driver
"I know how to communicate with SQLite."

sqlite
│
└── A Promise-based wrapper
"I make it easier to use SQLite with async/await."
So we're combining them:

Your JavaScript
│
│ async / await
▼
sqlite
│
▼
sqlite3
│
▼
SQLite
│
▼
db.sqlite
This works nicely with the JavaScript concepts you've just learned.

Step 2 — Create a database connection function
Below your imports, add:

async function openDatabase() {
const db = await open({
filename: "./db.sqlite",
driver: sqlite3.Database,
});

return db;
}
Let's understand it before we move on.

async function openDatabase()
We're creating an asynchronous function because opening a database connection takes time.

Then:

const db = await open({
We're asking the sqlite library to open a database.

This:

filename: "./db.sqlite"
tells it which database file to open.

And:

driver: sqlite3.Database
tells the sqlite library:

"Use the sqlite3 driver to communicate with this SQLite database."

Finally:

return db;
returns the database connection so other code can use it.

⚠️ One important path detail
Your structure is:

photo-gallery-project/
│
├── client/
│
└── server/
├── db.js
└── db.sqlite
So we want:

db.js
│
▼
server/db.sqlite
We'll need to make sure the path is resolved correctly when Node runs your server. The ./db.sqlite approach depends on the directory from which you start Node, so we'll address that carefully rather than accidentally creating a second database file somewhere else.

Your turn
Add just the imports and openDatabase() function to db.js:

import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
const db = await open({
filename: "./db.sqlite",
driver: sqlite3.Database,
});

return db;
}
Don't add anything else yet.

Once you've done that, tell me, and we'll make the database create the albums table. This is where we'll connect your planned fields:

id
title
cover_image
event_date
created_at
to an actual SQLite table.

Today 8:47 AM
done

Great! 👍 Now let's take the next small step: actually initialize the database and create the albums table.

We currently have a function that knows how to open the database:

async function openDatabase() {
const db = await open({
filename: "./db.sqlite",
driver: sqlite3.Database,
});

return db;
}
But right now, nothing calls this function, so the database isn't being opened yet.

Step 2 — Create an initialization function
Let's add this below openDatabase():

async function initializeDatabase() {
const db = await openDatabase();

await db.exec(`     CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cover_image TEXT,
      event_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

console.log("Albums table is ready");
}
Let's understand what is happening.

First:
const db = await openDatabase();
We call our function from the previous step.

The flow is:

initializeDatabase()
│
▼
openDatabase()
│
▼
Open db.sqlite
│
▼
Return database connection
│
▼
db
Now db represents our connection to SQLite.

Then:
await db.exec(`
We're asking SQLite to execute SQL.

The SQL is:

CREATE TABLE IF NOT EXISTS albums (
This means:

"Create a table called albums, but only if it doesn't already exist."

This is important because your server will start every time you run:

node index.js
We don't want to recreate the table every time.

Our table
We're defining:

id INTEGER PRIMARY KEY AUTOINCREMENT
SQLite will automatically generate:

1
2
3
4
...
for new albums.

title TEXT NOT NULL
Every album must have a title.

For example:

Ballroom Blitz 2026
cover_image TEXT
This will eventually store something like an image URL or path.

We aren't making it NOT NULL because an album could potentially exist before a cover image is assigned.

event_date TEXT
This stores the event date.

We're using TEXT for now because SQLite doesn't have a dedicated DATE data type.

For example:

2026-07-20
created_at TEXT DEFAULT CURRENT_TIMESTAMP
SQLite automatically records when the album was created.

One important thing
We haven't called:

initializeDatabase();
yet.

So right now your db.js contains functions, but they don't execute.

We need to decide when the database initialization should happen.

I recommend that the database is initialized when the server starts.

Conceptually:

Start Node
│
▼
Initialize Database
│
├── Open db.sqlite
│
└── Create albums table if needed
│
▼
Start Express Server
│
▼
Server ready
This way, when your server says:

BE Server is started and listening on port 3000
the database should already be ready.

But before we connect this to index.js...
There's one important JavaScript concept here.

Your initializeDatabase() function needs to be accessible from index.js.

Right now, if we have:

db.js
│
└── initializeDatabase()
and:

index.js
index.js can't automatically see that function.

We need to export it from db.js and import it into index.js.

You already know this:

import express from "express";
Now we're going to do the same thing with our own module.

Your next task
Add the initializeDatabase() function to db.js, but don't export or import anything yet.

So for now, your db.js should look like:

import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
const db = await open({
filename: "./db.sqlite",
driver: sqlite3.Database,
});

return db;
}

async function initializeDatabase() {
const db = await openDatabase();

await db.exec(`     CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cover_image TEXT,
      event_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

console.log("Albums table is ready");
}
Once you've added that, we'll do the export/import part together. That will be our next little piece.

i'm having errors:
import sqlite3 from "sqlite3";
import {open} from "sqlite";

//Function to open DB connection
async function openDatabase(){
const db = await open ({
filename: "./db.sqlite",
driver: sqlite3.Database,
})
return db;
}

//Creating and initializing DB
async function initializeDatabase(){
const db = await openDatabase();

    await db.exec('
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            cover_image TEXT,
            event_date TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )

');
console.log("Album table is ready")
}

You can absolutely use double quotes. The issue isn't double quotes vs. backticks. The issue is that your SQL is spread across multiple lines.

❌ This doesn't work:
await db.exec("
CREATE TABLE IF NOT EXISTS albums (
id INTEGER PRIMARY KEY
)
");
Because "..." cannot normally span multiple lines.

The same is true for single quotes:

await db.exec('
CREATE TABLE ...
');
✅ Option 1 — Backticks (best for multi-line SQL)
await db.exec(`    CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        cover_image TEXT,
        event_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
Backticks allow a string to span multiple lines.

✅ Option 2 — Double quotes on one line
You could technically write:

await db.exec("CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, cover_image TEXT, event_date TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)");
This works, but it's much harder to read.

So for our project:
Use:

await db.exec(`    SQL here`);
because SQL statements can get long, and formatting them across multiple lines makes them much easier to read.

A good rule of thumb:

"double quotes" → normal short string
'single quotes' → normal short string
`backticks` → multi-line strings or template literals
You'll also see backticks used later when JavaScript needs to insert variables into strings, for example:

const name = "Veronika";

console.log(`Hello, ${name}`);
which produces:

Hello, Veronika
So backticks are not required for SQL specifically. They're useful here because we're writing a multi-line SQL string.

oh, i see. any multiline string or with insertion of the wariable (without using standard concatination) is using back tick?

Yes! 🎯 You've got the idea.

In JavaScript, backticks create a template literal. They are especially useful for two things:

1. Multiline strings
   const message = `    Hello!
    Welcome to our photo gallery.
    Enjoy the pictures!`;
   With regular quotes, you'd have to keep it on one line or explicitly add line breaks.

2. Inserting variables with ${}
   For example:

const albumTitle = "Ballroom Blitz";

const message = `Welcome to ${albumTitle}!`;

console.log(message);
Output:

Welcome to Ballroom Blitz!
The ${albumTitle} is replaced with the value of the variable.

You can also put expressions inside:

const numberOfPhotos = 10;

const message = `This album contains ${numberOfPhotos} photos.`;
Or:

const firstName = "Max";
const lastName = "Brazhko";

const fullName = `${firstName} ${lastName}`;
Compared with concatenation
The older/common approach is:

const message = "Welcome to " + albumTitle + "!";
With a template literal:

const message = `Welcome to ${albumTitle}!`;
I think the second is easier to read, especially when you have several variables:

const title = "Ballroom Blitz";
const date = "2026-07-20";
const photoCount = 25;

const message = `Album: ${title}
Event date: ${date}
Photos: ${photoCount}`;
The result is:

Album: Ballroom Blitz
Event date: 2026-07-20
Photos: 25
🧠 One small terminology point
I'd phrase your understanding as:

"Backticks are used for template literals, which allow multiline strings and interpolation using ${}."

Interpolation is the technical term for inserting values into a string using ${}.

So you can remember:

"..." → String
'...' → String
`...` → Template literal
├── Multiline text
└── ${variable} interpolation
And that's exactly why we used backticks for our SQL:

await db.exec(`    CREATE TABLE IF NOT EXISTS albums (
        ...
    )`);
We're taking advantage of the multiline capability. We aren't using variable interpolation there yet.

Today 8:52 AM
lets continue

Absolutely. 😊 Let's continue from exactly where we stopped.

Your db.js should now look like this:

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Function to open DB connection
async function openDatabase() {
const db = await open({
filename: "./db.sqlite",
driver: sqlite3.Database,
});

return db;
}

// Creating and initializing DB
async function initializeDatabase() {
const db = await openDatabase();

await db.exec(`     CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cover_image TEXT,
      event_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

console.log("Album table is ready");
}
Now we have two functions:

openDatabase()
│
└── Opens db.sqlite
│
└── Returns database connection

initializeDatabase()
│
├── Calls openDatabase()
│
└── Creates albums table
But there's one problem:

index.js can't use initializeDatabase() yet.

Why? Because initializeDatabase() currently lives inside db.js, and each JavaScript module has its own scope.

We need to export it.

Step 1 — Export initializeDatabase
At the bottom of db.js, add:

export { initializeDatabase };
So the end of your file becomes:

async function initializeDatabase() {
const db = await openDatabase();

await db.exec(`     CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      cover_image TEXT,
      event_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

console.log("Album table is ready");
}

export { initializeDatabase };
This means:

"Make the initializeDatabase function available to other JavaScript modules."

Think of it like:

db.js
│
│ initializeDatabase()
│
│ export
▼
🌍 Available to other modules
Step 2 — Import it into index.js
At the top of server/index.js, you already have:

import express from "express";
Add:

import { initializeDatabase } from "./db.js";
So now:

import express from "express";
import { initializeDatabase } from "./db.js";
Notice the ./.

It means:

"The db.js file is in the same directory as index.js."

Your structure is:

server/
├── index.js
└── db.js
Therefore:

"./db.js"
is correct.

Step 3 — Actually call the function
Now we have imported the function, but we haven't called it.

We need:

initializeDatabase();
For the moment, put this before app.listen():

initializeDatabase();

// Start the server and listen on the port
app.listen(PORT, serverStarted);
Your flow becomes:

Node starts index.js
│
▼
Import initializeDatabase
│
▼
initializeDatabase()
│
▼
openDatabase()
│
▼
Open db.sqlite
│
▼
CREATE TABLE IF NOT EXISTS albums
│
▼
app.listen()
│
▼
Express starts listening
One thing to notice
initializeDatabase() is an async function.

We are calling:

initializeDatabase();
without await.

That's okay for our immediate learning step, but there's a subtle issue:

The database initialization might still be running while Express starts.

For example:

initializeDatabase()
│
│ still creating table...
│
├─────────────────┐
│ │
▼ ▼
app.listen() CREATE TABLE
│ │
▼ ▼
Server ready DB ready
Ideally, we want:

initializeDatabase()
│
▼
DB ready
│
▼
app.listen()
│
▼
Server ready
We'll improve that next.

But first, let's get the basic module connection working.

Your task now:
Add:

export { initializeDatabase };
to db.js.

Add:

import { initializeDatabase } from "./db.js";
to index.js.

Add:

initializeDatabase();
before app.listen().

Restart your server.

Then tell me what you see in your terminal.

We want to see:

Album table is ready
BE Server is started and listening on port 3000
If you get an error, that's okay—send it to me and we'll debug it together.

one question: is it true that in order access the fille/function and use it functions in the other file/folder we should 1. create import{name of the function/ maybe file?} and is it always at the bottom of the file?, 2. Then import it in the file where it should be used (import function. and or File?) 3. Initialize imported function

Yes — your understanding is mostly correct, but there are a couple of important details to clarify. This is a fundamental JavaScript concept, so it's good that you're stopping here. 👍

Let's use our project as the example.

We have:

server/
├── index.js
└── db.js
db.js contains:

async function initializeDatabase() {
// ...
}
We want to use that function in index.js.

The process

1. Export the function from the file where it was created
   In db.js:

export { initializeDatabase };
This can be at the bottom, but it doesn't have to be.

For example, this is also valid:

export async function initializeDatabase() {
// ...
}
Here we're exporting the function at the same time we declare it.

So these are two valid approaches:

Option A — Export at the bottom
async function initializeDatabase() {
// ...
}

export { initializeDatabase };
Option B — Export when declaring the function
export async function initializeDatabase() {
// ...
}
For our project, we're currently using Option A.

So:

❌ It is not always at the bottom.

The important thing is that the function is exported from the module.

2. Import it into the file where you want to use it
   In index.js:

import { initializeDatabase } from "./db.js";
This means:

"From the db.js module, bring me the thing called initializeDatabase."

The { } are important here because we're importing a named export.

So:

db.js
│
│ export { initializeDatabase }
│
▼
🌍 Exported function
│
│
▼
index.js
│
│ import { initializeDatabase } from "./db.js"
│
▼
Now index.js can access the function 3. Call the function
Importing a function does not automatically execute it.

This:

import { initializeDatabase } from "./db.js";
means:

"Make this function available to me."

It does not mean:

"Run this function."

To run it:

initializeDatabase();
So yes, your third step is correct:

Call the imported function when you need it.

I would use the word call rather than initialize, because initializeDatabase() is the function's name. In this particular case, the function itself initializes the database.

Your understanding, refined
You said:

create import{name of the function/ maybe file?} and is it always at the bottom of the file?

Then import it in the file where it should be used

Initialize imported function

I'd change it to:

Step 1 — Export
In the module where the function is defined:

export { initializeDatabase };
Step 2 — Import
In the module where you want to use it:

import { initializeDatabase } from "./db.js";
Step 3 — Call
Actually execute the function:

initializeDatabase();
So:

DEFINE
│
▼
EXPORT
│
▼
IMPORT
│
▼
CALL
What about importing a file?
This is an important distinction.

You don't normally say:

"Import a file and then use its functions."

Instead, you import things that the file exports.

For example, if db.js exports two functions:

export {
initializeDatabase,
getAlbums
};
Then index.js can import both:

import {
initializeDatabase,
getAlbums
} from "./db.js";
Then use them:

initializeDatabase();

const albums = await getAlbums();
So the relationship is:

                 db.js
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼

initializeDatabase() getAlbums()
│ │
│ export │ export
└──────────┬──────────┘
│
▼
index.js
│
┌─────┴─────┐
▼ ▼
initializeDatabase()
getAlbums()
There is one more concept: default exports
You'll also eventually see:

export default something;
Then you import it differently:

import something from "./file.js";
Notice there are no curly braces.

For now, I recommend sticking with named exports, because they make it very clear what you're importing:

export { initializeDatabase };

import { initializeDatabase } from "./db.js";
That's a good pattern for our project.

🧠 One final clarification
You asked:

"is it always at the bottom of the file?"

No. Imports are normally placed at the top of the file:

import express from "express";
import { initializeDatabase } from "./db.js";
Exports can be at the bottom:

export { initializeDatabase };
or directly on the declaration:

export async function initializeDatabase() {
// ...
}
So our current project follows:

db.js

1. Imports at top
   ↓
2. Define functions
   ↓
3. Export functions at bottom

index.js

1. Imports at top
   ↓
2. Define constants/functions
   ↓
3. Call imported functions when needed
   ↓
4. Start Express server
   And that's exactly the pattern we're using now.

One small correction to our current code: I want to revisit the order of initializeDatabase() and app.listen() next, because we want to make sure the database is ready before the server starts accepting requests. That's an important backend design detail, and it fits perfectly with what you're learning about async/await.

do i understand it correctly anything in curly braces means import that particular function?

Yes — in this specific syntax, that's correct. 👍

When you see:

import { initializeDatabase } from "./db.js";
the curly braces mean:

"Import the specifically named named export called initializeDatabase from db.js."

If the file exports several things:

export {
initializeDatabase,
getAlbums,
deleteAlbum
};
you can choose which ones to import:

import { getAlbums } from "./db.js";
or several:

import { initializeDatabase, getAlbums } from "./db.js";
Compare this:
Named import — curly braces:

import { initializeDatabase } from "./db.js";
➡️ Import the specific exported thing named initializeDatabase.

Default import — no curly braces:

import something from "./db.js";
➡️ Import the module's default export.

So your current mental model can be:

import { something } from "./file.js";
↑
└── "Give me the specifically named export called something"
One important detail: curly braces don't always mean "function." They mean you're importing a specifically named export, which could be a function, variable, constant, class, object, etc.

For example:

export const PORT = 3000;
Then:

import { PORT } from "./config.js";
So the best rule is:

Curly braces in an import statement mean you're importing one or more named exports.

For our project:

import { initializeDatabase } from "./db.js";
means exactly:

"From db.js, give me the named export initializeDatabase."

and if there are no curly braces, like import expres from "expres" it means we importin all available exports from express framework? and can it be done with other files too?

You're very close! There is one important distinction.

When you write:

import express from "express";
the lack of curly braces does not mean "import everything."

It means:

Import the module's default export and give it the local name express.

The express package provides a default export, which is the main Express function you use to create your application.

That's why this works:

import express from "express";

const app = express();
Compare the two types
Named export/import
db.js:

export { initializeDatabase };
index.js:

import { initializeDatabase } from "./db.js";
The curly braces mean:

"Give me the specific named export called initializeDatabase."

Default export/import
db.js:

export default initializeDatabase;
index.js:

import initializeDatabase from "./db.js";
No curly braces because you're importing the default export.

You can even give a default import a different local name:

import myDatabaseFunction from "./db.js";
The exported function is still the same; you've just called it myDatabaseFunction inside this file.

Can you do this with your own files?
Absolutely! This is a very common pattern.

For example:

server/
├── index.js
└── db.js
db.js:

function initializeDatabase() {
console.log("Database initialized");
}

export default initializeDatabase;
index.js:

import initializeDatabase from "./db.js";

initializeDatabase();
So you can use default exports with your own modules just like packages.

The simplest mental model
Think of it like this:

NAMED EXPORT
────────────────────────────
export { initializeDatabase };

import { initializeDatabase } from "./db.js";
↑
exact exported name

DEFAULT EXPORT
────────────────────────────
export default initializeDatabase;

import initializeDatabase from "./db.js";
↑
name you choose locally
And this is the key correction to your question:

import express from "express";
does not mean:

"Import everything from Express."

It means:

"Import the default export from the Express package and call it express in my file."

If you wanted to import multiple named exports, you'd use curly braces:

import { something, anotherThing } from "some-package";
One small note: JavaScript also has a syntax for importing everything as a namespace object:

import \* as expressStuff from "some-package";
That's different from:

import express from "express";
We don't need that for our project right now, but you'll probably encounter it later.

So for our current project, I'd remember:

{ name } → specific named export
name → default export

- as name → all exports grouped into one object
  That's the three main patterns you'll encounter.

i see, i think it is a little different in java

Yes, you're right. 😊 Java's import system is different from JavaScript's. Your Java experience can actually make this a little confusing at first because the word import is used in both languages, but it does different things.

In Java
Suppose you have:

import java.util.ArrayList;
You're basically saying:

"I want to use the ArrayList class from the java.util package."

You can then do:

ArrayList<String> names = new ArrayList<>();
Java doesn't have JavaScript's concept of default exports vs. named exports.

In JavaScript
You have an explicit relationship between exporting and importing.

For example:

// db.js

export { initializeDatabase };
Then:

// index.js

import { initializeDatabase } from "./db.js";
The {} tells JavaScript:

"Find the named export with exactly this name."

JavaScript also allows:

export default initializeDatabase;
and then:

import initializeDatabase from "./db.js";
This default export/import concept doesn't work the same way in Java.

Another difference
In Java, you often import a class:

import java.util.ArrayList;
Then you create an object:

ArrayList<String> names = new ArrayList<>();
In JavaScript, you might import a function:

import express from "express";
Then call it:

const app = express();
Or import a function you wrote yourself:

import { initializeDatabase } from "./db.js";

initializeDatabase();
So, roughly:

JAVA
import
↓
Class / Interface / Enum
↓
Use it

JAVASCRIPT
export
↓
Function / Variable / Class / Object / etc.
↓
import
↓
Use it
That's why, as you're moving from Java to JavaScript, I think it's useful to think of JavaScript modules as having two explicit steps:

"What does this file make available?" → export

"What do I want to bring into this file?" → import

And then:

"What do I actually want to execute?" → call the function.

For your photo gallery, we're now using this pattern:

db.js
│
├── defines initializeDatabase()
│
└── exports initializeDatabase
│
▼
index.js
│
├── imports initializeDatabase
│
└── calls initializeDatabase()
You're making a good connection between Java and JavaScript here. The concepts are related, but the module systems and syntax are different.

understand, a llittle confusing, but understandable

Exactly. 😊 And honestly, that's enough for now. You don't need to memorize all the variations immediately.

For our project, just keep this simple picture in mind:

db.js
│
│ export
▼
"Here are the things other files are allowed to use."
│
▼
index.js
│
│ import
▼
"I want to use this thing."
│
▼
call/use it
For now, the three patterns worth recognizing are:

// Named export
export { initializeDatabase };

// Named import
import { initializeDatabase } from "./db.js";
// Default export
export default initializeDatabase;

// Default import
import initializeDatabase from "./db.js";
And later:

// Import all exports as one object
import \* as db from "./db.js";
But we don't need the third one for our project right now.

💡 My recommendation
Don't worry about memorizing the syntax. As we build the Photo Gallery, you'll use import and `export repeatedly, and it will become natural.

For now, just remember:

export = make something available outside this file.
import = bring something from another file into this file.

That's all you need to continue. 👍

Now we can go back to our database setup and finish connecting db.js to index.js. Our next step is to make sure the database finishes initializing before Express starts accepting requests. That's where your async/await knowledge comes back into play.

image(8).png
i ran index.js db was created, all went smooth. let me attach screenshots

Excellent! 🎉 That means our database initialization is working.

From your screenshot, I can see that:

Your Express server is running at localhost:3000

The browser is successfully receiving your HTML

The frontend JavaScript is running

The albums request is being made

Your database initialization completed successfully

The albums table was created in db.sqlite

So we now have this part working:

Browser
│
│ GET /
▼
Express
│
▼
client/index.html
│
▼
main.js
And separately:

Node starts
│
▼
index.js
│
│ initializeDatabase()
▼
db.js
│
▼
db.sqlite
│
▼
CREATE TABLE albums
🎯 Our next step
Now we need to prove that the table actually exists and contains data.

At the moment, the table is empty, so your frontend will still get:

[]
The next step is to add one test album directly through our database code.

We'll learn how to:

Open the database.

Insert one album.

Get the generated id.

Query the album back from SQLite.

Eventually connect this to GET /albums.

That will take us from:

Database exists
↓
Table exists
↓
Table contains real data
↓
Express retrieves real data
↓
Browser receives real JSON
This is an important milestone because we'll finally complete the full chain we've been discussing:

Browser → Express → Database → Express → Browser

You're doing great. 👍 The foundation is working exactly as we want.

image(9).png

Ah, I see your screenshot. 👍 The database initialization is working, but there's one small issue in your logging:

Album table is created in undefined
This comes from:

console.log(`Album table is created in ${db.filename}`);
The db object returned by the sqlite package doesn't have a filename property available there, so JavaScript evaluates:

db.filename
as:

undefined
This doesn't mean your database failed. Your database was successfully created, and the table was successfully created.

Your terminal confirms:

Album table is ready
So we're good. ✅

I suggest removing that second log for now
You can keep:

console.log("Album table is ready");
and remove:

console.log(`Album table is created in ${db.filename}`);
Or, if you want to confirm the database path, we can log the path ourselves later.

One other thing I noticed
Your terminal shows:

BE Server is started and listening on port 3000
Album table is ready
The order is interesting.

We currently have something like:

initializeDatabase();

app.listen(PORT, serverStarted);
But because initializeDatabase() is asynchronous and we're not awaiting it, Node starts Express immediately.

So currently, the actual flow could be:

initializeDatabase()
│
│ starts async operation
▼
app.listen()
│
▼
BE Server is started
│
│
▼
Database finishes
│
▼
Album table is ready
That's why the server message appears before the database message.

Ideally, we want:

initializeDatabase()
│
▼
Album table is ready
│
▼
app.listen()
│
▼
BE Server is started
This is the next thing I want us to fix before adding album data.

We'll make the startup process asynchronous so Express only starts listening after the database is ready.

The good news is that you've now reached a really important point in the project: your db.js is successfully creating the database table, and your /albums route is successfully being requested by the browser.

Next we'll connect those two pieces:

GET /albums
│
▼
handleAlbumsRequest()
│
▼
db.js → get albums from SQLite
│
▼
response.json(albums)
│
▼
main.js → console.log(albums)
Then we'll insert our first real album and see it travel through the entire application. 🚀

i think it because where i put it in the code:

//Express framework for web server
import express from "express";
import { initializeDatabase } from "./db.js";

//Create an object for web server appllication
const app = express();
const PORT = 3000;

//Telling expres to use the static files from the client folder
app.use(express.static("../client"));

//routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

function serverStarted() {
console.log("BE Server is started and listening on port " + PORT);
}

//register the route on the server
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);

//initialize the database
initializeDatabase();

//Start the server and listen on the port
app.listen(PORT, serverStarted);

//functions for the routes in the server
function handleHomePageRequest(request, response) {
console.log("Browser requested Home Page on port " + PORT);
response.send(
"Welcome to Moonlight Dance Studio Photo Gallery Back End Server",
);
}

function handleAlbumsRequest(request, response) {
console.log("Browser requested Albums on port " + PORT);
response.json([]);
}

//Creating the table for database
/_
id
title
cover_image
event_date
created_at
_/

Yes! 👍 You're thinking in the right direction, but there are two separate issues here, and it's important to distinguish them.

1. Where you placed initializeDatabase()
   You currently have:

//initialize the database
initializeDatabase();

//Start the server and listen on the port
app.listen(PORT, serverStarted);
So logically, you are saying:

"Start initializing the database, then start the server."

That looks correct, but because initializeDatabase() is asynchronous, JavaScript doesn't necessarily wait for it to finish.

Your function is:

async function initializeDatabase() {
const db = await openDatabase();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS albums (
            ...
        )
    `);

    console.log("Album table is ready");

}
When you do:

initializeDatabase();
JavaScript starts the function, reaches:

await openDatabase();
and says:

"This operation isn't finished yet. I'll continue with other work."

So JavaScript then moves on to:

app.listen(PORT, serverStarted);
That's why you can see:

BE Server is started and listening on port 3000
Album table is ready
even though initializeDatabase() appears first in your code.

2. What we actually want
   We want:

Start application
│
▼
Initialize database
│
▼
Wait until database is ready
│
▼
Start Express server
│
▼
Accept browser requests
This means we need to await the database initialization.

But there's a problem:

You cannot simply write:

await initializeDatabase();
at the top level of your file in every Node.js setup. Instead, we'll create an asynchronous startup function.

For example:

async function startServer() {
await initializeDatabase();

app.listen(PORT, serverStarted);
}

startServer();
Now the flow becomes:

startServer()
│
▼
await initializeDatabase()
│
├── Open database
│
├── Create albums table
│
└── Finish
│
▼
app.listen()
│
▼
Server starts
So your bottom part would become:

async function startServer() {
await initializeDatabase();

app.listen(PORT, serverStarted);
}

startServer();
And you would remove this:

initializeDatabase();

app.listen(PORT, serverStarted);
Why is this important?
Imagine your database takes 2 seconds to initialize.

Without await:

0 seconds → Database initialization starts
0 seconds → Express starts
0.5 sec → Browser requests /albums
1 sec → Database is still initializing
2 sec → Database is ready
Potentially, the browser could request albums before the database is ready.

With await:

0 seconds → Database initialization starts
2 seconds → Database is ready
2 seconds → Express starts
2 seconds → Browser can request /albums
That's much safer.

One more important thing
Your current terminal showed:

BE Server is started and listening on port 3000
Album table is ready
So your observation was correct: the position in the source code isn't enough when dealing with asynchronous functions.

The key concept is:

Calling an async function starts it, but it doesn't automatically make the rest of your code wait for it.

That's why we use:

await initializeDatabase();
inside an async startup function.

This is actually a great example of why we spent time learning Promise and await earlier. You're now seeing the concept in a real application.

where should that function go? before or after server started function?

I would put startServer() after your serverStarted() function.

Your structure would look like this:

//Express framework for web server
import express from "express";
import { initializeDatabase } from "./db.js";

//Create an object for web server application
const app = express();
const PORT = 3000;

//Telling Express to use the static files from the client folder
app.use(express.static("../client"));

//Routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

function serverStarted() {
console.log("BE Server is started and listening on port " + PORT);
}

//Start the application
async function startServer() {
await initializeDatabase();

app.listen(PORT, serverStarted);
}

startServer();

//Register the routes on the server
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);

//Functions for the routes in the server
function handleHomePageRequest(request, response) {
console.log("Browser requested Home Page on port " + PORT);
response.send(
"Welcome to Moonlight Dance Studio Photo Gallery Back End Server",
);
}

function handleAlbumsRequest(request, response) {
console.log("Browser requested Albums on port " + PORT);
response.json([]);
}
However, I would actually make one small structural adjustment: put the route registrations before startServer() too.

So the logical organization becomes:

1. Imports
2. Create Express app
3. Constants
4. Middleware
5. Route registration
6. Route handler functions
7. Server startup function
8. Call startServer()
   The important part is that startServer() is called last:

async function startServer() {
await initializeDatabase();

app.listen(PORT, serverStarted);
}

startServer();
That gives us a nice mental model:

First define everything the server needs to know. Then start the server.

One subtle point: JavaScript function declarations like function handleHomePageRequest() are available even if they appear later in the file, so your routes can technically be registered before those functions are written. But for learning and readability, I recommend organizing the file in the order above.

So yes: put startServer() near the bottom, after serverStarted() and after your route handlers, then call startServer() as the last line.

//Express framework for web server
import express from "express";
import { initializeDatabase } from "./db.js";

//Create an object for web server appllication
const app = express();
const PORT = 3000;

//Telling expres to use the static files from the client folder
app.use(express.static("../client"));

//routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

//register the route on the server
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);

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

function handleAlbumsRequest(request, response) {
console.log("Browser requested Albums on port " + PORT);
response.json([]);
}

//function to wait for server and db starting
async function startServer() {
await initializeDatabase();
app.listen(PORT, serverStarted);
}

//function to start the server
startServer();

Yes! 👍 This is now structured correctly, and I like the way you've organized it.

Your startup flow is now:

Node starts index.js
│
▼
Import Express + database function
│
▼
Create Express application
│
▼
Register middleware
│
▼
Register routes
│
▼
Define functions
│
▼
startServer()
│
▼
await initializeDatabase()
│
▼
Database is ready
│
▼
app.listen()
│
▼
Express server starts accepting requests
The important change is here:

async function startServer() {
await initializeDatabase();
app.listen(PORT, serverStarted);
}
Because of await, Express will wait for:

initializeDatabase()
to finish before executing:

app.listen(PORT, serverStarted);
So your terminal should now show:

Album table is ready
BE Server is started and listening on port 3000
instead of:

BE Server is started and listening on port 3000
Album table is ready
One tiny wording change
Your comment:

//function to wait for server and db starting
is slightly misleading because startServer() doesn't wait for the server to start. It waits for the database initialization to finish, and then starts the server.

I'd change it to:

//Initialize the database before starting the server
async function startServer() {
await initializeDatabase();
app.listen(PORT, serverStarted);
}
Then:

//Start the application
startServer();
That's clearer.

⭐ One thing I want you to notice
You now have a very nice separation:

index.js
│
├── Express setup
├── Routes
├── Route handlers
└── Server startup
│
└── calls initializeDatabase()
│
▼
db.js
│
└── SQLite database
This is a good foundation for the next step.

I would say your database initialization part of Sprint 2 is complete. 🎉

Next, we'll make db.js responsible for getting albums from the database, and then change:

function handleAlbumsRequest(request, response) {
console.log("Browser requested Albums on port " + PORT);
response.json([]);
}
so that instead of returning a hard-coded empty array, it actually asks SQLite:

"Give me all albums."

That will be our first real Database → Backend → Frontend connection.

is this the middleware: //routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

No — those are not middleware. They are route constants.

You have:

// Routes in the BE server
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";
These are simply variables that store the URL paths your server will use.

Then you use them here:

app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);
So this:

app.get(HOME_ROUTE, handleHomePageRequest);
is effectively the same as:

app.get("/", handleHomePageRequest);
And:

app.get(ALBUM_ROUTE, handleAlbumsRequest);
is the same as:

app.get("/albums", handleAlbumsRequest);
Your middleware is this:
app.use(express.static("../client"));
This tells Express:

"Use the ../client folder to serve static files requested by the browser."

For example:

Browser requests:
GET /index.html
│
▼
express.static("../client")
│
▼
Finds ../client/index.html
│
▼
Sends index.html to browser
Your middleware is registered with:

app.use(...)
Your routes are registered with:

app.get(...)
A simple way to remember:

app.use() → middleware
app.get() → GET route
app.post() → POST route
app.put() → PUT route
app.delete() → DELETE route
So your current code has:

// Middleware
app.use(express.static("../client"));

// Route constants
const HOME_ROUTE = "/";
const ALBUM_ROUTE = "/albums";

// Routes
app.get(HOME_ROUTE, handleHomePageRequest);
app.get(ALBUM_ROUTE, handleAlbumsRequest);
You're asking exactly the right question here because middleware and routes are related but have different responsibilities. In our project, express.static() is middleware that helps serve the frontend, while / and /albums are routes that tell Express how to respond to specific requests.
