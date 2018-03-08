import low from 'lowdb'
const db = low('db.json')

import { version } from '../package.json'

db.defaults({ users: [], system: {} }).value()

export const getKarma = (id) => {
  const user = getUser(id)
  if (!user || !user.karma) return 0
  else return user.karma
}
export const addKarma = (id, val = 1) => db.get('users').find({ id }).assign({ karma: getKarma(id) + val }).value()
export const rmKarma = (id, val = 1) => db.get('users').find({ id }).assign({ karma: getKarma(id) - val }).value()

export const blacklistUser = (id, reason) => db.get('users').find({ id }).assign({ left: new Date().getTime(), rank: -10, reason }).value()
export const getUser = (id) => db.get('users').find({ id }).value()
export const getUserByUsername = (username) => db.get('users').find({ username }).value()
export const addUser = (id) => db.get('users').push({ id, rank: 0, version, left: false }).value()
export const rejoinUser = (id) => setLeft(id, false)
export const delUser = (id) => db.get('users').remove({ id }).value()
export const getUsers = () => db.get('users').value()
export const updateUser = (id, data) => db.get('users').find({ id }).assign(data).value()

const getUserWarnings = (id) => {
  const user = getUser(id)
  if (!user || !user.warnings) return 0
  else return user.warnings
}

import { BASE_COOLDOWN_MINUTES } from './constants'
import { MINUTES } from './time'

// alias to add a warning to a user
export const addWarning = (id) => {
  let warnings = getUserWarnings(id)
  let cooldownTime = Math.pow(BASE_COOLDOWN_MINUTES, warnings) * MINUTES

  // increment user warnings
  db.get('users').find({ id }).assign({ warnings: warnings + 1 }).value()
  updateWarnTime(id)
  banUser(id, cooldownTime)

  return cooldownTime
}

export const rmWarning = (id) => {
  // decrement user warnings
  let warnings = getUserWarnings(id)
  if (warnings > 0) {
    db.get('users').find({ id }).assign({ warnings: warnings - 1 }).value()
    updateWarnTime(id)
  }
}

export const updateWarnTime = (id) =>
  db.get('users').find({ id }).assign({ warnUpdated: Date.now() }).value()

export const setLeft = (id, left) => {
  db.get('users').find({ id }).assign({ left }).value()
}

export const banUser = (id, ms) =>
  db.get('users')
    .find({ id })
    .assign({ banned: Date.now() + ms })
    .value()

export const isActive = (user) => user && !user.left

export const setRank = (id, rank) => db.get('users').find({ id }).assign({ rank }).value()
export const setDebugMode = (id, val) => db.get('users').find({ id }).assign({ debug: val }).value()
export const setKarmaMode = (id, val) => db.get('users').find({ id }).assign({ hideKarma: val }).value()
export const karmaOptedOut = (id) => getUser(id).hideKarma || false

export const getSystemConfig = () => db.get('system').value()
export const setMotd = (motd) => db.get('system').assign({ motd }).value()
