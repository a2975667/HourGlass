# Backend Documentation

## Run server
after establishing virtual environment
```
>_ (.venv) cd backend
>_ (.venv) pip install -r requirements.txt
>_ (.venv) export FLASK_APP=app.py
>_ (.venv) flask run
```

Note: ask someone for api key or generate one

## Usage
### [GET] /api
Dummy index to test api
```Json
{"message": "API request successful."}
```

### [GET] /api/raw-data
Returns the raw-data from rescure time api by providing key, start data and end date.

```Usage
headers: 
    - api-key: [api-key]
params: 
    - start_date: yyyy-mm-dd
    - end_date: yyyy-mm-dd
Example: localhost:5000/data?start_date=2018-10-30&end_date=2018-10-30
```
```Json
{
    "notes": "data is an array of arrays (rows), column names for rows in row_headers",
    "row_headers": [
        "Date",
        "Time Spent (seconds)",
        "Number of People",
        "Activity",
        "Category",
        "Productivity"
    ],
    "rows": [
        [
            "2018-10-30T00:00:00",
            129,
            1,
            "facebook.com",
            "General Social Networking",
            -2
        ],
        [
            "2018-10-30T00:15:00",
            5,
            1,
            "facebook.com",
            "General Social Networking",
            -2
        ],...
```


### [GET] /api/data
Returns filtered data from backend server by providing key, start data and end date.

```Usage
headers: 
    - api-key: [api-key]
params: 
    - start_date: yyyy-mm-dd
    - end_date: yyyy-mm-dd
```

```Json
{
    "accounts.google.com": [
        [   "2018-10-30T17:50:00",
            13,
            "General Communication & Scheduling"],
        [   "2018-10-31T12:45:00",
            15,
            "General Communication & Scheduling"],
        [   "2018-10-31T16:45:00",
            8,
            "General Communication & Scheduling"], ... 
    "ai.googleblog.com": [
        [   "2018-11-01T14:25:00",
            231,
            "Uncategorized"],
        [   "2018-11-01T14:30:00",
            70,
            "Uncategorized"]],
    "airtable.com": [
        [   "2018-10-30T23:00:00",
            10,
            "Project Management"],
        [   "2018-10-31T11:05:00",
            155,
            "Project Management"],
        [   "2018-10-31T11:10:00",
            125,
            "Project Management"],...
    ], ... }
```

### [GET] /api/rank-distract
Returns top n distracted sites within given time frame

```Usage
headers: 
    - api-key: [api-key]
params: 
    - start_date: yyyy-mm-dd
    - end_date: yyyy-mm-dd
    - n: [int]
```

```Json
[
    {
        "category": "Search",
        "name": "google.com",
        "time": [
            [
                "2018-11-05T01:25:00",
                13,
                "Search"
            ],
            [
                "2018-11-05T02:00:00",
                18,
                "Search"
            ],
            [
                "2018-11-05T02:05:00",
                30,
                "Search"
            ],
            ...],
        "times": 32
    },
    {
        "category": "General Social Networking",
        "name": "facebook.com",
        "time": [...],
        "times": 19
    },
    {
        "category": "Video",
        "name": "youtube.com",
        "time": [...],
        "times": 8
    },...}
```

### [GET] /api/rank-aggregate
Returns top n most visited sites by aggregate time (seconds) within given time frame

```Usage
headers: 
    - api-key: [api-key]
params: 
    - start_date: yyyy-mm-dd
    - end_date: yyyy-mm-dd
    - n: [int]
```

```Json
[
    [
        3706,
        "youtube.com"
    ],
    [
        2615,
        "facebook.com"
    ],
    ...
]
```
