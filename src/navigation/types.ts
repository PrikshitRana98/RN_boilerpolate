export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  OfflineStorage: undefined;
  OfflinePost: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
};

export type MainStackParamList = {
  Home: undefined;
  Timer: undefined;
  Voice: undefined;
  Profile: undefined;
  Settings: undefined;
}; 