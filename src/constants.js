import { SECONDS, WEEKS } from './time'

export const LINK_REGEX = /(https?:\/\/)?[A-Za-z0-9-_]\.[A-Za-z]/g

export const SPAM_LIMIT = 3 // score / messages
export const SPAM_LIMIT_HIT = 5 // set score to this when limit is reached
export const SPAM_INTERVAL = 5 * SECONDS // interval to decrease scores

export const SCORE_MESSAGE = 0.75 // score per message sent
export const SCORE_LINK = 0.25  // score per message link
export const SCORE_CHARACTER = 0.004 // score per message character
export const SCORE_STICKER = 1.5 // score per sticker

export const BASE_COOLDOWN_MINUTES = 5
export const WARN_EXPIRE = 1 * WEEKS

export const KARMA_PLUS_ONE = 1
export const KARMA_PENALTY_WARN = 10
