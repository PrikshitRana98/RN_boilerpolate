import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  dismissRunningTimerNotification,
  ensureTimerNotificationPermission,
  showRunningTimerNotification,
  updateRunningTimerNotification,
} from '@/helper/timerNotificationService';

interface TimerContextType {
  elapsed: number;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const isLeavingForeground = (
  previousState: AppStateStatus,
  nextState: AppStateStatus,
) => previousState === 'active' && nextState !== 'active';

const isReturningToForeground = (
  previousState: AppStateStatus,
  nextState: AppStateStatus,
) => previousState !== 'active' && nextState === 'active';

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const baseElapsedRef = useRef(0);
  const runningSinceRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const notificationVisibleRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const computeElapsed = useCallback(() => {
    if (runningSinceRef.current === null) {
      return baseElapsedRef.current;
    }

    return (
      baseElapsedRef.current +
      Math.floor((Date.now() - runningSinceRef.current) / 1000)
    );
  }, []);

  const syncElapsedToState = useCallback(() => {
    setElapsed(computeElapsed());
  }, [computeElapsed]);

  const presentBackgroundNotification = useCallback(() => {
    if (runningSinceRef.current === null || notificationVisibleRef.current) {
      return;
    }

    notificationVisibleRef.current = true;
    showRunningTimerNotification(
      baseElapsedRef.current,
      runningSinceRef.current,
    );
  }, []);

  const hideBackgroundNotification = useCallback(() => {
    if (!notificationVisibleRef.current) {
      return;
    }

    notificationVisibleRef.current = false;
    dismissRunningTimerNotification();
  }, []);

  const syncBackgroundNotification = useCallback(() => {
    if (
      runningSinceRef.current === null ||
      appStateRef.current === 'active' ||
      !notificationVisibleRef.current
    ) {
      return;
    }

    updateRunningTimerNotification(
      baseElapsedRef.current,
      runningSinceRef.current,
    );
  }, []);

  useEffect(() => {
    ensureTimerNotificationPermission();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const previousState = appStateRef.current;

      if (
        isLeavingForeground(previousState, nextState) &&
        runningSinceRef.current !== null
      ) {
        presentBackgroundNotification();
      } else if (isReturningToForeground(previousState, nextState)) {
        hideBackgroundNotification();

        if (runningSinceRef.current !== null) {
          syncElapsedToState();
        }
      }

      appStateRef.current = nextState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [presentBackgroundNotification, hideBackgroundNotification, syncElapsedToState]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    syncElapsedToState();
    intervalRef.current = setInterval(() => {
      syncElapsedToState();
      syncBackgroundNotification();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, syncElapsedToState, syncBackgroundNotification]);

  const toggleTimer = async () => {
    if (isRunning) {
      baseElapsedRef.current = computeElapsed();
      runningSinceRef.current = null;
      setIsRunning(false);
      setElapsed(baseElapsedRef.current);
      hideBackgroundNotification();
      return;
    }

    await ensureTimerNotificationPermission();
    runningSinceRef.current = Date.now();
    setIsRunning(true);

    if (appStateRef.current !== 'active') {
      presentBackgroundNotification();
    }
  };

  const resetTimer = () => {
    baseElapsedRef.current = 0;
    runningSinceRef.current = null;
    setElapsed(0);
    setIsRunning(false);
    hideBackgroundNotification();
  };

  return (
    <TimerContext.Provider value={{ elapsed, isRunning, toggleTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};
