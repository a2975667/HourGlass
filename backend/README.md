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
### [GET] /
Dummy index to test api

### [GET] /raw-data
Returns the raw-data from rescure time api by providing key, start data and end date.

```Usage
headers: 
    - api-key: [api-key]
params: 
    - start_date: yyyy-mm-dd
    - end_date: yyyy-mm-dd
```

### [GET] /data
Returns filtered data from backend server by providing key, start data and end date.

```Usage
headers: 
    - api-key: [api-key]
params: 
    - start_date: yyyy-mm-dd
    - end_date: yyyy-mm-dd
```