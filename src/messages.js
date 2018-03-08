import { WARN_EXPIRE } from './constants'
import { isActive } from './db'
import { getRank } from './ranks'
import { DAYS, formatTime } from './time'

export const ERR_NO_REPLY = 'please reply to a message to use this command'
export const USER_NOT_IN_CHAT = 'you\'re not in the chat yet! Use </i>/start<i> to join'
export const USER_IN_CHAT = 'you\'re already in the chat!'
export const USER_BANNED_FROM_CHAT = 'your cooldown expires at'
export const USER_LEFT_CHAT = 'left the chat'
export const USER_JOINED_CHAT = 'joined the chat'
export const USER_SPAMMING = 'avoid sending messages too fast. your message has not been sent, try again later.'
export const ALREADY_WARNED = 'a warning has already been issued for this message'
export const MESSAGE_DISAPPEARED = 'this message disappeared into the ether'

export const blacklisted = (reason) => `you've been blacklisted for ${reason || '(reason not specified)'}`
export const handedCooldown = (duration, deleted = false) =>
  `you've been handed a cooldown of ${formatTime(duration)} for this message ${deleted ? '(message also deleted)' : ''}`

export const KARMA_THANK_YOU = 'you just gave this user some sweet karma, awesome!'
export const ALREADY_UPVOTED = 'you already upvoted this message'
export const CANT_UPVOTE_OWN_MESSAGE = 'you can\'t upvote your own message'
export const YOU_HAVE_KARMA = 'you\'ve just been given sweet karma! (check /info to see your karma, or /toggleKarma to turn these notifications off)'
export const REJOINING_QUICKLY = 'you\'re rejoining too quickly - try again later'

const parseValue = (val) => {
  if (typeof val === 'boolean') return val ? 'on' : 'off'
  else return val
}

export const htmlMessage = (msg) => {
  return {
    type: 'message',
    text: msg,
    options: {
      parse_mode: 'HTML'
    }
  }
}

export const configGet = (name, val) =>
  htmlMessage(`<i>${name}</i>: <code>${parseValue(val)}</code>`)

export const configSet = (name, val) =>
  htmlMessage(`set <i>${name}</i>: <code>${parseValue(val)}</code>`)

export const cursive = (msg) =>
  htmlMessage('<i>' + msg + '</i>')

export const generateSmiley = (warnings) => {
  if (!warnings || warnings <= 0) return ':)'
  else if (warnings === 1) return ':|'
  else if (warnings <= 3) return ':/'
  else if (warnings <= 5) return ':('
  else return `:'(`
}

const idSalt = () =>
  Math.floor(Date.now() / DAYS)

const obfuscateId = (id) =>
  Math.floor((id / idSalt()) * 100000).toString(32)

export const getUsername = (user) => {
  const rank = user.rank > 0 ? ' (' + getRank(user.rank) + ')' : ''
  return (user.username ? '@' + user.username : user.realname) + rank
}

export const getRealnameFromEvent = (evt) => {
  if (evt && evt.raw && evt.raw.from) {
    const { first_name: firstName, last_name: lastName } = evt.raw.from
    return [firstName, lastName].filter(i => i).join(' ')
  }
}

export const getUsernameFromEvent = (evt) => {
  if (evt && evt.raw && evt.raw.from) {
    return evt.raw.from.username
  }
}

export const stringifyTimestamp = (ts) =>
  (new Date(ts)).toUTCString()

export const obfuscateKarma = (karma) => {
  let offset = Math.round((karma * 0.2) + 2)
  return karma + Math.floor(Math.random() * (offset + 1) - offset)
}

export const usersText = (users, showNames) => {
  let u = users.filter(isActive)
  if (showNames) return `<b>${u.length}</b> <i>users:</i> ` + u.map(getUsername).join(', ')
  return `<b>${u.length}</b> <i>users.</i>`
}

export const infoText = (user) => !user ? '<i>user not found</i>'
  : `<b>id:</b> ${obfuscateId(user.id)}, <b>username:</b> @${user.username}, ` +
  `<b>rank:</b> ${user.rank} (${getRank(user.rank)}), ` +
  `<b>karma:</b> ${user.karma || 0}, ` +
  `<b>warnings:</b> ${user.warnings || 0} ${generateSmiley(user.warnings)}${user.warnings > 0 ? ` (one warning will be removed on ${stringifyTimestamp(user.warnUpdated + WARN_EXPIRE)})` : ''}, ` +
  `<b>cooldown:</b> ${user.banned >= Date.now() ? 'yes, until ' + stringifyTimestamp(user.banned) : 'no'}`

export const modInfoText = (user) => !user ? '<i>user not found</i>'
  : `<b>id:</b> ${obfuscateId(user.id)}, <b>username:</b> anonymous, ` +
  `<b>rank:</b> n/a, ` +
  `<b>karma:</b> ${obfuscateKarma(user.karma || 0)}, ` +
  `<b>cooldown:</b> ${user.banned >= Date.now() ? 'yes, until ' + stringifyTimestamp(user.banned) : 'no'}`
