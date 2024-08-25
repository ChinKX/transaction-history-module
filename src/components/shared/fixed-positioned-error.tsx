import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const FixedPositionedError: React.FunctionComponent<Props> = props => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const {bottom} = useSafeAreaInsets();
  const {error} = props;

  React.useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: error !== undefined ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });
    animation.start();

    return () => animation.stop();
  }, [error]);

  const containerStyle = {
    ...styles.container,
    bottom,
    opacity: fadeAnim,
  };

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.errorTextContainer}>
        <Text variant="titleMedium" style={styles.errorText}>
          Error: {error}
        </Text>
      </View>
    </Animated.View>
  );
};

type Props = {
  error: string | undefined;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  errorTextContainer: {
    backgroundColor: 'lightgrey',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
  },
});
