"""Summary"""
BASEURL = 'https://www.rescuetime.com/anapi/data?'
def query_string(api_key, start_date, end_date):
    """return query string

    Arguments:
        api_key {string} -- api key
        start_date {string} -- yyyy-mm-dd format
        end_date {string} -- yyyy-mm-dd format

    Returns:
        string -- query string
    """

    query = {
        "key": api_key,
        "operation": "select",
        "version": "0",
        "perspective": "interval",
        "resolution_time": "minute",
        "restrict_begin": start_date,
        "restrict_end": end_date,
        "format": "json"
    }

    query_params = []
    for key in query:
        query_params.append(key + '=' + str(query[key]))

    query_string = '&'.join(query_params)
    return BASEURL + query_string
