import type { ProfileForm, ProfileErrors } from './profile.types'

export function validateProfile(form: ProfileForm): ProfileErrors {
  const errors: ProfileErrors = {}

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }

  return errors
}
