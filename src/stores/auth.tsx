import * as React from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

export const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export type AuthState = {
  status: 'unauthenticated' | 'authenticated' | 'inactive';
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
  logout: () => void;
};

const AuthContext = React.createContext([
  {} as AuthState,
  {} as AuthAction,
] as const);

export const AuthProvider: React.FunctionComponent<
  React.PropsWithChildren
> = props => {
  const [state, setState] = React.useState<AuthState>({
    status: 'unauthenticated',
  });

  const authenticate = async () => {
    const {success, error} = await rnBiometrics.simplePrompt({
      promptMessage: 'Log in with Biometrics',
    });
    if (error) {
      throw new Error(error);
    }
    if (success) {
      setState(state => ({...state, status: 'authenticated'}));
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
          logout,
        },
      ]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => React.useContext(AuthContext);
