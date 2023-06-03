# Initial messages
initial-message-start = Waiting for a text or voice message...
initial-message-about = Release: { $releaseVersion }
  https://github.com/mikita-kandratsyeu/telegram-bot
initial-message-description = Hi there 👋🏻, I'm { $botName }, an intelligent bot capable of responding to various user requests, including voice input. I'm built on the { $model } architecture and possess extensive knowledge in various areas such as science, technology, arts, sports, health, and more. I can answer users' questions, help solve problems, and also engage in casual conversation on any topic. My interface allows for both text and voice input.

# Commands
command-profile = Profile
command-admin = Admin-panel
command-moderator = Moderator-panel
command-image = Generate an image via DALL·E 2
command-clear = Clear current session
command-description = Description
command-about = About developer

# Errors messages
error-message-common = Something went wrong. Try again!
error-message-common-try-again = Try again
error-message-auth = Your account ({ $username }) does not have permission to use this bot. Please contact administrator.
error-message-auth-empty = Your account does not have permission to use this bot. Please contact administrator.
error-message-auth-admin = Your account ({ $username }) does not have permission to use Admin-panel. Please contact administrator.
error-message-auth-moderator = Your account ({ $username }) does not have permission to use Moderator-panel. Please contact administrator.

# Common buttons
common-button-go-to-chat = Go to chat
common-button-go-back = ⬅️ Go back
common-button-cancel = Cancel
common-button-share = Share

# Admin panel
admin-panel-title = Admin-panel of { $botName }.

# Admin menu buttons
admin-menu-button-sessions = Sessions
admin-menu-button-conversations = Conversations
admin-menu-button-users = Users
admin-menu-button-loggers = Logs
admin-menu-button-csv-reader = CSV Reader
admin-menu-button-go-to-menu = Go to Admin-panel

# Moderator panel
moderator-panel-title = Moderator-panel of { $botName }.

# Moderator menu buttons
moderator-menu-button-sessions = Sessions
moderator-menu-button-users = Users
moderator-menu-button-csv-reader = CSV Reader
moderator-menu-button-go-to-menu = Go to Moderator-panel

# Sessions menu buttons
sessions-menu-button-get = Get session
sessions-menu-button-delete = Delete session

# Session menu messages
sessions-menu-message-delete-success = Session for { $username } has been deleted.

# Conversations menu buttons
conversations-menu-button-get = Get conversation
conversations-menu-button-delete = Delete conversation

# Conversations menu messages
conversations-menu-delete-success = Conversation for { $username } has been deleted.

# Users menu buttons
users-menu-button-get-all = Get all users
users-menu-button-add = Add user
users-menu-button-add-multiple = Add multiple users
users-menu-button-change-role = Change role
users-menu-button-block-unblock = Block/Unblock
users-menu-button-delete = Delete user

# Users menu messages
users-menu-message-add-success = User { $username } has been added.
users-menu-message-incorrect = Incorrect username entered. Try again!
users-menu-message-exist = User { $username } was already added.
users-menu-message-block-success = User { $username } has been blocked
users-menu-message-unblock-success = User { $username } has been unblocked
users-menu-message-delete-success = User { $username } has been deleted.
users-menu-message-change-role-success = User { $username } has been given a new role - { $role }.
users-menu-message-enter = Enter user following next format: { $inputFormat }.
users-menu-message-enter-csv = Load a CSV file with the following columns: { $csvFormat }.
users-menu-message-incorrect-csv = The file extension does not match the CSV. Try again!
users-menu-message-multiple-add-success = Users [ { $users } ] were successfully added.
users-menu-message-multiple-add-error = Users have already been added. Try again!

# User roles
user-role-super-admin = Super Admin
user-role-admin = Admin
user-role-moderator = Moderator
user-role-user = User

# User statuses
user-status-blocked = Blocked
user-status-available = Available

# Info messages
info-message-moderator-panel-for-super-admin = Note: Please go to the Admin-panel.
info-message-clear-current-session = The current session for the { $username } has been cleared.
info-message-reach-gpt-tokens-limit = You have used all available GPT tokens. Please try again after { $date }.

# Profile
profile-user-initial-message = Hey 👋🏻, { $firstName } { $lastName }!
profile-user-available-messages-amount = Available number of GPT tokens: { $amount }
profile-user-available-images-amount = Available number of GPT images: { $amount }
profile-user-role = Your role: { $role }
profile-user-date-register = Date of registration: { $date }
