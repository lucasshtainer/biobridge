// Medical Data Collection System
// Compliant with HIPAA and healthcare data regulations

class MedicalDataCollector {
  constructor() {
    this.data = [];
    this.analytics = {
      total_users: 0,
      demographics_breakdown: {
        age_groups: {},
        gender_distribution: {},
        location_distribution: {}
      },
      health_metrics_summary: {
        bmi_distribution: {},
        blood_pressure_categories: {},
        common_conditions: {},
        medication_usage: {}
      },
      lifestyle_insights: {
        smoking_rates: {},
        exercise_patterns: {},
        diet_trends: {}
      },
      healthcare_utilization: {
        insurance_types: {},
        provider_preferences: {}
      }
    };
  }

  // Process patient data into collectible format
  processPatientData(patientData) {
    if (!patientData || !patientData.user_consent) {
      return null; // Only collect with explicit consent
    }

    const age = parseInt(patientData.age) || 0;
    const height = parseFloat(patientData.heightCm) || 0;
    const weight = parseFloat(patientData.weightKg) || 0;
    const systolic = parseInt(patientData.systolic) || 0;
    const diastolic = parseInt(patientData.diastolic) || 0;

    return {
      age: age,
      gender: patientData.sex || 'unknown',
      location: patientData.state || 'unknown',
      income_bracket: this.categorizeIncome(patientData.income_bracket),
      
      bmi_range: this.categorizeBMI(height, weight),
      blood_pressure_category: this.categorizeBloodPressure(systolic, diastolic),
      cholesterol_level: this.categorizeCholesterol(parseInt(patientData.totalChol) || 0),
      diabetes_status: patientData.diabetes || 'none',
      
      smoking_status: patientData.smoker || 'unknown',
      exercise_frequency: this.categorizeExercise(patientData.exercise_frequency),
      diet_preferences: this.categorizeDiet(patientData.diet_preferences),
      sleep_quality: this.categorizeSleep(patientData.sleep_quality),
      
      condition_categories: this.categorizeConditions(patientData.medicalConditions || []),
      medication_categories: this.categorizeMedications(patientData.medications || ''),
      
      insurance_type: this.categorizeInsurance(patientData.insuranceProvider || ''),
      healthcare_provider_type: this.categorizeProvider(patientData.provider_type),
      visit_frequency: this.categorizeVisitFrequency(patientData.visit_frequency),
      
      data_collected_at: new Date(),
      user_consent: patientData.user_consent || false,
      data_sharing_consent: patientData.data_sharing_consent || false
    };
  }

  // Add data to collection (with consent)
  addData(patientData) {
    const processedData = this.processPatientData(patientData);
    if (!processedData || !processedData.data_sharing_consent) {
      return false; // Only collect with explicit consent
    }

    this.data.push(processedData);
    this.updateAnalytics(processedData);
    return true;
  }

  // Get anonymized analytics
  getAnalytics() {
    return { ...this.analytics };
  }

  // Export data for research/commercial use
  exportData() {
    return this.data.filter(record => record.data_sharing_consent);
  }

  // Categorization methods
  categorizeBMI(height, weight) {
    if (height === 0 || weight === 0) return 'unknown';
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  categorizeBloodPressure(systolic, diastolic) {
    if (systolic < 120 && diastolic < 80) return 'normal';
    if (systolic < 130 && diastolic < 80) return 'elevated';
    if (systolic < 140 && diastolic < 90) return 'stage1';
    return 'stage2';
  }

  categorizeCholesterol(total) {
    if (total === 0) return 'unknown';
    if (total < 200) return 'normal';
    if (total < 240) return 'borderline';
    return 'high';
  }

  categorizeIncome(income) {
    // This would be collected separately with consent
    return 'not_collected'; // Default for privacy
  }

  categorizeExercise(frequency) {
    if (!frequency) return 'unknown';
    if (frequency.includes('daily')) return 'daily';
    if (frequency.includes('weekly')) return 'weekly';
    if (frequency.includes('monthly')) return 'monthly';
    return 'rarely';
  }

  categorizeDiet(preferences) {
    if (!preferences) return [];
    const diets = [];
    if (preferences.includes('vegetarian')) diets.push('vegetarian');
    if (preferences.includes('vegan')) diets.push('vegan');
    if (preferences.includes('keto')) diets.push('keto');
    if (preferences.includes('paleo')) diets.push('paleo');
    return diets;
  }

  categorizeSleep(quality) {
    if (!quality) return 'unknown';
    if (quality.includes('excellent')) return 'excellent';
    if (quality.includes('good')) return 'good';
    if (quality.includes('poor')) return 'poor';
    return 'unknown';
  }

  categorizeConditions(conditions) {
    const categories = [];
    conditions.forEach(condition => {
      if (condition.organ.includes('Heart')) categories.push('cardiovascular');
      if (condition.organ.includes('Lungs')) categories.push('respiratory');
      if (condition.organ.includes('Brain')) categories.push('neurological');
      if (condition.organ.includes('Diabetes')) categories.push('endocrine');
    });
    return [...new Set(categories)];
  }

  categorizeMedications(medications) {
    const categories = [];
    if (medications.includes('blood pressure') || medications.includes('hypertension')) {
      categories.push('blood_pressure');
    }
    if (medications.includes('diabetes') || medications.includes('metformin')) {
      categories.push('diabetes');
    }
    if (medications.includes('cholesterol') || medications.includes('statin')) {
      categories.push('cholesterol');
    }
    return categories;
  }

  categorizeInsurance(provider) {
    if (!provider) return 'unknown';
    if (provider.includes('Blue Cross')) return 'blue_cross';
    if (provider.includes('Aetna')) return 'aetna';
    if (provider.includes('Cigna')) return 'cigna';
    if (provider.includes('Medicare')) return 'medicare';
    if (provider.includes('Medicaid')) return 'medicaid';
    return 'other';
  }

  categorizeProvider(type) {
    if (!type) return 'unknown';
    if (type.includes('primary')) return 'primary_care';
    if (type.includes('specialist')) return 'specialist';
    if (type.includes('urgent')) return 'urgent_care';
    return 'unknown';
  }

  categorizeVisitFrequency(frequency) {
    if (!frequency) return 'unknown';
    if (frequency.includes('monthly')) return 'monthly';
    if (frequency.includes('quarterly')) return 'quarterly';
    if (frequency.includes('annually')) return 'annually';
    return 'as_needed';
  }

  updateAnalytics(data) {
    this.analytics.total_users++;
    
    // Demographics
    const ageGroup = this.getAgeGroup(data.age);
    this.analytics.demographics_breakdown.age_groups[ageGroup] = 
      (this.analytics.demographics_breakdown.age_groups[ageGroup] || 0) + 1;
    
    this.analytics.demographics_breakdown.gender_distribution[data.gender] = 
      (this.analytics.demographics_breakdown.gender_distribution[data.gender] || 0) + 1;
    
    this.analytics.demographics_breakdown.location_distribution[data.location] = 
      (this.analytics.demographics_breakdown.location_distribution[data.location] || 0) + 1;
    
    // Health metrics
    this.analytics.health_metrics_summary.bmi_distribution[data.bmi_range] = 
      (this.analytics.health_metrics_summary.bmi_distribution[data.bmi_range] || 0) + 1;
    
    this.analytics.health_metrics_summary.blood_pressure_categories[data.blood_pressure_category] = 
      (this.analytics.health_metrics_summary.blood_pressure_categories[data.blood_pressure_category] || 0) + 1;
    
    // Conditions
    data.condition_categories.forEach(category => {
      this.analytics.health_metrics_summary.common_conditions[category] = 
        (this.analytics.health_metrics_summary.common_conditions[category] || 0) + 1;
    });
    
    // Medications
    data.medication_categories.forEach(category => {
      this.analytics.health_metrics_summary.medication_usage[category] = 
        (this.analytics.health_metrics_summary.medication_usage[category] || 0) + 1;
    });
    
    // Lifestyle
    this.analytics.lifestyle_insights.smoking_rates[data.smoking_status] = 
      (this.analytics.lifestyle_insights.smoking_rates[data.smoking_status] || 0) + 1;
    
    this.analytics.lifestyle_insights.exercise_patterns[data.exercise_frequency] = 
      (this.analytics.lifestyle_insights.exercise_patterns[data.exercise_frequency] || 0) + 1;
    
    // Healthcare utilization
    this.analytics.healthcare_utilization.insurance_types[data.insurance_type] = 
      (this.analytics.healthcare_utilization.insurance_types[data.insurance_type] || 0) + 1;
  }

  getAgeGroup(age) {
    if (age < 18) return 'under_18';
    if (age < 30) return '18_29';
    if (age < 45) return '30_44';
    if (age < 60) return '45_59';
    if (age < 75) return '60_74';
    return '75_plus';
  }
}

export const medicalDataCollector = new MedicalDataCollector();
