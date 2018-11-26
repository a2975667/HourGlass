from flask import Flask, jsonify, request, send_from_directory, redirect
from munch import Munch

from lib.engine import *
from lib.handleError import InvalidUsage

app = Flask(__name__, static_folder='frontend')


def data_request_safe_check(request):
    api_key = request.headers.get('Key')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if api_key == None:
        raise InvalidUsage('API key not provided', status_code=410)
    elif start_date == None or end_date == None:
        raise InvalidUsage('time not provided', status_code=411)

    payload = {'api_key': api_key,
               'start_date': start_date, 'end_date': end_date}
    return payload

@app.route('/')
def index():
    return redirect("/index.html", code=302)

@app.route('/barchart')
def barchart():
    return redirect("/barchart.html", code=302)

@app.route('/<path:filename>')  
def send_file(filename):  
    return send_from_directory(app.static_folder, filename)

@app.route('/api/')
def api():
    return jsonify({"message":"API request successful."})

@app.route('/api/raw-data')
def get_raw_by_id():
    payload = Munch(data_request_safe_check(request))
    response = raw_query(payload.api_key, payload.start_date, payload.end_date)
    return jsonify(response)
    
@app.route('/api/data')
def get_data_by_id():
    payload = Munch(data_request_safe_check(request))
    response = query(payload.api_key, payload.start_date, payload.end_date)
    return jsonify(response)

@app.route('/api/rank-distract')
def get_rank_distract_data():
    payload = Munch(data_request_safe_check(request))
    response = sort_by_time(payload.api_key, payload.start_date, payload.end_date)
    return jsonify(response)

@app.route('/api/summary/rank-distract')
def get_summary_rank_distract_data():
    payload = Munch(data_request_safe_check(request))
    response = sort_by_time(payload.api_key, payload.start_date, payload.end_date, summary=True)
    return jsonify(response)

@app.route('/api/rank-aggregate')
def get_rank_aggregate_data():
    payload = Munch(data_request_safe_check(request))
    response = aggregate(payload.api_key, payload.start_date, payload.end_date)
    return jsonify(response)

@app.errorhandler(InvalidUsage)
def handle_nokey_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
