import { t } from 'i18next';

export const LanguageKey = {
  dashboard: {
    nav: 'dashboard_nav',
    pageTitle: 'dashboard_page',
  },
  user: {
    nav: 'user_nav',
    listPageTitle: 'user_list_page',
    addNewButton: 'user_new_button',
    detailPageTitle: 'user_detail_page',
    tableTitle: 'user_table_title',
    detailTitle: 'user_detail_title',
    profileTitle: 'user_profile_title',
  },
  server: {
    nav: 'server_nav',
    addNewButton: 'server_new_button',
    connectServerButton: 'connect_server_button',
    listPageTitle: 'server_list_page',
    detailPageTitle: 'server_detail_page',
    detailTitle: 'server_detail_title',
    tableTitle: 'server_table_title',
    generalTab: 'server_general_tab',
    statusTab: 'server_status_tab',
    setupTab: 'server_setup_tab',
    nameItem: 'server_item_name',
    hostItem: 'server_item_host',
    portItem: 'server_item_port',
    userItem: 'server_item_user',
    createdAtItem: 'server_item_created_at',
    passwordItem: 'server_item_password',
    inactiveStatus: 'server_inactive_status',
    activeStatus: 'server_active_status',
    connected: 'server_connected',
    disconnected: 'server_disconnected',
    used: 'server_used',
    available: 'server_available',
    ram: 'server_ram',
    room: 'server_room',
    network: 'server_network',
    disk: 'server_disk',
    informationTitle: 'information_title',
    allService: 'all_service',
    dockerContainer: 'docker_containers',
    dockerImages: 'docker_images',
    notifyFetchingData: 'server_notify_fetching_data',
    notifyConnecting: 'server_notify_connecting',
    notifyDisconnected: 'server_notify_disconnected',
  },

  nginx: {
    title: 'nginx_title',
    addFileTitle: 'nginx_add_file_title',
    nameFileItem: 'nginx_name_file_item',
    contentFileItem: 'nginx_content_file_item',
  },

  site: {
    nav: 'site_nav',
    listPageTitle: 'site_list_page',
    detailPageTitle: 'site_detail_page',
    tableTitle: 'site_table_title',
    detailTitle: 'site_detail_title',
  },
  product: {
    nav: 'product_nav',
    listPageTitle: 'product_list_page',
    detailPageTitle: 'product_detail_page',
    addNewButton: 'product_new_button',
    tableTitle: 'product_table_title',
    detailTitle: 'product_detail_title',
  },
  blog: {
    nav: 'blog_nav',
    listPageTitle: 'blog_list_page',
    detailPageTitle: 'blog_detail_page',
    addNewButton: 'blog_new_button',
    tableTitle: 'blog_table_title',
    detailTitle: 'blog_detail_title',
  },
  language: {
    nav: 'language_nav',
    listPageTitle: 'language_list_page',
    tableTitle: 'language_table_title',
    detailTitle: 'language_detail_title',
    tabAll: 'language_tab_all_label',
    contentItem: 'language_item_content',
    codeItem: 'language_item_code',
    languageItem: 'language_item_language',
  },
  button: {
    login: 'login_button',
    signup: 'signup_button',
    register: 'register_button',
    logout: 'logout_button',
    submit: 'submit_button',
    cancel: 'cancel_button',
    save: 'save_button',
    delete: 'delete_button',
    update: 'update_button',
    create: 'create_button',
    detail: 'detail_button',
    saveChanges: 'save_changes_button',
    needHelp: 'need_help_button',
    clone: 'clone_button',
    pull: 'pull_button',
  },

  menu: {
    home: 'home_menu',
    profile: 'profile_menu',
    settings: 'settings_menu',
  },

  form: {
    createLabel: 'create_form_label',
    updateLabel: 'update_form_label',
    deleteLabel: 'delete_form_label',
    deleteTitle: 'delete_form_title',
    searchItem: 'search_item',
  },
  signin: {
    title: 'signin_title',
    emailItem: 'signin_item_email',
    passwordItem: 'signin_item_password',
    getStarted: 'get_started',
    noAccount: 'no_account',
    rememberMe: 'remember_me',
    allreadyAccount: 'allready_account',
    forgotPassword: 'forgot_password',
  },
  signup: {
    title: 'signup_title',
    description: 'signup_description',
    usernameItem: 'signup_item_user_name',
    emailItem: 'signup_item_email',
    passwordItem: 'signup_item_password',
    agreeTo: 'agree_to',
    termsOfService: 'terms_of_service',
    privacyPolicy: 'privacy_policy',
  },

  table: {
    filterTitle: 'filter_list_title',
    paginationPerPage: 'pagination_per_page',
    numberSelected: 'table_number_selected',
  },

  notification: {
    title: 'notification_title',
    viewAll: 'notification_view_all',
    new: 'notification_new',
    readAll: 'notification_read_all',
    beforeThat: 'notification_before_that',
    count: 'notification_count',
    tab_all: 'notification_tab_all',
    tab_new: 'notification_tab_new',
    tab_archived: 'notification_tab_archived',
  },

  notify: {
    changedLanguage: 'notify_changed_language',
    successApiCall: 'notify_success_api_call',
    successGetData: 'notify_success_get_data',
    successPostData: 'notify_success_post_data',
    successUpdate: 'notify_success_update',
    successDelete: 'notify_success_delete',
    errorGeneric: 'notify_error_generic',
    errorNetwork: 'notify_error_network',
    errorServer: 'notify_error_server',
    errorNoResults: 'notify_error_no_results',
    errorInvalidData: 'notify_error_invalid_data',
    errorMissingData: 'notify_error_missing_data',
    errorEmptyResponse: 'notify_error_empty_response',
  },
  common: {
    or: 'or',
    of: 'of',
    and: 'and',
    settingTitle: 'setting_title',
    darkModeTitle: 'dark_mode_title',
    lightModeTitle: 'light_mode_title',
    systemModeTitle: 'system_mode_title',
    contrastTitle: 'contrast_title',
    presetTitle: 'preset_title',
    detailTitle: 'detail_title',
    listTitle: 'list_title',
  },

  repository: {
    idItem: 'repository_id_item',
    nameItem: 'repository_name_item',
    githubUrlItem: 'repository_github_item',
    usernameItem: 'repository_username_item',
    serverPathItem: 'repository_server_path_item',
    imagesItem: 'repository_images_item',
    emailItem: 'repository_email_item',
    fineGrainedTokenItem: 'repository_fine_grained_token_item',
    repositoryPullButton: 'repository_pull_button',
    repositoryAddButton: 'repository_new_button',
    repositoryBuildImageButton: 'repository_build_button',
    repositoryListTitle: 'repository_list_title',
    createFormTitle: 'repository_create_title',
    createFormDescription: 'repository_create_description',
    updateFormTitle: 'repository_update_title',
    updateFormDescription: 'repository_update_description',
    repoEnv: 'repository_env_file',
    repoEnvGuide: 'repository_env_file_guide',
    services: 'repository_services_title',
    environment: 'repository_environment_title',
    volumes: 'repository_volumes_title',
    buildWithEnv: 'repository_build_env',
    buildWithDockerCompose: 'repository_build_docker_compose',
    optionalSettings: 'repository_optional_setting',
    basicInformation: 'repository_basic_information',

    cloneRepositoryTitle: 'repository_clone_title',
    cloneRepositoryDescription: 'repository_clone_description',

    pullRepositoryTitle: 'repository_pull_title',
    pullRepositoryDescription: 'repository_pull_description',

    buildRepositoryTitle: 'repository_build_title',
    buildRepositoryDescription: 'repository_build_description',

    runRepositoryTitle: 'repository_run_title',
    runRepositoryDescription: 'repository_run_description',

    upRepositoryTitle: 'repository_up_title',
    upRepositoryDescription: 'repository_up_description',

    downRepositoryTitle: 'repository_down_title',
    downRepositoryDescription: 'repository_down_description',
  },
  docker: {
    containerIdItem: 'docker_container_id_item',
    containerNameItem: 'docker_container_name_item',
    containerStatusItem: 'docker_container_status_item',
    containerImagesItem: 'docker_container_images_item',
    containerStateItem: 'docker_container_state_item',
    containerPortsItem: 'docker_container_ports_item',

    imageIdItem: 'docker_image_id_item',
    imageNameItem: 'docker_image_name_item',
    imageStatusItem: 'docker_image_status_item',
    imageTagItem: 'docker_image_tag_item',
    imageCreatedItem: 'docker_image_created_item',
    imageSizeItem: 'docker_image_size_item',
    imageRun: 'docker_image_run',
    imageStop: 'docker_image_stop',
  },
};

export const StoreName = {
  SERVER: 'server_store',
  SERVER_REPOSIROTY: 'server_repository_store',
  SERVER_SERVICE: 'server_service_store',
  SERVER_IMAGES: 'server_images_store',
  SERVER_CONTAINER: 'server_container_store',
  SERVER_NGINX: 'server_nginx_store',
  LANGUAGE: 'language_store',
  SITE: 'site_store',

  PROFILE: 'profile_store',
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
