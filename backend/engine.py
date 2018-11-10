from .template import query_string
from requests import get
import json

API_KEY = "B63mVDYNd_2h9n4dbHjgrjMyNBCjVdZUOH5luFCE"

def raw_query(api_key, start_date, end_date):
    response = get(query_string(api_key, '2018-11-01', '2018-11-01'))
    print(response.text)
    return json.loads(response.text)

def query(api_key, start_date, end_date):
    return 'hehe'

if __name__ == '__main__':
    q = query_string(api_key, '2018-11-01', '2018-11-01')
    print(BASEURL+q)
    