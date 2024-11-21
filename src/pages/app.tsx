import { AppProps } from 'next/app';
import { BrowserRouter } from 'react-router-dom';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BrowserRouter>
      <Component {...pageProps} />
    </BrowserRouter>
  );
}

export default MyApp;
