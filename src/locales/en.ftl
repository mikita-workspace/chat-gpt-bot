# Commands
command-profile = Profile
command-image = Generate an image
command-restart = New dialog
command-about = About me
command-change-model = Change GPT model
command-support = Write to support

# Common buttons
common-button-go-to-chat = Go to chat

# Start
start-message = 💭 I'm expecting a text or voice message...
start-description = 🙃 Let's chatting! What do you want to ask?

# Description
description-message-start = Hi 👋, this is { $botName }!
description-message-body = I'm intelligent bot capable of responding to various user requests, including voice input. I'm built on various GPT models and have extensive knowledge in various fields such as science, technology, art, sports, healthcare and more. I can answer on questions, help solve problems, and also engage in a casual conversation on any topic. My interface allows both text and voice input.

# About
about-gpt-model = GPT model:
about-speech-model = Speech model:
about-image-model = Image model:
about-release = Releases:

# Errors messages
error-message-common = Your request could not be processed 😔. Try again!
error-message-gpt = Your message could not be processed. Try again!
error-message-change-gpt-model = You have not selected the GPT model. Try again!
error-message-common-try-again = Try again

# Auth
auth-authorization = It looks like your account is not authorized. Please press the authorization button.
auth-success = Thank you for authorization! After approval, { $botName } bot will be available to you.
auth-button = Authorization
auth-approval = We are still working on setting up the bot for you. Thank you for your patience!
auth-block = Your account has been blocked.
auth-error = Access is denied.

# Support
support-contact = If you have any questions, press /support.

# Feedback
feedback-like = 👍
feedback-dislike = 👎
feedback-like-response-first = 🤗 Thank you for your feedback! I'm very pleased
feedback-like-response-second = 🙏 Thank you for your feedback! Glad I could help.
feedback-like-response-dislike = If you don't like my answer, give me another chance and press /restart. I'll think about it better 🤔
feedback-like-response-image-dislike = If you don't like the result, give me another chance and click /image. I 'll generate better 🌉

# Loader
loader-message-start = Great request,
loader-message-end = 💬 I read it, thinking about the answer...
loader-message-image-end = 🏙️ Generating an image...

# Restart
restart-message = Let's start with a clean slate 😊

# Change GPT model
gpt-model-change-success = The GPT model has been changed.
gpt-model-change-title = Select an available GPT model:

# Profile
profile-client-initial-message = Hey 👋, { $firstname } { $lastname }!
profile-client-select-model = Selected GPT model:
profile-client-rate = Rate:
profile-client-available-messages = GPT tokens:
profile-client-available-images = GPT images:
profile-client-date-expires = Available tokens will be updated { $expiresIn }.
profile-client-incognito = Incognito
profile-client-unavailable-info = 🤖 Your tokens will appear here when you write any message to the bot.

# Image
image-generate = 🖼️ Describe what kind of picture you would like to generate:
image-amount = 🤔 Specify the number of images you want to get (from 1 to { $max }):
image-empty-input = 😬 Oops! It looks like you want to move to another section. Press { $command } again!
image-feedback = Did you like the result?

usage-token-limit = You have used up all the tokens. Try again { $expiresIn }.
usage-image-limit = You have used up all the images. Try again { $expiresIn }.