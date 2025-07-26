import { Masonry } from '@mui/lab';
import { Box, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import {
  PATH_ANALYTICS_CATEGORY_BOOKS,
  PATH_ANALYTICS_CATEGORY_NEWS,
  PATH_ANALYTICS_GOOGLE_INDEXED,
  PATH_ANALYTICS_GOOGLE_SEARCH_STATUS,
  PATH_ANALYTICS_POST,
  PATH_ANALYTICS_SITE,
  PATH_ANALYTICS_SOURCE,
} from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';

import { Scrollbar } from 'src/components/scrollbar';
import { LanguageKey } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsNews } from '../analytics-news';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

type workspacesType = 'wp_books' | 'wp_news' | 'wp_system';

export function OverviewAnalyticsView() {
  const defaultWorkspaces = (localStorage.getItem('workspaces') || 'wp_system') as workspacesType;
  const [workspace, setWorkspace] = useState<workspacesType>(defaultWorkspaces);
  const theme = useTheme();

  useEffect(() => {
    const handleStorageChange = () => {
      const newWorkspaces = (localStorage.getItem('workspaces') ||
        defaultWorkspaces) as workspacesType;
      setWorkspace(newWorkspaces);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [defaultWorkspaces]);

  return (
    <Scrollbar sx={{ maxHeight: '100%', overflowX: 'hidden' }}>
      <DashboardContent maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
            borderRadius: 3,
            p: 4,
            m: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t(LanguageKey.home.title)}
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            {t(LanguageKey.home.description)}
          </Typography>
        </Box>

        <Box display="flex" m={1} gap={3} flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}>
          {workspace === 'wp_books' && (
            <AnalyticsWidgetSummary
              workspace={workspace}
              title={t(LanguageKey.home.bookSumary)}
              icon={<Iconify width={40} icon="fa6-solid:blog" />}
              baseUrl={PATH_ANALYTICS_POST}
            />
          )}
          {workspace === 'wp_news' && (
            <AnalyticsWidgetSummary
              workspace={workspace}
              title={t(LanguageKey.home.postSummary)}
              icon={<Iconify width={40} icon="fa6-solid:blog" />}
              baseUrl={PATH_ANALYTICS_POST}
            />
          )}
          {workspace === 'wp_system' && (
            <AnalyticsWidgetSummary
              workspace={workspace}
              title={t(LanguageKey.home.contentSumary)}
              icon={<Iconify width={40} icon="fa6-solid:blog" />}
              baseUrl={PATH_ANALYTICS_POST}
            />
          )}

          <AnalyticsWidgetSummary
            workspace={workspace}
            baseUrl={PATH_ANALYTICS_SITE}
            title={t(LanguageKey.home.siteSummary)}
            color="warning"
            icon={<Iconify width={40} icon="ooui:references-ltr" />}
          />

          <AnalyticsWidgetSummary
            workspace={workspace}
            title={t(LanguageKey.home.googleConsoleSummary)}
            baseUrl={PATH_ANALYTICS_GOOGLE_INDEXED}
            color="error"
            icon={<Iconify width={40} icon="logos:google-play-console-icon" />}
          />
        </Box>

        <Box display="flex" mt={1} flexDirection="column" alignItems="center">
          <Masonry columns={{ xs: 1, sm: 1, md: 2 }} spacing={3}>
            <AnalyticsConversionRates
              workspace={workspace}
              baseUrl={PATH_ANALYTICS_SOURCE}
              title={t(LanguageKey.home.sourceSummaryTitle)}
              description={t(LanguageKey.home.sourceSummaryDescription)}
            />
            <AnalyticsCurrentVisits
              workspace={workspace}
              title={t(LanguageKey.home.googleSearchStatusChart)}
              baseUrl={PATH_ANALYTICS_GOOGLE_SEARCH_STATUS}
            />
            <AnalyticsNews
              title={t(LanguageKey.home.trendingSummary)}
              subheader="Latest trending topics and discussions"
            />
            {(workspace === 'wp_news' || workspace === 'wp_system') && (
              <AnalyticsConversionRates
                baseUrl={PATH_ANALYTICS_CATEGORY_NEWS}
                title={t(LanguageKey.home.categoryNewsSummary)}
              />
            )}
            {(workspace === 'wp_books' || workspace === 'wp_system') && (
              <AnalyticsConversionRates
                baseUrl={PATH_ANALYTICS_CATEGORY_BOOKS}
                title={t(LanguageKey.home.categoryBooksSummary)}
              />
            )}
          </Masonry>
        </Box>
      </DashboardContent>
    </Scrollbar>
  );
}
