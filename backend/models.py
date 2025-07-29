from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(50), nullable=False)
    platform = db.Column(db.String(100), nullable=False)
    progress = db.Column(db.String(50), nullable=False)
    hours_spent = db.Column(db.Float, default=0.0)
    notes = db.Column(db.Text, default="")
    difficulty = db.Column(db.Integer, default=1)