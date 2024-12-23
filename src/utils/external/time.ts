/**
 * Delays the execution of a function for a specified amount of time
 * @param milliseconds - The amount of time to wait in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

/**
 * Converts a date or now to unix time
 * @param date - The date to convert or undefined
 * @returns Compact Unix time ( devided by 1000 ) in seconds
 * */
export const dateToUnixTime = (date?: Date) =>
  Math.floor((date ?? new Date()).getTime() / 1000)

/**
 * Calculates the time difference between now and a given date
 * @param date - The date in unix time or string or date format
 * @returns An object containing the days, hours, minutes, and seconds between now and the given date
 */
export const getTimeDiff = (date?: Date | string | number) => {
  if (!date) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  let itemDate: Date
  if (typeof date === 'string') {
    itemDate = new Date(date)
  } else if (typeof date === 'number') {
    itemDate = new Date(date * 1000) // Convert unix timestamp to milliseconds
  } else {
    itemDate = date
  }

  const now = new Date()
  const diffInSeconds = (now.getTime() - itemDate.getTime()) / 1000
  const seconds = diffInSeconds % 60
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const minutes = diffInMinutes % 60
  const diffInHours = Math.floor(diffInMinutes / 60)
  const hours = diffInHours % 24
  const days = Math.floor(diffInHours / 24)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

/**
 * Converts a date or unix time to a display format
 * @param date - The date or unix time to convert
 * @returns The date in display format
 */
export const dateToDisplay = (date: number | Date) => {
  let timestamp: number

  try {
    if (date instanceof Date) timestamp = date.getTime()
    else timestamp = date * 1000

    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp)
  } catch {
    return '...'
  }
}
