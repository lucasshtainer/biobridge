import React, { useState, useEffect } from 'react';
import { AnalyticsData } from './dataCollection';
import AdminAuth from './AdminAuth';

interface DataViewerProps {
  onBack: () => void;
}

const DataViewer: React.FC<DataViewerProps> = ({ onBack }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'raw' | 'export'>('analytics');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    const expires = localStorage.getItem('admin_session_expires');
    
    if (isAuth && expires && Date.now() < parseInt(expires)) {
      setIsAuthenticated(true);
      fetchAnalytics();
      fetchRawData();
    } else {
      // Clear expired session
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_session_expires');
      setShowAuth(true);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchRawData = async () => {
    try {
      const response = await fetch('/api/export-data');
      const data = await response.json();
      if (data.success) {
        setRawData(data.data);
      }
    } catch (error) {
      console.error('Error fetching raw data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (rawData.length === 0) return;
    
    const headers = Object.keys(rawData[0]);
    const csvContent = [
      headers.join(','),
      ...rawData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(rawData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
    fetchAnalytics();
    fetchRawData();
  };

  const handleAuthCancel = () => {
    onBack();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_session_expires');
    setIsAuthenticated(false);
    setShowAuth(true);
  };

  // Show authentication if not authenticated
  if (showAuth) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} onCancel={handleAuthCancel} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Data Viewer</h1>
                <p className="text-sm text-gray-500">View collected medical data and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.total_users || 0}
                </div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'analytics', label: 'Analytics Overview' },
                { id: 'raw', label: 'Raw Data' },
                { id: 'export', label: 'Export Data' }
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
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
              
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Demographics */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Age Groups:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.demographics_breakdown.age_groups).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Genders:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.demographics_breakdown.gender_distribution).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Locations:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.demographics_breakdown.location_distribution).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">BMI Categories:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.health_metrics_summary.bmi_distribution).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">BP Categories:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.health_metrics_summary.blood_pressure_categories).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Conditions:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.health_metrics_summary.common_conditions).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Smoking Status:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.lifestyle_insights.smoking_rates).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Exercise Patterns:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.lifestyle_insights.exercise_patterns).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Diet Trends:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Object.keys(analytics.lifestyle_insights.diet_trends).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Raw Data</h2>
                <div className="text-sm text-gray-600">
                  {rawData.length} records
                </div>
              </div>
              
              {rawData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(rawData[0]).map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rawData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rawData.length > 10 && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                      Showing first 10 of {rawData.length} records
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-600">Start collecting data by having users complete the registration form.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Export Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                  <div className="space-y-4">
                    <button
                      onClick={exportToCSV}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      Export to CSV
                    </button>
                    <button
                      onClick={exportToJSON}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Export to JSON
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Records:</span>
                      <span className="text-sm font-medium text-gray-900">{rawData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data Fields:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {rawData.length > 0 ? Object.keys(rawData[0]).length : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Commercial Use</h4>
                <p className="text-sm text-blue-800">
                  This data is anonymized and ready for commercial use. You can sell it to:
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Healthcare companies for market research</li>
                  <li>• Pharmaceutical companies for drug development</li>
                  <li>• Insurance companies for risk assessment</li>
                  <li>• Research institutions for medical studies</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
