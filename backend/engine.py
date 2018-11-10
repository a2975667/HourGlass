from .template import query_string
from requests import get
import json
from collections import defaultdict
from pprint import pprint

def _filter_data(data):
    clean_data = defaultdict(lambda: [])
    for d in data['rows']:
        if '.' not in d[3]:
            continue
        if 'uwp' in d[3]:
            continue
        clean_data[d[3]].append([d[0],d[1],d[4]])
        
    return clean_data

def raw_query(api_key, start_date, end_date):
    response = get(query_string(api_key, start_date, end_date))
    return json.loads(response.text)

def query(api_key, start_date, end_date):
    data = raw_query(api_key, start_date, end_date)
    data = _filter_data(data)
    return dict(data)
    