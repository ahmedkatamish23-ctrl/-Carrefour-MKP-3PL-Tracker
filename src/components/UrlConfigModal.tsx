import React, { useState } from 'react';
import { PartnerConfig, PartnerId } from '../types';
import {
  getActiveUrlTemplates,
  saveCustomUrlTemplates,
  resetUrlTemplatesToDefault,
  DEFAULT_PARTNERS,
  buildTrackingUrl,
} from '../config/partners';
import { X, RotateCcw, Save, Check, ExternalLink, SlidersHorizontal, Info } from 'lucide-react';

interface UrlConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  partners: PartnerConfig[];
  onConfigUpdated: () => void;
}

export const UrlConfigModal: React.FC<UrlConfigModalProps> = ({
  isOpen,
  onClose,
  partners,
  onConfigUpdated,
}) => {
  const [templates, setTemplates] = useState<Record<PartnerId, string>>(() =>
    getActiveUrlTemplates()
  );
  const [testAwb, setTestAwb] = useState<string>('TEST123456');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync templates when opened
  React.useEffect(() => {
    if (isOpen) {
      setTemplates(getActiveUrlTemplates());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUrlChange = (id: PartnerId, value: string) => {
    setTemplates((prev) => ({
      ...prev,
      [id]: value,
    }));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    saveCustomUrlTemplates(templates);
    setSavedSuccess(true);
    onConfigUpdated();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    resetUrlTemplatesToDefault();
    const defaults = getActiveUrlTemplates();
    setTemplates(defaults);
    setSavedSuccess(true);
    onConfigUpdated();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      id="url-config-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="config-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#004E98]/10 text-[#004E98] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 id="config-modal-title" className="text-base font-bold text-slate-900">
                Configure 3PL Tracking URLs
              </h3>
              <p className="text-xs text-slate-500">
                Update or customize URL templates for Carrefour Marketplace partners
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="close-config-modal-button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left text-sm text-slate-700">
          <div className="flex items-start gap-2.5 p-3 bg-blue-50/60 border border-blue-200/80 rounded-lg text-xs text-blue-900">
            <Info className="w-4 h-4 text-[#004E98] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">AWB Dynamic Replacement</p>
              <p className="text-blue-800 leading-relaxed">
                Use <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold text-[#004E98]">{'{AWB}'}</code> as the placeholder in each tracking URL. When an operator tracks a shipment, it will be dynamically replaced with the URL-encoded AWB number.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {partners.map((partner) => {
              const currentVal = templates[partner.id] ?? partner.trackingUrlTemplate;
              const isModified = currentVal !== DEFAULT_PARTNERS[partner.id].trackingUrlTemplate;
              const previewUrl = buildTrackingUrl(partner.id, testAwb);

              return (
                <div
                  key={partner.id}
                  className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{partner.name}</span>
                      <span className="text-xs text-slate-500">({partner.fullName})</span>
                      {isModified && (
                        <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          Customized
                        </span>
                      )}
                    </div>
                    <a
                      href={partner.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#004E98] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Portal Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <label
                      htmlFor={`url-input-${partner.id}`}
                      className="block text-xs font-semibold text-slate-600 mb-1"
                    >
                      URL Template
                    </label>
                    <input
                      id={`url-input-${partner.id}`}
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleUrlChange(partner.id, e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004E98] text-slate-800"
                    />
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-md">
                      Preview: <span className="font-mono text-slate-600">{previewUrl}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUrlChange(partner.id, DEFAULT_PARTNERS[partner.id].trackingUrlTemplate)}
                      disabled={!isModified}
                      className="text-[11px] text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Revert default
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label htmlFor="test-awb-input" className="block text-xs font-medium text-slate-600 mb-1">
              Test AWB Sample for Previews:
            </label>
            <input
              id="test-awb-input"
              type="text"
              value={testAwb}
              onChange={(e) => setTestAwb(e.target.value)}
              className="w-48 px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#004E98]"
              placeholder="e.g. TEST123456"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            id="reset-config-button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All to Defaults
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 animate-in fade-in">
                <Check className="w-4 h-4" />
                Saved successfully
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              id="cancel-config-button"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              id="save-config-button"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#004E98] hover:bg-[#084090] rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
