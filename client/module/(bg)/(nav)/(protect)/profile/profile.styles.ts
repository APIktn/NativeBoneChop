import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 28,
    gap: 16,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Mitr-SemiBold',
  },

  /* avatar */
  avatarWrapper: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 38,
    fontFamily: 'Mitr-Regular',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlayText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontFamily: 'Mitr-Regular',
    letterSpacing: 0.5,
  },

  /* section row */
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },

  /* field */
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
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
  },
  successText: {
    color: 'rgba(100,220,100,1)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 4,
  },
  emailNote: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
    textAlign: 'center',
    marginTop: -8,
  },
})
