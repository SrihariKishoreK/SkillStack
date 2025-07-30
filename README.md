# SkillStack

After setting up all the files open the backend folder in Visual Studio Code and run the below commands
1) python -m venv venv
2) venv\Scripts\activate (for windows), source venv/bin/activate(for macOS)
3) pip install flask flask_sqlalchemy flask_cors
4) python app.py

After executing all these commands there will be a database file created called "skill.db" inside a folder named instance. Then the database can be deleted that is the skill.db and the instance folder can be deleted for each and every execution of the database so that there will be no error else there might be an error face that "skills can't be added".

This error will not occur for sure if you keep the old database and again start the database it might show the error or it may continue with the old database. Since I have faced the error for several times, I strongly recommend to delete the old database after stopping it and restarting it again. 

The back-end should run in localhost 5000 after starting the database.

After setting up the frontend execute the below commands 
1) npm install
2) npm start

The front-end should run in localhost 3000 after executing the react app.
