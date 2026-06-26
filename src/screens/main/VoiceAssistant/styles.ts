import { Colors, ThemeType, commonColors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

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
          padding: moderateScale(16),
        },
        statusCard: {
          backgroundColor: colors.surface,
          borderRadius: moderateScale(16),
          padding: moderateScale(20),
          alignItems: 'center',
          marginBottom: verticalScale(16),
          borderWidth: 1,
          borderColor: colors.inputBorder,
        },
        statusDot: {
          width: moderateScale(12),
          height: moderateScale(12),
          borderRadius: moderateScale(6),
          marginBottom: verticalScale(8),
        },
        statusText: {
          fontFamily: fontFamily.medium,
          fontSize: moderateScale(16),
          color: colors.text,
          textAlign: 'center',
        },
        transcriptContainer: {
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: moderateScale(16),
          padding: moderateScale(16),
          marginBottom: verticalScale(16),
          borderWidth: 1,
          borderColor: colors.inputBorder,
        },
        transcriptTitle: {
          fontFamily: fontFamily.semiBold,
          fontSize: moderateScale(14),
          color: colors.textSecondary,
          marginBottom: verticalScale(12),
          textAlign: isRTL ? 'right' : 'left',
        },
        transcriptList: {
          flex: 1,
        },
        transcriptItem: {
          marginBottom: verticalScale(10),
        },
        transcriptRole: {
          fontFamily: fontFamily.semiBold,
          fontSize: moderateScale(12),
          color: colors.textSecondary,
          marginBottom: verticalScale(2),
          textAlign: isRTL ? 'right' : 'left',
        },
        transcriptText: {
          fontFamily: fontFamily.regular,
          fontSize: moderateScale(14),
          color: colors.text,
          textAlign: isRTL ? 'right' : 'left',
        },
        emptyTranscript: {
          fontFamily: fontFamily.regular,
          fontSize: moderateScale(14),
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: verticalScale(24),
        },
        errorText: {
          fontFamily: fontFamily.medium,
          fontSize: moderateScale(13),
          color: commonColors.error,
          textAlign: 'center',
          marginBottom: verticalScale(12),
        },
        buttonGroup: {
          gap: verticalScale(12),
        },
        hint: {
          fontFamily: fontFamily.regular,
          fontSize: moderateScale(12),
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: verticalScale(12),
        },
      }),
    [colors, isRTL, theme],
  );
};

export default useRTLStyles;
