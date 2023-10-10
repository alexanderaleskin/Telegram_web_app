import json
from telegram import Bot, InlineQueryResult

from base.models import FileItem
from .utils import get_telegram_data
from django.conf import settings


def send(request):
    telegram_data = get_telegram_data(request)
    telegram_user = json.loads(telegram_data['user'])



    file = FileItem.objects.get(
        user_id=telegram_user['id'],
        id=request.POST,
        type=FileItem.TYPE_FILE,
    )

    bot = Bot(settings.TELEGRAM_TOKEN)

    bot.answerWebAppQuery(
        web_app_query_id=telegram_data['query_id'],
        result=InlineQueryResult()
    )

    """
    await telegramBot.api.raw.answerWebAppQuery({
        web_app_query_id: requestData.sessionData.queryId,
        result: InlineQueryResultBuilder.article(
          requestData.sessionData.queryId, // 'unused-field',
          'unused-field',
        ).text("Swap started...")
      })
    """