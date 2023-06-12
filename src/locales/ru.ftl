# Commands
command-profile = Профиль
command-admin = Админ-панель
command-moderator = Модератор-панель
command-image = Сгенерировать картинку через DALL·E 2
command-clear = Очистить текущую сессию
command-description = Описание
command-about = О боте

# Errors messages
error-message-common = Что-то пошло не так. Попробуйте еще раз!
error-message-common-try-again = Попробовать еще раз
error-message-auth = У вашей учетной записи ({ $username }) нет разрешения на использование этого бота. Пожалуйста, свяжитесь с администратором.
error-message-auth-empty = У вашей учетной записи нет разрешения на использование этого бота. Пожалуйста, свяжитесь с администратором.
error-message-auth-admin = У вашей учетной записи ({ $username }) нет разрешения на использование Админ-панели. Пожалуйста, свяжитесь с администратором.
error-message-auth-moderator = У вашей учетной записи ({ $username }) нет разрешения на использование Модератор-панели. Пожалуйста, свяжитесь с администратором.

# Common buttons
common-button-go-to-chat = Перейти в чат
common-button-go-back = ⬅️ Вернуться назад
common-button-cancel = Отменить
common-button-share = Поделиться

# Start
start-message = Ожидаю текстовое или голосовое сообщение...

# Description
description-message = Привет 👋🏻, Я { $botName }, интеллектуальный бот, способный отвечать на различные запросы пользователей, включая голосовой ввод. Я создан на архитектуре { $model } и обладаю обширными знаниями в различных областях, таких как наука, технологии, искусство, спорт, здоровье, бизнес и многое другое. Я могу отвечать на вопросы пользователей, помогать решать проблемы, а также вести непринужденную беседу на любые темы. Мой интерфейс позволяет вводить как текст, так и голос.

# About
about-message-release = Релиз: { $release }

# Admin panel
admin-panel-title = Админ-панель для { $botName }.

# Admin menu buttons
admin-menu-button-sessions = Сессии
admin-menu-button-conversations = Беседы
admin-menu-button-users = Пользователи
admin-menu-button-images = Изображения
admin-menu-button-loggers = Логи
admin-menu-button-csv-reader = CSV Считыватель
admin-menu-button-go-to-menu = Перейти в Админ-панель

# Moderator panel
moderator-panel-title = Модератор-панель для { $botName }.

# Moderator menu buttons
moderator-menu-button-sessions = Сессии
moderator-menu-button-users = Пользователи
moderator-menu-button-csv-reader = CSV Считыватель
moderator-menu-button-go-to-menu = Перейти в Модератор-панель

# Sessions menu buttons
sessions-menu-button-get = Получить сессию
sessions-menu-button-delete = Удалить сессию

# Session menu messages
sessions-menu-message-delete-success = Сессия для { $username } была удалена.

# Conversations menu buttons
conversations-menu-button-get = Получить беседу
conversations-menu-button-delete = Удалить беседу

# Conversations menu messages
conversations-menu-delete-success = Беседа для { $username } была удалена.

# User images menu
user-images-menu-button-get = Получить изображения
user-images-menu-button-get-archive = Получить архив изображений (на это потребуется время)
user-images-menu-button-get-csv = Получить CSV файл

# Users menu buttons
users-menu-button-get-all = Получить всех пользователей
users-menu-button-add = Добавить пользователя
users-menu-button-add-multiple = Добавить нескольких пользователей
users-menu-button-change-role = Изменить роль
users-menu-button-change-limits = Изменить GPT лимиты
users-menu-button-block-unblock = Заблокировать/Разблокировать
users-menu-button-delete = Удалить пользователя

# Users menu messages
users-menu-message-add-success = Пользователь { $username } был добавлен.
users-menu-message-incorrect = Введено неверное имя пользователя. Попробуйте еще раз!
users-menu-message-exist = Пользователь { $username } был уже добавлен.
users-menu-message-block-success = Пользователь { $username } был заблокирован
users-menu-message-unblock-success = Пользователь { $username } был разблокирован
users-menu-message-delete-success = Пользователь { $username } был удален.
users-menu-message-change-role-success = Пользователю { $username } была предоставлена новая роль - { $role }.
users-menu-message-enter = Введите пользовтеля в следующем формате: { $inputFormat }.
users-menu-message-enter-csv = Загрузите файл CSV со следующими столбцами: { $csvFormat }.
users-menu-message-incorrect-csv = Расширение файла не соответствует CSV. Попробуйте еще раз!
users-menu-message-multiple-add-success = Пользователи [ { $users } ] были успешно добавлены.
users-menu-message-multiple-add-error = Пользователи уже были добавлены. Попробуйте еще раз!
users-menu-message-new-gpt-limits-success =  Пользователю { $username } был предоставлен новый GPT лимит - { $package }.

# User roles
user-role-super-admin = Супер Админ
user-role-admin = Админ
user-role-moderator = Модератор
user-role-user = Пользователь

# User statuses
user-status-blocked = Заблокирован
user-status-available = Доступен

# User GPT limits packages
user-gpt-limit-base = Базовый
user-gpt-limit-premium = Премиум
user-gpt-limit-vip = VIP
user-gpt-limit-super_vip = Супер VIP

# Info messages
info-message-moderator-panel-for-super-admin = Примечание: Пожалуйста, перейдите в Админ-панель.
info-message-node-cache = Примечание: Установлено кэширование данных - { $cache } минут.
info-message-clear-current-session = Текущая сессия для { $username } была очищена.
info-message-reach-gpt-tokens-limit = Вы использовали все доступные GPT токены. Пожалуйста, повторите попытку после { $date } { $utc }.
info-message-reach-gpt-images-limit = Вы использовали все доступные GPT изображения. Пожалуйста, повторите попытку после { $date } { $utc }.

# Profile
profile-user-initial-message = Привет 👋🏻, { $firstName } { $lastName }!
profile-user-role = Ваша роль: { $role }
profile-user-gpt-package = GPT лимит: { $package }
profile-user-available-messages-amount = Доступное количество GPT токенов: { $amount }
profile-user-available-images-amount = Доступное количество GPT картинок: { $amount }
profile-user-date-register = Дата регистрации: { $date } { $utc }

# Image generator
image-generator-enter-request = Введите запрос в следующем формате: { $gptImageQuery }.
image-generator-incorrect-image-number = Введено неверное количество картинок. Попробуйте еще раз!
