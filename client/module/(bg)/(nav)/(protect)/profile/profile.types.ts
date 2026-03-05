export type ProfileForm = {
  firstName: string
  lastName: string
  userName: string
  address: string
  tel: string
}

export type ProfileErrors = Partial<Pick<ProfileForm, 'firstName' | 'lastName'>>
