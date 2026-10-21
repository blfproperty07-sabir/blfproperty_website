import React from 'react';
import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const [clientId, setClientId] = useState(null);
  const [configurationError, setConfigurationError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    fetch(`${apiUrl}/config/google-auth`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Google sign-in configuration request failed (${response.status}).`);
        }
        return response.json();
      })
      .then((configuration) => {
        if (!isMounted) return;
        const configuredClientId = configuration.clientId?.trim() || process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim();
        setClientId(configuredClientId || '');
        if (!configuredClientId) {
          setConfigurationError('Google sign-in needs a client ID in backend/.env.');
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Could not load Google sign-in configuration:', error);
        setClientId('');
        setConfigurationError('Could not load Google sign-in configuration. Check that the backend is running.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!clientId) {
    return (
      <div className="text-center">
        <button
          type="button"
          disabled
          className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-400"
        >
          <span aria-hidden="true" className="text-lg font-bold">G</span>
          Continue with Google
        </button>
        <p className="mt-2 text-xs text-slate-500">
          {clientId === null ? 'Loading Google sign-in…' : configurationError}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={(response) => {
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError('Google did not return an identity credential. Please try again.');
            }
          }}
          onError={() => onError('Google sign-in could not be completed. Please try again.')}
          theme="outline"
          shape="rectangular"
          size="large"
          text="continue_with"
          width="360"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleSignInButton;
