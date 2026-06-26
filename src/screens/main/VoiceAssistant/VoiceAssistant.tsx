import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import { useTheme } from '@/context/ThemeContext';
import { useVapiCall } from '@/hooks/useVapiCall';
import useIsRTL from '@/hooks/useIsRTL';
import { commonColors } from '@/styles/colors';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import useRTLStyles from './styles';

const VoiceAssistant = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const {
    isConnected,
    isSpeaking,
    isStarting,
    transcripts,
    isMuted,
    error,
    startCall,
    stopCall,
    toggleMute,
  } = useVapiCall();

  const statusColor = useMemo(() => {
    if (isSpeaking) {
      return commonColors.info;
    }
    if (isConnected) {
      return commonColors.success;
    }
    if (isStarting) {
      return commonColors.warning;
    }
    return commonColors.gray300;
  }, [isConnected, isSpeaking, isStarting]);

  const statusKey = useMemo(() => {
    if (isSpeaking) {
      return 'VAPI_SPEAKING';
    }
    if (isConnected) {
      return 'VAPI_LISTENING';
    }
    if (isStarting) {
      return 'VAPI_CONNECTING';
    }
    return 'VAPI_IDLE';
  }, [isConnected, isSpeaking, isStarting]);

  return (
    <WrapperContainer style={styles.container} edges={['top']}>
      <HeaderComp showBack={false} title="VAPI_VOICE" />

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <TextComp text={statusKey} style={styles.statusText} />
          {isStarting ? <ActivityIndicator color={commonColors.primary} style={{ marginTop: 12 }} /> : null}
        </View>

        <View style={styles.transcriptContainer}>
          <TextComp text="VAPI_TRANSCRIPT" style={styles.transcriptTitle} />
          <FlatList
            data={transcripts}
            keyExtractor={(_, index) => String(index)}
            style={styles.transcriptList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <TextComp text="VAPI_TRANSCRIPT_EMPTY" style={styles.emptyTranscript} />
            }
            renderItem={({ item }) => (
              <View style={styles.transcriptItem}>
                <TextComp
                  isDynamic
                  text={item.role === 'user' ? 'You' : 'Assistant'}
                  style={styles.transcriptRole}
                />
                <TextComp isDynamic text={item.text} style={styles.transcriptText} />
              </View>
            )}
          />
        </View>

        {error ? <TextComp isDynamic text={error} style={styles.errorText} /> : null}

        <View style={styles.buttonGroup}>
          <ButtonComp
            title={isConnected ? 'VAPI_END_CALL' : 'VAPI_START_CALL'}
            onPress={isConnected ? stopCall : startCall}
            disabled={isStarting}
          />
          {isConnected ? (
            <ButtonComp
              title={isMuted ? 'VAPI_UNMUTE' : 'VAPI_MUTE'}
              onPress={toggleMute}
              variant="secondary"
            />
          ) : null}
        </View>

        <TextComp text="VAPI_HINT" style={styles.hint} />
      </View>
    </WrapperContainer>
  );
};

export default VoiceAssistant;
