# Final Markdown
## Team Members and Contributions 
- Giovanni Aguirre
  - Designed game 
  	- store and present lyrics line by line
  	- check user input and give hints
  	- formatted input and output text
  	- designed score system
  - Basic Html
  	- started html layout for main features
  - Fixed some bugs
  	- filtered diacritics
  	- fixed bugs related to hint function
- Irene Garcia
  - Created most markdowns and demo video
  - Worked with design and styling
  	- navbar
  	- logo
  	- color
    - images
  	- css/styling
- William Zhu
  - Implemented user/account features
  - Stored scores in database and implemented data visualization
  - Fixed bugs and improved features related to user and score database
  - Worked with design and styling
    - reordering pages
    - organizing page content
    - css/styling
  - Code integrity and app testing
- Yue Wu
  - Found and implemented APIs such as google translate
  - Improved and fixed bugs for the database
  - Worked with input formatting such as case insensitivity
  - Worked with showing top songs
  - Worked with database searching
  - Worked with form validation and input sanitization
  - Code integrity and app testing
    - converting vanilla JS to ES6 standards



## Files Written by Us

- JS
  - server
  	- links with database being able to get and post information to and from the database
  	
  - create_db
  	- creates a database with variables of song, artist, user info, scores, language

  - add
  	- collects user info for song entry including lyrics, title, artist, and language

  - changePage
  	- changes page of the website called by the navbar

  - game
  	- gets song user asks for, starts game by displaying song lyric line by line as it gets user input and checks if it is correct. Also gives hints to the user.

  - list
  	- used for the top songs on the game page and records each time a song is played.

  - login
  	- works with user login and puts info into database

  - scores
  	- gets scores from database and graphs them.

  - validate
  	- validates user input on the add page ensuring all fields are filled

- HTML
  - LyricApp
  	- Adds scripts, ids, and basic styling to entire app, contains the navbar
  - add
  	- page where user adds song info such as lyrics, language, and artist
  - find
  	- page where user can either select one of the most popular songs or enter a song thats in the database
  - game
  	- page where the main game is played as it displays the song lyrics to be translated, is where the user inputs the original lyrics and is able to see hints for the next lyric
  - login
  	- page where user inputs there login info
  - scores
  	- page where scores are displayed

- CSS
  - style
    - has most of the styling for the app such as placement, color, and text style



# Demo Video

https://drive.google.com/file/d/1DfA5aJy2cMfMqaA2e3GtK7Fy7ia1coZP/view?usp=sharing