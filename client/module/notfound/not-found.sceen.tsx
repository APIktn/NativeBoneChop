import { View, Text } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { styles } from "./not-found.styles";
import { GlassButton } from "../../components/btn/GlassButton";

export default function NotFound() {
  const { width, height } = useWindowDimensions();

  const videoRatio = 16 / 9;
  const screenRatio = width / height;

  let videoWidth = width;
  let videoHeight = height;

  if (screenRatio > videoRatio) {
    videoWidth = width;
    videoHeight = width / videoRatio;
  } else {
    videoHeight = height;
    videoWidth = height * videoRatio;
  }

  return (
    <View style={styles.wrapper}>
      <Video
        source={require("../../assets/video/NotFound.mp4")}
        style={{
          position: "absolute",
          width: videoWidth,
          height: videoHeight,
          alignSelf: "center",
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>
          404{"\n"}
          Your URL was not found anywhere in this universe
        </Text>

        <GlassButton
          title="but don't worry, we can go back to home page"
          onPress={() => router.replace("/")}
        />
      </View>
    </View>
  );
}
