import ButtonComp from '@/components/ButtonComp';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import { useTimer } from '@/context/TimerContext';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import React from 'react';
import { View } from 'react-native';
import useRTLStyles from './styles';

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

const Timer = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const { elapsed, isRunning, toggleTimer, resetTimer } = useTimer();

  return (
    <WrapperContainer style={styles.container} edges={['top']}>
      <HeaderComp showBack={false} title="TIMER" />

      <View style={styles.content}>
        <View style={styles.displayCard}>
          <TextComp isDynamic text={formatTime(elapsed)} style={styles.timerDisplay} />
          <TextComp
            text={isRunning ? 'TIMER_RUNNING' : 'TIMER_STOPPED'}
            style={styles.statusText}
          />
        </View>

        <View style={styles.buttonGroup}>
          <ButtonComp
            title={isRunning ? 'TIMER_STOP' : 'TIMER_START'}
            onPress={toggleTimer}
          />
          <ButtonComp title="TIMER_RESET" onPress={resetTimer} variant="secondary" />
        </View>

        <TextComp text="TIMER_BACKGROUND_HINT" style={styles.hint} />
      </View>
    </WrapperContainer>
  );
};

export default Timer;
