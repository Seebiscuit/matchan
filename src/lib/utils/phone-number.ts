import { parsePhoneNumberFromString } from 'libphonenumber-js/min'

export const phoneNumberUtils = {
  validate: (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'US')
    return phoneNumber?.isValid() || false
  },

  format: (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'US')
    return phoneNumber?.format('NATIONAL') || phone
  },

  normalize: (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'US')
    return phoneNumber?.format('E.164') || phone
  }
} 