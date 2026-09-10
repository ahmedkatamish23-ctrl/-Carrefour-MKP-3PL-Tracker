import React, { useState, useRef, useEffect } from 'react';
import { PartnerConfig, PartnerId } from '../types';
import { buildTrackingUrl } from '../config/partners';
import {
  Search,
  ExternalLink,
  AlertCircle,
  Clipboard,
  Check,
  X,
  ChevronDown,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface TrackingFormProps {
  partners: PartnerConfig[];
  selectedPartnerId: PartnerId;
  onSelectPartner: (partnerId: PartnerId) => void;
  onTrackSuccess?: (awb: string, partnerId: PartnerId, url: string) => void;
}

/**
 * Submits AWB directly to TFM Express public tracking engine via POST
 * This automatically loads the shipment status, timeline milestones, and history table.
 */
function submitTfmDirectTracking(awb: string) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://customer.tfmex.com/Skybill/TrackSkybill';
  form.target = '_blank';

  const awbInput = document.createElement('input');
  awbInput.type = 'hidden';
  awbInput.name = 'AWB';
  awbInput.value = awb;
  form.appendChild(awbInput);

  const keyInput = document.createElement('input');
  keyInput.type = 'hidden';
  keyInput.name = 'secretKey';
  keyInput.value = '7BF55197-E725-4467-A149-B29D1FAB6F7F';
  form.appendChild(keyInput);

  const tzInput = document.createElement('input');
  tzInput.type = 'hidden';
  tzInput.name = 'clientTimeZoneOffSetHour';
  tzInput.value = '4';
  form.appendChild(tzInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export const TrackingForm: React.FC<TrackingFormProps> = ({
  partners,
  selectedPartnerId,
  onSelectPartner,
  onTrackSuccess,
}) => {
  const [awb, setAwb] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastTrackedInfo, setLastTrackedInfo] = useState<{
    awb: string;
    partnerId: PartnerId;
    partnerName: string;
    url: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const selectedPartner =
    partners.find((p) => p.id === selectedPartnerId) || partners[0];

  // Auto-focus input on initial load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    setAwb('');
    setErrorMessage('');
    inputRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setAwb(text.trim());
        setErrorMessage('');
        inputRef.current?.focus();
      }
    } catch {
      // If clipboard read is disallowed by browser permissions, ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAwb = awb.trim();

    // 1. Validate that an AWB has been entered
    if (!cleanAwb) {
      setErrorMessage('Please enter an AWB number to track the shipment.');
      inputRef.current?.focus();
      return;
    }

    setErrorMessage('');

    // 2. Use the selected 3PL company to determine tracking
    const trackingUrl = buildTrackingUrl(selectedPartner.id, cleanAwb);

    try {
      if (selectedPartner.id === 'tfm') {
        // TFM public engine accepts direct POST with auto-rendered milestones
        submitTfmDirectTracking(cleanAwb);
      } else {
        window.open(trackingUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.warn('Direct popup prevented; showing direct fallback link', err);
    }

    setLastTrackedInfo({
      awb: cleanAwb,
      partnerId: selectedPartner.id,
      partnerName: selectedPartner.name,
      url: trackingUrl,
    });

    if (onTrackSuccess) {
      onTrackSuccess(cleanAwb, selectedPartner.id, trackingUrl);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto" id="tracking-form-container">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-left"
        id="carrefour-tracking-form"
        noValidate
      >
        {/* 3PL Partner Selector (Clear Dropdown) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="partner-select-dropdown"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Select 3PL Partner
            </label>
            <span className="text-xs text-[#004E98] font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {selectedPartner.fullName}
            </span>
          </div>

          <div className="relative">
            <select
              id="partner-select-dropdown"
              value={selectedPartnerId}
              onChange={(e) => {
                onSelectPartner(e.target.value as PartnerId);
                setErrorMessage('');
              }}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-300 focus:border-[#004E98] focus:bg-white focus:outline-none rounded-lg py-3.5 pl-4 pr-10 text-base font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id} className="py-2 text-slate-900 font-medium">
                  {partner.name} &mdash; {partner.fullName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Large AWB Input Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="awb-number-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Air Waybill (AWB) Number
            </label>
            {selectedPartner.placeholderHint && (
              <span className="text-xs text-slate-400 font-mono">
                {selectedPartner.placeholderHint}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              id="awb-number-input"
              type="text"
              value={awb}
              onChange={(e) => {
                setAwb(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter AWB Number"
              className={`w-full py-4 pl-4 pr-24 text-lg sm:text-xl font-mono tracking-wide text-slate-900 placeholder:text-slate-400 placeholder:font-sans placeholder:text-base placeholder:tracking-normal bg-white border-2 rounded-lg transition-all focus:outline-none ${
                errorMessage
                  ? 'border-red-500 ring-2 ring-red-100'
                  : 'border-slate-300 focus:border-[#004E98] focus:ring-3 focus:ring-[#004E98]/15'
              }`}
              autoComplete="off"
              spellCheck="false"
            />

            {/* Quick Action Buttons inside input */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1">
              {awb ? (
                <button
                  type="button"
                  onClick={handleClear}
                  id="clear-awb-button"
                  title="Clear input"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  id="paste-awb-button"
                  title="Paste from clipboard"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-600 hover:text-[#004E98] hover:bg-blue-50 border border-slate-200 rounded transition-colors cursor-pointer"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div
              id="awb-validation-error"
              role="alert"
              className="mt-2.5 flex items-center gap-1.5 text-sm font-semibold text-red-600 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Helper hint */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{selectedPartner.notes}</span>
            <button
              type="button"
              onClick={() => {
                setAwb(selectedPartner.exampleAwb);
                setErrorMessage('');
                inputRef.current?.focus();
              }}
              className="text-[#004E98] hover:underline cursor-pointer font-medium"
            >
              Use example
            </button>
          </div>
        </div>

        {/* Primary Action Button: "Track Shipment" */}
        <div>
          <button
            type="submit"
            id="track-shipment-button"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-lg text-white text-base sm:text-lg font-bold bg-[#004E98] hover:bg-[#084090] active:scale-[0.99] transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#004E98]/30 cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span>Track Shipment</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>
        </div>
      </form>

      {/* Confirmation & Direct Link Fallback (ensures reliable access even in restrictive iframe/pop-up blocking environments) */}
      {lastTrackedInfo && (
        <div
          id="last-tracked-confirmation"
          className="mt-4 p-4 bg-emerald-50/90 border border-emerald-200 rounded-lg text-left animate-in fade-in duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-950">
                  Tracking opened for {lastTrackedInfo.partnerName}
                </p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  AWB: <span className="font-mono font-bold">{lastTrackedInfo.awb}</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {lastTrackedInfo.partnerId === 'tfm' ? (
                    <button
                      type="button"
                      onClick={() => submitTfmDirectTracking(lastTrackedInfo.awb)}
                      id="direct-tracking-fallback-link"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Re-open Tracker <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a
                      href={lastTrackedInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="direct-tracking-fallback-link"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <span className="text-[11px] text-emerald-700">
                    Click to re-open if browser blocked new tab
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastTrackedInfo(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 rounded hover:bg-emerald-100 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
