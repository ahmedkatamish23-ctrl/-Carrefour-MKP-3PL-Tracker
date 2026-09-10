import { PartnerConfig, PartnerId } from '../types';

/**
 * Default tracking URL templates for Carrefour Marketplace UAE 3PL Partners.
 *
 * Each URL template contains `{AWB}` which is dynamically replaced
 * with the URL-encoded Air Waybill number entered by the operator.
 *
 * These can be easily updated directly in this configuration file or
 * overridden in the application settings by internal operators.
 */
export const DEFAULT_PARTNERS: Record<PartnerId, PartnerConfig> = {
  imile: {
    id: 'imile',
    name: 'I-mile',
    fullName: 'iMile Delivery UAE',
    // Official UAE tracking endpoint as specified by operator:
    trackingUrlTemplate: 'https://www.imile.com/AE-en/track/?waybillNo={AWB}',
    portalUrl: 'https://www.imile.com/AE-en/track/',
    directUrlSupported: true,
    notes: 'Enter standard iMile AWB / Waybill number',
    placeholderHint: 'e.g. 1324567890123',
    exampleAwb: '6012345678901',
  },
  emx: {
    id: 'emx',
    name: 'EMX',
    fullName: 'EMX (Emirates Post Express)',
    // Direct endpoint that automatically populates the AWB into the EMX tracking search bar:
    trackingUrlTemplate: 'https://www.emx.ae/all-services/track-a-package/step-two?q={AWB}',
    portalUrl: 'https://www.emx.ae/all-services/track-a-package',
    directUrlSupported: true,
    notes: 'EMX UAE package tracking — pre-populates AWB into tracking bar',
    placeholderHint: 'e.g. EMX123456789AE',
    exampleAwb: 'EMX987654321AE',
  },
  tfm: {
    id: 'tfm',
    name: 'TFM',
    fullName: 'TFM Express Logistics UAE',
    // Official UAE TFM Express tracking URL specified by user:
    trackingUrlTemplate: 'https://tfmex.com/shipment-tracking-online/?tracking_id={AWB}',
    portalUrl: 'https://tfmex.com/shipment-tracking-online/',
    directUrlSupported: true,
    notes: 'TFM Express UAE tracking — opens official tracker with tracking_id',
    placeholderHint: 'e.g. 971701442999',
    exampleAwb: '971701442999',
  },
  aramex: {
    id: 'aramex',
    name: 'Aramex',
    fullName: 'Aramex UAE',
    // Verified official Aramex UAE tracking results portal:
    trackingUrlTemplate: 'https://www.aramex.com/ae/en/track/results?source=aramex&ShipmentNumber={AWB}',
    portalUrl: 'https://www.aramex.com/ae/en/track/results',
    directUrlSupported: true,
    notes: 'Aramex UAE express shipment tracking results',
    placeholderHint: 'e.g. 32901928374',
    exampleAwb: '32901928374',
  },
};

export const PARTNER_LIST: PartnerConfig[] = [
  DEFAULT_PARTNERS.imile,
  DEFAULT_PARTNERS.emx,
  DEFAULT_PARTNERS.tfm,
  DEFAULT_PARTNERS.aramex,
];

const STORAGE_KEY_URLS = 'carrefour_mkp_3pl_custom_urls_v8';

/**
 * Get active URL templates (merging defaults with any local operator overrides)
 */
export function getActiveUrlTemplates(): Record<PartnerId, string> {
  const templates: Record<PartnerId, string> = {
    imile: DEFAULT_PARTNERS.imile.trackingUrlTemplate,
    emx: DEFAULT_PARTNERS.emx.trackingUrlTemplate,
    tfm: DEFAULT_PARTNERS.tfm.trackingUrlTemplate,
    aramex: DEFAULT_PARTNERS.aramex.trackingUrlTemplate,
  };

  try {
    // Clear legacy cache keys that held outdated URLs
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls');
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls_v2');
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls_v3');
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls_v4');
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls_v5');
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls_v6');
    localStorage.removeItem('carrefour_mkp_3pl_custom_urls_v7');

    const saved = localStorage.getItem(STORAGE_KEY_URLS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        for (const key of ['imile', 'emx', 'tfm', 'aramex'] as PartnerId[]) {
          const val = parsed[key];
          if (
            typeof val === 'string' &&
            val.trim().length > 0 &&
            !val.includes('/en/track-shipment')
          ) {
            templates[key] = val.trim();
          }
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  return templates;
}

/**
 * Save custom URL templates
 */
export function saveCustomUrlTemplates(customTemplates: Partial<Record<PartnerId, string>>): void {
  try {
    const current = getActiveUrlTemplates();
    const updated = { ...current, ...customTemplates };
    localStorage.setItem(STORAGE_KEY_URLS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save custom tracking URLs to localStorage', err);
  }
}

/**
 * Reset URL templates to default configuration
 */
export function resetUrlTemplatesToDefault(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_URLS);
  } catch (err) {
    console.error('Failed to reset tracking URLs', err);
  }
}

/**
 * Generate tracking URL for a given partner and AWB
 */
export function buildTrackingUrl(partnerId: PartnerId, awb: string): string {
  const cleanAwb = awb.trim();
  const templates = getActiveUrlTemplates();
  const template = templates[partnerId] || DEFAULT_PARTNERS[partnerId].trackingUrlTemplate;

  if (template.includes('{AWB}')) {
    return template.replace('{AWB}', encodeURIComponent(cleanAwb));
  }

  // Fallback if no template variable is present
  const separator = template.includes('?') ? '&' : '?';
  return `${template}${separator}awb=${encodeURIComponent(cleanAwb)}`;
}
