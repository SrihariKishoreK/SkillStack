from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skills.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------------------------
# Define the Skill model
# -------------------------
class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    skill = db.Column(db.String(100), nullable=False)
    resource = db.Column(db.String(50))
    platform = db.Column(db.String(50))
    progress = db.Column(db.String(50))
    hours = db.Column(db.Float)
    notes = db.Column(db.Text)
    difficulty = db.Column(db.Integer)

# -------------------------
# Create DB at app startup
# -------------------------
with app.app_context():
    db.create_all()
    print("✅ Database initialized")

# -------------------------
# Delete Skill by ID Route
# -------------------------
@app.route('/api/skills/<int:id>', methods=['DELETE'])
def delete_skill(id):
    try:
        skill = Skill.query.get(id)
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404

        db.session.delete(skill)
        db.session.commit()
        return jsonify({'message': 'Skill deleted successfully'}), 200

    except Exception as e:
        print("Error deleting skill:", e)
        return jsonify({'error': 'Error deleting skill'}), 500

# -------------------------
# Add Skill Route
# -------------------------
@app.route('/api/skills', methods=['POST'])
def add_skill():
    try:
        data = request.get_json()
        print("🔍 Received data from frontend:", data)

        new_skill = Skill(
            skill=data['skill'],
            resource=data['resource'],
            platform=data['platform'],
            progress=data['progress'],
            hours=data['hours'],
            notes=data['notes'],
            difficulty=data['difficulty']
        )
        db.session.add(new_skill)
        db.session.commit()
        return jsonify({"message": "Skill added successfully"}), 201

    except Exception as e:
        print("❌ Error adding skill:", e)
        return jsonify({"error": "Error adding skill"}), 500

# -------------------------
# Get All Skills Route
# -------------------------
@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    result = [{
        "id": s.id,
        "skill": s.skill,
        "resource": s.resource,
        "platform": s.platform,
        "progress": s.progress,
        "hours": s.hours,
        "notes": s.notes,
        "difficulty": s.difficulty
    } for s in skills]
    return jsonify(result)

# -------------------------
# Run App
# -------------------------
if __name__ == '__main__':
    app.run(debug=True)
