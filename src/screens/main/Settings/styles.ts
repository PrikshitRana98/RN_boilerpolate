import { StyleSheet } from 'react-native';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

const useRTLStyles = (isRTL: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: moderateScale(16),
      paddingTop: moderateScale(24),
    },
    title: {
      fontSize: moderateScale(20),
      fontFamily: fontFamily.medium,
      marginBottom: moderateScale(24),
      textAlign: isRTL ? 'right' : 'left',
    },
    actions: {
      gap: moderateScale(12),
    },
  });
};

export default useRTLStyles;
