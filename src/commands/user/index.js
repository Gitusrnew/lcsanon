import { sendToAll } from '../../index'
import {
  cursive, htmlMessage,
  getUsername,
  infoText, configSet, usersText,
  USER_NOT_IN_CHAT, USER_LEFT_CHAT
} from '../../messages'
import { setLeft, getUsers, getSystemConfig, setDebugMode, setKarmaMode } from '../../db'
import { version } from '../../../package.json'

export default function userCommands (user, evt, reply) {
  const isReply = evt && evt.raw && evt.raw.reply_to_message

  switch (evt.cmd) {
    case 'modhelp':
      reply(htmlMessage(`
<i>you can use the following commands:</i>
  /modhelp - show this info
  /modsay [message] - send an official moderator message

<i>or reply to a message and use:</i>
  /info - to get info about the user that sent this message
  /warn - to warn the user that sent this message
  /delete - delete a message and warn the user`))
      break

    case 'adminhelp':
      reply(htmlMessage(`
<i>you can use the following commands:</i>
  /adminhelp - show this info
  /adminsay [message] - send an official moderator message
  /motd [message] - set the message of the day
  /mod [username] - grant a user moderator rank
  /admin [username] - grant a user admin rank

<i>or reply to the message and use:</i>
  /blacklist [reason] - blacklist the user who posted this message`))
      break

    case 'stop':
      if (!user || user.left) return reply(cursive(USER_NOT_IN_CHAT))
      reply(cursive('You left the chat!'))
      setLeft(user.id, new Date().getTime())
      break

    case 'users':
      const users = getUsers()
      reply(htmlMessage(
        usersText(users)
      ))
      break

    case 'info':
      if (!isReply && evt.args.length === 0) {
        reply(htmlMessage(
          infoText(user)
        ))
      }
      break

    case 'motd':
      const motd = evt.args.join(' ')
      if (!motd) {
        reply(cursive(getSystemConfig().motd))
      }
      break

    case 'sign':
    case 's':
      reply(cursive('this command has been disabled'))
      break

    case 'toggledebug':
      const newDebugMode = !user.debug
      setDebugMode(evt.user, newDebugMode)
      reply(configSet('debug mode', newDebugMode))
      break

    case 'togglekarma':
      const newKarmaMode = !user.hideKarma
      setKarmaMode(evt.user, newKarmaMode)
      reply(configSet('karma notifications', !newKarmaMode))
      break

    case 'source':
    case 'version':
      const tag = 'v' + version.split('-').shift()
      reply(`secretlounge v${version} - https://github.com/6697/secretlounge`)
      reply(`changelog: https://github.com/6697/secretlounge/releases/tag/${tag}`)
      break

    case 'changelog':
      reply('you can see the full changelog here: https://github.com/6697/secretlounge/releases')
      break

    case 'issues':
      reply('please report issues here: https://github.com/6697/secretlounge/issues')
      break
  }
}
