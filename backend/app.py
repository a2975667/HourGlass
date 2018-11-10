from flask import Flask, jsonify, request

from .engine import *
from .handleError import InvalidUsage

app = Flask(__name__)

@app.route('/')
def index():
    return {"message":"API request successful."}

@app.route('/raw-data/<string:start_date>/<string:end_date>')
def get_raw_by_id(start_date, end_date):
    api_key = request.headers.get('Key')
    if api_key:
        response = raw_query(api_key, start_date, end_date)
        return jsonify(response)
    else:
        raise InvalidUsage('API key not provided', status_code=410)

@app.route('/data')
def get_data_by_id():
    api_key = request.headers.get('Key')
    if api_key:
        response = query(api_key, start_date, end_date)
        return jsonify(response)
    else:
        raise InvalidUsage('API key not provided', status_code=410)

@app.errorhandler(InvalidUsage)
def handle_nokey_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response