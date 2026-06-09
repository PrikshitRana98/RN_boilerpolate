import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import WrapperContainer from '@/components/WrapperContainer';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { offlineStorage } from '@/utils/offlineStorage';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import useRTLStyles from './styles';

const OfflineStorage = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const { isConnected, isChecking } = useNetworkStatus();
  const [inputValue, setInputValue] = useState('');
  const [savedValue, setSavedValue] = useState<string | null>(null);

  useEffect(() => {
    setSavedValue(offlineStorage.getData());
  }, []);

  const handleSave = () => {
    if (!inputValue.trim()) {
      return;
    }

    offlineStorage.saveData(inputValue.trim());
    setSavedValue(inputValue.trim());
    setInputValue('');
  };

  const handleClear = () => {
    offlineStorage.clearData();
    setSavedValue(null);
    setInputValue('');
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
      <HeaderComp showBack title="OFFLINE_STORAGE" customStyle={styles.header} />

      <View style={styles.content}>
        <View style={[styles.networkIndicator, indicatorStyle]}>
          <View style={[styles.networkDot, dotStyle]} />
          <TextComp text={networkStatusKey} style={[styles.networkText, textStyle]} />
        </View>

        <TextComp text="OFFLINE_STORAGE_DESCRIPTION" style={styles.description} />

        <TextComp text="OFFLINE_STORAGE_INPUT_LABEL" style={styles.inputLabel} />
        <TextInputComp
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="WRITE_HERE"
        />

        <View style={styles.savedCard}>
          <TextComp text="OFFLINE_STORAGE_SAVED_LABEL" style={styles.savedLabel} />
          <TextComp
            isDynamic
            text={savedValue || '—'}
            style={styles.savedValue}
          />
        </View>

        <View style={styles.buttonGroup}>
          <ButtonComp
            title="OFFLINE_STORAGE_SAVE"
            onPress={handleSave}
            style={styles.button}
            disabled={!inputValue.trim()}
          />
          <ButtonComp
            title="OFFLINE_STORAGE_CLEAR"
            onPress={handleClear}
            variant="secondary"
            style={styles.button}
            disabled={!savedValue}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default OfflineStorage;
