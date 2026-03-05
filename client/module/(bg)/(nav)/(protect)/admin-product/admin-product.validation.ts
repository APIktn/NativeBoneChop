import type { ProductHeaderForm, ProductRow, HeaderErrors, RowError } from './admin-product.types'

export function validateHeader(form: ProductHeaderForm, isEdit: boolean): HeaderErrors {
  const errors: HeaderErrors = {}

  if (!isEdit && !form.productCode.trim()) {
    errors.productCode = 'Product code is required'
  }

  if (!form.productName.trim()) {
    errors.productName = 'Product name is required'
  }

  return errors
}

export function validateRows(rows: ProductRow[]): RowError[] {
  return rows.map((r) => ({
    size: !r.size,
    price: !r.price.trim() || isNaN(Number(r.price)) || Number(r.price) < 0,
    amount: !r.amount.trim() || isNaN(Number(r.amount)) || !Number.isInteger(Number(r.amount)),
  }))
}
