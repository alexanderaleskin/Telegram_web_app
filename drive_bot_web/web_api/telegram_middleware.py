from django.conf import settings
from django.http import JsonResponse
from urllib import parse
import hashlib
import hmac
from .utils import get_telegram_data


class TelegramMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

        self.bot_token = settings.TELEGRAM_TOKEN


    def __call__(self, request):
        is_valid = False
        telegram_params = get_telegram_data(request)
        telegram_hash = telegram_params.pop('hash')

        if telegram_hash:
            telegram_keys = list(telegram_params.keys())
            telegram_keys.sort()

            telegram_check_row = "\n".join([
                f'{key}={telegram_params[key]}' for key in telegram_keys
            ])
            secret_key = hmac.new("WebAppData".encode(), self.bot_token.encode(), hashlib.sha256)
            result_hash = hmac.new(secret_key.digest(), telegram_check_row.encode(), hashlib.sha256).hexdigest()
            if result_hash == telegram_hash:
                is_valid = True



        if not is_valid:
            return JsonResponse({'error': 'unvalid hash'}, status=400)

        response = self.get_response(request)



        return response