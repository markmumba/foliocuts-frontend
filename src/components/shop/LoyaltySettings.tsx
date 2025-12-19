import { Award, Gift, TrendingUp, Users, Save, Edit2 } from 'lucide-react';
import { useState } from 'react';

export function LoyaltySettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [loyaltyConfig, setLoyaltyConfig] = useState({
    enabled: true,
    requiredVisits: 10,
    rewardType: 'free_service',
    serviceName: 'Haircut',
    smsNotifications: true,
    progressNotifications: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Loyalty Program Settings</h2>
          <p className="text-sm text-gray-500">Configure your digital loyalty rewards program</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            <Edit2 className="w-4 h-4" />
            Edit Settings
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Loyalty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Members</p>
              <h3 className="text-2xl font-bold text-primary">0</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rewards Given</p>
              <h3 className="text-2xl font-bold text-primary">0</h3>
              <p className="text-xs text-gray-400">This month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Return Rate</p>
              <h3 className="text-2xl font-bold text-primary">0%</h3>
              <p className="text-xs text-gray-400">Customer retention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Close to Reward</p>
              <h3 className="text-2xl font-bold text-primary">0</h3>
              <p className="text-xs text-gray-400">8-9 visits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Configuration */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Program Configuration</h3>

        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1">Enable Loyalty Program</p>
              <p className="text-xs text-gray-500">Turn the loyalty program on or off</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={loyaltyConfig.enabled}
                onChange={(e) =>
                  setLoyaltyConfig({ ...loyaltyConfig, enabled: e.target.checked })
                }
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Required Visits */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <label className="block text-sm text-primary mb-2">Required Visits for Free Service</label>
            <p className="text-xs text-gray-500 mb-3">
              Number of services customer must complete to earn a free reward
            </p>
            {isEditing ? (
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={loyaltyConfig.requiredVisits}
                  onChange={(e) =>
                    setLoyaltyConfig({ ...loyaltyConfig, requiredVisits: parseInt(e.target.value) })
                  }
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center">
                  <span className="text-primary font-semibold">{loyaltyConfig.requiredVisits}</span>
                </div>
              </div>
            ) : (
              <p className="text-accent font-semibold">{loyaltyConfig.requiredVisits} visits</p>
            )}
          </div>

          {/* Reward Type */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <label className="block text-sm text-primary mb-2">Reward Service</label>
            <p className="text-xs text-gray-500 mb-3">
              Which service customers get for free after completing required visits
            </p>
            {isEditing ? (
              <select
                value={loyaltyConfig.serviceName}
                onChange={(e) =>
                  setLoyaltyConfig({ ...loyaltyConfig, serviceName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option>Haircut</option>
                <option>Beard Trim</option>
                <option>Manicure</option>
                <option>Pedicure</option>
                <option>Any Service (Customer Choice)</option>
              </select>
            ) : (
              <p className="text-accent font-semibold">{loyaltyConfig.serviceName}</p>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1">SMS Reward Notifications</p>
              <p className="text-xs text-gray-500">
                Send SMS when customer earns a free service
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={loyaltyConfig.smsNotifications}
                onChange={(e) =>
                  setLoyaltyConfig({ ...loyaltyConfig, smsNotifications: e.target.checked })
                }
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Progress Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm text-primary mb-1">Progress Updates</p>
              <p className="text-xs text-gray-500">
                Notify customers of their loyalty progress (e.g., "7/10 visits")
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={loyaltyConfig.progressNotifications}
                onChange={(e) =>
                  setLoyaltyConfig({ ...loyaltyConfig, progressNotifications: e.target.checked })
                }
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-linear-to-br from-accent to-accent/80 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Program Preview</h3>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Customer sees after payment:</p>
              <p className="text-xs opacity-75">Automatic, no app needed</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm mb-2">🎉 Loyalty Progress: 7/{loyaltyConfig.requiredVisits}</p>
            <p className="text-xs opacity-90">
              {loyaltyConfig.requiredVisits - 7} more visit
              {loyaltyConfig.requiredVisits - 7 > 1 ? 's' : ''} until your free{' '}
              {loyaltyConfig.serviceName}!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
