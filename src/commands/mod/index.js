import dude from 'debug-dude'
const { info } = dude('bot:commands:mod')

import { sendToAll, sendToUser } from '../../index'
import { KARMA_PENALTY_WARN } from '../../constants'
import {
  cursive, htmlMessage, usersText, handedCooldown, modInfoText, ALREADY_WARNED,
  MESSAGE_DISAPPEARED, ERR_NO_REPLY
} from '../../messages'
import { getFromCache, getCacheGroup, setWarnedFlag, hasWarnedFlag } from '../../cache'
import {
  getUser, getUsers,
  addWarning, rmKarma
} from '../../db'

export default function modCommands (user, evt, reply) {
  const messageRepliedTo = getFromCache(evt, reply)
  const msgId = evt && evt.raw && evt.raw.reply_to_message && evt.raw.reply_to_message.message_id

  switch (evt.cmd) {
    case 'modsay':
      if (evt.args.length <= 0) return reply(cursive('please specify a message, e.g. /modsay message'))
      info('%o sent mod message -> %s', user, evt.args.join(' '))
      sendToAll(htmlMessage(evt.args.join(' ') + ' <b>~mods</b>'))
      break

    case 'users':
      const users = getUsers()
      reply(htmlMessage(
        usersText(users, true)
      ))
      break

    case 'info':
      if (evt && evt.raw && evt.raw.reply_to_message) {
        if (messageRepliedTo) {
          const user = getUser(messageRepliedTo.sender)
          reply(htmlMessage(
            modInfoText(user)
          ))
        }
      }
      break

    case 'delete':
      let replyCache = getCacheGroup(msgId)

      if (messageRepliedTo) {
        info('%o deleted message', user)
        if (!hasWarnedFlag(msgId)) {
          const cooldownTime = addWarning(messageRepliedTo.sender)

          rmKarma(messageRepliedTo.sender, KARMA_PENALTY_WARN)
          setWarnedFlag(msgId)

          sendToUser(messageRepliedTo.sender, {
            ...cursive(handedCooldown(cooldownTime, true)),
            options: {
              reply_to_message_id: msgId,
              parse_mode: 'HTML'
            }
          })
        }
        getUsers().map((user) => {
          if (messageRepliedTo.sender !== user.id) {
            reply({
              type: 'deleteMessage',
              chat: user.id,
              messageId: replyCache && replyCache[user.id]
            })
          }
        })
        reply(cursive('deleted message'))
      } else {
        reply(cursive(ERR_NO_REPLY))
      }
      break

    case 'warn':
      if (messageRepliedTo) {
        if (!hasWarnedFlag(msgId)) {
          info('%o warned message', user)
          const cooldownTime = addWarning(messageRepliedTo.sender)
          rmKarma(messageRepliedTo.sender, KARMA_PENALTY_WARN)
          setWarnedFlag(msgId)
          sendToUser(messageRepliedTo.sender, {
            ...cursive(handedCooldown(cooldownTime)),
            options: {
              reply_to_message_id: msgId,
              parse_mode: 'HTML'
            }
          })
          reply(cursive('warned message'))
        } else {
          reply(cursive(ALREADY_WARNED))
        }
      } else {
        reply(cursive(ERR_NO_REPLY))
      }
      break
  }
}
