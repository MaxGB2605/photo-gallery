                 Browser
                    |
                    |
              Frontend
          HTML/CSS/JavaScript
                    |
                    |
                API Calls
                    |
                    |
              Node + Express
                    |
                    |
                SQLite DB


-----------------------------------------

                USER
                  │
                  ▼
        Clicks "Albums"
                  │
                  ▼
             Browser
                  │
      Runs JavaScript
                  │
                  ▼
             Frontend
"I need album information"
                  │
          GET /api/albums
                  │
                  ▼
             Backend
"Only visible albums.
 Sort newest first."
                  │
                  ▼
             Database
"Here are the rows."
                  │
                  ▼
             Backend
"Convert rows to JSON."
                  │
                  ▼
             Frontend
"Create album cards."
                  │
                  ▼
             Browser
Displays beautiful gallery

-----------------------------------------

          User
            │
            ▼
    "Holiday Party"
            │
            ▼
      Frontend
            │
 knows title = Holiday Party
 knows id = 2
            │
            ▼
Backend Request

GET /albums/2
            │
            ▼
Database

SELECT * FROM albums
WHERE id = 2

-----------------------------------------