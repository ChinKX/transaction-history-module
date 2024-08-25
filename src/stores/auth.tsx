import * as React from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

export const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export type AuthState = {
  status: 'unauthenticated' | 'authenticated' | 'inactive';
  lastActivity?: number;
};

export type AuthAction = {
  authenticate: () => Promise<void>;
  simpleAuthenticate: () => Promise<
    | {
        type: 'success';
      }
    | {
        type: 'failed';
        error: string;
      }
  >;
  setLastActivity: () => void;
  logout: () => void;
};

const AuthContext = React.createContext([
  {} as AuthState,
  {
    setLastActivity: () => {},
  } as AuthAction,
] as const);

export const AuthProvider: React.FunctionComponent<
  React.PropsWithChildren
> = props => {
  const [state, setState] = React.useState<AuthState>({
    status: 'unauthenticated',
    lastActivity: undefined,
  });

  React.useEffect(() => {
    if (state.status === 'authenticated') {
      const timer = setTimeout(
        () => setState(state => ({...state, status: 'inactive'})),
        15000,
      );
      return () => clearTimeout(timer);
    }
  }, [state.status, state.lastActivity]);

  React.useEffect(() => {
    if (state.status === 'inactive') {
      const timer = setTimeout(() => logout(), 15000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  const authenticate = async () => {
    const {success, error} = await rnBiometrics.simplePrompt({
      promptMessage: 'Log in with Biometrics',
    });
    if (error) {
      throw new Error(error);
    }
    if (success) {
      setState(state => ({
        ...state,
        status: 'authenticated',
      }));
      return;
    }
    throw new Error('User cancelled biometric prompt');
  };

  const simpleAuthenticate = async () => {
    const {success, error} = await rnBiometrics.simplePrompt({
      promptMessage: 'Log in with Biometrics',
    });
    if (error) {
      return {
        type: 'failed' as const,
        error,
      };
    }
    if (success) {
      return {type: 'success' as const};
    }
    return {
      type: 'failed' as const,
      error: 'User cancelled biometric prompt',
    };
  };

  const setLastActivity = () => {
    if (state.status === 'unauthenticated') {
      return;
    }
    setState(state => ({
      ...state,
      status: 'authenticated',
      lastActivity: Date.now(),
    }));
  };

  const logout = () => {
    setState(state => ({...state, status: 'unauthenticated'}));
  };

  return (
    <AuthContext.Provider
      value={[
        state,
        {
          authenticate,
          simpleAuthenticate,
          setLastActivity,
          logout,
        },
      ]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => React.useContext(AuthContext);
