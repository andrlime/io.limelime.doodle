import '../styles/globals.css';
import React, { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  return <SafeHydrate><Component {...pageProps} /></SafeHydrate>;
};

const SafeHydrate: FunctionComponent<{children: any}> = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

export default App;
