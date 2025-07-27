export const LanguageData: Record<
  string,
  Record<string, { key: string; en: string; vi: string }>
> = {
  chart: {
    filter: { key: 'chart_filter_title', en: 'Filter', vi: 'Bộ lọc' },
    searchLabel: { key: 'chart_search_label', en: 'Search text', vi: 'Tìm kiếm' },
    sortBy: { key: 'chart_sort_by', en: 'Sort By', vi: 'Sắp xếp theo' },
    sortByStt: { key: 'chart_sort_by_stt_title', en: 'Sort by index', vi: 'Thứ tự gốc' },
    sortByType: { key: 'chart_sort_by_type_title', en: 'Sort by type', vi: 'Tên' },
    sortByNumber: { key: 'chart_sort_by_number_title', en: 'Sort by number', vi: 'Số lượng' },
    sortOrderTitle: { key: 'chart_sort_order_title', en: 'STT', vi: 'Thứ tự' },
    ascTitle: { key: 'chart_asc_title', en: 'Asc', vi: 'Tăng dần' },
    descTitle: { key: 'chart_desc_title', en: 'Desc', vi: 'Giảm dần' },
    clearFilterTitle: { key: 'chart_clear_filter_title', en: 'Clear Filter', vi: 'Xoá bộ lọc' },
    rangeTitle: {
      key: 'chart_range_title',
      en: 'Range: {min} - {max}',
      vi: 'Khoảng giá trị: {min} - {max}',
    },
    totalTitle: { key: 'chart_show_title', en: 'Total: {number}', vi: 'Tổng số: {number}' },
    exportCsv: { key: 'chart_export_csv', en: 'Export CSV', vi: 'Tải CSV' },
    showLabel: { key: 'chart_show_label', en: 'Show data label', vi: 'Hiện nhãn dữ liệu' },
    hideLabel: { key: 'chart_hide_label', en: 'Hide data label', vi: 'Ẩn nhãn dữ liệu' },
    resetButton: { key: 'chart_reset_button', en: 'Reset Chart', vi: 'Làm mới biểu đồ' },
  },
  batchLogs: {
    finishedAtItem: {
      key: 'batch_finished_at_item',
      en: 'Finished At',
      vi: 'Kết thúc',
    },
    idItem: {
      key: 'batch_id_item',
      en: 'ID',
      vi: 'ID',
    },
    jobNameItem: {
      key: 'batch_job_name_item',
      en: 'Batch Name',
      vi: 'Tên mã',
    },
    jobSourceItem: {
      key: 'batch_job_source_item',
      en: 'Batch Source',
      vi: 'Source',
    },
    listPageTitle: {
      key: 'batch_list_page',
      en: 'Server Logs',
      vi: 'Server Logs',
    },
    messageItem: {
      key: 'batch_message_item',
      en: 'Message',
      vi: 'Message',
    },
    scheduledAtItem: {
      key: 'batch_scheduled_at_item',
      en: 'Scheduled At',
      vi: 'Lịch',
    },
    startedAtItem: {
      key: 'batch_started_at_item',
      en: 'Started At',
      vi: 'Bắt đầu',
    },
    statusItem: {
      key: 'batch_status_item',
      en: 'Status',
      vi: 'Trạng thái',
    },
  },
  blog: {
    addNewButton: {
      key: 'blog_new_button',
      en: 'New Blog',
      vi: 'Thêm Blog',
    },
    blogArchivedDescription: {
      key: 'blog_archived_description',
      en: 'Old blogs not indexed or removed from index',
      vi: 'Blog cũ không còn index hoặc đã bị gỡ bỏ',
    },
    blogTrendingDescription: {
      key: 'blog_trending_description',
      en: 'Trending blogs from search data',
      vi: 'Blog xu hướng từ dữ liệu tìm kiếm',
    },
    blogUnusedDescription: {
      key: 'blog_unsed_description',
      en: 'Blogs no longer used on any site',
      vi: 'Blog không còn được dùng ở bất kỳ site nào',
    },
    categoryItem: {
      key: 'blog_category_item',
      en: 'Categories',
      vi: 'Danh mục',
    },
    contentItem: {
      key: 'blog_content_item',
      en: 'Content',
      vi: 'Nội dung',
    },
    descriptionItem: {
      key: 'blog_description_item',
      en: 'Description',
      vi: 'Mô tả',
    },
    detailPageTitle: {
      key: 'blog_detail_page',
      en: 'Blog Detail',
      vi: 'Chi tiết blog',
    },
    detailTitle: {
      key: 'blog_detail_title',
      en: 'Blog Detail',
      vi: 'Chi tiết blog',
    },
    draftButton: {
      key: 'draft_button',
      en: 'Draft',
      vi: 'Draft',
    },
    keywordsItem: {
      key: 'blog_keywords_item',
      en: 'Keywords',
      vi: 'Từ khóa',
    },
    listPageTitle: {
      key: 'blog_list_page',
      en: 'Blog List',
      vi: 'Danh sách blog',
    },
    publicButton: {
      key: 'public_button',
      en: 'Public',
      vi: 'Public',
    },
    siteItem: {
      key: 'blog_site_item',
      en: 'Sites',
      vi: 'Trang web',
    },
    slugItem: {
      key: 'blog_detail_slug',
      en: 'Slug',
      vi: 'Slug',
    },
    statusItem: {
      key: 'blog_status_item',
      en: 'Status',
      vi: 'Trạng thái',
    },
    tableTitle: {
      key: 'blog_table_title',
      en: 'Blogs',
      vi: 'Blog',
    },
    titleItem: {
      key: 'blog_title_item',
      en: 'Title',
      vi: 'Tiêu đề',
    },
  },
  book: {
    bookAudio: {
      key: 'book_audio_nav',
      en: 'Audio',
      vi: 'Truyện Nói',
    },
    categoryItem: {
      key: 'book_category_item',
      en: 'Category',
      vi: 'Danh mục',
    },
    chapterItem: {
      key: 'book_chapter_item',
      en: 'Chapter',
      vi: 'Chương',
    },
    contentItem: {
      key: 'book_content_item',
      en: 'Content',
      vi: 'Nội Dung',
    },
    descriptionItem: {
      key: 'book_description_item',
      en: 'Description',
      vi: 'Mô tả',
    },
    detailPageTitle: {
      key: 'book_detail_page',
      en: 'Book',
      vi: 'Book',
    },
    draftButton: {
      key: 'draft_button',
      en: 'Draft',
      vi: 'Draft',
    },
    fullStatus: {
      key: 'book_full_status',
      en: 'Full',
      vi: 'Hoàn thành',
    },
    generateGeminiButton: {
      key: 'book_generate_gemini_button',
      en: 'GEMINI GENERATE',
      vi: 'GEMINI GENERATE',
    },
    gemimiGenerate: {
      key: 'book_gemimi_generate',
      en: 'AI will rewriter title, description, keywords, chapters and content SEO',
      vi: 'AI Sẽ làm mới các tiêu đề, mô tả, từ khoá, chương và các nội dung liên quan tới SEO',
    },
    hotStatus: {
      key: 'book_hot_status',
      en: 'Hot',
      vi: 'Nổi bật',
    },
    keywordItem: {
      key: 'book_keywords_item',
      en: 'Keywords',
      vi: 'Từ khoá',
    },
    listPageTitle: {
      key: 'book_list_page',
      en: 'Books',
      vi: 'Books',
    },
    metaDescriptionItem: {
      key: 'book_meta_description_item',
      en: 'Description',
      vi: 'Mô Tả',
    },
    newStatus: {
      key: 'book_new_status',
      en: 'New',
      vi: 'Mới',
    },
    publicButton: {
      key: 'public_button',
      en: 'Public',
      vi: 'Public',
    },
    siteItem: {
      key: 'book_site_item',
      en: 'Site',
      vi: 'Site',
    },
    slugItem: {
      key: 'book_slug_item',
      en: 'Slug',
      vi: 'Slug',
    },
    sourceUrlItem: {
      key: 'book_source_url_item',
      en: 'Source',
      vi: 'Nguồn',
    },
    statusItem: {
      key: 'book_status_item',
      en: 'Status',
      vi: 'Trạng Thái',
    },
    thumbnailItem: {
      key: 'book_thumbnail_item',
      en: 'Thumbnail',
      vi: 'Ảnh bìa',
    },
    titleItem: {
      key: 'book_title_item',
      en: 'Title',
      vi: 'Tiêu Đề',
    },
    totalChapterItem: {
      key: 'book_total_chapter_item',
      en: 'Total Chapter',
      vi: 'Tổng số chương',
    },
    voiceItem: {
      key: 'book_voice_item',
      en: 'Voice',
      vi: 'Voice',
    },
  },
  button: {
    accept: {
      key: 'accept_button',
      en: 'OK',
      vi: 'OK',
    },
    back: {
      key: 'back_button',
      en: 'Back',
      vi: 'Trở về',
    },
    cancel: {
      key: 'cancel_button',
      en: 'Cancel',
      vi: 'Hủy',
    },
    clone: {
      key: 'clone_button',
      en: 'Clone',
      vi: 'Sao chép kho',
    },
    create: {
      key: 'create_button',
      en: 'Create',
      vi: 'Tạo mới',
    },
    delete: {
      key: 'delete_button',
      en: 'Delete',
      vi: 'Xóa',
    },
    detail: {
      key: 'detail_button',
      en: 'Detail',
      vi: 'Chi tiết',
    },
    discard: {
      key: 'discard_button',
      en: 'Discard',
      vi: 'Huỷ',
    },
    login: {
      key: 'login_button',
      en: 'Log in',
      vi: 'Đăng nhập',
    },
    logout: {
      key: 'logout_button',
      en: 'Logout',
      vi: 'Đăng xuất',
    },
    needHelp: {
      key: 'need_help_button',
      en: 'Need help',
      vi: 'Cần trợ giúp',
    },
    pull: {
      key: 'pull_button',
      en: 'Pull',
      vi: 'Kéo mã nguồn',
    },
    register: {
      key: 'register_button',
      en: 'Register',
      vi: 'Đăng ký',
    },
    save: {
      key: 'save_button',
      en: 'Save',
      vi: 'Lưu',
    },
    saveChanges: {
      key: 'save_changes_button',
      en: 'Save Changes',
      vi: 'Lưu thay đổi',
    },
    signup: {
      key: 'signup_button',
      en: 'Sign up',
      vi: 'Đăng ký',
    },
    submit: {
      key: 'submit_button',
      en: 'Submit',
      vi: 'Gửi',
    },
    update: {
      key: 'update_button',
      en: 'Update',
      vi: 'Cập nhật',
    },
  },
  category: {
    booksItem: {
      key: 'category_books_item',
      en: 'Books',
      vi: 'Sách, Truyện',
    },
    descriptionItem: {
      key: 'category_description_item',
      en: 'Description',
      vi: 'Mô tả',
    },
    nameItem: {
      key: 'category_name_item',
      en: 'Name',
      vi: 'Tên',
    },
    postsItem: {
      key: 'category_posts_item',
      en: 'Posts',
      vi: 'Bài viết',
    },
    sitesItem: {
      key: 'category_sites_item',
      en: 'Sites',
      vi: 'Trang web',
    },
    slugItem: {
      key: 'category_slug_item',
      en: 'Slug',
      vi: 'Slug',
    },
    addNewButton: {
      key: 'category_new_button',
      en: 'Add New',
      vi: 'Thêm mới',
    },
    listPageTitle: {
      key: 'category_list_page',
      en: 'Category List',
      vi: 'Danh sách danh mục',
    },
  },
  common: {
    and: {
      key: 'and',
      en: 'AND',
      vi: 'VÀ',
    },
    contrastTitle: {
      key: 'contrast_title',
      en: 'Contrast',
      vi: 'Độ tương phản',
    },
    copied: {
      key: 'copied',
      en: 'Copied',
      vi: 'Đã sao chép',
    },
    copyClipboard: {
      key: 'copy_clipboard',
      en: 'Copy to clipboard',
      vi: 'Sao chép vào bộ nhớ tạm',
    },
    createdAtItem: {
      key: 'created_at_item',
      en: 'Created At',
      vi: 'Created At',
    },
    createdByItem: {
      key: 'created_by_item',
      en: 'Created By',
      vi: 'Created By',
    },
    dataNotFound: {
      key: 'data_not_found',
      en: 'Sorry, data not found',
      vi: 'Không tìm thấy dữ liệu',
    },
    darkModeTitle: {
      key: 'dark_mode_title',
      en: 'Dark Mode',
      vi: 'Chế độ tối',
    },
    detailTitle: {
      key: 'detail_title',
      en: 'Detail',
      vi: 'Chi tiết',
    },
    false: {
      key: 'false',
      en: 'FALSE',
      vi: 'FALSE',
    },
    lightModeTitle: {
      key: 'light_mode_title',
      en: 'Light Mode',
      vi: 'Chế độ sáng',
    },
    listTitle: {
      key: 'list_title',
      en: 'List',
      vi: 'Danh sách',
    },
    of: {
      key: 'of',
      en: 'OF',
      vi: 'CỦA',
    },
    or: {
      key: 'or',
      en: 'OR',
      vi: 'HOẶC',
    },
    presetTitle: {
      key: 'preset_title',
      en: 'Preset',
      vi: 'Giao diện',
    },
    readMore: {
      key: 'read_more',
      en: 'View more',
      vi: 'Xem thêm',
    },
    readShowless: {
      key: 'read_showless',
      en: 'Show less',
      vi: 'Thu gọn',
    },
    settingTitle: {
      key: 'setting_title',
      en: 'Settings',
      vi: 'Cài đặt',
    },
    systemModeTitle: {
      key: 'system_mode_title',
      en: 'System Mode',
      vi: 'Theo hệ thống',
    },
    true: {
      key: 'true',
      en: 'TRUE',
      vi: 'TRUE',
    },
    viewAll: {
      key: 'view_all',
      en: 'View All',
      vi: 'Tất cả',
    },
  },
  dashboard: {
    pageTitle: {
      key: 'dashboard_page',
      en: 'Dashboard',
      vi: 'Bảng điều khiển',
    },
  },
  docker: {
    containerIdItem: {
      key: 'docker_container_id_item',
      en: 'Id',
      vi: 'Id',
    },
    containerImagesItem: {
      key: 'docker_container_images_item',
      en: 'Image',
      vi: 'Ảnh',
    },
    containerNameItem: {
      key: 'docker_container_name_item',
      en: 'Container',
      vi: 'Tên container',
    },
    containerPortsItem: {
      key: 'docker_container_ports_item',
      en: 'Ports',
      vi: 'Cổng',
    },
    containerStateItem: {
      key: 'docker_container_state_item',
      en: 'State',
      vi: 'Trạng thái',
    },
    containerStatusItem: {
      key: 'docker_container_status_item',
      en: 'Status',
      vi: 'Trạng thái',
    },
    imageCreatedItem: {
      key: 'docker_image_created_item',
      en: 'Created',
      vi: 'Ngày tạo',
    },
    imageIdItem: {
      key: 'docker_image_id_item',
      en: 'Id',
      vi: 'Id',
    },
    imageNameItem: {
      key: 'docker_image_name_item',
      en: 'Image',
      vi: 'Tên ảnh',
    },
    imageRun: {
      key: 'docker_image_run',
      en: 'Run',
      vi: 'Chạy',
    },
    imageSizeItem: {
      key: 'docker_image_size_item',
      en: 'Size',
      vi: 'Kích thước',
    },
    imageStatusItem: {
      key: 'docker_image_status_item',
      en: 'Status',
      vi: 'Trạng thái',
    },
    imageStop: {
      key: 'docker_image_stop',
      en: 'Stop',
      vi: 'Dừng',
    },
    imageTagItem: {
      key: 'docker_image_tag_item',
      en: 'Tag',
      vi: 'Thẻ',
    },
  },
  form: {
    confirmPasswordItem: {
      key: 'confirm_password_label',
      en: 'Confirm Pasword',
      vi: 'Xác nhận mật khẩu',
    },
    createLabel: {
      key: 'create_form_label',
      en: 'Quick Add',
      vi: 'Thêm nhanh',
    },
    deleteLabel: {
      key: 'delete_form_label',
      en: 'Quick Delete',
      vi: 'Xóa nhanh',
    },
    deleteTitle: {
      key: 'delete_form_title',
      en: 'Are you sure you want to delete?',
      vi: 'Bạn có chắc muốn xóa không?',
    },
    passwordItem: {
      key: 'password_label',
      en: 'Password',
      vi: 'Mật khẩu',
    },
    searchItem: {
      key: 'search_item',
      en: 'Search',
      vi: 'Tìm kiếm',
    },
    updateLabel: {
      key: 'update_form_label',
      en: 'Quick Update',
      vi: 'Cập nhật nhanh',
    },
  },
  googleConsole: {
    listPageTitle: {
      key: 'google_console_list_page',
      en: 'Google Console List',
      vi: 'Danh sách Google Console',
    },
  },
  home: {
    bookSumary: {
      key: 'book_summary',
      en: 'New Books',
      vi: 'Truyện mới',
    },
    categoryBooksSummary: {
      key: 'category_books_summary',
      en: 'Books',
      vi: 'Sách, Truyện',
    },
    categoryNewsSummary: {
      key: 'category_news_summary',
      en: 'News',
      vi: 'Tin tức',
    },
    categorySummary: {
      key: 'category_summary',
      en: 'Categories',
      vi: 'Danh mục',
    },
    contentSumary: {
      key: 'content_summary',
      en: 'All Content',
      vi: 'Tất cả nội dung',
    },
    description: {
      key: 'home_description',
      en: "Here's what's happening with your content today",
      vi: "Here's what's happening with your content today",
    },
    googleConsoleSummary: {
      key: 'google_console_summary',
      en: 'Google Indexed',
      vi: 'Đã index trên Google',
    },
    googleSearchStatusChart: {
      key: 'google_Search_status_chart',
      en: 'Google Search',
      vi: 'Google Indexing',
    },
    keywordSummary: {
      key: 'keyword_summary',
      en: 'Keywords',
      vi: 'Từ khóa',
    },
    postSummary: {
      key: 'post_summary',
      en: 'New Posts',
      vi: 'Bài viết mới',
    },
    siteSummary: {
      key: 'site_summary',
      en: 'New Sites',
      vi: 'Trang web mới',
    },
    sourceSummaryDescription: {
      key: 'source_summary_description',
      en: 'Chart show count book by type',
      vi: 'Biểu đồ thể hiện số lượng truyện/sách theo từng thể loại',
    },
    sourceSummaryTitle: {
      key: 'source_summary_title',
      en: 'Source',
      vi: 'Thể loại',
    },
    title: {
      key: 'home_title',
      en: 'Hi, Welcome back 👋',
      vi: 'Hi, Welcome back 👋',
    },
    trendingSummary: {
      key: 'trending_summary',
      en: 'New Trendings',
      vi: 'Xu hướng mới',
    },
  },
  language: {
    codeItem: {
      key: 'language_item_code',
      en: 'Code',
      vi: 'Mã',
    },
    contentItem: {
      key: 'language_item_content',
      en: 'Content',
      vi: 'Nội dung',
    },
    detailTitle: {
      key: 'language_detail_title',
      en: 'Language Detail',
      vi: 'Chi tiết ngôn ngữ',
    },
    languageItem: {
      key: 'language_item_language',
      en: 'Language',
      vi: 'Ngôn ngữ',
    },
    listPageTitle: {
      key: 'language_list_page',
      en: 'Language List',
      vi: 'Danh sách ngôn ngữ',
    },
    tableTitle: {
      key: 'language_table_title',
      en: 'Languages',
      vi: 'Ngôn ngữ',
    },
    tabAll: {
      key: 'language_tab_all_label',
      en: 'All',
      vi: 'Tất cả',
    },
  },
  menu: {
    home: {
      key: 'home_menu',
      en: 'Home',
      vi: 'Trang chủ',
    },
    profile: {
      key: 'profile_menu',
      en: 'Profile',
      vi: 'Hồ sơ',
    },
    settings: {
      key: 'settings_menu',
      en: 'Settings',
      vi: 'Cài đặt',
    },
  },
  nav: {
    batchLogs: {
      key: 'batch_logs_nav',
      en: 'Server Logs',
      vi: 'Server Logs',
    },
    blog: {
      key: 'blog_nav',
      en: 'Blog',
      vi: 'Blog',
    },
    blogAll: {
      key: 'blog_all_nav',
      en: 'All Blog',
      vi: 'Tất cả Blog',
    },
    blogArchived: {
      key: 'blog_archived_nav',
      en: 'Archived',
      vi: 'Đã lưu trữ',
    },
    blogNew: {
      key: 'blog_unused_nav',
      en: 'Blog Unused',
      vi: 'Blog không dùng',
    },
    blogTrending: {
      key: 'blog_trending_nav',
      en: 'Trending',
      vi: 'Xu hướng',
    },
    bookAudio: {
      key: 'book_audio_nav',
      en: 'Audio',
      vi: 'Truyện Nói',
    },
    bookGroup: {
      key: 'book_group_nav',
      en: 'Books',
      vi: 'Danh Sách',
    },
    bookList: {
      key: 'book_nav',
      en: 'All Books',
      vi: 'Truyện',
    },
    category: {
      key: 'category_nav',
      en: 'Category',
      vi: 'Danh mục',
    },
    color: {
      key: 'color_nav',
      en: 'Color',
      vi: 'Màu sắc',
    },
    dashboard: {
      key: 'dashboard_nav',
      en: 'Dashboard',
      vi: 'Bảng điều khiển',
    },
    googleConsole: {
      key: 'google_console_nav',
      en: 'Google Console',
      vi: 'Google Console',
    },
    googleIndexing: {
      key: 'google_indexing_nav',
      en: 'Google Indexing',
      vi: 'Google Indexing',
    },
    googleLogs: {
      key: 'google_logs_nav',
      en: 'Google Logs',
      vi: 'Google Logs',
    },
    googleSitemap: {
      key: 'google_sitemap_nav',
      en: 'Google Sitemap',
      vi: 'Google Sitemap',
    },
    googleWebsite: {
      key: 'google_website_nav',
      en: 'Google Website',
      vi: 'Google Website',
    },
    image: {
      key: 'image_nav',
      en: 'Image',
      vi: 'Hình ảnh',
    },
    language: {
      key: 'language_nav',
      en: 'Language',
      vi: 'Ngôn ngữ',
    },
    product: {
      key: 'product_nav',
      en: 'Product',
      vi: 'Sản phẩm',
    },
    role: {
      key: 'role_nav',
      en: 'Role',
      vi: 'Phân quyền',
    },
    server: {
      key: 'server_nav',
      en: 'Server',
      vi: 'Máy chủ',
    },
    setting: {
      key: 'setting_nav',
      en: 'System Setting',
      vi: 'Cài đặt hệ thống',
    },
    site: {
      key: 'site_nav',
      en: 'Site',
      vi: 'Trang web',
    },
    user: {
      key: 'user_nav',
      en: 'User',
      vi: 'Người dùng',
    },
  },
  nginx: {
    addFileTitle: {
      key: 'nginx_add_file_title',
      en: 'Add new config',
      vi: 'Thêm cấu hình mới',
    },
    contentFileItem: {
      key: 'nginx_content_file_item',
      en: 'Content',
      vi: 'Nội dung',
    },
    nameFileItem: {
      key: 'nginx_name_file_item',
      en: 'File name (.conf)',
      vi: 'Tên file (.conf)',
    },
    title: {
      key: 'nginx_title',
      en: 'Nginx Config',
      vi: 'Cấu hình NGINX',
    },
  },
  notification: {
    beforeThat: {
      key: 'notification_before_that',
      en: 'Before That',
      vi: 'Trước đó',
    },
    count: {
      key: 'notification_count',
      en: 'You have {count} unread messages',
      vi: 'Bạn có {count} thông báo chưa đọc',
    },
    new: {
      key: 'notification_new',
      en: 'New',
      vi: 'Mới',
    },
    readAll: {
      key: 'notification_read_all',
      en: 'Mark all as read',
      vi: 'Đánh dấu tất cả đã đọc',
    },
    tab_all: {
      key: 'notification_tab_all',
      en: 'All',
      vi: 'Tất cả',
    },
    tab_archived: {
      key: 'notification_tab_archived',
      en: 'Archived',
      vi: 'Lưu trữ',
    },
    tab_new: {
      key: 'notification_tab_new',
      en: 'Unread',
      vi: 'Chưa đọc',
    },
    title: {
      key: 'notification_title',
      en: 'Notifications',
      vi: 'Thông báo',
    },
    viewAll: {
      key: 'notification_view_all',
      en: 'View All',
      vi: 'Xem tất cả',
    },
  },
  notify: {
    changedLanguage: {
      key: 'notify_changed_language',
      en: 'Language has been changed!',
      vi: 'Đã thay đổi ngôn ngữ!',
    },
    errorEmptyResponse: {
      key: 'notify_error_empty_response',
      en: 'Empty response. Please try again.',
      vi: 'Phản hồi trống. Vui lòng thử lại.',
    },
    errorGeneric: {
      key: 'notify_error_generic',
      en: 'An error occurred while fetching data.',
      vi: 'Đã xảy ra lỗi khi lấy dữ liệu.',
    },
    errorInvalidData: {
      key: 'notify_error_invalid_data',
      en: 'Invalid data received from the server.',
      vi: 'Dữ liệu không hợp lệ từ máy chủ.',
    },
    errorMissingData: {
      key: 'notify_error_missing_data',
      en: 'The response is missing necessary information.',
      vi: 'Thiếu thông tin cần thiết từ phản hồi.',
    },
    errorNetwork: {
      key: 'notify_error_network',
      en: 'Network error. Please check your connection.',
      vi: 'Lỗi kết nối mạng. Vui lòng kiểm tra lại.',
    },
    errorNoResults: {
      key: 'notify_error_no_results',
      en: 'No results found for your request.',
      vi: 'Không tìm thấy kết quả phù hợp.',
    },
    errorServer: {
      key: 'notify_error_server',
      en: 'Unable to reach the server. Please try again later.',
      vi: 'Không thể kết nối máy chủ. Thử lại sau.',
    },
    successApiCall: {
      key: 'notify_success_api_call',
      en: 'API call was successful!',
      vi: 'Gọi API thành công!',
    },
    successDelete: {
      key: 'notify_success_delete',
      en: 'Data deleted successfully!',
      vi: 'Xóa dữ liệu thành công!',
    },
    successGetData: {
      key: 'notify_success_get_data',
      en: 'Data retrieved successfully!',
      vi: 'Lấy dữ liệu thành công!',
    },
    successPostData: {
      key: 'notify_success_post_data',
      en: 'Request completed successfully!',
      vi: 'Yêu cầu thành công!',
    },
    successUpdate: {
      key: 'notify_success_update',
      en: 'Successfully updated the data!',
      vi: 'Cập nhật dữ liệu thành công!',
    },
  },
  product: {
    addNewButton: {
      key: 'product_new_button',
      en: 'New Product',
      vi: 'Thêm sản phẩm',
    },
    detailPageTitle: {
      key: 'product_detail_page',
      en: 'Product Detail',
      vi: 'Chi tiết sản phẩm',
    },
    detailTitle: {
      key: 'product_detail_title',
      en: 'Product Detail',
      vi: 'Chi tiết sản phẩm',
    },
    listPageTitle: {
      key: 'product_list_page',
      en: 'Product List',
      vi: 'Danh sách sản phẩm',
    },
    tableTitle: {
      key: 'product_table_title',
      en: 'Products',
      vi: 'Sản phẩm',
    },
  },
  repository: {
    basicInformation: {
      key: 'repository_basic_information',
      en: 'Basic Information',
      vi: 'Thông tin cơ bản',
    },
    buildRepositoryDescription: {
      key: 'repository_build_description',
      en: 'Will replace .env, docker-compose.yml in source (if exist options)',
      vi: 'Sẽ thay thế .env, docker-compose.yml trong source (nếu chọn)',
    },
    buildRepositoryTitle: {
      key: 'repository_build_title',
      en: 'Build a new image',
      vi: 'Tạo image mới',
    },
    buildWithDockerCompose: {
      key: 'repository_build_docker_compose',
      en: 'Build with new docker-compose.yml',
      vi: 'Build với docker-compose.yml mới',
    },
    buildWithEnv: {
      key: 'repository_build_env',
      en: 'Build with new .env',
      vi: 'Build với .env mới',
    },
    cloneRepositoryDescription: {
      key: 'repository_clone_description',
      en: 'Clone and create docker-compose.xml, .env (if not exists)',
      vi: 'Sao chép và tạo docker-compose.xml, .env (nếu chưa có)',
    },
    cloneRepositoryTitle: {
      key: 'repository_clone_title',
      en: 'Clone Repository',
      vi: 'Sao chép kho',
    },
    createFormDescription: {
      key: 'repository_create_description',
      en: 'Clone and create docker-compose.xml (if not exist)',
      vi: 'Sao chép và tạo docker-compose.xml (nếu chưa có)',
    },
    createFormTitle: {
      key: 'repository_create_title',
      en: 'Clone Repository',
      vi: 'Sao chép kho',
    },
    downRepositoryDescription: {
      key: 'repository_down_description',
      en: '',
      vi: '',
    },
    downRepositoryTitle: {
      key: 'repository_down_title',
      en: 'Down',
      vi: 'Dừng lại',
    },
    emailItem: {
      key: 'repository_email_item',
      en: 'Email',
      vi: 'Email',
    },
    environment: {
      key: 'repository_environment_title',
      en: 'Environment',
      vi: 'Môi trường',
    },
    fineGrainedTokenItem: {
      key: 'repository_fine_grained_token_item',
      en: 'Fine Grained Token',
      vi: 'Fine Grained Token',
    },
    githubUrlItem: {
      key: 'repository_github_item',
      en: 'Github',
      vi: 'Github',
    },
    idItem: {
      key: 'repository_id_item',
      en: 'Id',
      vi: 'Id',
    },
    imagesItem: {
      key: 'repository_images_item',
      en: 'Images',
      vi: 'Ảnh',
    },
    nameItem: {
      key: 'repository_name_item',
      en: 'Name',
      vi: 'Tên',
    },
    optionalSettings: {
      key: 'repository_optional_setting',
      en: 'Optional Settings',
      vi: 'Cài đặt tùy chọn',
    },
    pullRepositoryDescription: {
      key: 'repository_pull_description',
      en: 'Pull new code and replace .env and service in your data.',
      vi: 'Kéo mã mới và thay thế .env và service hiện tại.',
    },
    pullRepositoryTitle: {
      key: 'repository_pull_title',
      en: 'Pull Repository',
      vi: 'Kéo kho lưu trữ',
    },
    repoEnv: {
      key: 'repository_env_file',
      en: 'Env file',
      vi: 'File .env',
    },
    repoEnvGuide: {
      key: 'repository_env_file_guide',
      en: 'system auto create file .env',
      vi: 'Hệ thống sẽ tự tạo file .env',
    },
    repositoryAddButton: {
      key: 'repository_new_button',
      en: 'Add Repository',
      vi: 'Thêm kho',
    },
    repositoryBuildImageButton: {
      key: 'repository_build_button',
      en: 'Build',
      vi: 'Build',
    },
    repositoryListTitle: {
      key: 'repository_list_title',
      en: 'Repositories',
      vi: 'Kho lưu trữ',
    },
    repositoryPullButton: {
      key: 'repository_pull_button',
      en: 'Pull Source',
      vi: 'Kéo mã nguồn',
    },
    runRepositoryDescription: {
      key: 'repository_run_description',
      en: '',
      vi: '',
    },
    runRepositoryTitle: {
      key: 'repository_run_title',
      en: 'Run a new container',
      vi: 'Chạy container mới',
    },
    serverPathItem: {
      key: 'repository_server_path_item',
      en: 'Path',
      vi: 'Đường dẫn trên máy chủ',
    },
    services: {
      key: 'repository_services_title',
      en: 'Services',
      vi: 'Dịch vụ',
    },
    upRepositoryDescription: {
      key: 'repository_up_description',
      en: '',
      vi: '',
    },
    upRepositoryTitle: {
      key: 'repository_up_title',
      en: 'Up',
      vi: 'Khởi động',
    },
    updateFormDescription: {
      key: 'repository_update_description',
      en: 'Pull and create docker-compose.xml (if not exist)',
      vi: 'Kéo mã và tạo docker-compose.xml (nếu chưa có)',
    },
    updateFormTitle: {
      key: 'repository_update_title',
      en: 'Update Basic Information',
      vi: 'Cập nhật thông tin cơ bản',
    },
    usernameItem: {
      key: 'repository_username_item',
      en: 'Username',
      vi: 'Tên đăng nhập',
    },
    volumes: {
      key: 'repository_volumes_title',
      en: 'Volumes',
      vi: 'Volumes',
    },
  },
  role: {
    addNewButton: {
      key: 'role_new_button',
      en: 'Add New Role',
      vi: 'Tạo mới phân quyền',
    },
    canActionWhen: {
      key: 'role_can_action_when',
      en: 'Can {action} when',
      vi: 'Có thể {action} khi',
    },
    collectionType: {
      key: 'role_collection_type',
      en: 'Collection Type',
      vi: 'Collection Type',
    },
    conditionLabel: {
      key: 'role_condition_label',
      en: 'Condition',
      vi: 'Condition',
    },
    createPageDescription: {
      key: 'role_create_page_description',
      en: 'Define the rights given to the role',
      vi: 'Define the rights given to the role',
    },
    createPagetitle: {
      key: 'role_create_page_title',
      en: 'Create a role',
      vi: 'Tạo mới',
    },
    createType: {
      key: 'role_create',
      en: 'Create',
      vi: 'Create',
    },
    deleteType: {
      key: 'role_delete',
      en: 'Delete',
      vi: 'Delete',
    },
    detailPageDescription: {
      key: 'role_detail_page_description',
      en: 'Define the rights given to the role',
      vi: 'Define the rights given to the role',
    },
    detailPagetitle: {
      key: 'role_detail_page_title',
      en: 'Role',
      vi: 'Chi tiết',
    },
    idItem: {
      key: 'role_id_item',
      en: 'ID',
      vi: 'ID',
    },
    listPageDescription: {
      key: 'role_list_page_description',
      en: 'List of roles',
      vi: 'Danh sách phân quyền',
    },
    listPageTitle: {
      key: 'role_list_page_title',
      en: 'Roles',
      vi: 'Phân Quyền',
    },
    nameItem: {
      key: 'role_name_item',
      en: 'Name',
      vi: 'Tên',
    },
    publishType: {
      key: 'role_publish',
      en: 'Publish',
      vi: 'Publish',
    },
    readType: {
      key: 'role_read',
      en: 'Read',
      vi: 'Read',
    },
    settingType: {
      key: 'role_setting',
      en: 'Setting',
      vi: 'Setting',
    },
    updateType: {
      key: 'role_update',
      en: 'Update',
      vi: 'Update',
    },
    userItem: {
      key: 'role_user_item',
      en: 'User',
      vi: 'Người dùng',
    },
    descriptionItem: {
      key: 'role_description_item',
      en: 'Description',
      vi: 'Mô tả',
    },
    createdAtItem: {
      key: 'role_created_at_item',
      en: 'Created At',
      vi: 'Ngày tạo',
    },
  },
  server: {
    activeStatus: {
      key: 'server_active_status',
      en: 'Active',
      vi: 'Đang hoạt động',
    },
    addNewButton: {
      key: 'server_new_button',
      en: 'New Server',
      vi: 'Thêm máy chủ',
    },
    allService: {
      key: 'all_service',
      en: 'All Services',
      vi: 'Tất cả dịch vụ',
    },
    available: {
      key: 'server_available',
      en: 'Available',
      vi: 'Sẵn sàng',
    },
    connected: {
      key: 'server_connected',
      en: 'Connected',
      vi: 'Đã kết nối',
    },
    connectServerButton: {
      key: 'connect_server_button',
      en: 'Connect Server',
      vi: 'Kết nối máy chủ',
    },
    createdAtItem: {
      key: 'server_item_created_at',
      en: 'Created Time',
      vi: 'Thời gian tạo',
    },
    detailPageTitle: {
      key: 'server_detail_page',
      en: 'Server Detail',
      vi: 'Chi tiết máy chủ',
    },
    detailTitle: {
      key: 'server_detail_title',
      en: 'Server Detail',
      vi: 'Chi tiết máy chủ',
    },
    disconnected: {
      key: 'server_disconnected',
      en: 'Disconnected',
      vi: 'Mất kết nối',
    },
    disk: {
      key: 'server_disk',
      en: 'Disk',
      vi: 'Ổ đĩa',
    },
    dockerContainer: {
      key: 'docker_containers',
      en: 'Containers Docker',
      vi: 'Docker Containers',
    },
    dockerImages: {
      key: 'docker_images',
      en: 'Images Docker',
      vi: 'Docker Images',
    },
    generalTab: {
      key: 'server_general_tab',
      en: 'General',
      vi: 'Tổng quan',
    },
    hostItem: {
      key: 'server_item_host',
      en: 'Host',
      vi: 'Host',
    },
    inactiveStatus: {
      key: 'server_inactive_status',
      en: 'Inactive',
      vi: 'Không hoạt động',
    },
    informationTitle: {
      key: 'information_title',
      en: 'Information',
      vi: 'Thông tin',
    },
    listPageTitle: {
      key: 'server_list_page',
      en: 'Server List',
      vi: 'Danh sách máy chủ',
    },
    nameItem: {
      key: 'server_item_name',
      en: 'Server',
      vi: 'Tên máy chủ',
    },
    network: {
      key: 'server_network',
      en: 'Network',
      vi: 'Mạng',
    },
    notifyConnecting: {
      key: 'server_notify_connecting',
      en: 'Re-connect to server...',
      vi: 'Đang kết nối lại máy chủ...',
    },
    notifyDisconnected: {
      key: 'server_notify_disconnected',
      en: 'Unable to connect to the server.',
      vi: 'Không thể kết nối tới máy chủ.',
    },
    notifyFetchingData: {
      key: 'server_notify_fetching_data',
      en: 'The data is being updated...',
      vi: 'Đang cập nhật dữ liệu...',
    },
    passwordItem: {
      key: 'server_item_password',
      en: 'Password',
      vi: 'Mật khẩu',
    },
    portItem: {
      key: 'server_item_port',
      en: 'Port',
      vi: 'Cổng',
    },
    ram: {
      key: 'server_ram',
      en: 'Ram',
      vi: 'Ram',
    },
    room: {
      key: 'server_room',
      en: 'Room',
      vi: 'Phòng máy',
    },
    setupTab: {
      key: 'server_setup_tab',
      en: 'Config Container',
      vi: 'Cấu hình container',
    },
    statusTab: {
      key: 'server_status_tab',
      en: 'Status',
      vi: 'Trạng thái',
    },
    tableTitle: {
      key: 'server_table_title',
      en: 'Servers',
      vi: 'Máy chủ',
    },
    used: {
      key: 'server_used',
      en: 'Used',
      vi: 'Đang dùng',
    },
    userItem: {
      key: 'server_item_user',
      en: 'User',
      vi: 'Người dùng',
    },
  },
  signin: {
    allreadyAccount: {
      key: 'allready_account',
      en: 'Already have an account?',
      vi: 'Đã có tài khoản?',
    },
    emailItem: {
      key: 'signin_item_email',
      en: 'Email address',
      vi: 'Email',
    },
    forgotPassword: {
      key: 'forgot_password',
      en: 'Forgot password?',
      vi: 'Quên mật khẩu?',
    },
    getStarted: {
      key: 'get_started',
      en: 'Get started',
      vi: 'Bắt đầu ngay',
    },
    noAccount: {
      key: 'no_account',
      en: 'Don’t have an account?',
      vi: 'Chưa có tài khoản?',
    },
    passwordItem: {
      key: 'signin_item_password',
      en: 'Password',
      vi: 'Mật khẩu',
    },
    rememberMe: {
      key: 'remember_me',
      en: 'Remember me',
      vi: 'Ghi nhớ tôi',
    },
    title: {
      key: 'signin_title',
      en: 'Sign in',
      vi: 'Đăng nhập',
    },
  },
  signup: {
    agreeTo: {
      key: 'agree_to',
      en: 'By registering, I agree to Minimal',
      vi: 'Khi đăng ký, tôi đồng ý với',
    },
    description: {
      key: 'signup_description',
      en: 'Free forever. No credit card needed.',
      vi: 'Miễn phí vĩnh viễn. Không cần thẻ tín dụng.',
    },
    emailItem: {
      key: 'signup_item_email',
      en: 'Email address',
      vi: 'Email',
    },
    passwordItem: {
      key: 'signup_item_password',
      en: 'Password',
      vi: 'Mật khẩu',
    },
    privacyPolicy: {
      key: 'privacy_policy',
      en: 'Privacy Policy',
      vi: 'Chính sách bảo mật',
    },
    termsOfService: {
      key: 'terms_of_service',
      en: 'Terms of Service',
      vi: 'Điều khoản dịch vụ',
    },
    title: {
      key: 'signup_title',
      en: 'Get started absolutely free.',
      vi: 'Bắt đầu miễn phí ngay.',
    },
    usernameItem: {
      key: 'signup_item_user_name',
      en: 'User name',
      vi: 'Tên người dùng',
    },
  },
  site: {
    addNewButton: {
      key: 'site_new_button',
      en: 'New Site',
      vi: 'Thêm trang mới',
    },
    autoPostItem: {
      key: 'site_auto_post_item',
      en: 'Auto Post',
      vi: 'Tự động đăng bài',
    },
    categoriesItem: {
      key: 'site_categories_item',
      en: 'Categories',
      vi: 'Danh mục',
    },
    createdAtItem: {
      key: 'site_created_at_item',
      en: 'Created At',
      vi: 'Ngày tạo',
    },
    descriptionItem: {
      key: 'site_description_item',
      en: 'Description',
      vi: 'Mô tả',
    },
    detailPageTitle: {
      key: 'site_detail_page',
      en: 'Site Detail',
      vi: 'Chi tiết trang',
    },
    detailTitle: {
      key: 'site_detail_title',
      en: 'Site Detail',
      vi: 'Chi tiết trang web',
    },
    domainItem: {
      key: 'site_domain_item',
      en: 'Domain',
      vi: 'Tên miền',
    },
    indexingItem: {
      key: 'site_indexing',
      en: 'Indexing',
      vi: 'Đang index',
    },
    listPageTitle: {
      key: 'site_list_page',
      en: 'Site List',
      vi: 'Danh sách trang',
    },
    nameItem: {
      key: 'site_name_item',
      en: 'Name',
      vi: 'Tên',
    },
    postSlugItem: {
      key: 'site_post_slug',
      en: '',
      vi: '',
    },
    postTitleItem: {
      key: 'site_post_title',
      en: 'Post',
      vi: 'Bài viết',
    },
    postsItem: {
      key: 'site_posts_item',
      en: 'Posts',
      vi: 'Bài viết',
    },
    requestIndex: {
      key: 'site_request_index',
      en: 'Request Index',
      vi: 'Yêu cầu index',
    },
    siteItem: {
      key: 'book_site_item',
      en: 'Site',
      vi: 'Site',
    },
    tableTitle: {
      key: 'site_table_title',
      en: 'Sites',
      vi: 'Trang web',
    },
    teleBotName: {
      key: 'site_tele_bot_name',
      en: 'Telegram Bot Name',
      vi: 'Tên Bot Telegram',
    },
    teleChatId: {
      key: 'site_tele_chat_id',
      en: 'Telegram Chat Id',
      vi: 'ID Chat Telegram',
    },
    teleChatName: {
      key: 'site_tele_chat_name',
      en: 'Telegram Chat Name',
      vi: 'Tên Chat Telegram',
    },
    teleToken: {
      key: 'site_tele_token',
      en: 'Telegram Token',
      vi: 'Telegram Token',
    },
    teleVerify: {
      key: 'site_tele_verify',
      en: 'Verified',
      vi: 'Đã xác minh',
    },
    tokenItem: {
      key: 'site_token_item',
      en: 'Token',
      vi: 'Token',
    },
    typeItem: {
      key: 'site_type_item',
      en: 'Type',
      vi: 'Type',
    },
    workspacesItem: {
      key: 'site_workspaces_item',
      en: 'Workspaces',
      vi: 'Workspaces',
    },
  },
  table: {
    filterTitle: {
      key: 'filter_list_title',
      en: 'Filter list',
      vi: 'Bộ lọc danh sách',
    },
    numberSelected: {
      key: 'table_number_selected',
      en: '{count} selected',
      vi: '{count} mục đã chọn',
    },
    paginationPerPage: {
      key: 'pagination_per_page',
      en: 'Rows per page',
      vi: 'Số dòng mỗi trang',
    },
  },
  trendings: {
    trendingNowTitle: {
      key: 'trending_now_title',
      en: 'Trending Now',
      vi: 'Xu hướng hiện tại',
    },
    trendingSearchVolumeItem: {
      key: 'trending_search_volume_item',
      en: 'Search Volume',
      vi: 'Lượng tìm kiếm',
    },
    trendingStartedItem: {
      key: 'trending_started_item',
      en: 'Started',
      vi: 'Bắt đầu từ',
    },
    trendingTitleItem: {
      key: 'trending_title_item',
      en: 'Title',
      vi: 'Tiêu đề',
    },
  },
  user: {
    activeItem: {
      key: 'user_active_item',
      en: 'active',
      vi: 'Active',
    },
    addressItem: {
      key: 'user_address_item',
      en: 'Address',
      vi: 'Address',
    },
    addNewButton: {
      key: 'user_new_button',
      en: 'New User',
      vi: 'Người dùng mới',
    },
    associatedData: {
      key: 'user_associated_data',
      en: 'Associated Data',
      vi: 'Dữ liệu',
    },
    avatarItem: {
      key: 'user_avatar_item',
      en: 'Avatar',
      vi: 'Ảnh đại diện',
    },
    bannerItem: {
      key: 'user_banner_item',
      en: 'Banner',
      vi: 'Ảnh bìa',
    },
    createdItem: {
      key: 'user_created_item',
      en: 'Created At',
      vi: 'Cập nhất mới nhất',
    },
    createPageDescription: {
      key: 'user_create_page_description',
      en: 'Create a new user account',
      vi: 'Create a new user account',
    },
    createPageTitle: {
      key: 'user_create_page_title',
      en: 'Create User',
      vi: 'Tạo mới user',
    },
    detailPageDescription: {
      key: 'user_detail_page_description',
      en: 'Edit user information and permissions',
      vi: 'Edit user information and permissions',
    },
    detailPageTitle: {
      key: 'user_detail_page_title',
      en: 'User',
      vi: 'User',
    },
    detailTitle: {
      key: 'user_detail_title',
      en: 'User Detail',
      vi: 'Chi tiết người dùng',
    },
    editProfileTitle: {
      key: 'user_edit_profile_title',
      en: 'Update profile',
      vi: 'Chỉnh sửa trang cá nhân',
    },
    emailItem: {
      key: 'user_email_item',
      en: 'Email',
      vi: 'Email',
    },
    inputPostTitle: {
      key: 'user_input_post_title',
      en: 'Click to add new post',
      vi: 'Nhấn vào để nhập bài viết mới',
    },
    listPageDescription: {
      key: 'user_list_page_description',
      en: 'All the users who have access to the System admin panel',
      vi: 'All the users who have access to the System admin panel',
    },
    listPageTitle: {
      key: 'user_list_page_title',
      en: 'Users',
      vi: 'Danh sách user',
    },
    myPostTitle: {
      key: 'user_my_post_title',
      en: 'Your Posts',
      vi: 'Bài viết của bạn',
    },
    nameItem: {
      key: 'user_name_item',
      en: 'Name',
      vi: 'Họ & Tên',
    },
    passwordItem: {
      key: 'user_password_item',
      en: 'Password',
      vi: 'Mật Khẩu',
    },
    phoneItem: {
      key: 'user_phone_item',
      en: 'Phone',
      vi: 'Phone',
    },
    profileTitle: {
      key: 'user_profile_title',
      en: 'Profile',
      vi: 'Hồ sơ',
    },
    roleDataTitle: {
      key: 'user_role_data_title',
      en: 'Role & Data',
      vi: 'Phân quyền & dữ liệu',
    },
    roleItem: {
      key: 'user_role_item',
      en: 'Role',
      vi: 'role',
    },
    siteItem: {
      key: 'user_site_item',
      en: 'Sites',
      vi: 'Sites',
    },
    tabProfile: {
      key: 'user_tab_profile',
      en: 'Profile',
      vi: 'Hồ sơ',
    },
    tableTitle: {
      key: 'user_table_title',
      en: 'Users',
      vi: 'Người dùng',
    },
    uploadAvatar: {
      key: 'user_upload_avatar',
      en: 'Upload Avatar',
      vi: 'Cập nhật ảnh đại diện',
    },
    uploadBanner: {
      key: 'user_upload_banner',
      en: 'Upload Banner',
      vi: 'Cập nhật ảnh bìa',
    },
    userManagePost: {
      key: 'user_manage_post',
      en: 'Manage Posts',
      vi: 'Quản lý bài viết',
    },
    usernameItem: {
      key: 'user_username_item',
      en: 'Username',
      vi: 'Tên Đăng Nhập',
    },
  },
};
