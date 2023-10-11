import sys
from functools import wraps

import telegram
from django.contrib.auth import get_user_model

from base.models import MESSAGE_FORMAT


def get_file_data(update: telegram.Update) -> dict:
    message = update.message

    file_data = {}

    if message:
        caption = True

        if message.photo:
            file_data = {
                'message_format': MESSAGE_FORMAT.PHOTO,
                'media_id': message.photo[-1]['file_id'],
            }
        elif message.audio:
            file_data = {
                'message_format': MESSAGE_FORMAT.AUDIO,
                'media_id': message.audio['file_id'],
                'name': message.audio['file_name'],
            }
        elif message.document:
            file_data = {
                'message_format': MESSAGE_FORMAT.DOCUMENT,
                'media_id': message.document['file_id'],
                'name': message.document['file_name'],
            }
        elif message.sticker:
            file_data = {
                'message_format': MESSAGE_FORMAT.STICKER,
                'media_id': message.sticker['file_id'],
            }
        elif message.video:
            file_data = {
                'message_format': MESSAGE_FORMAT.VIDEO,
                'media_id': message.video['file_id'],
                'name': message.video['file_name'],
            }
        elif message.animation:
            file_data = {
                'message_format': MESSAGE_FORMAT.GIF,
                'media_id': message.animation['file_id'],
            }
        elif message.voice:
            file_data = {
                'message_format': MESSAGE_FORMAT.VOICE,
                'media_id': message.voice['file_id'],
            }
        elif message.video_note:
            file_data = {
                'message_format': MESSAGE_FORMAT.VIDEO_NOTE,
                'media_id': message.video_note['file_id'],
            }
        elif message.media_group_id:
            raise NotImplementedError('')

        elif message.location:
            file_data = {
                'message_format': MESSAGE_FORMAT.LOCATION,
                'media_id': message.location['file_id'],
            }
        else:
            caption = False
            value = '-'
            file_data = {
                'message_format': MESSAGE_FORMAT.TEXT,
                'media_id': '-',
                'text': message.text,
            }

        if caption:
            file_data['text'] = message.caption

        file_data['user_id'] = message.from_user.id

    if message and message.text:
        file_data['text'] = message.text

    return file_data


def send_file(bot: telegram.Bot, file, chat_id):

    file_format = file.message_format

    if file_format == MESSAGE_FORMAT.TEXT:
        telegram_func = bot.send_message(chat_id, file.text)
    else:
        args = [chat_id, file.media_id]
        kwargs = {}
        if file.text:
            kwargs['caption'] = file.text

        if file_format == MESSAGE_FORMAT.PHOTO:
            telegram_func = bot.send_photo(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.AUDIO:
            telegram_func = bot.send_audio(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.VIDEO:
            telegram_func = bot.send_video(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.DOCUMENT:
            telegram_func = bot.send_document(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.GIF:
            telegram_func = bot.send_animation(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.VIDEO_NOTE:
            telegram_func = bot.send_video_note(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.VOICE:
            telegram_func = bot.send_voice(*args, **kwargs)
        elif file_format == MESSAGE_FORMAT.STICKER:
            telegram_func = bot.send_sticker(*args, **kwargs)
        else:
            raise NotImplementedError()

    return telegram_func








ERROR_MESSAGE = ('Oops! It seems that an error has occurred, please write to support (contact in bio)!')


def handler_decor(log_type='F', update_user_info=True):
    """

    :param log_type: 'F' -- функция, 'C' -- callback or command, 'U' -- user-status, 'N' -- NO LOG
    :param update_user_info: update user info if it has been changed
    :return:
    """

    def decor(func):
        @wraps(func)
        async def wrapper(update, CallbackContext):
            def check_first_income():
                if update and update.message and update.message.text:
                    query_words = update.message.text.split()
                    # if len(query_words) > 1 and query_words[0] == '/start':
                    #     telelink, _ = TeleDeepLink.objects.get_or_create(link=query_words[1])
                    #     telelink.users.add(user)

            bot = CallbackContext.bot

            user_details = update.effective_user

            if user_details is None:
                raise ValueError(
                    f'handler_decor is made for communication with user, current update has not any user: {update}'
                )

            User = get_user_model()

            user_adding_info = {
                'username': '{}'.format(user_details.id),
                'telegram_language_code': user_details.language_code or 'en',

                'telegram_username': user_details.username[:64] if user_details.username else '',
                'first_name': user_details.first_name[:30] if user_details.first_name else '',
                'last_name': user_details.last_name[:60] if user_details.last_name else '',
            }

            user, created = await User.objects.aget_or_create(
                id=user_details.id,
                defaults=user_adding_info
            )

            if created:
                # add_log_action(user.id, 'ACTION_CREATED')
                check_first_income()
            elif update_user_info:
                # check if telegram_username or first_name or last_name changed:
                fields_changed = False
                for key in ['telegram_username', 'first_name', 'last_name']:
                    if getattr(user, key) != user_adding_info[key]:
                        setattr(user, key, user_adding_info[key])
                        fields_changed = True

                if fields_changed:
                    user.save()

            if not user.is_active:
                check_first_income()
                user.is_active = True
                await user.asave()

            # if settings.USE_I18N:
            #     translation.activate(user.language_code)

            raise_error = None
            try:
                res = await func(bot, update, user)
            except telegram.error.BadRequest as error:
                if 'Message is not modified:' in error.message:
                    res = None
                else:
                    res = await bot.send_message(user.id, str(ERROR_MESSAGE))  # should be bot.send_format_message
                    tb = sys.exc_info()[2]
                    raise_error = error.with_traceback(tb)
            except Exception as error:

                res = await bot.send_message(user.id, str(ERROR_MESSAGE))  # should be bot.send_format_message
                tb = sys.exc_info()[2]
                raise_error = error.with_traceback(tb)

            # log actions

            if log_type != 'N':
                if log_type == 'C':
                    if update.callback_query:
                        log_value = update.callback_query.data
                    else:
                        log_value = update.message.text
                elif log_type == 'U':
                    log_value = user.current_utrl
                # elif log_type == 'F':
                else:
                    log_value = func.__name__

            #     add_log_action(user.id, log_value[:32])
            #
            # if ActionLog.objects.filter(user=user, type='ACTION_ACTIVE_TODAY', dttm__date=timezone.now().date()).count() == 0:
            #     add_log_action(user.id, 'ACTION_ACTIVE_TODAY')

            if raise_error:
                raise raise_error

            return res
        return wrapper
    return decor

