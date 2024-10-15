from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import requests
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///birthdays.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
IMAGE_UPLOADS = "static/uploads"
app.config['IMAGE_UPLOADS'] = IMAGE_UPLOADS

db = SQLAlchemy(app)

class Birthday(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    date = db.Column(db.Date, nullable=False)
    arc = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

with app.app_context():
    db.create_all()

class BirthdayResource(Resource):
    def get(self):
        birthdays = Birthday.query.all()
        response = [
            {
                "id": b.id,
                "name": b.name,
                "date": b.date.strftime('%Y-%m-%d'),
                "arc": b.arc,
                "description": b.description,
                "image_url": b.image_url
            }
            for b in birthdays
        ]
        return response, 200

    def post(self):
        data = request.get_json()
        try:
            date_obj = datetime.strptime(data['date'], '%Y-%m-%d')

            image_url = data.get('image_url', None)
            if image_url:
                # Create uploads folder if it doesn't exist
                if not os.path.exists(app.config['IMAGE_UPLOADS']):
                    os.makedirs(app.config['IMAGE_UPLOADS'])

                # Download the image and save it locally
                response = requests.get(image_url)
                image_filename = secure_filename(image_url.split("/")[-1])  # Get the image file name
                image_path = os.path.join(app.config['IMAGE_UPLOADS'], image_filename)

                with open(image_path, 'wb') as f:
                    f.write(response.content)
            else:
                image_path = None

            new_birthday = Birthday(
                name=data['name'],
                date=date_obj,
                arc=data['arc'],
                description=data['description'],
                image_url=image_path
            )
            db.session.add(new_birthday)
            db.session.commit()
            return {"message": "Birthday added successfully"}, 201
        except Exception as e:
            return {"message": str(e)}, 400
    
    def delete(self, birthday_id):
        birthday = Birthday.query.get(birthday_id)
        if birthday:
            db.session.delete(birthday)
            db.session.commit()
            return {"message": "Birthday deleted successfully"}, 200
        return {"message": "Birthday not found"}, 404


api.add_resource(BirthdayResource, '/api/birthdays', '/api/birthdays/<int:birthday_id>', endpoint='birthday')

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/static/uploads/<path:filename>')
def send_uploaded_file(filename):
    return send_from_directory(app.config['IMAGE_UPLOADS'], filename)
