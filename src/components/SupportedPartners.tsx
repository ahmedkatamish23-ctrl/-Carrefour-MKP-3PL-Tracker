import React from 'react';
import { PartnerConfig, PartnerId } from '../types';
import { Check, ExternalLink } from 'lucide-react';

interface SupportedPartnersProps {
  partners: PartnerConfig[];
  selectedPartnerId: PartnerId;
  onSelectPartner: (partnerId: PartnerId) => void;
}

export const SupportedPartners: React.FC<SupportedPartnersProps> = ({
  partners,
  selectedPartnerId,
  onSelectPartner,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto pt-4" id="supported-3pl-section">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Supported 3PL Partners
        </span>
      </div>

      {/* Pill row with separators */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
        {partners.map((partner, index) => {
          const isSelected = partner.id === selectedPartnerId;
          return (
            <React.Fragment key={partner.id}>
              <button
                type="button"
                id={`partner-pill-${partner.id}`}
                onClick={() => onSelectPartner(partner.id)}
                title={`Select ${partner.name} (${partner.fullName})`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#004E98] text-white shadow-xs ring-2 ring-[#004E98]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{partner.name}</span>
              </button>
              {index < partners.length - 1 && (
                <span className="text-slate-300 text-xs select-none font-light">|</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
