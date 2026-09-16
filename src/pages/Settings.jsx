import React, { useState } from 'react'
import {
  Settings as SettingsIcon,
  Save,
  Sliders,
  Shield,
  Building2,
  Utensils,
  Truck,
  RotateCcw,
  CheckCircle2,
  Layers,
  Thermometer,
  FileCheck,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Settings() {
  const toast = useToast()

  const [settings, setSettings] = useState({
    hubName: 'Silver Catering Central Kitchen & Logistics Hub',
    branchLocation: 'Perinthalmanna - Calicut Highway, Malappuram, Kerala',
    fssaiLicense: 'FSSAI Lic. No. 11324005000412',
    operationsManager: 'Nihal M.V. (Event Operations Director)',
    emergencyPhone: '+91 94470 12345',
    bufferFoodPercentage: 3,
    bufferWaterPercentage: 5,
    minimumHotTemp: 65,
    singleCounterSpeed: 200,
    queueLanes: 6,
    activeCurrency: 'INR (₹)',
  })

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Configuration Saved', 'Operational defaults and kitchen parameters updated.')
  }

  const handleResetDemoData = () => {
    if (
      window.confirm(
        'Reset all demo event data to original 3-Day 30,000 Guests College Event state?'
      )
    ) {
      localStorage.removeItem('silver_catering_events_data_v1')
      localStorage.removeItem('silver_catering_menu_data_v1')
      localStorage.removeItem('silver_catering_staff_data_v1')
      localStorage.removeItem('silver_catering_vendors_data_v1')
      localStorage.removeItem('silver_catering_arrangements_data_v1')
      localStorage.removeItem('silver_catering_tasks_data_v1')
      localStorage.removeItem('silver_catering_expenses_data_v1')
      localStorage.removeItem('silver_catering_budget_data_v1')
      toast.info('Data Reset', 'Demo data reset to factory initial state. Reloading page...')
      setTimeout(() => {
        window.location.reload()
      }, 700)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Operational Configuration"
        description="Central kitchen profiles, catering buffer formulas, single distribution counter parameters, and food safety thresholds."
        badge="System Configuration"
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
              onClick={handleResetDemoData}
            >
              Reset Demo Data
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSave}
            >
              Save Configuration
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Kitchen Profile & FSSAI */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e8f0]">
            <Building2 className="w-5 h-5 text-[#163324]" />
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Kitchen Hub & Operating Profile</h3>
              <p className="text-xs text-[#64748b]">Registered central kitchen facility and safety certifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#334155] mb-1">Facility Name</label>
              <input
                type="text"
                value={settings.hubName}
                onChange={(e) => setSettings({ ...settings, hubName: e.target.value })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#334155] mb-1">FSSAI License Number</label>
              <input
                type="text"
                value={settings.fssaiLicense}
                onChange={(e) => setSettings({ ...settings, fssaiLicense: e.target.value })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#334155] mb-1">Facility Location</label>
              <input
                type="text"
                value={settings.branchLocation}
                onChange={(e) => setSettings({ ...settings, branchLocation: e.target.value })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#334155] mb-1">Emergency Operations Contact</label>
              <input
                type="text"
                value={settings.emergencyPhone}
                onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Catering & Safety Parameters */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e8f0]">
            <Utensils className="w-5 h-5 text-[#163324]" />
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Catering Buffers & Food Safety Rules</h3>
              <p className="text-xs text-[#64748b]">Automatic buffer calculations and temperature dispatch safeguards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
              <label className="block font-semibold text-[#334155] mb-1">Food Buffer Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="15"
                value={settings.bufferFoodPercentage}
                onChange={(e) => setSettings({ ...settings, bufferFoodPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-sm font-bold"
              />
              <span className="text-[10px] text-[#64748b] mt-1 block">Surplus portions cooked per 1,000 guests</span>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
              <label className="block font-semibold text-[#334155] mb-1">Water Bottle Buffer (%)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={settings.bufferWaterPercentage}
                onChange={(e) => setSettings({ ...settings, bufferWaterPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-sm font-bold"
              />
              <span className="text-[10px] text-[#64748b] mt-1 block">Extra reserve mineral water cases</span>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
              <label className="block font-semibold text-[#334155] mb-1">Minimum Food Temp (°C)</label>
              <input
                type="number"
                min="50"
                max="85"
                value={settings.minimumHotTemp}
                onChange={(e) => setSettings({ ...settings, minimumHotTemp: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg text-sm font-bold text-orange-700"
              />
              <span className="text-[10px] text-[#64748b] mt-1 block">Thermal hot-box dispatch standard</span>
            </div>
          </div>
        </div>

        {/* Section 3: Single Distribution Counter Architecture */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#e2e8f0]">
            <Truck className="w-5 h-5 text-[#163324]" />
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">ONE Central Distribution Counter Protocol</h3>
              <p className="text-xs text-[#64748b]">Queuing throughput rate and crowd flow parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-lg">
              <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                Target Service Rate (meals / minute)
              </span>
              <input
                type="number"
                min="50"
                max="400"
                value={settings.singleCounterSpeed}
                onChange={(e) => setSettings({ ...settings, singleCounterSpeed: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-emerald-300 rounded-lg font-black text-emerald-900 text-sm"
              />
              <span className="text-[10px] text-emerald-700 mt-1 block">
                During peak window (12:30 PM — 02:00 PM) for 10,000 guests daily
              </span>
            </div>

            <div className="p-3.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg">
              <span className="text-[11px] font-bold text-[#334155] block mb-1">
                Active Parallel Queue Channels
              </span>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.queueLanes}
                onChange={(e) => setSettings({ ...settings, queueLanes: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg font-black text-[#0f172a] text-sm"
              />
              <span className="text-[10px] text-[#64748b] mt-1 block">
                Stanchion barricaded lanes feeding into the single central serving desk
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
