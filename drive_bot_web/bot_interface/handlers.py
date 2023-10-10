import copy
from uuid import uuid4

from django.conf import settings
from telegram_django_bot.tg_dj_bot import TG_DJ_Bot


from telegram import Update, WebAppInfo
from .utils import get_file_data, handler_decor, send_file


from base.models import MountInstance, ShareLink, User, FileItem


from telegram import (
    # TelegramObject,
    Bot,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    KeyboardButton,
    ReplyKeyboardMarkup,
)

from asgiref.sync import sync_to_async



@handler_decor()
async def start(bot: TG_DJ_Bot, update: Update, user: User):
    text = update.message.text

    if text == '/start':
        self_root_folder = await sync_to_async(FileItem.objects.filter(
            user_id=user.pk,
            parent_id__isnull=True,
        ).first)()

        buttons = [
            [InlineKeyboardButton(
                text='Open storage',
                web_app=WebAppInfo(url=f'{settings.FRONTEND_URL}/{self_root_folder.id}/')
            )]
        ]

        mess = (
            "Hi! This bot stores files and important notes in a usable format. You can group files in folders "
            "for easy access 🙋 \n"
            "\n"
            "Just send file or note to me and I will save it"
        )
        return await bot.send_message(
            chat_id=user.id,
            text=mess,
            reply_markup=InlineKeyboardMarkup(buttons)
        )
    else:
        # it is deeplink
        file_id = text[len('/start '):]

        file = await FileItem.objects.aget(
            user_id=user.id,
            id=file_id,
            type=FileItem.TYPE_FILE,
        )

        return await send_file(bot, file, user.id)



@handler_decor()
async def create_file_from_message(bot: TG_DJ_Bot, update: Update, user: User):
    root_folder = await FileItem.objects.aget(
        user_id=user.id,
        parent__isnull=True
    )

    file_data = get_file_data(update)

    file_data.update({
        'parent_id': root_folder.pk,
        'type': FileItem.TYPE_FILE,
    })

    # file_item = await sync_to_async(FileItem.objects.create)(file_data)
    file_item = await FileItem.objects.acreate(**file_data)

    buttons = [
        [InlineKeyboardButton(
            'look file in store',
            web_app=WebAppInfo(f'{settings.FRONTEND_URL}/{file_item.id}/')
        )]
    ]

    return await bot.send_message(
        chat_id=user.id,
        text="file saved",
        reply_markup=InlineKeyboardMarkup(buttons)
    )

