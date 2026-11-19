import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, PhoneCall, ShieldCheck, ExternalLink, Heart } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

export const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-farm-950 text-white/90 pt-14 pb-10 border-t border-farm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-farm-800/80">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-farm-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Farm<span className="text-farm-400">Fresh</span>
              </span>
            </div>
            <p className="text-sm text-farm-200/80 max-w-sm leading-relaxed">
              {t('subtagline')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-farm-900/80 border border-farm-800 flex items-center gap-2.5 text-xs text-farm-200">
                <ShieldCheck className="w-4 h-4 text-farm-400 shrink-0" />
                <span>{t('directTradeNotice')}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-farm-100 uppercase tracking-wider mb-3">
              {t('navMarket')}
            </h4>
            <ul className="space-y-2 text-xs text-farm-300/80">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">{t('navMarket')}</Link></li>
              <li><Link to="/auctions" className="hover:text-white transition-colors">{t('navAuctions')}</Link></li>
              <li><Link to="/mandi-rates" className="hover:text-white transition-colors">{t('navMandi')}</Link></li>
              <li><Link to="/cold-storage" className="hover:text-white transition-colors">{t('navColdStorage')}</Link></li>
              <li><Link to="/transport" className="hover:text-white transition-colors">{t('navTransport')}</Link></li>
              <li><Link to="/freshness-scanner" className="hover:text-white transition-colors">{t('navFreshness')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Govt Portals & Schemes */}
          <div>
            <h4 className="font-semibold text-sm text-farm-100 uppercase tracking-wider mb-3">
              {t('navSchemes')}
            </h4>
            <ul className="space-y-2 text-xs text-farm-300/80">
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  PM-KISAN Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  e-NAM Mandi <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  PM Fasal Bima (PMFBY) <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://agriinfra.dac.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  Agri Infra Fund (AIF) <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li><Link to="/schemes" className="text-farm-400 hover:underline">{t('viewAll')} →</Link></li>
            </ul>
          </div>

          {/* Col 4: Farmer Helpline */}
          <div>
            <h4 className="font-semibold text-sm text-farm-100 uppercase tracking-wider mb-3">
              {t('supportTitle')}
            </h4>
            <div className="bg-farm-900/90 border border-farm-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-harvest-400 text-xs font-semibold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t('kisanHelplineTitle')}</span>
              </div>
              <div className="font-mono text-base font-bold text-white tracking-wide">
                1800 180 1551
              </div>
              <p className="text-[11px] text-farm-300/70">
                {t('kisanHelplineDesc')}
              </p>
            </div>
            <div className="mt-3 text-[11px] text-farm-400">
              {t('madeForIndia')}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-farm-400/80 gap-3">
          <p>© 2026 {t('brand')} • {t('allRightsReserved')}</p>
          <div className="flex items-center gap-1 text-farm-300">
            <span>{t('tagline')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
