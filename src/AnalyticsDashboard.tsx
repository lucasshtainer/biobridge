import React, { useState } from 'react';
import { AnalyticsData } from './dataCollection';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
  onExportData: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics, onExportData }) => {
  const [activeTab, setActiveTab] = useState<'demographics' | 'health' | 'lifestyle' | 'healthcare'>('demographics');

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (value: number, total: number) => 
    total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

  const renderDemographics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.demographics_breakdown.age_groups).map(([ageGroup, count]) => (
              <div key={ageGroup} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{ageGroup.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.demographics_breakdown.gender_distribution).map(([gender, count]) => (
              <div key={gender} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{gender}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.demographics_breakdown.location_distribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([location, count]) => (
            <div key={location} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(count)}</div>
              <div className="text-sm text-gray-600">{location}</div>
              <div className="text-xs text-gray-500">
                {formatPercentage(count, analytics.total_users)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHealthMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.health_metrics_summary.bmi_distribution).map(([bmi, count]) => (
              <div key={bmi} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{bmi}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Pressure Categories</h3>
          <div className="space-y-2">
            {Object.entries(analytics.health_metrics_summary.blood_pressure_categories).map(([bp, count]) => (
              <div key={bp} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{bp.replace('stage', 'Stage ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Conditions</h3>
          <div className="space-y-2">
            {Object.entries(analytics.health_metrics_summary.common_conditions)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([condition, count]) => (
              <div key={condition} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{condition.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Usage</h3>
          <div className="space-y-2">
            {Object.entries(analytics.health_metrics_summary.medication_usage)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([medication, count]) => (
              <div key={medication} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{medication.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smoking Status</h3>
          <div className="space-y-2">
            {Object.entries(analytics.lifestyle_insights.smoking_rates).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Patterns</h3>
          <div className="space-y-2">
            {Object.entries(analytics.lifestyle_insights.exercise_patterns).map(([pattern, count]) => (
              <div key={pattern} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{pattern}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthcare = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Types</h3>
          <div className="space-y-2">
            {Object.entries(analytics.healthcare_utilization.insurance_types).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Preferences</h3>
          <div className="space-y-2">
            {Object.entries(analytics.healthcare_utilization.provider_preferences).map(([provider, count]) => (
              <div key={provider} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{provider.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.total_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)} ({formatPercentage(count, analytics.total_users)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Medical data insights and trends</p>
            </div>
            <div className="flex space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{formatNumber(analytics.total_users)}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <button
                onClick={onExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'demographics', label: 'Demographics' },
                { id: 'health', label: 'Health Metrics' },
                { id: 'lifestyle', label: 'Lifestyle' },
                { id: 'healthcare', label: 'Healthcare' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {activeTab === 'demographics' && renderDemographics()}
          {activeTab === 'health' && renderHealthMetrics()}
          {activeTab === 'lifestyle' && renderLifestyle()}
          {activeTab === 'healthcare' && renderHealthcare()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
