from telegram.ext import (
    filters,
    MessageHandler,
    CommandHandler,
    Application,
)

from .handlers import start, create_file_from_message

# from asgiref.sync import sync_to_async

def add_handlers(updater: Application):
    updater.add_handler(CommandHandler('start', start))
    updater.add_handler(MessageHandler(filters.ALL, create_file_from_message))