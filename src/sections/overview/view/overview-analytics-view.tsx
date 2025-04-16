import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsNews } from '../analytics-news';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';
import { Iconify } from 'src/components/iconify';
import {
  PATH_ANALYTICS_CATEGORY,
  PATH_ANALYTICS_GOOGLE_INDEXED,
  PATH_ANALYTICS_GOOGLE_SEARCH_STATUS,
  PATH_ANALYTICS_KEYWORD,
  PATH_ANALYTICS_POST,
  PATH_ANALYTICS_SITE,
  PATH_ANALYTICS_SOURCE,
  PATH_ANALYTICS_TRENDING,
} from 'src/api-core/path';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { Box, Paper } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent maxWidth="xl">
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={t(LanguageKey.home.postSummary)}
              icon={<Iconify width={40} icon="fa6-solid:blog" />}
              baseUrl={PATH_ANALYTICS_POST}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              baseUrl={PATH_ANALYTICS_TRENDING}
              title={t(LanguageKey.home.trendingSummary)}
              color="secondary"
              icon={<Iconify width={40} icon="fluent-color:arrow-trending-lines-24" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              baseUrl={PATH_ANALYTICS_SITE}
              title={t(LanguageKey.home.siteSummary)}
              color="warning"
              icon={<Iconify width={40} icon="ooui:references-ltr" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={t(LanguageKey.home.googleConsoleSummary)}
              baseUrl={PATH_ANALYTICS_GOOGLE_INDEXED}
              color="error"
              icon={<Iconify width={40} icon="logos:google-play-console-icon" />}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              baseUrl={PATH_ANALYTICS_SOURCE}
              title={t(LanguageKey.home.sourceSummary)}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title={t(LanguageKey.home.googleSearchStatusChart)}
              baseUrl={PATH_ANALYTICS_GOOGLE_SEARCH_STATUS}
            />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <AnalyticsConversionRates
              baseUrl={PATH_ANALYTICS_CATEGORY}
              title={t(LanguageKey.home.categorySummary)}
            />
          </Grid>
        </Grid>
      </DashboardContent>
    </Scrollbar>
  );
}
