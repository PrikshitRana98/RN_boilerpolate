import { isVapiConfigured, VAPI_CONFIG } from '@/config/vapi';
import { useVapiClient } from '@/context/VapiContext';
import { useCallback, useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

export type VapiTranscript = {
  role: string;
  text: string;
};

const requestMicrophonePermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone Permission',
      message: 'This app needs microphone access for voice calls',
      buttonPositive: 'OK',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const useVapiCall = () => {
  const vapi = useVapiClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [transcripts, setTranscripts] = useState<VapiTranscript[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onCallStart = () => {
      setIsConnected(true);
      setIsStarting(false);
      setError(null);
    };

    const onCallEnd = () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setIsStarting(false);
      setIsMuted(false);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onMessage = (message: {
      type?: string;
      role?: string;
      transcript?: string;
    }) => {
      if (message.type === 'transcript' && message.transcript) {
        const transcript = message.transcript;
        setTranscripts((prev) => [
          ...prev,
          {
            role: message.role ?? 'assistant',
            text: transcript,
          },
        ]);
      }
    };

    const onError = (err: { message?: string }) => {
      setError(err?.message ?? 'Voice call failed');
      setIsStarting(false);
    };

    const onCallStartFailed = (event: { error?: string }) => {
      setError(event.error ?? 'Failed to start call');
      setIsStarting(false);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);
    vapi.on('call-start-failed', onCallStartFailed);

    return () => {
      vapi.removeListener('call-start', onCallStart);
      vapi.removeListener('call-end', onCallEnd);
      vapi.removeListener('speech-start', onSpeechStart);
      vapi.removeListener('speech-end', onSpeechEnd);
      vapi.removeListener('message', onMessage);
      vapi.removeListener('error', onError);
      vapi.removeListener('call-start-failed', onCallStartFailed);
    };
  }, [vapi]);

  const startCall = useCallback(async () => {
    if (!isVapiConfigured()) {
      Alert.alert('Configure Vapi', 'Add your Vapi API key and assistant ID in src/config/vapi.ts');
      return;
    }

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setError('Microphone permission denied');
      return;
    }

    setIsStarting(true);
    setTranscripts([]);
    setError(null);

    try {
      await vapi.start(VAPI_CONFIG.ASSISTANT_ID);
    } catch (err) {
      setIsStarting(false);
      setError(err instanceof Error ? err.message : 'Failed to start call');
    }
  }, [vapi]);

  const stopCall = useCallback(() => {
    vapi.stop();
  }, [vapi]);

  const toggleMute = useCallback(() => {
    const nextMuted = !vapi.isMuted();
    vapi.setMuted(nextMuted);
    setIsMuted(nextMuted);
  }, [vapi]);

  return {
    isConnected,
    isSpeaking,
    isStarting,
    transcripts,
    isMuted,
    error,
    startCall,
    stopCall,
    toggleMute,
  };
};
