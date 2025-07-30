from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure SQLite DB
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
# Create DB at startup
# -------------------------
with app.app_context():
    db.create_all()
    print("✅ Database initialized")

# -------------------------
# Get All Skills
# -------------------------
@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    return jsonify([skill.to_dict() for skill in skills])

# -------------------------
# Add Skill
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

        return jsonify(new_skill.to_dict()), 201  # ✅ Send full skill back

    except Exception as e:
        print("❌ Error adding skill:", e)
        return jsonify({"error": "Error adding skill"}), 500

# -------------------------
# Delete Skill
# -------------------------
@app.route('/api/skills/<int:skill_id>', methods=['DELETE'])  # ✅ Fixed type
def delete_skill(skill_id):
    try:
        skill = Skill.query.get(skill_id)
        if not skill:
            return jsonify({"error": "Skill not found"}), 404

        db.session.delete(skill)
        db.session.commit()
        return jsonify({"message": "✅ Skill deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# Recommend Resources
# -------------------------
@app.route('/recommendations', methods=['POST'])
def recommend_resources():
    try:
        data = request.get_json()
        skills = data.get('skills', [])

        recommendations_map = {
    "python": "✅ Try <a href='https://www.youtube.com/watch?v=rfscVS0vtbw' target='_blank'>Python for Beginners</a> by freeCodeCamp.",
    "java": "✅ Check out <a href='https://www.youtube.com/watch?v=grEKMHGYyns' target='_blank'>Java Full Course</a> by BroCode.",
    "c": "✅ Watch <a href='https://www.youtube.com/watch?v=irqbmMNs2Bo' target='_blank'>C Programming Tutorial</a> by freeCodeCamp.",
    "javascript": "✅ Try <a href='https://www.youtube.com/watch?v=PkZNo7MFNFg' target='_blank'>JavaScript Full Course</a> by freeCodeCamp.",
    "react": "✅ Explore <a href='https://www.youtube.com/watch?v=bMknfKXIFA8' target='_blank'>React Full Course</a> by freeCodeCamp.",
    "mongodb": "✅ Learn from <a href='https://www.youtube.com/watch?v=-56x56UppqQ' target='_blank'>MongoDB Tutorial</a> by freeCodeCamp.",
    "typescript": "✅ Take <a href='https://www.youtube.com/watch?v=30LWjhZzg50' target='_blank'>TypeScript Course</a> by Programming with Mosh.",
    "html": "✅ Try <a href='https://www.youtube.com/watch?v=pQN-pnXPaVg' target='_blank'>HTML Tutorial</a> by freeCodeCamp.",
    "css": "✅ Learn <a href='https://www.youtube.com/watch?v=OXGznpKZ_sA' target='_blank'>CSS Full Course</a> by freeCodeCamp.",
    "node": "✅ Master Node.js via <a href='https://www.youtube.com/watch?v=Oe421EPjeBE' target='_blank'>Node.js Full Course</a> by freeCodeCamp.",
    "express": "✅ Learn Express from <a href='https://www.youtube.com/watch?v=L72fhGm1tfE' target='_blank'>Express.js Crash Course</a> by Traversy Media."
}



        recommendations = []
        for entry in skills:
            skill_name = entry.get("skill", "").strip().lower()  # ✅ Normalize case
            if skill_name and skill_name in recommendations_map:
                recommendations.append(recommendations_map[skill_name])

        if not recommendations:
            recommendations.append("⚠️ No recommendations available.")

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        print("❌ Error generating recommendations:", e)
        return jsonify({"error": "Recommendation error"}), 500

# -------------------------
# Run Flask App
# -------------------------
if __name__ == '__main__':
    app.run(debug=True)
