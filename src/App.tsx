import React, { useState } from 'react';
import { PartnerId, PartnerConfig } from './types';
import { PARTNER_LIST } from './config/partners';
import { CarrefourLogo } from './components/CarrefourLogo';
import { TrackingForm } from './components/TrackingForm';
import { SupportedPartners } from './components/SupportedPartners';
import { UrlConfigModal } from './components/UrlConfigModal';
import { Settings, ShieldCheck, MapPin } from 'lucide-react';

export default function App() {
  const [partners, setPartners] = useState<PartnerConfig[]>(PARTNER_LIST);
  const [selectedPartnerId, setSelectedPartnerId] = useState<PartnerId>('imile');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  const handleConfigUpdated = () => {
    // Re-trigger partners state if modified
    setPartners([...PARTNER_LIST]);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-[#004E98] selection:text-white">
      {/* Top Corporate Utility Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CarrefourLogo size="sm" showSubtitle={false} />
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E21836]" />
              UAE Marketplace Operations
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              id="open-config-button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              title="Configure 3PL Tracking URLs"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Configure URLs</span>
            </button>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#004E98] bg-blue-50 border border-blue-100 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#004E98]" />
              Internal Tool
            </span>
          </div>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-14 w-full">
        <div className="w-full max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Prominent Carrefour Branding & Title Section */}
          <div className="space-y-3">
            <div className="flex justify-center pb-2">
              <CarrefourLogo size="lg" showSubtitle={true} />
            </div>

            <div className="space-y-1">
              <h1
                id="main-app-title"
                className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight"
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                Carrefour MKP 3PL Tracker
              </h1>
              <p
                id="main-app-subtitle"
                className="text-base sm:text-lg font-medium text-slate-600"
              >
                UAE Shipment Tracking
              </p>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Direct routing shortcut for shipments handled by Carrefour Marketplace UAE 3PL logistics partners.
            </p>
          </div>

          {/* Core Tracking Form */}
          <TrackingForm
            partners={partners}
            selectedPartnerId={selectedPartnerId}
            onSelectPartner={setSelectedPartnerId}
          />

          {/* Supported 3PL Partners Section */}
          <SupportedPartners
            partners={partners}
            selectedPartnerId={selectedPartnerId}
            onSelectPartner={setSelectedPartnerId}
          />

        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-slate-200 py-6 bg-slate-50 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-600">
            Carrefour Marketplace UAE &bull; 3PL Partner Operations Utility
          </p>
          <p className="text-slate-400 text-[11px]">
            Fast-path redirection utility for daily logistics operations. Tracking opens directly on partner portals in a new window.
          </p>
        </div>
      </footer>

      {/* 3PL URL Configuration Modal */}
      <UrlConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        partners={partners}
        onConfigUpdated={handleConfigUpdated}
      />
    </div>
  );
}
