import { StyleSheet } from 'react-native';
import { Colors, ThemeType } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { useMemo } from 'react';

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
  const colors = Colors[theme];

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: moderateScale(24),
        },
        displayCard: {
          backgroundColor: colors.surface,
          borderRadius: moderateScale(20),
          paddingVertical: verticalScale(32),
          paddingHorizontal: moderateScale(24),
          width: '100%',
          alignItems: 'center',
          marginBottom: verticalScale(40),
          borderWidth: 1,
          borderColor: colors.inputBorder,
        },
        timerDisplay: {
          fontFamily: fontFamily.bold,
          fontSize: moderateScale(48),
          color: colors.text,
          letterSpacing: moderateScale(2),
        },
        statusText: {
          fontFamily: fontFamily.medium,
          fontSize: moderateScale(14),
          color: colors.textSecondary,
          marginTop: verticalScale(12),
          textAlign: 'center',
        },
        buttonGroup: {
          width: '100%',
          gap: moderateScale(12),
        },
        hint: {
          fontFamily: fontFamily.regular,
          fontSize: moderateScale(12),
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: verticalScale(24),
          lineHeight: moderateScale(18),
        },
      }),
    [isRTL, theme, colors],
  );
};

export default useRTLStyles;
