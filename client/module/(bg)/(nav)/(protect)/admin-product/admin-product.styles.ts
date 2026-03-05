import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 120,
    gap: 0,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 20,
    gap: 14,
  },

  /* ── page header ── */
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Mitr-SemiBold',
    flexShrink: 1,
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  newBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  newBtnText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
  },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.5)',
  },
  deleteBtnText: {
    color: 'rgba(255,100,100,0.9)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  /* ── fields ── */
  fieldWrapper: {
    gap: 4,
  },
  label: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
    marginLeft: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: 'Mitr-Regular',
  },
  inputError: {
    borderColor: 'rgba(255,80,80,0.8)',
  },
  errorText: {
    color: 'rgba(255,100,100,1)',
    fontSize: 12,
    fontFamily: 'Mitr-Regular',
    marginLeft: 4,
    marginTop: 2,
  },

  /* ── image picker ── */
  imagePicker: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 14,
    fontFamily: 'Mitr-Regular',
  },

  /* ── lines section ── */
  linesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  linesTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Mitr-SemiBold',
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addRowText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
  },
  editLineNote: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: 'Mitr-Regular',
  },

  /* ── row card ── */
  rowCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    gap: 10,
  },
  rowCardNew: {
    borderColor: 'rgba(255,200,80,0.3)',
    backgroundColor: 'rgba(255,200,80,0.04)',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowNo: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: 'Mitr-Regular',
    minWidth: 24,
  },
  rowNewBadge: {
    color: 'rgba(255,200,80,0.8)',
    fontSize: 11,
    fontFamily: 'Mitr-Regular',
    borderWidth: 1,
    borderColor: 'rgba(255,200,80,0.4)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  rowActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  rowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBtnDelete: {
    backgroundColor: 'rgba(255,60,60,0.12)',
  },
  rowField: {
    gap: 4,
  },
  rowLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: 'Mitr-Regular',
    marginLeft: 2,
  },
  rowInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: 'Mitr-Regular',
  },
  rowDoubleField: {
    flexDirection: 'row',
    gap: 10,
  },

  /* ── size picker ── */
  sizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sizeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Mitr-Regular',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: 'rgba(20,20,20,0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingBottom: 32,
    paddingTop: 8,
  },
  pickerTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 4,
  },
  pickerItem: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  pickerItemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pickerItemText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Mitr-Regular',
  },
  pickerItemTextActive: {
    fontFamily: 'Mitr-SemiBold',
    color: '#d4a843',
  },
})
