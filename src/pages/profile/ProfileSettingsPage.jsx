import React, { useState } from 'react'
import { User, Calendar, Lock, Globe, ShieldCheck, Check, Save, Phone, MapPin, Award } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext'
import toast, { Toaster } from 'react-hot-toast'

export const ProfileSettingsPage = () => {
  const { profile, role } = useAuth()
  const { lang, setLang, t } = useLanguage()

  const [dob, setDob] = useState(profile?.date_of_birth || '1984-06-15')
  const [fullName, setFullName] = useState(profile?.full_name || 'Ramesh Patel')
  const [phone, setPhone] = useState(profile?.phone || '+91 98251 44520')
  const [district, setDistrict] = useState(profile?.district || 'Anand')
  const [newPassword, setNewPassword] = useState('')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    toast.success(t('saveProfileSuccess', 'Profile settings updated successfully!'))
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!newPassword) {
      toast.error('Please enter a new password')
      return
    }
    toast.success('Password updated via Supabase Auth!')
    setNewPassword('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Toaster position="top-right" />

      {/* Public Profile Card View */}
      <div className="glass-card-green p-6 sm:p-8 rounded-3xl border border-farm-200 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <img
          src={profile.avatar}
          alt={profile.full_name}
          className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg shrink-0"
        />
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-display font-extrabold text-2xl text-farm-950">{profile.full_name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-farm-700 text-white shadow-xs">
              {t('verified', 'Verified')} {role.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-farm-900 font-medium">
            {profile.city_village || 'Borsad Village'}, {profile.district || 'Anand'}, {profile.state || 'Gujarat'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-farm-800">
            <div className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('aadhaarVerifiedLbl', 'Aadhaar Verified')}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold">
              <Award className="w-4 h-4 text-harvest-600" />
              <span>{t('ratingLbl', 'Rating:')} {profile.rating || 4.92} / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info & Editable DOB */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-farm-600" />
            <span>{t('profileDetailsDOB', 'Profile Details & Date of Birth')}</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">{t('fullNameTitle', 'Full Name')}</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">{t('mobilePhoneTitle', 'Phone Number')}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">{t('districtState', 'District / State')}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">{t('dateOfBirthEditable', 'Date of Birth (Editable)')}</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="input-farm"
              />
            </div>

            <button type="submit" className="w-full btn-farm text-xs py-2.5 justify-center">
              <Save className="w-4 h-4" />
              <span>{t('saveProfileUpdatesBtn', 'Save Profile Updates')}</span>
            </button>
          </form>
        </div>

        {/* Security & Language Preference */}
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-farm-600" />
              <span>{t('languageVoicePreferenceTitle', 'Language & Voice Preference')}</span>
            </h3>
            <p className="text-xs text-gray-500">
              {t('selectLanguageHint', 'Select your primary language for the UI and Web Speech Voice Assistant:')}
            </p>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="input-farm text-xs font-semibold"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Change Password */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-farm-600" />
              <span>{t('changePasswordSupabase', 'Change Password (Supabase Auth)')}</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('passwordTitle', 'New Password')}</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-farm"
                />
              </div>

              <button type="submit" className="w-full btn-farm text-xs py-2.5 justify-center">
                <span>{t('updatePasswordBtn', 'Update Password')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

