import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import WrapperContainer from '@/components/WrapperContainer';
import { submitPostData } from '@/helper/offlineSyncService';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import useOfflineQueue from '@/hooks/useOfflineQueue';
import React, { useState } from 'react';
import { View } from 'react-native';
import useRTLStyles from './styles';

const OfflinePost = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const { isConnected, isChecking } = useNetworkStatus();
  const { pendingCount } = useOfflineQueue();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [statusKey, setStatusKey] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
    };

    setTitle('');
    setMessage('');
    setStatusKey('OFFLINE_POST_SUBMITTING');

    submitPostData(payload)
      .then(result => {
        setStatusKey(
          result === 'sent' ? 'OFFLINE_POST_SENT' : 'OFFLINE_POST_QUEUED',
        );
      })
      .catch(() => {
        setStatusKey('OFFLINE_POST_FAILED');
      });
  };

  const networkStatusKey = isChecking
    ? 'INTERNET_CHECKING'
    : isConnected
      ? 'INTERNET_CONNECTED'
      : 'INTERNET_DISCONNECTED';

  const indicatorStyle = isChecking
    ? styles.networkIndicatorChecking
    : isConnected
      ? styles.networkIndicatorOnline
      : styles.networkIndicatorOffline;

  const dotStyle = isChecking
    ? styles.networkDotChecking
    : isConnected
      ? styles.networkDotOnline
      : styles.networkDotOffline;

  const textStyle = isChecking
    ? styles.networkTextChecking
    : isConnected
      ? styles.networkTextOnline
      : styles.networkTextOffline;

  return (
    <WrapperContainer style={styles.container}>
      <HeaderComp showBack title="OFFLINE_POST" customStyle={styles.header} />

      <View style={styles.content}>
        <View style={[styles.networkIndicator, indicatorStyle]}>
          <View style={[styles.networkDot, dotStyle]} />
          <TextComp text={networkStatusKey} style={[styles.networkText, textStyle]} />
        </View>

        <TextComp text="OFFLINE_POST_DESCRIPTION" style={styles.description} />

        <View style={styles.inputSpacing}>
          <TextComp text="OFFLINE_POST_TITLE_LABEL" style={styles.inputLabel} />
          <TextInputComp
            value={title}
            onChangeText={setTitle}
            placeholder="OFFLINE_POST_TITLE_PLACEHOLDER"
          />
        </View>

        <View style={styles.inputSpacing}>
          <TextComp text="OFFLINE_POST_MESSAGE_LABEL" style={styles.inputLabel} />
          <TextInputComp
            value={message}
            onChangeText={setMessage}
            placeholder="WRITE_HERE"
          />
        </View>

        <View style={styles.statusCard}>
          <TextComp text="OFFLINE_POST_PENDING_LABEL" style={styles.statusLabel} />
          <TextComp
            isDynamic
            text={String(pendingCount)}
            style={styles.statusValue}
          />
          {statusKey ? (
            <>
              <TextComp
                text="OFFLINE_POST_LAST_STATUS"
                style={[styles.statusLabel, { marginTop: 12 }]}
              />
              <TextComp text={statusKey} style={styles.statusValue} />
            </>
          ) : null}
        </View>

        <ButtonComp
          title="OFFLINE_POST_SUBMIT"
          onPress={handleSubmit}
          style={styles.button}
          disabled={!title.trim() || !message.trim()}
        />
      </View>
    </WrapperContainer>
  );
};

export default OfflinePost;
