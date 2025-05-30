import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { PageLoading } from './components/loading';
import i18n from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <I18nextProvider i18n={i18n}>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoading isLoading />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </I18nextProvider>
);
