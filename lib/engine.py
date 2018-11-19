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
    
def sort_by_time(api_key, start_date, end_date, n=10):
    data = raw_query(api_key, start_date, end_date)
    time_dict = defaultdict(lambda: {})
    for d in data['rows']:
        if '.' not in d[3]:
            continue
        if 'uwp' in d[3]:
            continue
        if d[4] in time_dict[d[0]]:
            time_dict[d[0]][d[4]].append([d[0],d[1],d[3],d[4]])
        else:
            time_dict[d[0]][d[4]] = [[d[0],d[1],d[3],d[4]]]
    times = [x for x in time_dict if len(time_dict[x]) > 1]

    distractions = defaultdict(lambda: [])
    lst = []
    for time in times:
        for key in time_dict[time]:
            event = time_dict[time][key][0]
            lst += [event]
            distractions[event[2]].append((event[0], event[1], event[3]))

    intermediate = sorted([(len(distractions[x]), x) for x in distractions], reverse=True)[:n]
    results = [{'name': x[1], 'time':distractions[x[1]], 'times':x[0], 'category':distractions[x[1]][2][2]} for x in intermediate]

    return results

def aggregate(api_key, start_date, end_date, n=10):
    data = query(api_key, start_date, end_date)
    result = []
    for site in data:
        total_time = 0
        time = [d[1] for d in data[site]]
        result.append( (sum(time), site))
    result = sorted(result, reverse=True)[:n]
    return result
