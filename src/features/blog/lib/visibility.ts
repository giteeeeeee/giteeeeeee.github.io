export interface PublishableContent {
  draft?: boolean;
  published?: boolean;
}

/**
 * Keep every production discovery surface and detail route on one visibility rule.
 * Development deliberately shows hidden entries so authors can preview them.
 */
export function isPublishableContentVisible(
  data: PublishableContent,
  isDevelopment = import.meta.env.DEV,
) {
  return isDevelopment || (!data.draft && data.published !== false);
}
