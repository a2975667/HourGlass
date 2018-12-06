from .template import query_string
from requests import get
import json
from collections import defaultdict
from pprint import pprint

from datetime import datetime, timedelta
from dateutil import parser

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
    
def sort_by_time(api_key, start_date, end_date, n=10, summary=False):
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
            print((event[0], event[1], event[3]))
            distractions[event[2]].append((event[0], event[1], event[3]))

    intermediate = sorted([(len(distractions[x]), x) for x in distractions], reverse=True)[:n]
    if summary:
        results = [{'name': x[1], 'count':x[0], 'category':distractions[x[1]][2][2]} for x in intermediate]
    else:
        results = [{'name': x[1], 'time':distractions[x[1]], 'times':x[0], 'category':distractions[x[1]][2][2]} for x in intermediate]

    #print (results)
    return results

def sort_by_time_for_d3(api_key, start_date, end_date, n):
    n = int(n)
    data = raw_query(api_key, start_date, end_date)
    good_result, bad_result = get_working_hours(data['rows'], [], [])
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
            info = (event[2], event[0], (parser.parse(event[0]) + timedelta(0,event[1])).isoformat(), event[3])
            distractions[event[2]].append(info)
    intermediate = sorted([(len(distractions[x]), x) for x in distractions], reverse=True)[:n]
    results = [] # + good_result + bad_result
    for site in intermediate:
        meta = [{'category': list(x)[3],'name': list(x)[0], 'from': list(x)[1], 'to': list(x)[2]} for x in distractions[site[1]]]
        results += meta
    return results

def get_productive_unproductive_time(api_key, start_date, end_date):
    data = raw_query(api_key, start_date, end_date)
    good_result, bad_result = get_working_hours(data['rows'], [], [])
    results = good_result + bad_result
    return results

def get_working_hours(raw_data, good, bad):
    good = []
    bad = ['Instant Message', 
    'General Entertainment',
    'General News & Opinion',
    'Video',
    'Music',
    'Games',
    'Comedy',
    'Photos',
    'Sports',
    'Society',
    'General',
    'Regional',
    'Business',
    'Electronics',
    'International',
    'Entertainment',
    'General Shopping',
    'Travel & Outdoors',
    'Clothes & Personal',
    'Science & Technology']

    good_timesheet = defaultdict(lambda: [])
    bad_timesheet = defaultdict(lambda: [])
    for data in raw_data:
        # exceptions
        if data[3] in ['system idle process']:
            continue
        if data[4] in bad:
            bad_timesheet[data[0]].append(data)
        else:
            good_timesheet[data[0]].append(data)
    
    bad_result = restructure_timesheet(bad_timesheet, 'unproductive')
    good_result = restructure_timesheet(good_timesheet, 'productive')
    return good_result, bad_result

def restructure_timesheet(timesheet, name):
    return_list = []
    for key in timesheet:
        start_time = key
        end_time = sum([event[1] for event in timesheet[key]])
        end_time = (parser.parse(start_time) + timedelta(0,end_time)).isoformat()
        site_name = ', '.join([event[3] for event in timesheet[key]])
        dictionary = {
            'category': '',
            "from":start_time,
            "to":end_time,
            'name': name,
            "info":site_name
        }
        return_list.append(dictionary)
    return return_list

def aggregate(api_key, start_date, end_date, n=10):
    data = query(api_key, start_date, end_date)
    result = []
    for site in data:
        total_time = 0
        time = [d[1] for d in data[site]]
        result.append( (sum(time), site))
    result = sorted(result, reverse=True)[:n]
    return result

def get_cal(api_key, calendar, start_date, end_date):
    delta_day = parser.parse(end_date) - parser.parse(start_date)
    if delta_day > timedelta(days=5):
        return {'message':'exceed query limit, please set date range less than 5 days'}
    string = 'https://www.googleapis.com/calendar/v3/calendars/'+ calendar\
    + '/events?key=' + api_key + '&timeMin=' + start_date + 'T00:00:00Z&timeMax=' + end_date + 'T00:00:00Z'

    response = get(string).json()

    result = []
    for item in response['items']:
        try:
            if 'dateTime' in item['start']:
                event = {
                    "name" : "Work Hour",
                    'status': 'busy',
                    'start_time': item['start']['dateTime'],
                    'end_time': item['end']['dateTime']
                }
                result.append(event)
        except:
            result = {'message': 'error in get_cal(), contact admin'}

    list_of_unavaliable_time = sorted([(event['start_time'], event['end_time']) for event in result])

    list_of_unavaliable_time = [time for time in merge(list_of_unavaliable_time)]
    
    start = parser.parse(list_of_unavaliable_time[0][0]).replace(hour=0,minute=0).isoformat()
    end = parser.parse(list_of_unavaliable_time[-1][1]).replace(hour=23,minute=59).isoformat()

    list_of_unavaliable_time = [(start,start)] + list_of_unavaliable_time + [(end,end)]
    avaliable_time = []

    for index in range(len(list_of_unavaliable_time)-1):
        start, end = list_of_unavaliable_time[index][1], list_of_unavaliable_time[index+1][0]
        event = {
            "name" : "Non-Work Hour",
            'status': 'free',
            'start_time': start,
            'end_time': end
        }
        avaliable_time.append(event)

    result += avaliable_time

    return result

def merge(times):
    saved = list(times[0])
    for st, en in sorted([sorted(t) for t in times]):
        if st <= saved[1]:
            saved[1] = max(saved[1], en)
        else:
            yield tuple(saved)
            saved[0] = st
            saved[1] = en
    yield tuple(saved)