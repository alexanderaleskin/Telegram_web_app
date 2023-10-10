from urllib import parse
import json


def get_telegram_data(request):
    telegram_data = parse.parse_qs(parse.unquote(request.headers['Telegraminitdata']))
    return {key: values[0] for key, values in telegram_data.items()}


def get_telegram_user(request):
    telegram_params = get_telegram_data(request)
    return json.loads(telegram_params['user'])


