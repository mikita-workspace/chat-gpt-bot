# Commands
command-profile = Профіль
command-admin = Адмін-панэль
command-moderator = Мадэратар-панэль
command-image = Згенераваць карцінку праз DALL·E 2
command-clear = Ачысціць бягучую сесію
command-description = Апісанне
command-about = Аб боце

# Errors messages
error-message-common = Нешта пайшло не так. Паспрабуйце яшчэ раз!
error-message-common-try-again = Паспрабаваць яшчэ раз
error-message-auth = Ваш уліковы запіс ({ $username }) не мае дазволу на выкарыстанне гэтага бота. Калі ласка, звяжыцеся з адміністратарам.
error-message-auth-empty = Ваш уліковы запіс не мае дазволу на выкарыстанне гэтага бота. Калі ласка, звяжыцеся з адміністратарам.
error-message-auth-admin = Ваш уліковы запіс ({ $username }) не мае дазволу на выкарыстанне адмін-панэлі. Калі ласка, звяжыцеся з адміністратарам.
error-message-auth-moderator = У вашага ўліковага запісу ({ $username }) няма дазволу на выкарыстанне Мадэратар-панэлі. Калі ласка, звяжыцеся з адміністратарам.

# Common buttons
common-button-go-to-chat = Перайсці ў чат
common-button-go-back = Вернуться️ вярнуцца назад
common-button-cancel = Адмяніць
common-button-share = Падзяліцца

# Start
start-message = Чакаю тэкставае або галасавое паведамленне...

# Description
description-message = Прывітанне 👋🏻, Я { $botName }, разумны бот, здольны адказваць на розныя запыты карыстальнікаў, уключаючы галасавы ўвод. Я створаны на архітэктуры { $model } і валодаю шырокімі ведамі ў розных галінах, такіх як навука, тэхналогіі, мастацтва, спорт, здароўе, бізнес і многае іншае. Я магу адказваць на пытанні карыстальнікаў, дапамагаць вырашаць праблемы, а таксама весці нязмушаную гутарку на любыя тэмы. Мой інтэрфейс дазваляе ўводзіць як тэкст, так і голас.

# About
about-message-release = Рэліз: { $release }

# Admin panel
admin-panel-title = Адмін-панэль для { $botName }.

# Admin menu buttons
admin-menu-button-sessions = Сесіі
admin-menu-button-conversations = Гутаркі
admin-menu-button-users = Карыстальнікі
admin-menu-button-loggers = Логі
admin-menu-button-csv-reader = CSV Счытвальнік
admin-menu-button-go-to-menu = Перайсці ў адмін-панэль

# Moderator panel
moderator-panel-title = Мадэратар-панэль для { $botName }.

# Moderator menu buttons
moderator-menu-button-sessions = Сесіі
moderator-menu-button-users = Карыстальнікі
moderator-menu-button-csv-reader = CSV Счытвальнік
moderator-menu-button-go-to-menu = Перайсці ў Мадэратар-панэль

# Sessions menu buttons
sessions-menu-button-get = Атрымаць сесію
sessions-menu-button-delete = Выдаліць сесію

# Session menu messages
sessions-menu-message-delete-success = Сесія для { $username } была выдаленая.

# Conversations menu buttons
conversations-menu-button-get = Атрымаць гутарку
conversations-menu-button-delete = Выдаліць гутарку

# Conversations menu messages
conversations-menu-delete-success = Гутарка для { $username } была выдаленая.

# Users menu buttons
users-menu-button-get-all = Атрымаць усіх карыстальнікаў
users-menu-button-add = Дадаць карыстальніка
users-menu-button-add-multiple = Дадаць некалькіх карыстальнікаў
users-menu-button-change-role = Змяніць ролю
users-menu-button-change-limits = Змяніць GPT ліміты
users-menu-button-block-unblock = Заблакаваць / разблакаваць
users-menu-button-delete = Выдаліць карыстальніка

# Users menu messages
users-menu-message-add-success = Карыстальнік { $username } быў дададзены.
users-menu-message-incorrect = Уведзена няправільнае імя карыстальніка. Паспрабуйце яшчэ раз!
users-menu-message-exist = Карыстальнік { $username } быў ужо дададзены.
users-menu-message-block-success = Карыстальнік { $username } быў заблакаваны
users-menu-message-unblock-success = Карыстальнік { $username } быў разблакаваны
users-menu-message-delete-success = Карыстальнік { $username } быў выдалены.
users-menu-message-change-role-success = Карыстачу { $username } была прадастаўлена новая роля - { $role }.
users-menu-message-enter = Увядзіце пользовтеля ў наступным фармаце: { $inputFormat }.
users-menu-message-enter-csv = Загрузіце файл CSV з наступнымі слупкамі: { $csvFormat }.
users-menu-message-incorrect-csv = Пашырэнне файла не адпавядае CSV. Паспрабуйце яшчэ раз!
users-menu-message-multiple-add-success = Карыстальнікі [ { $users } ] былі паспяхова дададзеныя.
users-menu-message-multiple-add-error = Карыстальнікі ўжо былі дададзеныя. Паспрабуйце яшчэ раз!
users-menu-message-new-gpt-limits-success = Карыстачу { $username } быў прадастаўлены новы GPT ліміт - { $package }.

# User roles
user-role-super-admin = Супер Адмін
user-role-адмін = Адмін
user-role-moderator = Мадэратар
user-role-user = Карыстальнік

# User statuses
user-status-blocked = Заблякаваны
user-status-available = Даступны

# User GPT limits packages
user-gpt-limit-base = Базавы
user-gpt-limit-premium = Прэміум
user-gpt-limit-vip = VIP
user-GPT-limit-super_vip = Супер VIP

# Info messages
info-message-moderator-panel-for-super-admin = Заўвага: калі ласка, перайдзіце ў адмін-панэль.
info-message-node-cache = Заўвага: Устаноўлена кэшаванне дадзеных - { $cache } хвілін.
info-message-clear-current-session = Бягучая сесія для { $username } была ачышчана.
info-message-reach-gpt-tokens-limit = Вы выкарыстоўвалі ўсе даступныя GPT токены. Калі ласка, паспрабуйце яшчэ раз пасля { $date } { $utc }
info-message-reach-gpt-images-limit = Вы выкарыстоўвалі ўсе даступныя GPT малюнка. Калі ласка, паспрабуйце яшчэ раз пасля { $date } { $utc }.

# Profile
profile-user-initial-message = Прывітанне 👋🏻, { $firstName } { $lastName }!
profile-user-role = Ваша роля: { $role }
profile-user-gpt-package = GPT ліміт: { $package }
profile-user-available-messages-amount = Даступнае колькасць GPT токенаў: { $amount }
profile-user-available-images-amount = Даступнае колькасць GPT малюнкаў: { $amount }
profile-user-date-register = Дата рэгістрацыі: { $date } { $utc }

# Image generator
image-generator-enter-request = Увядзіце запыт у наступным фармаце: { $gptImageQuery }.
image-generator-incorrect-image-number = Уведзена няправільнае колькасць малюнкаў. Паспрабуйце яшчэ раз!
