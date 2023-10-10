from telegram.ext import (
    ApplicationBuilder,
)
from telegram import Bot, Update
import os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bot_conf.settings')
django.setup()

from telegram_django_bot.tg_dj_bot import TG_DJ_Bot
from bot_conf.settings import TELEGRAM_TOKEN, TELEGRAM_LOG, DEBUG
import logging

from bot_interface.routing import add_handlers


# class TG_BOT(Bot):
#     def _post(self, endpoint, data=None, *args, **kwargs):
#         print(endpoint, data)
#         return super()._post(endpoint, data, *args, **kwargs)



def main():
    if not DEBUG:
        logging.basicConfig(
            filename=TELEGRAM_LOG,
            filemode='a',
            format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
            datefmt='%Y.%m.%d %H:%M:%S',
            level=logging.INFO
        )

    bot = Bot(TELEGRAM_TOKEN)
    application = ApplicationBuilder().bot(bot).build()


    # application.add_handler(CommandHandler("start", start))

    # updater = Updater(bot=TG_BOT(TELEGRAM_TOKEN), workers=8)
    add_handlers(application)

    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()

