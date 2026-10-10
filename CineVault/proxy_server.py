from flask import Flask, jsonify, request
import requests, os

app = Flask(__name__)
TMDB_KEY = os.environ.get('TMDB_KEY', '8265bd1679663a7ea12ac168da84d2e8')
BASE = 'https://api.themoviedb.org/3'

@app.route('/tmdb/<path:path>')
def proxy(path):
    url = f"{BASE}/{path}"
    params = dict(request.args)
    params['api_key'] = TMDB_KEY
    r = requests.get(url, params=params, timeout=10)
    return (r.content, r.status_code, {'Content-Type': 'application/json'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
