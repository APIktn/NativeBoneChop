import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 12,
  },

  /* ── card base ── */
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  cardContent: {
    position: 'relative',
    zIndex: 2,
    padding: 24,
  },

  /* ── hero ── */
  heroCard: {
    minHeight: 420,
  },
  heroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
  },
  heroText: {
    flex: 1,
    minWidth: 200,
  },
  heroTitle: {
    fontSize: 48,
    fontFamily: 'Mitr-Bold',
    color: '#fff',
    lineHeight: 52,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Mitr-Regular',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  featureList: {
    marginTop: 12,
    gap: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureCheck: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
  },
  featureText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: 'Mitr-Regular',
  },
  heroLogoWrapper: {
    width: 160,
    height: 160,
    alignSelf: 'center',
  },
  heroLogo: {
    width: '100%',
    height: '100%',
  },

  /* ── stats ── */
  statsCard: {
    minHeight: 120,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Mitr-Bold',
    color: '#d4a843',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Mitr-Regular',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 2,
  },

  /* ── carousel ── */
  carouselSection: {
    gap: 4,
  },
  carouselOutTitle: {
    fontSize: 40,
    fontFamily: 'Mitr-Bold',
    color: 'rgba(255,255,255,0.15)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  carouselCard: {
    /* height set inline (responsive) */
  },
  carouselInner: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 8,
    zIndex: 2,
  },
  carouselArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselArrowText: {
    color: '#fff',
    fontSize: 18,
  },
  /* carouselSide / carouselCenter → sized inline (responsive) */

  /* ── video cards ── */
  videoCard: {
    height: 380,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  videoContent: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: 'flex-end',
    padding: 28,
  },
  bigTitle: {
    fontSize: 40,
    fontFamily: 'Mitr-Bold',
    color: '#fff',
    lineHeight: 44,
    letterSpacing: 1,
  },

  /* ── split card ── */
  splitCard: {
    flexDirection: 'row',
    minHeight: 280,
  },
  splitLeft: {
    flex: 2,
    backgroundColor: 'rgba(17,17,17,0.6)',
    padding: 24,
    justifyContent: 'center',
  },
  splitTitle: {
    fontSize: 28,
    fontFamily: 'Mitr-Bold',
    color: '#fff',
    lineHeight: 32,
  },
  splitSubtitle: {
    fontSize: 14,
    fontFamily: 'Mitr-Regular',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
  },
  splitRight: {
    flex: 1,
    backgroundColor: 'rgba(214,95,16,0.75)',
    minHeight: 280,
    position: 'relative',
  },
  splitImage: {
    width: '100%',
    height: '100%',
  },

  /* ── contact card ── */
  contactCard: {
    height: 260,
  },
  contactContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    fontSize: 36,
    fontFamily: 'Mitr-Bold',
    color: '#fff',
    opacity: 0.85,
    letterSpacing: 1,
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: 'Mitr-Regular',
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
});
