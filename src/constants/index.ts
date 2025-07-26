import { LanguageData } from './language-data';

function reverseTransform(
  input: Record<string, Record<string, { key: string; en: string; vi: string }>>
) {
  const result: Record<string, Record<string, string>> = {};

  for (const group in input) {
    result[group] = {};

    for (const item in input[group]) {
      result[group][item] = input[group][item].key;
    }
  }

  return result;
}
export const LanguageKey = reverseTransform(LanguageData);

export const StoreName = {
  SERVER: 'server_store',
  SERVER_REPOSIROTY: 'server_repository_store',
  SERVER_SERVICE: 'server_service_store',
  SERVER_IMAGES: 'server_images_store',
  SERVER_CONTAINER: 'server_container_store',
  SERVER_NGINX: 'server_nginx_store',
  LANGUAGE: 'language_store',
  CATEGORY: 'category_store',
  MEDIA: 'media_store',
  SITE: 'site_store',
  SITE_CATEGORIES: 'site_categories_store',
  SITE_BLOG: 'site_blog_store',
  BOOK: 'book_store',
  BLOG: 'blog_store',
  BLOG_ARCHIVED: 'blog_archived_store',
  BLOG_UNUSED: 'blog_unused_store',
  BLOG_TRENDING: 'blog_trending_store',

  GOOGLE_INDEXING: 'google_indexing_store',
  GOOGLE_SITEMAP: 'google_sitemap_store',
  GOOGLE_WEBSITE: 'google_website_store',
  GOOGLE_LOGS: 'google_logs_store',

  // USER
  USER_DETAIL: 'user_detail_store',
  USER_LIST_CATEGORY: 'user_list_category_store',
  USER_LIST_POST: 'user_list_post_store',
  USER_LIST_SITE: 'user_list_site_store',
  USER_LIST: 'user_list_store',
  BATCH_LOGS: 'batch_logs_list_store',
  ROLE_LIST: 'user_role_list_store',
  ROLE_DETAIL: 'user_role_detail_store',
};

export const Breadcrumbs = {
  COLOR: {
    items: [{ href: '/color', title: LanguageKey.common.listTitle }],
  },
  SERVER_LIST: {
    items: [{ href: '/server', title: LanguageKey.common.listTitle }],
  },
  SERVER_DETAIL: {
    items: [{ title: LanguageKey.common.listTitle }, { title: LanguageKey.common.detailTitle }],
  },

  PROFILE: {
    items: [{ href: '/profile', title: LanguageKey.user.profileTitle }],
  },
  LANGUAGE_LIST: {
    items: [{ href: '/language', title: LanguageKey.common.listTitle }],
  },
};

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const SubjectConfig = {
  USERS: 'users',
  GOOGLE: 'google',
  SERVERS: 'servers',
  ROLES: 'roles',
  POSTS: 'posts',
  BOOKS: 'books',
  SITES: 'sites',
  CATEGORIES: 'categories',
  CHAPTERS: 'chapters',
  MEDIA: 'media ',
  TRENDINGS: 'trendings',
};
