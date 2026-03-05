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
  Modal,
  Alert,
} from 'react-native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { GlassButton } from '@/components/btn/GlassButton'
import { productsService } from '@/services/products.service'
import { getErrorMessage } from '@/services/auth.service'

import { styles } from './admin-product.styles'
import type { ProductRow, ProductHeaderForm, HeaderErrors, RowError } from './admin-product.types'
import { validateHeader, validateRows } from './admin-product.validation'

const SIZE_OPTIONS = ['100%', '200%', '300%', '400%', '800%', '1200%']

/* ── size picker (bottom sheet modal) ── */
function SizePicker({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (v: string) => void
  error?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Pressable
        style={[styles.sizeBtn, error && styles.inputError]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.sizeBtnText, !value && { color: 'rgba(255,255,255,0.35)' }]}>
          {value || 'select size'}
        </Text>
        <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.5)" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <Pressable style={styles.pickerOverlay} onPress={() => setOpen(false)}>
          <View style={styles.pickerSheet}>
            <Text style={styles.pickerTitle}>Select Size</Text>
            {SIZE_OPTIONS.map((s) => (
              <Pressable
                key={s}
                style={[styles.pickerItem, s === value && styles.pickerItemActive]}
                onPress={() => {
                  onChange(s)
                  setOpen(false)
                }}
              >
                <Text style={[styles.pickerItemText, s === value && styles.pickerItemTextActive]}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

/* ── row card ── */
function RowCard({
  row,
  index,
  total,
  error,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  row: ProductRow
  index: number
  total: number
  error: RowError
  onChange: (field: keyof ProductRow, value: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  const isNew = typeof row.lineKey === 'string'

  return (
    <View style={[styles.rowCard, isNew && styles.rowCardNew]}>
      {/* row header */}
      <View style={styles.rowHeader}>
        <Text style={styles.rowNo}>#{row.lineNo}</Text>
        {isNew && <Text style={styles.rowNewBadge}>new</Text>}
        <View style={styles.rowActions}>
          <Pressable
            style={styles.rowBtn}
            onPress={onMoveUp}
            disabled={index === 0}
          >
            <Ionicons
              name="chevron-up"
              size={16}
              color={index === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'}
            />
          </Pressable>
          <Pressable
            style={styles.rowBtn}
            onPress={onMoveDown}
            disabled={index === total - 1}
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color={index === total - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'}
            />
          </Pressable>
          <Pressable style={[styles.rowBtn, styles.rowBtnDelete]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={14} color="rgba(255,100,100,0.9)" />
          </Pressable>
        </View>
      </View>

      {/* size */}
      <View style={styles.rowField}>
        <Text style={styles.rowLabel}>size</Text>
        <SizePicker
          value={row.size}
          onChange={(v) => onChange('size', v)}
          error={error.size}
        />
        {error.size && <Text style={styles.errorText}>required</Text>}
      </View>

      {/* price + amount */}
      <View style={styles.rowDoubleField}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>price</Text>
          <TextInput
            style={[styles.rowInput, error.price && styles.inputError]}
            value={row.price}
            onChangeText={(v) => onChange('price', v)}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
          {error.price && <Text style={styles.errorText}>required</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>amount</Text>
          <TextInput
            style={[styles.rowInput, error.amount && styles.inputError]}
            value={row.amount}
            onChangeText={(v) => onChange('amount', v)}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
          {error.amount && <Text style={styles.errorText}>required</Text>}
        </View>
      </View>

      {/* note */}
      <View style={styles.rowField}>
        <Text style={styles.rowLabel}>note</Text>
        <TextInput
          style={styles.rowInput}
          value={row.note}
          onChangeText={(v) => onChange('note', v)}
          placeholder="optional"
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
      </View>
    </View>
  )
}

/* ══════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════ */
export default function AdminProductScreen() {
  const { prd } = useLocalSearchParams<{ prd?: string }>()
  const isEdit = Boolean(prd)

  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')

  const [headerForm, setHeaderForm] = useState<ProductHeaderForm>({
    productCode: '',
    productName: '',
    description: '',
  })
  const [headerErrors, setHeaderErrors] = useState<HeaderErrors>({})

  const [rows, setRows] = useState<ProductRow[]>([
    { lineKey: 'new-1', lineNo: 1, size: '', price: '', amount: '', note: '' },
  ])
  const [rowErrors, setRowErrors] = useState<RowError[]>([{}])
  const [tempCounter, setTempCounter] = useState(1)

  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  /* set header field */
  const setHeader = (key: keyof ProductHeaderForm) => (value: string) => {
    setHeaderForm((prev) => ({ ...prev, [key]: value }))
    setHeaderErrors((prev) => ({ ...prev, [key]: undefined }))
    setApiError('')
  }

  /* set row field */
  const setRowField =
    (index: number, field: keyof ProductRow) => (value: string) => {
      setRows((prev) =>
        prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
      )
      if (field !== 'note') {
        setRowErrors((prev) =>
          prev.map((e, i) => (i === index ? { ...e, [field]: false } : e)),
        )
      }
      setApiError('')
    }

  /* load product */
  useEffect(() => {
    if (!prd) return

    productsService
      .getProduct(prd)
      .then((res) => {
        const d = res.data
        setHeaderForm({
          productCode: d.productCode,
          productName: d.productName,
          description: d.description ?? '',
        })
        setImagePreview(d.mainImage)
        const loadedRows: ProductRow[] = d.items.map((i) => ({
          lineKey: i.lineKey,
          lineNo: i.lineNo,
          size: i.size,
          price: String(i.price),
          amount: String(i.amount),
          note: i.note ?? '',
        }))
        setRows(loadedRows)
        setRowErrors(d.items.map(() => ({})))
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true)
        else setApiError(getErrorMessage(err, 'Failed to load product'))
      })
      .finally(() => setLoading(false))
  }, [prd])

  /* pick image */
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      const ext = asset.uri.split('.').pop() ?? 'jpg'
      setImage({ uri: asset.uri, name: `product.${ext}`, type: asset.mimeType ?? `image/${ext}` })
      setImagePreview(asset.uri)
    }
  }

  /* add row */
  const handleAddRow = () => {
    const next = tempCounter + 1
    setTempCounter(next)
    setRows((prev) => [
      ...prev,
      { lineKey: `new-${next}`, lineNo: prev.length + 1, size: '', price: '', amount: '', note: '' },
    ])
    setRowErrors((prev) => [...prev, {}])
  }

  /* delete row */
  const handleDeleteRow = (index: number) => {
    const row = rows[index]

    const doDelete = async () => {
      if (typeof row.lineKey === 'number') {
        try {
          await productsService.deleteLine(row.lineKey)
        } catch (err) {
          setApiError(getErrorMessage(err, 'Failed to delete line'))
          return
        }
      }
      setRows((prev) =>
        prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, lineNo: i + 1 })),
      )
      setRowErrors((prev) => prev.filter((_, i) => i !== index))
    }

    if (typeof row.lineKey === 'number') {
      Alert.alert('Delete line', 'Are you sure you want to delete this line?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ])
    } else {
      doDelete()
    }
  }

  /* move row (up / down) */
  const handleMoveRow = (index: number, dir: 'up' | 'down') => {
    const swapIndex = dir === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= rows.length) return

    setRows((prev) => {
      const next = [...prev]
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      return next.map((r, i) => ({ ...r, lineNo: i + 1 }))
    })
    setRowErrors((prev) => {
      const next = [...prev]
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
      return next
    })
  }

  /* validate */
  const validate = (): boolean => {
    const hErrors = validateHeader(headerForm, isEdit)
    setHeaderErrors(hErrors)

    const rowsToValidate = isEdit
      ? rows.filter((r) => typeof r.lineKey === 'number')
      : rows

    if (rowsToValidate.length === 0 && !isEdit) {
      setApiError('At least one row is required')
      return false
    }

    const rErrors = validateRows(rows)
    setRowErrors(rErrors)

    const savedErrors = isEdit
      ? rErrors.filter((_, i) => typeof rows[i].lineKey === 'number')
      : rErrors

    return (
      Object.keys(hErrors).length === 0 &&
      savedErrors.every((e) => !e.size && !e.price && !e.amount)
    )
  }

  /* reload helper */
  const reloadProduct = async () => {
    const res = await productsService.getProduct(prd!)
    const d = res.data
    setImagePreview(d.mainImage)
    setRows(
      d.items.map((i) => ({
        lineKey: i.lineKey,
        lineNo: i.lineNo,
        size: i.size,
        price: String(i.price),
        amount: String(i.amount),
        note: i.note ?? '',
      })),
    )
    setRowErrors(d.items.map(() => ({})))
  }

  /* save */
  const handleSave = async () => {
    if (!validate()) return

    setSaving(true)
    setApiError('')

    try {
      if (!isEdit) {
        /* ── CREATE ── */
        const res = await productsService.createProduct({
          productCode: headerForm.productCode.trim().toUpperCase(),
          productName: headerForm.productName.trim(),
          description: headerForm.description.trim(),
          items: rows.map((r, i) => ({
            lineNo: i + 1,
            size: r.size,
            price: Number(r.price),
            amount: Number(r.amount),
            note: r.note || undefined,
          })),
          image: image ?? undefined,
        })

        router.replace(`/admin-product?prd=${res.data.productCode}` as any)
      } else {
        /* ── UPDATE ── */
        await productsService.updateProductHeader(prd!, {
          productName: headerForm.productName.trim(),
          description: headerForm.description.trim(),
          image: image ?? undefined,
        })

        const savedRows = rows.filter((r) => typeof r.lineKey === 'number') as Array<
          ProductRow & { lineKey: number }
        >

        if (savedRows.length > 0) {
          await productsService.updateLines(
            savedRows.map((r) => ({
              lineKey: r.lineKey,
              lineNo: r.lineNo,
              size: r.size,
              price: Number(r.price),
              amount: Number(r.amount),
              note: r.note || undefined,
            })),
          )
        }

        setImage(null)
        await reloadProduct()
      }
    } catch (err) {
      setApiError(getErrorMessage(err, 'Failed to save product'))
    } finally {
      setSaving(false)
    }
  }

  /* delete product */
  const handleDeleteProduct = () => {
    Alert.alert(
      'Delete product',
      `Delete "${headerForm.productName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productsService.deleteProduct(prd!)
              router.replace('/admin-product' as any)
            } catch (err) {
              setApiError(getErrorMessage(err, 'Failed to delete product'))
            }
          },
        },
      ],
    )
  }

  /* ── loading / not found ── */
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    )
  }

  if (notFound) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Mitr-SemiBold' }}>
          product not found
        </Text>
        <GlassButton
          title="create new product"
          onPress={() => router.replace('/admin-product' as any)}
        />
      </View>
    )
  }

  /* ── new rows in edit mode (skipped on save) ── */
  const newRowCount = rows.filter((r) => typeof r.lineKey === 'string').length

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
          {/* page header */}
          <View style={styles.pageHeader}>
            <Text style={styles.title} numberOfLines={1}>
              {isEdit ? prd : 'new product'}
            </Text>
            <View style={styles.headerBtns}>
              {isEdit && (
                <Pressable style={styles.deleteBtn} onPress={handleDeleteProduct}>
                  <Text style={styles.deleteBtnText}>delete</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.newBtn}
                onPress={() => router.replace('/admin-product' as any)}
              >
                <Text style={styles.newBtnText}>+ new</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          {/* product code (create only) */}
          {!isEdit && (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Product Code *</Text>
              <TextInput
                style={[styles.input, !!headerErrors.productCode && styles.inputError]}
                value={headerForm.productCode}
                onChangeText={setHeader('productCode')}
                placeholder="e.g. PRD001"
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {!!headerErrors.productCode && (
                <Text style={styles.errorText}>{headerErrors.productCode}</Text>
              )}
            </View>
          )}

          {/* product name */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={[styles.input, !!headerErrors.productName && styles.inputError]}
              value={headerForm.productName}
              onChangeText={setHeader('productName')}
              placeholder="product name"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCorrect={false}
            />
            {!!headerErrors.productName && (
              <Text style={styles.errorText}>{headerErrors.productName}</Text>
            )}
          </View>

          {/* description */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              value={headerForm.description}
              onChangeText={setHeader('description')}
              placeholder="product description..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* image */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Product Image</Text>
            <Pressable style={styles.imagePicker} onPress={handlePickImage}>
              {image || imagePreview ? (
                <Image
                  source={{ uri: image?.uri ?? imagePreview! }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              ) : (
                <Text style={styles.imagePlaceholder}>+ tap to add image</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.divider} />

          {/* lines header */}
          <View style={styles.linesHeader}>
            <Text style={styles.linesTitle}>product stock</Text>
            <Pressable style={styles.addRowBtn} onPress={handleAddRow}>
              <Ionicons name="add-circle-outline" size={18} color="rgba(255,255,255,0.75)" />
              <Text style={styles.addRowText}>add row</Text>
            </Pressable>
          </View>

          {isEdit && newRowCount > 0 && (
            <Text style={[styles.errorText, { marginTop: -8 }]}>
              {newRowCount} new row(s) will be skipped — server add-line not supported yet
            </Text>
          )}

          {/* row cards */}
          {rows.map((row, index) => (
            <RowCard
              key={String(row.lineKey)}
              row={row}
              index={index}
              total={rows.length}
              error={rowErrors[index] ?? {}}
              onChange={(field, value) => setRowField(index, field)(value)}
              onMoveUp={() => handleMoveRow(index, 'up')}
              onMoveDown={() => handleMoveRow(index, 'down')}
              onDelete={() => handleDeleteRow(index)}
            />
          ))}

          {rows.length === 0 && (
            <Text style={[styles.errorText, { textAlign: 'center', paddingVertical: 8 }]}>
              no rows — tap "add row" to get started
            </Text>
          )}

          {!!apiError && <Text style={styles.errorText}>{apiError}</Text>}

          <GlassButton
            title={saving ? 'Saving...' : 'Save'}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
