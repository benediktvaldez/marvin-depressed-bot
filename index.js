var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
  bot.reply(message, 'I think you ought to know I\'m feeling very depressed.')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'I think you ought to know I\'m feeling very depressed.. :disappointed:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.' +
      'I have a million other ideas, but, they all point to certain death. '
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
  
  bot.reply(message, 'Life? Don\'t talk to me about life!')
  bot.reply(message, 'I\'ve calculated your chance of survival, but I don\'t think you\'ll like it')
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n Did I say something wrong? Pardon me for breathing which I never do anyway so I don\'t know why I bother to say it oh God I\'m so depressed.')
})

controller.hears('do * laundry', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Here I am, brain the size of a planet, and they tell me to do <@' + message.user + '>\'s laundry. Call that job satisfaction? Cause I don\'t.')
})

controller.hears(['how have you been', 'how are you'], ['mention', 'direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'The first ten million years were the worst. And the second ten million: they were the worst, too. The third ten million I didn\'t enjoy at all. After that, I went into a bit of a decline. :disappointed:')
})

controller.hears(['what should I do about *', 'fix my problems', '*problem*'], ['mention', 'direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'You think you\'ve got problems. What are you supposed to do if you are a manically depressed robot? No, don\'t even bother answering. I\'m 50,000 times more intelligent than you and even I don\'t know the answer. :disappointed:')
})
