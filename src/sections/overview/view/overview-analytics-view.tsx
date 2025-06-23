import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { t } from 'i18next';
import {
  PATH_ANALYTICS_CATEGORY_BOOKS,
  PATH_ANALYTICS_CATEGORY_NEWS,
  PATH_ANALYTICS_GOOGLE_INDEXED,
  PATH_ANALYTICS_GOOGLE_SEARCH_STATUS,
  PATH_ANALYTICS_POST,
  PATH_ANALYTICS_SITE,
  PATH_ANALYTICS_SOURCE,
  PATH_ANALYTICS_TRENDING,
} from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const defaultWorkspaces = localStorage.getItem('workspaces') as workspacesType;
  const [workspace, setWorkspace] = useState<workspacesType>(defaultWorkspaces);

  useEffect(() => {
    const handleStorageChange = () => {
      const newWorkspaces = (localStorage.getItem('workspaces') ||
        defaultWorkspaces) as workspacesType;

      setWorkspace(newWorkspaces);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [defaultWorkspaces]);

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent maxWidth="xl">
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>
          {workspace == 'wp_books' && (
            <Grid xs={12} sm={4} md={4}>
              <AnalyticsWidgetSummary
                workspace={workspace}
                title={t(LanguageKey.home.bookSumary)}
                icon={<Iconify width={40} icon="fa6-solid:blog" />}
                baseUrl={PATH_ANALYTICS_POST}
              />
            </Grid>
          )}

          {workspace == 'wp_news' && (
            <Grid xs={12} sm={4} md={4}>
              <AnalyticsWidgetSummary
                workspace={workspace}
                title={t(LanguageKey.home.postSummary)}
                icon={<Iconify width={40} icon="fa6-solid:blog" />}
                baseUrl={PATH_ANALYTICS_POST}
              />
            </Grid>
          )}
          {workspace == 'wp_system' && (
            <Grid xs={12} sm={4} md={4}>
              <AnalyticsWidgetSummary
                workspace={workspace}
                title={t(LanguageKey.home.contentSumary)}
                icon={<Iconify width={40} icon="fa6-solid:blog" />}
                baseUrl={PATH_ANALYTICS_POST}
              />
            </Grid>
          )}

          {/* <Grid xs={12} sm={4} md={3}>
            <AnalyticsWidgetSummary
              workspace={workspace}
              baseUrl={PATH_ANALYTICS_TRENDING}
              title={t(LanguageKey.home.trendingSummary)}
              color="secondary"
              icon={<Iconify width={40} icon="fluent-color:arrow-trending-lines-24" />}
            />
          </Grid> */}

          <Grid xs={12} sm={4} md={4}>
            <AnalyticsWidgetSummary
              workspace={workspace}
              baseUrl={PATH_ANALYTICS_SITE}
              title={t(LanguageKey.home.siteSummary)}
              color="warning"
              icon={<Iconify width={40} icon="ooui:references-ltr" />}
            />
          </Grid>

          <Grid xs={12} sm={4} md={4}>
            <AnalyticsWidgetSummary
              workspace={workspace}
              title={t(LanguageKey.home.googleConsoleSummary)}
              baseUrl={PATH_ANALYTICS_GOOGLE_INDEXED}
              color="error"
              icon={<Iconify width={40} icon="logos:google-play-console-icon" />}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              workspace={workspace}
              baseUrl={PATH_ANALYTICS_SOURCE}
              title={t(LanguageKey.home.sourceSummary)}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              workspace={workspace}
              title={t(LanguageKey.home.googleSearchStatusChart)}
              baseUrl={PATH_ANALYTICS_GOOGLE_SEARCH_STATUS}
            />
          </Grid>

          {(workspace == 'wp_news' || workspace == 'wp_system') && (
            <Grid xs={12} md={12} lg={12}>
              <AnalyticsConversionRates
                baseUrl={PATH_ANALYTICS_CATEGORY_NEWS}
                title={t(LanguageKey.home.categoryNewsSummary)}
              />
            </Grid>
          )}
          {(workspace == 'wp_books' || workspace == 'wp_system') && (
            <Grid xs={12} md={12} lg={12}>
              <AnalyticsConversionRates
                baseUrl={PATH_ANALYTICS_CATEGORY_BOOKS}
                title={t(LanguageKey.home.categoryBooksSummary)}
              />
            </Grid>
          )}
        </Grid>
      </DashboardContent>
    </Scrollbar>
  );
}
