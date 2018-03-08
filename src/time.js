export const SECONDS = 1000
export const MINUTES = 60 * SECONDS
export const HOURS = 60 * MINUTES
export const DAYS = 24 * HOURS
export const WEEKS = 7 * DAYS

export const formatTime = (ms) => {
  if (ms < MINUTES) {
    return Math.ceil(ms / SECONDS) + 's'
  } else if (ms < HOURS) {
    return Math.ceil(ms / MINUTES) + 'm'
  } else if (ms < DAYS) {
    return Math.ceil(ms / HOURS) + 'h'
  } else if (ms < WEEKS) {
    return Math.ceil(ms / DAYS) + 'd'
  } else {
    // let's really hope this never happens, eh?
    return Math.ceil(ms / WEEKS) + 'w'
  }
}
