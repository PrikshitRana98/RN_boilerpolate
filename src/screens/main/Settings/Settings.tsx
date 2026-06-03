import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import useIsRTL from '@/hooks/useIsRTL';
import { DeepLinkPaths } from '@/navigation/linking';
import { shareDeepLink } from '@/utils/shareDeepLink';
import React from 'react';
import { View } from 'react-native';
import useRTLStyles from './styles';

const Settings = () => {
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL);

  const handleShareApp = () => {
    shareDeepLink(DeepLinkPaths.HOME);
  };

  const handleShareSignup = () => {
    shareDeepLink(DeepLinkPaths.SIGNUP);
  };

  return (
    <WrapperContainer style={styles.container}>
      <HeaderComp showBack={false} title="SETTINGS" />
      <View style={styles.content}>
        <TextComp text="SETTINGS" style={styles.title} />
        <View style={styles.actions}>
          <ButtonComp title="SHARE_APP" onPress={handleShareApp} />
          <ButtonComp
            title="SHARE_SIGNUP_LINK"
            onPress={handleShareSignup}
            variant="secondary"
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Settings;
