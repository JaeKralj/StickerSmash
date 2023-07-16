import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export default function EmojiSticker({ imageSize, stickerSource }) {
  const isPressed = useSharedValue(false)
  const offset = useSharedValue({ x: 0, y: 0 })
  const panStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.15 : 1) },
      ],
    }
  })
  const panStart = useSharedValue({ x: 0, y: 0 })
  const pan = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true
    })
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + panStart.value.x,
        y: e.translationY + panStart.value.y,
      }
    })
    .onEnd(() => {
      panStart.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })
    .onFinalize(() => {
      isPressed.value = false
    })

  // scale image
  const scaleImage = useSharedValue(imageSize)
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    }
  })
  const scale = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2
      } else {
        scaleImage.value = imageSize
      }
    })
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ top: -350 }, panStyles]}>
        <GestureDetector gesture={scale}>
          <Animated.Image
            source={stickerSource}
            resizeMode='contain'
            style={[{ width: imageSize, height: imageSize }, imageStyle]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  )
}
