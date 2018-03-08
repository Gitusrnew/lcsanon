import dude from 'debug-dude'
const { info } = dude('bot:commands:admin')

import { sendToAll, sendToUser } from '../../index'
import { cursive, htmlMessage, configSet, blacklisted } from '../../messages'
import { getFromCache } from '../../cache'
import { setMotd, setRank, getUser, getUserByUsername, blacklistUser } from '../../db'
import { RANKS } from '../../ranks'

export default function adminCommands (user, evt, reply) {
  const messageRepliedTo = getFromCache(evt, reply)

  switch (evt.cmd) {
    case 'motd':
      const motd = evt.args.join(' ')
      if (motd) {
        setMotd(motd)
        info('%o set motd -> %s', user, motd)
        reply(configSet('message of the day', motd))
      }
      break

    case 'mod':
      if (evt.args.length !== 1) return reply(htmlMessage('<i>please specify a username, e.g.</i> /mod username'))
      const newMod = getUserByUsername(evt.args[0])
      setRank(newMod.id, RANKS.mod)
      info('%o made %o mod', user, newMod)
      sendToUser(newMod.id,
        htmlMessage('<i>you\'ve been promoted to mod, run</i> /modhelp <i>for a list of commands</i>')
      )
      reply(htmlMessage(`<i>made</i> @${evt.args[0]} <i>a moderator</i>`))
      break

    case 'admin':
      if (evt.args.length !== 1) return reply(htmlMessage('<i>please specify a username, e.g.</i> /admin username'))
      const newAdmin = getUserByUsername(evt.args[0])
      setRank(newAdmin.id, RANKS.admin)
      info('%o made %o admin', user, newAdmin)
      sendToUser(newAdmin.id,
        htmlMessage('<i>you\'ve been promoted to admin, run</i> /adminhelp <i>for a list of commands</i>')
      )
      reply(htmlMessage(`<i>made</> @${evt.args[0]} <i>an admin</i>`))
      break

    case 'blacklist':
      if (evt.args.length < 1) return reply(cursive('please specify a reason for the blacklist'))
      if (evt && evt.raw && evt.raw.reply_to_message) {
        if (messageRepliedTo) {
          const user = getUser(messageRepliedTo.sender)
          getUsers().map((user) => {
            if (messageRepliedTo.sender !== user.id) {
              reply({
                type: 'deleteMessage',
                chat: user.id,
                messageId: replyCache && replyCache[user.id]
              })
            }
          })
          blacklistUser(user.id, evt.args.join(' '))
          sendToUser(user.id, blacklisted(evt.args.join(' ')))
        }
      }
      break

    case 'adminsay':
      if (evt.args.length <= 0) return reply(htmlMessage('<i>please specify a message, e.g. </i>/adminsay message'))
      info('%o sent admin message -> %s', user, evt.args.join(' '))
      sendToAll(htmlMessage(evt.args.join(' ') + ' <b>~admins</b>'))
      break
  }
}
