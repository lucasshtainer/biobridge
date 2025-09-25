import React, { useState } from 'react';

interface ConsentManagerProps {
  onConsentChange: (consent: ConsentData) => void;
  initialConsent?: ConsentData;
}

interface ConsentData {
  dataCollection: boolean;
  dataSharing: boolean;
  analytics: boolean;
  research: boolean;
  commercial: boolean;
  marketing: boolean;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({ onConsentChange, initialConsent }) => {
  const [consent, setConsent] = useState<ConsentData>(initialConsent || {
    dataCollection: false,
    dataSharing: false,
    analytics: false,
    research: false,
    commercial: false,
    marketing: false
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleConsentChange = (field: keyof ConsentData, value: boolean) => {
    const newConsent = { ...consent, [field]: value };
    setConsent(newConsent);
    onConsentChange(newConsent);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Data Collection & Privacy Consent
      </h3>
      
      <div className="space-y-4">
        {/* Essential Data Collection */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Essential Data Collection</h4>
              <p className="text-sm text-gray-600">Required for service functionality</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={consent.dataCollection}
                onChange={(e) => handleConsentChange('dataCollection', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Required</span>
            </label>
          </div>
        </div>

        {/* Analytics & Insights */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Analytics & Health Insights</h4>
              <p className="text-sm text-gray-600">Help improve our service and provide health insights</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={consent.analytics}
                onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Optional</span>
            </label>
          </div>
        </div>

        {/* Research Participation */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Medical Research Participation</h4>
              <p className="text-sm text-gray-600">Contribute to anonymized medical research</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={consent.research}
                onChange={(e) => handleConsentChange('research', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Optional</span>
            </label>
          </div>
        </div>

        {/* Commercial Data Sharing */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Commercial Data Sharing</h4>
              <p className="text-sm text-gray-600">Share anonymized data with healthcare partners</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={consent.commercial}
                onChange={(e) => handleConsentChange('commercial', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Optional</span>
            </label>
          </div>
        </div>

        {/* Marketing Communications */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Communications</h4>
              <p className="text-sm text-gray-600">Receive health-related offers and updates</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={consent.marketing}
                onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Optional</span>
            </label>
          </div>
        </div>
      </div>

      {/* Details Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showDetails ? 'Hide' : 'Show'} detailed information
        </button>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-2">What Data We Collect:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Demographics:</strong> Age range, gender, location (state only)</li>
            <li>• <strong>Health Metrics:</strong> BMI category, blood pressure category, cholesterol levels</li>
            <li>• <strong>Lifestyle:</strong> Exercise frequency, diet preferences, sleep quality</li>
            <li>• <strong>Health Conditions:</strong> Condition categories (cardiovascular, respiratory, etc.)</li>
            <li>• <strong>Medications:</strong> Medication categories (blood pressure, diabetes, etc.)</li>
            <li>• <strong>Healthcare:</strong> Insurance type, provider type, visit frequency</li>
          </ul>
          
          <h5 className="font-medium text-gray-900 mb-2 mt-4">How We Use Your Data:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Service Improvement:</strong> Enhance our AI assistant and user experience</li>
            <li>• <strong>Health Insights:</strong> Provide personalized health recommendations</li>
            <li>• <strong>Research:</strong> Contribute to medical research (anonymized)</li>
            <li>• <strong>Commercial:</strong> Partner with healthcare companies for better services</li>
            <li>• <strong>Analytics:</strong> Understand health trends and user needs</li>
          </ul>

          <h5 className="font-medium text-gray-900 mb-2 mt-4">Your Rights:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You can withdraw consent at any time</li>
            <li>• You can request data deletion</li>
            <li>• You can view your collected data</li>
            <li>• All data is anonymized and aggregated</li>
            <li>• We never share personally identifiable information</li>
          </ul>
        </div>
      )}

      {/* Legal Notice */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Legal Notice:</strong> This data collection complies with HIPAA, GDPR, and healthcare privacy regulations. 
          All data is anonymized and aggregated. We never share personally identifiable information. 
          You can withdraw consent at any time through your account settings.
        </p>
      </div>
    </div>
  );
};

export default ConsentManager;
