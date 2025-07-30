# SkillStack

After setting up all the files open the backend folder in Visual Studio Code and run the below commands
1) python -m venv venv
2) venv\Scripts\activate (for windows), source venv/bin/activate(for macOS)
3) pip install flask flask_sqlalchemy flask_cors
4) python app.py

The back-end should run in localhost 5000 after starting the database.

After setting up the frontend execute the below commands 
1) npm install
2) npm start

The front-end should run in localhost 3000 after executing the react app.

Note:

After executing all these commands, a database file named skill.db will be created inside an instance folder (located within the backend directory). Before each execution, it is recommended to delete the existing skill.db file and the instance folder to avoid potential errors. Otherwise, you might encounter an error stating "skills can't be added."

This error typically does not occur if the existing database is retained, but there's a chance it may still appear or continue using the old database. Since I have encountered this error multiple times, I strongly recommend deleting the old database after stopping the application and before restarting it.
