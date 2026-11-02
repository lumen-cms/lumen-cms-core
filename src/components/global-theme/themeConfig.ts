import type {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

// Project only scalar inputs; never retain CMS content trees in the theme.
export function selectThemeConfig(
  settings: GlobalStoryblok,
  page?: Pick<PageStoryblok, 'right_drawer_width'> | null
) {
  const toolbar = settings.multi_toolbar?.[0]
  return {
    _uid: settings._uid,
    theme_container_width: settings.theme_container_width,
    default_font_color: settings.default_font_color,
    theme_base: settings.theme_base,
    theme_primary: settings.theme_primary,
    theme_primary_contrast: settings.theme_primary_contrast,
    theme_secondary: settings.theme_secondary,
    theme_secondary_contrast: settings.theme_secondary_contrast,
    theme_error: settings.theme_error,
    theme_error_contrast: settings.theme_error_contrast,
    theme_success: settings.theme_success,
    theme_success_contrast: settings.theme_success_contrast,
    theme_info: settings.theme_info,
    theme_info_contrast: settings.theme_info_contrast,
    theme_warning: settings.theme_warning,
    theme_warning_contrast: settings.theme_warning_contrast,
    drawer_width: settings.drawer_width,
    toolbar_progress_color: settings.toolbar_progress_color,
    toolbar_main_height: settings.toolbar_main_height,
    theme_font_default: settings.theme_font_default,
    theme_font_alt1: settings.theme_font_alt1,
    theme_font_alt2: settings.theme_font_alt2,
    theme_font_alt3: settings.theme_font_alt3,
    theme_font_alt4: settings.theme_font_alt4,
    bodyBackgroundColor: settings.body_background_color?.rgba,
    systemBarHeight: toolbar?.is_system_bar ? Number(toolbar.height || 40) : 0,
    rightDrawerWidth: page?.right_drawer_width
  }
}
export type ThemeConfig = ReturnType<typeof selectThemeConfig>
