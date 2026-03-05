/* local row state — lineKey is DB id (number) for saved rows, string for new temp rows */
export type ProductRow = {
  lineKey: number | string
  lineNo: number
  size: string
  price: string
  amount: string
  note: string
}

export type ProductHeaderForm = {
  productCode: string
  productName: string
  description: string
}

export type HeaderErrors = Partial<{
  productCode: string
  productName: string
}>

export type RowError = {
  size?: boolean
  price?: boolean
  amount?: boolean
}
