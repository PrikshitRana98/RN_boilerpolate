import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Colors, commonColors, ThemeType } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale, verticalScale } from '@/styles/scaling';

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
  const colors = Colors[theme];

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: moderateScale(16),
        },
        content: {
          flex: 1,
          marginTop: moderateScale(24),
        },
        networkIndicator: {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: moderateScale(8),
          paddingHorizontal: moderateScale(12),
          paddingVertical: moderateScale(8),
          borderRadius: moderateScale(20),
          marginBottom: verticalScale(16),
          borderWidth: 1,
        },
        networkIndicatorOnline: {
          backgroundColor: `${commonColors.success}15`,
          borderColor: commonColors.success,
        },
        networkIndicatorOffline: {
          backgroundColor: `${commonColors.error}15`,
          borderColor: commonColors.error,
        },
        networkIndicatorChecking: {
          backgroundColor: colors.surface,
          borderColor: colors.inputBorder,
        },
        networkDot: {
          width: moderateScale(8),
          height: moderateScale(8),
          borderRadius: moderateScale(4),
        },
        networkDotOnline: {
          backgroundColor: commonColors.success,
        },
        networkDotOffline: {
          backgroundColor: commonColors.error,
        },
        networkDotChecking: {
          backgroundColor: colors.textSecondary,
        },
        networkText: {
          fontSize: moderateScale(12),
          fontFamily: fontFamily.medium,
        },
        networkTextOnline: {
          color: commonColors.success,
        },
        networkTextOffline: {
          color: commonColors.error,
        },
        networkTextChecking: {
          color: colors.textSecondary,
        },
        description: {
          fontSize: moderateScale(14),
          fontFamily: fontFamily.regular,
          color: colors.textSecondary,
          marginBottom: verticalScale(20),
          textAlign: isRTL ? 'right' : 'left',
          lineHeight: moderateScale(20),
        },
        inputLabel: {
          fontSize: moderateScale(16),
          fontFamily: fontFamily.medium,
          marginBottom: moderateScale(10),
          textAlign: isRTL ? 'right' : 'left',
        },
        inputSpacing: {
          marginBottom: verticalScale(16),
        },
        statusCard: {
          marginTop: verticalScale(8),
          marginBottom: verticalScale(20),
          padding: moderateScale(16),
          borderRadius: moderateScale(12),
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        },
        statusLabel: {
          fontSize: moderateScale(12),
          fontFamily: fontFamily.medium,
          color: colors.textSecondary,
          marginBottom: moderateScale(6),
          textAlign: isRTL ? 'right' : 'left',
        },
        statusValue: {
          fontSize: moderateScale(14),
          fontFamily: fontFamily.regular,
          color: colors.text,
          textAlign: isRTL ? 'right' : 'left',
        },
        button: {
          height: moderateScale(48),
        },
        header: {
          paddingHorizontal: 0,
        },
      }),
    [isRTL, colors],
  );
};

export default useRTLStyles;
