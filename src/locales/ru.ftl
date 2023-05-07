bot-initial = Ожидаю текстовое или голосовое сообщение...

bot-about = Построен на { $model } архитектуре
    https://github.com/mikita-kandratsyeu/telegram-bot

bot-description = Я - ChatGPT, интеллектуальный бот, способный отвечать на различные запросы пользователей, включая голосовой ввод. Я создан на основе архитектуры { $model } и обладаю обширными знаниями в различных областях, таких как наука, техника, искусство, спорт, здоровье, бизнес и многое другое. Я могу отвечать на вопросы пользователей, помогать решать проблемы, а также вести непринужденную беседу на любые темы. Мой интерфейс позволяет вводить как текст, так и голос, что делает общение со мной еще более удобным и доступным для пользователей

error-common = Что-то пошло не так. Попробуйте еще раз!
error-auth = У вашей учетной записи ({ $username }) нет разрешения на использование этого бота. Пожалуйста, свяжитесь с администратором
error-session-reading = Ошибка чтения сообщений из сессии для { $key }:{ $targetUsername }
error-auth-admin =  У вашей учетной записи ({ $username }) нет разрешения на использование Админ-панели. Пожалуйста, свяжитесь с администратором

admin-initial =  Добро пожаловать, { $firstName }, в Админ-панель для { $botName }!
admin-go-back = ⬅️ Вернуться назад
admin-cancel = Отменить
admin-go-to-main = Перейти в Админ-панель
admin-sessions = Сессии
admin-get-session = Получить сессию
admin-delete-session = Удалить сессию
admin-delete-session-not-found = Сессия для { $username } не была найдена
admin-delete-session-successful = Сессия для { $username } была удалена
admin-users = Пользователи
admin-get-all-users = Получить всех пользователей
admin-get-all-users-role = Роль -
admin-get-all-users-active = Пользователь заблокирован? -
admin-add-user = Добавить пользователя
admin-add-user-successful = Пользователь { $username } был добавлен
admin-add-user-exist = Пользователь { $username } был уже добавлен
admin-block-unblock-user = Заблокировать/Разблокировать пользователя
admin-block-block-user-successful = Пользователь { $username } был заблокирован
admin-block-unblock-user-successful = Пользователь { $username } был разблокирован
admin-enter-username = Выберите пользователя
admin-enter-user = Введите пользовтеля в следующем формате: { $inputFormat }