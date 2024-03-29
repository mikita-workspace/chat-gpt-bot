# Commands
command-profile = Профиль
command-image = Сгенерировать изображение
command-restart = Новый диалог
command-about = Обо мне
command-change-model = Изменить GPT модель
command-support = Написать в поддержку

# Common buttons
common-button-go-to-chat = Перейти в чат

# Start
start-message = 💭 Ожидаю текстовое или голосовое сообщение...
start-description = 🙃 Давайте поболтаем! Что вы хотите спросить?

# Description
description-message-start = Привет 👋, это { $botName }!
description-message-body = Я интеллектуальный бот, способный отвечать на различные запросы пользователей, включая голосовой ввод. Я создан на различных GPT моделях и обладаю обширными знаниями в различных областях, таких как наука, технологии, искусство, спорт, здоровье, бизнес и многое другое. Я могу отвечать на вопросы пользователей, помогать решать проблемы, а также вести непринужденную беседу на любые темы. Мой интерфейс позволяет вводить как текст, так и голос.

# About
about-gpt-model = GPT модель:
about-speech-model = Speech модель:
about-image-model = Image модель:
about-vision-model = Vision модель:
about-releases = Релизы:

# Errors messages
error-message-common = 😔 Не удалось обработать ваш запрос. Попробуйте еще раз!
error-message-gpt = 😔 Ваше сообщение не удалось обработать. Попробуйте еще раз!
error-message-change-gpt-model = 😬 Упс! Похоже, вы хотите перейти в другой раздел. Нажмите { $command } еще раз!
error-message-common-try-again = Попробовать еще раз

# Auth
auth-authorization = Похоже, ваша учетная запись не авторизована. Пожалуйста, нажмите кнопку авторизации.
auth-success = Благодарим вас за авторизацию! После одобрения, { $botName } бот будет доступен для вас.
auth-button = Авторизация
auth-approval = Все еще работаем над настройкой бота для вас. Спасибо вам за ваше терпение!
auth-block = Ваша учетная запись была заблокирована.
auth-error = Доступ запрещен.

# Support
support-contact = Если у вас возникли какие-либо вопросы, нажмите /support.
support-select-topic = Выберите тему обращения.
support-enter-description = Опишите вашу проблему или идею.
support-success = 🤖 Ваше обращение { $csm } было принято. Мы постараемся оперативно решить ваш вопрос. Спасибо!
support-error = 😬 Упс! Похоже, вы хотите перейти в другой раздел. Нажмите { $command } еще раз!

# Feedback
feedback-like = 👍
feedback-dislike = 👎
feedback-zany = 🤪
feedback-smile = 🤩
feedback-neutral = 😑
feedback-cry = 😫
feedback-like-response-first = 🤗 Спасибо за ваш фидбек! Мне очень приятно.
feedback-like-response-second = 🙏 Спасибо за ваш фидбэк! Рад, что смог помочь.
feedback-like-response-dislike = Если вам не нравится мой ответ, дайте мне еще один шанс и нажмите /restart. Подумаю лучше 🤔
feedback-like-response-image-dislike = Если вам не понравился результат, дайте мне еще один шанс и нажмите /image. Сгенерирую лучше 🌉

# Loader
loader-message-start = Интересный запрос,
loader-message-end = 💬 Прочитал, думаю над ответом...
loader-message-image-end = 🏙️ Генерирую изображение...
loader-message-vision-end = 🕵️ Генерирую ответ на вашу картинку...

# Restart
restart-message = Начнем с чистого листа 😊

# Change GPT model
gpt-model-change-success = GPT модель была изменена.
gpt-model-change-title = Выберете доступную GPT модель.

# Profile
profile-client-initial-message = Привет 👋, { $firstName } { $lastName }!
profile-client-select-model = Выбраная GPT модель:
profile-client-available-messages = GPT токены:
profile-client-available-images = GPT изображения:
profile-client-date-expires = Доступные токены будут обновлены { $expiresIn }.
profile-client-promo-date-expires = Срок действия Promo аккаунта истекает { $expiresIn }.
profile-client-incognito = Инкогнито
profile-client-unavailable-info = 🤖 Ваши токены появятся здесь, когда вы напишете любое сообщение боту.

# Image
image-generate = 🖼️ Опишите, какую картинку вы хотели бы сгенерировать:
image-amount = 🤔 Укажите количество изображений, которые вы хотите получить (от 1 до { $max }):
image-empty-input = 😬 Упс! Похоже, вы хотите перейти в другой раздел. Нажмите { $command } еще раз!
image-feedback = Понравился ли вам результат?

# Usage
usage-token-limit = Вы израсходовали все токены. Повторите попытку { $expiresIn }.
usage-image-limit = Вы израсходовали все изображения. Повторите попытку { $expiresIn }.

# Unavailable section
unavailable-section = 👷 Этот раздел находится в стадии разработки.

# Vision
vision-incorrect-extension = 📂 Неверное расширение файла. Доступные расширения - { $extensions }.
vision-enter-query = 🤔 Введите ваш запрос для загруженной картинки.
vision-empty-query = 😬 Упс! Похоже, вы хотите перейти в другой раздел. Нажмите { $command } еще раз!
vision-denied = 🚫 Похоже, что эта функциональность вам недоступна.