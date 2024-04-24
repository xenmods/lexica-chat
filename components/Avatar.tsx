/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Image } from 'react-native';

const UIAvatar = ({
  source,
  children,
  overlay,
  badge,
  badgePosition = 'br',
  badgeInset = 0,
  rounded = 'full',
  size = 'md',
  bg = '#a8bac1',
  border = 0,
  borderColor = '#ffffff',
}) => {
  const sizeMappedValue = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    '2xl': 128,
  }[size];

  const fullRadius = sizeMappedValue / 2;

  const roundedMappedValue = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    full: fullRadius,
  }[rounded];

  // Determine the bounded radius, ensuring it does not exceed the full radius
  const boundedRadius = Math.min(roundedMappedValue, fullRadius);

  // Calculate the side length of the outer square surrounding the circle formed by the radius
  const radiusOuterSquareSide = boundedRadius * 2;
  // Calculate the hypotenuse of the outer square
  const hypotenuse = Math.sqrt(
    Math.pow(radiusOuterSquareSide, 2) + Math.pow(radiusOuterSquareSide, 2)
  );
  // Calculate the distance between the corner of the outer square and the inner circle
  const distanceBetweenCornerAndInnerCircle = hypotenuse / 2 - boundedRadius;
  // Define the side length of the smaller square between the outer square and the inner circle, serving as the reference for positioning the badge (top/bottom and left/right)
  const referenceSquareSide = Math.sqrt(Math.pow(distanceBetweenCornerAndInnerCircle, 2) / 2);
  // This distance is used for determining top/bottom and left/right positions of the badge
  const distance = referenceSquareSide + badgeInset;

  const badgePositionMappedStyles = {
    tl: { top: distance, left: distance },
    t: { top: badgeInset, left: '50%' },
    tr: { top: distance, right: distance },
    r: { top: '50%', right: badgeInset },
    br: { bottom: distance, right: distance },
    b: { bottom: badgeInset, left: '50%' },
    bl: { bottom: distance, left: distance },
    l: { top: '50%', left: badgeInset },
  }[badgePosition];

  const styles = {
    avatar: {
      flexShrink: 0,
      width: sizeMappedValue,
      height: sizeMappedValue,
    },
    avatarContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: border,
      borderColor: borderColor,
      borderRadius: boundedRadius,
      backgroundColor: bg,
      overflow: 'hidden',
    },
    avatarImg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    avatarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarBadge: {
      ...badgePositionMappedStyles,
      position: 'absolute',
      width: 0,
      height: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <View style={styles.avatar}>
      <View style={styles.avatarContainer}>
        {children}
        {source ? <Image source={source} style={styles.avatarImg} /> : null}
        {overlay ? <View style={styles.avatarOverlay}>{overlay}</View> : null}
      </View>
      {badge ? <View style={styles.avatarBadge}>{badge}</View> : null}
    </View>
  );
};

export default UIAvatar;
