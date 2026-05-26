
from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.')

@app.route('/')
def home():
    # Serve your static HTML file
    return send_from_directory('.', 'index.html')

@app.route('/api/health')
def health():
    return {"status": "healthy", "message": "Backend is running!"}

# Add more API endpoints as needed
@app.route('/api/data')
def get_data():
    return {"data": "Your dynamic data here"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)