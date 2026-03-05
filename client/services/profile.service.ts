import { api } from './api'

export type ProfileData = {
  userCode: string
  email: string
  userName: string | null
  firstName: string
  lastName: string
  address: string | null
  tel: string | null
  imageProfile: string | null
  imageUpload: string | null
  displayName: string
}

export type UpdateProfilePayload = {
  firstName: string
  lastName: string
  userName?: string
  address?: string
  tel?: string
  image?: { uri: string; name: string; type: string }
}

export const profileService = {
  getProfile: () => api.get<ProfileData>('/profile'),

  updateProfile: (payload: UpdateProfilePayload) => {
    if (payload.image) {
      const form = new FormData()
      form.append('firstName', payload.firstName)
      form.append('lastName', payload.lastName)
      if (payload.userName) form.append('userName', payload.userName)
      if (payload.address) form.append('address', payload.address)
      if (payload.tel) form.append('tel', payload.tel)
      form.append('image', payload.image as any)

      return api.patch<{ message: string; user: ProfileData }>('/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }

    const { image: _image, ...rest } = payload
    return api.patch<{ message: string; user: ProfileData }>('/profile', rest)
  },
}
