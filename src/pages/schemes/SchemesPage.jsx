import React, { useState } from 'react'
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  PhoneCall, 
  Search, 
  ShieldCheck, 
  Building2, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { GOVERNMENT_SCHEMES } from '../../lib/demoData'
import { useLanguage } from '../../contexts/LanguageContext'

export const SchemesPage = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedScheme, setExpandedScheme] = useState(GOVERNMENT_SCHEMES[0].id)

  const categories = ['All', 'Direct Income Support', 'Crop Risk & Insurance', 'Post-Harvest & Cold Chain Infrastructure', 'Organic & Sustainable Farming', 'Market Linkage & APMC Reform', 'Agricultural Credit & Working Capital', 'Farm Machinery & Tech Modernization', 'Irrigation & Water Conservation']

  const filteredSchemes = GOVERNMENT_SCHEMES.filter((scheme) => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.subsidy_benefit.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' ? true : scheme.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('govMinistryBadge', 'Government of India • Ministry of Agriculture & Farmers Welfare')}</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-gray-900">
          {t('schemesCatalogTitle', 'Government Schemes, Subsidies & Grants Catalog')}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('schemesCatalogSub', 'Direct information, eligibility criteria, document checklists, and verified application portals for Indian agricultural subsidies.')}
        </p>
      </div>

      {/* Search & Categories */}
      <div className="glass-card p-4 rounded-2xl space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchSchemes', 'Search schemes (PM-KISAN, Fasal Bima, Solar Pump, Drip Irrigation)...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-farm pl-10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-farm-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? t('all', 'All') : t(cat, cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedScheme === scheme.id
          return (
            <div
              key={scheme.id}
              className="glass-card rounded-2xl overflow-hidden border-farm-100 transition-all hover:shadow-md"
            >
              {/* Header Accordion Bar */}
              <div
                onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-farm-50/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-farm-100 text-farm-800 font-bold text-xs">
                      {scheme.acronym}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {scheme.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-snug">
                    {scheme.title}
                  </h3>
                  <p className="text-xs text-farm-700 font-semibold">
                    {scheme.subsidy_benefit}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {isExpanded ? t('hideDetails', 'Hide Details') : t('viewDetails', 'View Details')}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-gray-100 space-y-4 text-xs bg-white/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Eligibility & Benefits */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-farm-600" />
                          <span>{t('eligibilityCriteria', 'Eligibility Criteria')}</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                          {scheme.eligibility_criteria}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{t('keyBenefits', 'Key Scheme Benefits:')}</h4>
                        <ul className="space-y-1 text-gray-600">
                          {scheme.key_benefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-farm-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Documents & Official Action Links */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{t('mandatoryDocs', 'Mandatory Documents Required:')}</h4>
                        <ul className="space-y-1 text-gray-600 bg-gray-50 p-3 rounded-xl">
                          {scheme.documents_required.map((doc, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-farm-600"></span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Helpline & Official Link */}
                      <div className="bg-farm-50/80 border border-farm-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-farm-900">
                          <span className="flex items-center gap-1.5 font-medium">
                            <PhoneCall className="w-3.5 h-3.5 text-farm-600" />
                            {t('kisanHelplineTitle', 'Helpline')}: {scheme.helpline_number}
                          </span>
                        </div>

                        <a
                          href={scheme.official_portal_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-farm text-xs py-2 px-4 w-full text-center"
                        >
                          <span>{t('applyOnOfficial', 'Apply on Official Portal')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

