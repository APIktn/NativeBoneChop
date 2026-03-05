import { api } from './api'

export type ProductLine = {
  lineKey: number
  lineNo: number
  size: string
  price: number
  amount: number
  note: string
}

export type ProductData = {
  productCode: string
  productName: string
  description: string
  mainImage: string | null
  items: ProductLine[]
}

export const productsService = {
  getProduct: (code: string) =>
    api.get<ProductData>(`/products/${code}`),

  createProduct: (payload: {
    productCode: string
    productName: string
    description: string
    items: Array<{ lineNo: number; size: string; price: number; amount: number; note?: string }>
    image?: { uri: string; name: string; type: string }
  }) => {
    const form = new FormData()
    form.append('productCode', payload.productCode)
    form.append('productName', payload.productName)
    form.append('description', payload.description)
    form.append('items', JSON.stringify(payload.items))
    if (payload.image) form.append('image', payload.image as any)

    return api.post<{ message: string; productCode: string }>('/products', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  updateProductHeader: (
    code: string,
    payload: {
      productName: string
      description: string
      image?: { uri: string; name: string; type: string }
    },
  ) => {
    if (payload.image) {
      const form = new FormData()
      form.append('productName', payload.productName)
      form.append('description', payload.description)
      form.append('image', payload.image as any)
      return api.patch<{ message: string }>(`/products/${code}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    const { image: _image, ...rest } = payload
    return api.patch<{ message: string }>(`/products/${code}`, rest)
  },

  updateLines: (
    lines: Array<{ lineKey: number; lineNo: number; size: string; price: number; amount: number; note?: string }>,
  ) =>
    api.patch<{ message: string }>('/products/lines', {
      lines: lines.map((l) => ({
        id: l.lineKey,
        lineNo: l.lineNo,
        size: l.size,
        price: l.price,
        amount: l.amount,
        note: l.note,
      })),
    }),

  deleteProduct: (code: string) =>
    api.delete<{ message: string }>(`/products/${code}`),

  deleteLine: (id: number) =>
    api.delete<{ message: string }>(`/products/lines/${id}`),
}
