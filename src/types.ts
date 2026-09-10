/**
 * Type definitions for Carrefour MKP 3PL Tracker
 */

export type PartnerId = 'imile' | 'emx' | 'tfm' | 'aramex';

export interface PartnerConfig {
  id: PartnerId;
  name: string;
  fullName: string;
  trackingUrlTemplate: string;
  portalUrl: string;
  directUrlSupported: boolean;
  notes: string;
  placeholderHint: string;
  exampleAwb: string;
}

export interface TrackingHistoryItem {
  id: string;
  awb: string;
  partnerId: PartnerId;
  partnerName: string;
  timestamp: number;
  url: string;
}
