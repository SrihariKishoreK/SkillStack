from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

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

    def to_dict(self):
        return {
            "id": self.id,
            "skill": self.skill,
            "resource": self.resource,
            "platform": self.platform,
            "progress": self.progress,
            "hours": self.hours,
            "notes": self.notes,
            "difficulty": self.difficulty
        }

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

#-------------------------------------
# Recommend learning resource Route
#-------------------------------------
@app.route('/api/recommend', methods=['GET'])
def recommend_resource():
    try:
        latest_skill = Skill.query.order_by(Skill.id.desc()).first()

        if not latest_skill:
            return jsonify({"recommendations": ["No skills added yet. Start learning something new!"]})

        skill_name = latest_skill.skill.lower()

        # Find resources used for this specific skill
        matching_skills = Skill.query.filter(Skill.skill.ilike(skill_name)).all()

        if not matching_skills:
            return jsonify({"recommendations": ["No similar skills found to generate suggestions."]})

        resource_count = {}
        for s in matching_skills:
            resource = s.resource.lower()
            resource_count[resource] = resource_count.get(resource, 0) + 1

        # Sort by most frequent resource used
        best_resource = max(resource_count.items(), key=lambda x: x[1])[0]
        message = f"Try using '{best_resource.title()}' for learning '{skill_name.title()}'!"

        return jsonify({"recommendations": [message]})

    except Exception as e:
        print("Recommendation error:", e)
        return jsonify({"recommendations": ["No suggestions available"]}), 500

#--------------------------
# Skill Mastery Prediction
#--------------------------
@app.route('/api/predict', methods=['POST'])
def predict_mastery_date():
    try:
        data = request.get_json()
        skill_name = data.get('skill')
        current_hours = data.get('hours', 0)
        daily_avg_hours = data.get('daily_hours', 1)

        hours_left = max(0, 20 - current_hours)
        days_needed = int(hours_left / daily_avg_hours) if daily_avg_hours > 0 else 999

        estimated_date = (datetime.now() + timedelta(days=days_needed)).strftime("%Y-%m-%d")

        return jsonify({
            "estimated_mastery_date": estimated_date
        })

    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

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
    return jsonify([skill.to_dict() for skill in skills])

# -------------------------
# Run App
# -------------------------
if __name__ == '__main__':
    app.run(debug=True)
