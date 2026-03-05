import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'

import { GlassButton } from '@/components/btn/GlassButton'
import { profileService } from '@/services/profile.service'
import { getErrorMessage } from '@/services/auth.service'
import { useAuth } from '@/context/auth.context'

import { styles } from './profile.styles'
import type { ProfileForm, ProfileErrors } from './profile.types'
import { validateProfile } from './profile.validation'

function Field({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines,
}: {
  label: string
  value: string
  onChangeText: (v: string) => void
  error?: string
  placeholder?: string
  keyboardType?: any
  multiline?: boolean
  numberOfLines?: number
}) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !!error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export default function ProfileScreen() {
  const { updateUser } = useAuth()

  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    userName: '',
    address: '',
    tel: '',
  })

  const [errors, setErrors] = useState<ProfileErrors>({})
  const [apiError, setApiError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [pendingImage, setPendingImage] = useState<{ uri: string; name: string; type: string } | null>(null)

  const setField = (key: keyof ProfileForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setApiError('')
    setSuccessMsg('')
  }

  /* pick image */
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      const ext = asset.uri.split('.').pop() ?? 'jpg'
      setPendingImage({
        uri: asset.uri,
        name: `profile.${ext}`,
        type: asset.mimeType ?? `image/${ext}`,
      })
      setAvatarUrl(asset.uri)
    }
  }

  /* load profile */
  useEffect(() => {
    profileService
      .getProfile()
      .then((res) => {
        const d = res.data
        setForm({
          firstName: d.firstName ?? '',
          lastName: d.lastName ?? '',
          userName: d.userName ?? '',
          address: d.address ?? '',
          tel: d.tel ?? '',
        })
        setAvatarUrl(d.imageUpload ?? d.imageProfile ?? null)
      })
      .catch((err) => setApiError(getErrorMessage(err, 'Failed to load profile')))
      .finally(() => setLoading(false))
  }, [])

  /* save */
  const handleSave = async () => {
    const newErrors = validateProfile(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSaving(true)
    setApiError('')
    setSuccessMsg('')

    try {
      const res = await profileService.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName || undefined,
        address: form.address || undefined,
        tel: form.tel || undefined,
        image: pendingImage ?? undefined,
      })

      const updated = res.data.user
      setPendingImage(null)
      setAvatarUrl(updated.imageUpload ?? updated.imageProfile ?? null)
      updateUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
        userName: updated.userName,
        displayName: updated.displayName,
        address: updated.address,
        tel: updated.tel,
        imageUpload: updated.imageUpload,
        imageProfile: updated.imageProfile,
      })
      setSuccessMsg('Profile updated successfully')
    } catch (err) {
      setApiError(getErrorMessage(err, 'Failed to update profile'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Profile</Text>

          {/* avatar */}
          <Pressable style={styles.avatarWrapper} onPress={handlePickImage}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <Text style={styles.avatarPlaceholder}>
                {form.firstName ? form.firstName[0].toUpperCase() : '?'}
              </Text>
            )}
            <View style={styles.avatarOverlay}>
              <Text style={styles.avatarOverlayText}>edit</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          {/* name row */}
          <View style={styles.row}>
            <View style={styles.rowField}>
              <Field
                label="First Name *"
                value={form.firstName}
                onChangeText={setField('firstName')}
                error={errors.firstName}
                placeholder="first name"
                keyboardType="default"
              />
            </View>
            <View style={styles.rowField}>
              <Field
                label="Last Name *"
                value={form.lastName}
                onChangeText={setField('lastName')}
                error={errors.lastName}
                placeholder="last name"
              />
            </View>
          </View>

          <Field
            label="Username"
            value={form.userName}
            onChangeText={setField('userName')}
            placeholder="username"
          />

          <Field
            label="Tel"
            value={form.tel}
            onChangeText={setField('tel')}
            placeholder="telephone number"
            keyboardType="phone-pad"
          />

          <Field
            label="Address"
            value={form.address}
            onChangeText={setField('address')}
            placeholder="address"
            multiline
            numberOfLines={3}
          />

          {!!apiError && <Text style={styles.errorText}>{apiError}</Text>}
          {!!successMsg && <Text style={styles.successText}>{successMsg}</Text>}

          <GlassButton
            title={saving ? 'Saving...' : 'Save Profile'}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
