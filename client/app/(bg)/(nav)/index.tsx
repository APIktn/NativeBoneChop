import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Pressable,
  Animated,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import { GlassButton } from '@/components/btn/GlassButton';
import { styles } from '../../../module/(bg)/(nav)/home.styles';

/* ── assets ── */
const LOGO        = require('../../../assets/image/mrbonelogo.png');
const PACK_IMAGE  = require('../../../assets/image/MRBone_pack1.png');
const VIDEO_1     = require('../../../assets/video/MRBone_V1.mp4');
const VIDEO_2     = require('../../../assets/video/MRBone_V2.mp4');

const LAND_1   = require('../../../assets/image/land_1.png');
const LAND_1_5 = require('../../../assets/image/land_1_5.png');
const LAND_2   = require('../../../assets/image/land_2.png');
const LAND_3   = require('../../../assets/image/land_3.png');

const CAROUSEL_IMAGES = [
  require('../../../assets/image/MRBone_1.png'),
  require('../../../assets/image/MRBone_2.png'),
  require('../../../assets/image/MRBone_3.png'),
  require('../../../assets/image/MRBone_4.png'),
  require('../../../assets/image/MRBone_5.png'),
  require('../../../assets/image/MRBone_6.png'),
  require('../../../assets/image/MRBone_7.png'),
  require('../../../assets/image/MRBone_8.png'),
];

const FEATURES = [
  'original art toy collections',
  'limited & exclusive figures',
  'designer toys from local artists',
  'handcrafted details & quality paint',
  'collectible pieces with unique stories',
  'perfect for display & collection',
];

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
function HeroSection() {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ImageBackground source={LAND_1} style={[styles.card, styles.heroCard]} imageStyle={innerImg}>
      <View style={styles.cardOverlay} />
      <View style={styles.cardContent}>
        <View style={styles.heroRow}>
          {/* text */}
          <Animated.View
            style={[styles.heroText, { opacity: fade, transform: [{ translateY: slide }] }]}
          >
            <Text style={styles.heroTitle}>bone chop!</Text>
            <Text style={styles.heroSubtitle}>art toy shop for collectors</Text>
            <Text style={styles.heroSubtitle}>who love unique and creative designs</Text>

            <View style={styles.featureList}>
              {FEATURES.map((f) => (
                <View key={f} style={styles.featureItem}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <GlassButton title="shop now!" onPress={() => {}} />
          </Animated.View>

          {/* logo */}
          <View style={styles.heroLogoWrapper}>
            <Image source={LOGO} style={styles.heroLogo} contentFit="contain" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

/* ════════════════════════════════════════
   STATS
════════════════════════════════════════ */
function StatsSection() {
  const STATS = [
    { number: '500+',     label: 'original collections' },
    { number: '100,000+', label: 'sold items worldwide' },
    { number: '500,000+', label: 'collector community' },
  ];

  return (
    <ImageBackground source={LAND_1_5} style={[styles.card, styles.statsCard]} imageStyle={innerImg}>
      <View style={styles.cardOverlay} />
      <View style={styles.cardContent}>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statNumber}>{s.number}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

/* ════════════════════════════════════════
   CAROUSEL
════════════════════════════════════════ */
function CarouselSection() {
  const [idx, setIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();
  const showSide = width >= 500;

  /* responsive sizes */
  const cardHeight  = Math.max(260, Math.min(420, width * 0.55));
  const centerSize  = Math.min(220, width * 0.40);
  const sideSize    = Math.min(100, width * 0.16);

  /* fade-out → change index → fade-in (after re-render) */
  const go = (dir: 'prev' | 'next') => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setIdx((i) =>
        dir === 'prev'
          ? (i === 0 ? CAROUSEL_IMAGES.length - 1 : i - 1)
          : (i === CAROUSEL_IMAGES.length - 1 ? 0 : i + 1),
      );
    });
  };

  /* fade-in fires AFTER new idx is rendered */
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  }, [idx]);

  const leftIdx  = (idx - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
  const rightIdx = (idx + 1) % CAROUSEL_IMAGES.length;

  return (
    <View style={styles.carouselSection}>
      <Text style={styles.carouselOutTitle}>select your style!</Text>

      <ImageBackground
        source={LAND_2}
        style={[styles.card, styles.carouselCard, { height: cardHeight }]}
        imageStyle={innerImg}
      >
        <View style={styles.cardOverlay} />

        {/* absoluteFill so content always fills the card */}
        <View style={styles.carouselInner}>
          <Pressable style={styles.carouselArrow} onPress={() => go('prev')}>
            <Text style={styles.carouselArrowText}>‹</Text>
          </Pressable>

          {showSide && (
            <Image
              source={CAROUSEL_IMAGES[leftIdx]}
              style={{ width: sideSize, height: sideSize, opacity: 0.5 }}
              contentFit="contain"
            />
          )}

          <Animated.View style={{ opacity: fadeAnim }}>
            <Image
              source={CAROUSEL_IMAGES[idx]}
              style={{ width: centerSize, height: centerSize }}
              contentFit="contain"
            />
          </Animated.View>

          {showSide && (
            <Image
              source={CAROUSEL_IMAGES[rightIdx]}
              style={{ width: sideSize, height: sideSize, opacity: 0.5 }}
              contentFit="contain"
            />
          )}

          <Pressable style={styles.carouselArrow} onPress={() => go('next')}>
            <Text style={styles.carouselArrowText}>›</Text>
          </Pressable>
        </View>
      </ImageBackground>

      <Text style={styles.carouselOutTitle}>find your favorite</Text>
    </View>
  );
}

/* ════════════════════════════════════════
   VIDEO 1
════════════════════════════════════════ */
function VideoSection1() {
  return (
    <View style={styles.videoCard}>
      <Video
        source={VIDEO_1}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.videoOverlay} />
      <View style={styles.videoContent}>
        <Text style={styles.bigTitle}>KEEP YOUR{'\n'}SUPER SECRET</Text>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   SPLIT CARD
════════════════════════════════════════ */
function SplitSection() {
  return (
    <ImageBackground source={LAND_3} style={[styles.card, styles.splitCard]} imageStyle={innerImg}>
      <View style={styles.splitLeft}>
        <Text style={styles.splitTitle}>
          unboxing mr.bone{'\n'}camping series
        </Text>
        <Text style={styles.splitSubtitle}>join mr.bone on his camping adventure</Text>
      </View>
      <View style={styles.splitRight}>
        <Image source={PACK_IMAGE} style={styles.splitImage} contentFit="contain" />
      </View>
    </ImageBackground>
  );
}

/* ════════════════════════════════════════
   CONTACT CARD
════════════════════════════════════════ */
function ContactSection() {
  return (
    <View style={styles.contactCard}>
      <Video
        source={VIDEO_2}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.videoOverlay} />
      <View style={[styles.videoContent, styles.contactContent]}>
        <Text style={styles.contactTitle}>contact me</Text>
        <Text style={styles.contactEmail}>apisitamornktn@gmail.com</Text>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function HomePage() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <HeroSection />
      <StatsSection />
      <CarouselSection />
      <VideoSection1 />
      <SplitSection />
      <ContactSection />
    </ScrollView>
  );
}

/* shared imageStyle for ImageBackground */
const innerImg = { borderRadius: 20 };
