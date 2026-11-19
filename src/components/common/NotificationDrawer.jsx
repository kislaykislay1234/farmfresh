import React, { useState } from 'react'
import { Bell, Check, Clock, ShieldCheck, Sparkles, X } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import { VoiceReadButton } from './VoiceReadButton'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'

export const NotificationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(() => farmFreshStore.getNotifications())
  const { activeSectionId } = useVoice()
  const { t } = useLanguage()

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkRead = (id) => {
    farmFreshStore.markNotificationAsRead(id)
    setNotifications(farmFreshStore.getNotifications())
  }

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-farm-50 text-gray-700 transition-colors"
        title={t('notificationsTitle')}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-farm-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-gray-900">{t('notificationsTitle')}</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-farm-100 text-farm-800 text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 text-xs">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-3 transition-all cursor-pointer flex items-start gap-3 ${
                  activeSectionId === `notif-${n.id}` ? 'bg-emerald-100/90 font-bold' : n.is_read ? 'bg-white text-gray-600' : 'bg-farm-50/60 font-semibold text-gray-900'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-farm-600" />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{n.title}</span>
                    <span className="text-[10px] text-gray-400 font-normal shrink-0 ml-1">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-normal leading-relaxed">{n.message}</p>
                  
                  <div className="pt-1.5 flex justify-end">
                    <VoiceReadButton
                      sectionId={`notif-${n.id}`}
                      category="generic"
                      customText={`${n.title}: ${n.message}`}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-6 text-center text-gray-400 text-xs">{t('noNotifications')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
