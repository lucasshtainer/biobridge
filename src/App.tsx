import React, { useState, useCallback } from 'react'
import GradientText from './GradientText'
import ChatPage from './ChatPage'
import DataViewer from './DataViewer'

type Sex = "Male" | "Female" | "Other" | "Prefer not to say";

type MedicalCondition = {
  id: string;
  organ: string;
  condition: string;
  details: string;
};

type SurgicalHistory = {
  id: string;
  bodyPart: string;
  surgery: string;
  year: string;
  details: string;
};

type PatientData = {
  name: string;
  age: string;
  sex: Sex | "";
  heightCm: string;
  weightKg: string;
  systolic: string;
  diastolic: string;
  heartRate: string;
  totalChol: string;
  hdl: string;
  ldl: string;
  triglycerides: string;
  fastingGlucose: string;
  smoker: "No" | "Yes" | "Former" | "";
  diabetes: "No" | "Type 1" | "Type 2" | "Prediabetes" | "";
  medications: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  insuranceProvider: string;
  insuranceNumber: string;
  preferredLanguage: string;
  howDidYouHear: string;
  // Dynamic Medical Conditions
  medicalConditions: MedicalCondition[];
  // Dynamic Surgical History
  surgicalHistory: SurgicalHistory[];
};

type Errors = Partial<Record<keyof PatientData, string>>;

const EMPTY: PatientData = {
  name: "",
  age: "",
  sex: "",
  heightCm: "",
  weightKg: "",
  systolic: "",
  diastolic: "",
  heartRate: "",
  totalChol: "",
  hdl: "",
  ldl: "",
  triglycerides: "",
  fastingGlucose: "",
  smoker: "",
  diabetes: "",
  medications: "",
  allergies: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  insuranceProvider: "",
  insuranceNumber: "",
  preferredLanguage: "",
  howDidYouHear: "",
  medicalConditions: [],
  surgicalHistory: []
};

// Organ and condition data
const ORGAN_CONDITIONS = {
  "Heart & Cardiovascular": [
    "Heart Attack", "High Blood Pressure", "Arrhythmia", "Heart Failure", 
    "Coronary Artery Disease", "Angina", "Heart Murmur", "Cardiomyopathy"
  ],
  "Lungs & Respiratory": [
    "Asthma", "COPD", "Pneumonia", "Sleep Apnea", "Bronchitis", 
    "Emphysema", "Pulmonary Fibrosis", "Lung Cancer"
  ],
  "Liver": [
    "Hepatitis A", "Hepatitis B", "Hepatitis C", "Cirrhosis", 
    "Fatty Liver Disease", "Liver Cancer", "Jaundice"
  ],
  "Kidneys": [
    "Kidney Stones", "Chronic Kidney Disease", "Kidney Failure", 
    "Dialysis", "Polycystic Kidney Disease", "Kidney Infection"
  ],
  "Brain & Nervous System": [
    "Stroke", "Seizures", "Migraines", "Parkinson's Disease", 
    "Multiple Sclerosis", "Epilepsy", "Alzheimer's", "Dementia"
  ],
  "Digestive System": [
    "IBS", "Crohn's Disease", "Ulcerative Colitis", "GERD", 
    "Gallstones", "Celiac Disease", "Diverticulitis", "Colon Cancer"
  ],
  "Endocrine System": [
    "Hypothyroidism", "Hyperthyroidism", "Diabetes Type 1", 
    "Diabetes Type 2", "Adrenal Disorders", "Pituitary Disorders"
  ],
  "Reproductive System": [
    "PCOS", "Endometriosis", "Prostate Issues", "Fertility Concerns", 
    "Menopause", "Erectile Dysfunction", "Ovarian Cysts"
  ],
  "Musculoskeletal": [
    "Arthritis", "Osteoporosis", "Back Problems", "Joint Replacements", 
    "Fibromyalgia", "Gout", "Rheumatoid Arthritis"
  ],
  "Skin": [
    "Eczema", "Psoriasis", "Skin Cancer", "Acne", "Rosacea", 
    "Vitiligo", "Dermatitis", "Melanoma"
  ],
  "Eyes": [
    "Glaucoma", "Macular Degeneration", "Cataracts", "Diabetic Retinopathy", 
    "Dry Eye", "Retinal Detachment", "Vision Loss"
  ],
  "Ears": [
    "Hearing Loss", "Tinnitus", "Vertigo", "Ear Infections", 
    "Meniere's Disease", "Otosclerosis"
  ],
  "Immune System": [
    "Lupus", "Rheumatoid Arthritis", "HIV/AIDS", "Allergies", 
    "Autoimmune Hepatitis", "Sjogren's Syndrome", "Immunodeficiency"
  ]
};

// Body parts and surgeries data
const BODY_PART_SURGERIES = {
  "Heart & Chest": [
    "Coronary Artery Bypass", "Heart Valve Replacement", "Pacemaker Implant", 
    "Angioplasty", "Heart Transplant", "Chest Tube Insertion", "Thoracotomy"
  ],
  "Lungs & Respiratory": [
    "Lung Biopsy", "Lobectomy", "Pneumonectomy", "Bronchoscopy", 
    "Tracheostomy", "Lung Transplant", "Pleural Drainage"
  ],
  "Abdomen & Digestive": [
    "Appendectomy", "Gallbladder Removal", "Hernia Repair", "Bowel Resection", 
    "Gastric Bypass", "Liver Biopsy", "Splenectomy", "Pancreatic Surgery"
  ],
  "Kidneys & Urinary": [
    "Kidney Transplant", "Nephrectomy", "Kidney Stone Removal", "Bladder Surgery", 
    "Prostate Surgery", "Ureteroscopy", "Dialysis Access"
  ],
  "Brain & Nervous System": [
    "Craniotomy", "Brain Tumor Removal", "Spinal Fusion", "Laminectomy", 
    "Deep Brain Stimulation", "Shunt Placement", "Spinal Cord Surgery"
  ],
  "Orthopedic & Joints": [
    "Hip Replacement", "Knee Replacement", "Shoulder Surgery", "Spinal Fusion", 
    "Fracture Repair", "Arthroscopy", "Joint Fusion", "Bone Graft"
  ],
  "Eyes": [
    "Cataract Surgery", "LASIK", "Retinal Surgery", "Glaucoma Surgery", 
    "Corneal Transplant", "Eye Muscle Surgery", "Vitrectomy"
  ],
  "Ears, Nose & Throat": [
    "Tonsillectomy", "Adenoidectomy", "Sinus Surgery", "Ear Tube Surgery", 
    "Thyroid Surgery", "Parathyroid Surgery", "Laryngoscopy"
  ],
  "Reproductive System": [
    "Hysterectomy", "Ovarian Surgery", "Prostate Surgery", "Cesarean Section", 
    "Tubal Ligation", "Vasectomy", "Endometrial Surgery"
  ],
  "Skin & Soft Tissue": [
    "Skin Graft", "Mole Removal", "Liposuction", "Breast Surgery", 
    "Tumor Excision", "Wound Debridement", "Plastic Surgery"
  ],
  "Vascular System": [
    "Aneurysm Repair", "Varicose Vein Surgery", "Arterial Bypass", 
    "Stent Placement", "Vascular Graft", "Thrombectomy"
  ],
  "Other": [
    "Biopsy", "Exploratory Surgery", "Emergency Surgery", "Diagnostic Surgery", 
    "Reconstructive Surgery", "Cosmetic Surgery", "Other"
  ]
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<PatientData>(EMPTY)
  const [currentPage, setCurrentPage] = useState<'home' | 'myinfo' | 'chat' | 'data'>('home')
  const [submittedData, setSubmittedData] = useState<PatientData | null>(null)

  // Step configuration
  const steps = [
    { id: 1, title: "Personal Info", fields: ["name", "age", "sex", "email", "phone"] },
    { id: 2, title: "Address", fields: ["address", "city", "state", "zipCode"] },
    { id: 3, title: "Vitals", fields: ["heightCm", "weightKg", "systolic", "diastolic", "heartRate"] },
    { id: 4, title: "Labs", fields: ["totalChol", "hdl", "ldl", "triglycerides", "fastingGlucose"] },
    { id: 5, title: "Medical History", fields: ["smoker", "diabetes", "medications", "allergies"] },
    { id: 6, title: "Surgical History", fields: [] },
    { id: 7, title: "Emergency Contact", fields: ["emergencyContactName", "emergencyContactPhone"] },
    { id: 8, title: "Insurance", fields: ["insuranceProvider", "insuranceNumber", "preferredLanguage", "howDidYouHear"] }
  ]

  const totalSteps = steps.length

  // Validation functions
  function isPositiveNumberStr(s: string) {
    if (!s) return false;
    const n = Number(s);
    return Number.isFinite(n) && n > 0;
  }

  function isNonNegativeNumberStr(s: string) {
    if (!s) return false;
    const n = Number(s);
    return Number.isFinite(n) && n >= 0;
  }

  function phoneLooksValid(s: string) {
    if (!s) return false;
    const digits = s.replace(/\D/g, "");
    return digits.length >= 10;
  }

  const validateStep = useCallback((stepNumber: number): Errors => {
    const step = steps.find(s => s.id === stepNumber);
    if (!step) return {};
    
    const errors: Errors = {};
    const stepFields = step.fields as (keyof PatientData)[];

    stepFields.forEach(field => {
      const value = formData[field as keyof PatientData];
      
      switch (field) {
        case 'name':
        case 'email':
        case 'phone':
        case 'address':
        case 'city':
        case 'state':
        case 'zipCode':
        case 'emergencyContactName':
          if (!(value as string)?.trim()) errors[field] = "Required";
          break;
        case 'age':
        case 'heightCm':
        case 'weightKg':
        case 'systolic':
        case 'diastolic':
        case 'heartRate':
          if (!isPositiveNumberStr(value as string)) errors[field] = "Enter a valid number";
          break;
        case 'sex':
        case 'smoker':
        case 'diabetes':
          if (!value) errors[field] = "Required";
          break;
        case 'emergencyContactPhone':
          if (!phoneLooksValid(value as string)) errors[field] = "Enter a valid phone number";
          break;
        case 'totalChol':
        case 'hdl':
        case 'ldl':
        case 'triglycerides':
        case 'fastingGlucose':
          if (!isNonNegativeNumberStr(value as string)) errors[field] = "Enter a valid number";
          break;
      }
    });

    // Special validation for blood pressure
    if (stepNumber === 3 && isPositiveNumberStr(formData.systolic) && isPositiveNumberStr(formData.diastolic)) {
      if (Number(formData.systolic) <= Number(formData.diastolic)) {
        errors.systolic = "Systolic should be greater than diastolic";
        errors.diastolic = "Diastolic should be less than systolic";
      }
    }

    return errors;
  }, [formData, steps]);

  // Only validate on blur, not on every keystroke
  const [stepErrors, setStepErrors] = useState<Errors>({});
  const hasCurrentStepErrors = Object.keys(stepErrors).length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }


  const nextStep = () => {
    // Validate current step before proceeding
    const errors = validateStep(currentStep);
    setStepErrors(errors);
    
    if (currentStep < totalSteps && Object.keys(errors).length === 0) {
      setCurrentStep(prev => prev + 1);
      setStepErrors({}); // Clear errors for next step
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setStepErrors({}); // Clear errors when going back
    }
  }

  // Removed goToStep function - users must complete steps sequentially

  const addMedicalCondition = () => {
    const newCondition: MedicalCondition = {
      id: Date.now().toString(),
      organ: "",
      condition: "",
      details: ""
    };
    setFormData(prev => ({
      ...prev,
      medicalConditions: [...prev.medicalConditions, newCondition]
    }));
  }

  const removeMedicalCondition = (id: string) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(condition => condition.id !== id)
    }));
  }

  const updateMedicalCondition = (id: string, field: keyof MedicalCondition, value: string) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.map(condition =>
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    }));
  }

  const addSurgicalHistory = () => {
    const newSurgery: SurgicalHistory = {
      id: Date.now().toString(),
      bodyPart: "",
      surgery: "",
      year: "",
      details: ""
    };
    setFormData(prev => ({
      ...prev,
      surgicalHistory: [...prev.surgicalHistory, newSurgery]
    }));
  }

  const removeSurgicalHistory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      surgicalHistory: prev.surgicalHistory.filter(surgery => surgery.id !== id)
    }));
  }

  const updateSurgicalHistory = (id: string, field: keyof SurgicalHistory, value: string) => {
    setFormData(prev => ({
      ...prev,
      surgicalHistory: prev.surgicalHistory.map(surgery =>
        surgery.id === id ? { ...surgery, [field]: value } : surgery
      )
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate all steps before final submission
    let allErrors: Errors = {};
    for (let i = 1; i <= totalSteps; i++) {
      const stepErrors = validateStep(i);
      allErrors = { ...allErrors, ...stepErrors };
    }
    
    if (Object.keys(allErrors).length > 0) {
      alert('Please complete all required fields before submitting.');
      return;
    }
    
    try {
      // Save user data to JSON file via API
      const response = await fetch('/api/save-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('User data saved successfully:', result);
      } else {
        console.error('Failed to save user data');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
    
    // Here you would typically send the data to your backend
    console.log('Patient information submitted:', formData)
    setSubmittedData(formData)
    alert('Thank you for your information! We will contact you soon to complete your registration.')
    setIsModalOpen(false)
    setCurrentStep(1)
    setFormData(EMPTY)
    setStepErrors({})
  }

  const openModal = () => {
    setIsModalOpen(true)
    setCurrentStep(1)
    setFormData(EMPTY)
    setStepErrors({})
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentStep(1)
    setFormData(EMPTY)
    setStepErrors({})
  }
  // Medical History Page Component
  const MedicalHistoryPage = () => (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-2xl font-bold text-black hover:text-white transition-all duration-300 hover:bg-black px-3 py-1 rounded-lg"
                >
                  BioBridge
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Home
              </button>
              <button
                onClick={openModal}
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition duration-200"
              >
                Update Information
              </button>
              <button
                onClick={() => setCurrentPage('data')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200"
                title="Admin Access"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Medical History Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">My Medical History</h1>
            <p className="text-xl text-gray-600">Your complete health profile and medical records</p>
          </div>

          {submittedData ? (
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.age} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Sex</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.sex}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {submittedData.address}, {submittedData.city}, {submittedData.state} {submittedData.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-6">Vital Signs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Height</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.heightCm} cm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Weight</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.weightKg} kg</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Blood Pressure</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.systolic}/{submittedData.diastolic} mmHg</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Heart Rate</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.heartRate} bpm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">BMI</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {submittedData.heightCm && submittedData.weightKg 
                        ? (Number(submittedData.weightKg) / Math.pow(Number(submittedData.heightCm) / 100, 2)).toFixed(1)
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-6">Laboratory Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Total Cholesterol</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.totalChol} mg/dL</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">HDL</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.hdl} mg/dL</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">LDL</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.ldl} mg/dL</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Triglycerides</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.triglycerides} mg/dL</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Fasting Glucose</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.fastingGlucose} mg/dL</p>
                  </div>
                </div>
              </div>

              {/* Medical Conditions */}
              {submittedData.medicalConditions.length > 0 && (
                <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-black mb-6">Medical Conditions</h2>
                  <div className="space-y-4">
                    {submittedData.medicalConditions.map((condition) => (
                      <div key={condition.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {condition.organ} - {condition.condition}
                            </h3>
                            {condition.details && (
                              <p className="text-gray-600 mt-2">{condition.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Surgical History */}
              {submittedData.surgicalHistory.length > 0 && (
                <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-black mb-6">Surgical History</h2>
                  <div className="space-y-4">
                    {submittedData.surgicalHistory.map((surgery) => (
                      <div key={surgery.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {surgery.bodyPart} - {surgery.surgery}
                            </h3>
                            <p className="text-gray-600 mt-1">Year: {surgery.year}</p>
                            {surgery.details && (
                              <p className="text-gray-600 mt-2">{surgery.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-6">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Smoking Status</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.smoker}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Diabetes Status</label>
                    <p className="text-lg font-semibold text-gray-900">{submittedData.diabetes}</p>
                  </div>
                  {submittedData.medications && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Current Medications</label>
                      <p className="text-lg font-semibold text-gray-900">{submittedData.medications}</p>
                    </div>
                  )}
                  {submittedData.allergies && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Allergies</label>
                      <p className="text-lg font-semibold text-gray-900">{submittedData.allergies}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Medical History Available</h3>
              <p className="text-gray-600 mb-8">You haven't submitted any medical information yet.</p>
              <button
                onClick={openModal}
                className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-lg"
              >
                Start Your Medical Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main Home Page Component
  const HomePage = () => (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="text-2xl font-bold text-black hover:text-white transition-all duration-300 hover:bg-black px-3 py-1 rounded-lg"
                >
                  BioBridge
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('chat')}
                className="text-black px-6 py-2 rounded-full text-sm font-medium hover:text-gray-600 transition duration-200"
              >
                myAssistant
              </button>
              <button 
                onClick={() => setCurrentPage('myinfo')}
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                myInfo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-black mb-8">
              <GradientText
                colors={["#ffffff", "#dc2626", "#ffffff", "#dc2626", "#ffffff", "#dc2626"]}
                animationSpeed={4}
                showBorder={false}
                className="text-6xl md:text-8xl font-black"
              >
                Get Started Now
              </GradientText>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your healthcare experience with our intelligent platform
            </p>
            <button 
              onClick={openModal}
              className="inline-flex items-center justify-center px-16 py-8 text-3xl font-bold text-black bg-white border-2 border-black rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gray-50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition duration-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Get started in seconds with our streamlined process</p>
            </div>
            
            <div 
              className="bg-gray-50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition duration-300 cursor-pointer"
              onClick={() => {
                console.log('Lock icon clicked - Admin access!');
                setCurrentPage('data');
              }}
              title="Admin Access - Click the lock icon"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
            </div>
            
            <div className="bg-gray-50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-gray-100 transition duration-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">AI-Powered</h3>
              <p className="text-gray-600">Intelligent insights to optimize your health journey</p>
            </div>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Transforming Healthcare Through Technology
              </h2>
              <p className="text-lg text-black mb-6">
                BioBridge represents the future of healthcare technology, combining 
                artificial intelligence, secure data management, and user-friendly 
                interfaces to create a comprehensive health information platform.
              </p>
              <p className="text-lg text-black mb-8">
                Our mission is to bridge the gap between patients and healthcare 
                providers, ensuring that critical health information is accessible, 
                secure, and actionable for better health outcomes.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">10K+</div>
                  <div className="text-black">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">500+</div>
                  <div className="text-black">Healthcare Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">99.9%</div>
                  <div className="text-black">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">24/7</div>
                  <div className="text-black">Support</div>
                </div>
              </div>
            </div>
            <div className="bg-white border-2 border-black rounded-2xl p-8 text-black">
              <h3 className="text-2xl font-bold mb-6 text-black">Why Choose BioBridge?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-black mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-black">HIPAA-compliant security and privacy protection</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-black mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-black">Intuitive interface designed for all users</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-black mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-black">Advanced AI-powered health insights</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-black mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-black">Seamless integration with existing systems</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-black mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-black">24/7 customer support and training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">BioBridge</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Comprehensive Health Information Platform connecting patients, 
                providers, and data for better health outcomes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 BioBridge. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      {/* Step-by-Step Patient Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Progress Bar */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Patient Registration</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <p className="text-gray-600">Please provide your basic personal details to get started.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Full Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={stepErrors.name}
                      placeholder="Jane Doe"
                    />
                    <TextField
                      label="Age (years) *"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      error={stepErrors.age}
                      placeholder="32"
                    />
                    <SelectField
                      label="Sex *"
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      error={stepErrors.sex ? stepErrors.sex : undefined}
                      options={["Male", "Female", "Other", "Prefer not to say"]}
                      placeholder="Select"
                    />
                    <TextField
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={stepErrors.email ? stepErrors.email : undefined}
                      placeholder="jane@example.com"
                    />
                    <TextField
                      label="Phone Number *"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={stepErrors.phone ? stepErrors.phone : undefined}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Address Information</h3>
                    <p className="text-gray-600">Please provide your current address details.</p>
                  </div>
                  <div className="space-y-4">
                    <TextField
                      label="Street Address *"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={stepErrors.address ? stepErrors.address : undefined}
                      placeholder="123 Main Street"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextField
                        label="City *"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        error={stepErrors.city ? stepErrors.city : undefined}
                        placeholder="New York"
                      />
                      <TextField
                        label="State *"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        error={stepErrors.state ? stepErrors.state : undefined}
                        placeholder="NY"
                      />
                      <TextField
                        label="ZIP Code *"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        error={stepErrors.zipCode ? stepErrors.zipCode : undefined}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Vitals */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Vitals & Measurements</h3>
                    <p className="text-gray-600">Please provide your current vital signs and measurements.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Height (cm) *"
                      name="heightCm"
                      type="number"
                      value={formData.heightCm}
                      onChange={handleInputChange}
                      error={stepErrors.heightCm ? stepErrors.heightCm : undefined}
                      placeholder="170"
                    />
                    <TextField
                      label="Weight (kg) *"
                      name="weightKg"
                      type="number"
                      value={formData.weightKg}
                      onChange={handleInputChange}
                      error={stepErrors.weightKg ? stepErrors.weightKg : undefined}
                      placeholder="68"
                    />
                    <TextField
                      label="Systolic (mmHg) *"
                      name="systolic"
                      type="number"
                      value={formData.systolic}
                      onChange={handleInputChange}
                      error={stepErrors.systolic ? stepErrors.systolic : undefined}
                      placeholder="120"
                    />
                    <TextField
                      label="Diastolic (mmHg) *"
                      name="diastolic"
                      type="number"
                      value={formData.diastolic}
                      onChange={handleInputChange}
                      error={stepErrors.diastolic ? stepErrors.diastolic : undefined}
                      placeholder="80"
                    />
                    <TextField
                      label="Heart Rate (bpm) *"
                      name="heartRate"
                      type="number"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      error={stepErrors.heartRate ? stepErrors.heartRate : undefined}
                      placeholder="72"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Labs */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Laboratory Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Total Cholesterol (mg/dL)"
                      name="totalChol"
                      type="number"
                      value={formData.totalChol}
                      onChange={handleInputChange}
                      error={stepErrors.totalChol ? stepErrors.totalChol : undefined}
                      placeholder="185"
                    />
                    <TextField
                      label="HDL (mg/dL)"
                      name="hdl"
                      type="number"
                      value={formData.hdl}
                      onChange={handleInputChange}
                      error={stepErrors.hdl ? stepErrors.hdl : undefined}
                      placeholder="55"
                    />
                    <TextField
                      label="LDL (mg/dL)"
                      name="ldl"
                      type="number"
                      value={formData.ldl}
                      onChange={handleInputChange}
                      error={stepErrors.ldl ? stepErrors.ldl : undefined}
                      placeholder="110"
                    />
                    <TextField
                      label="Triglycerides (mg/dL)"
                      name="triglycerides"
                      type="number"
                      value={formData.triglycerides}
                      onChange={handleInputChange}
                      error={stepErrors.triglycerides ? stepErrors.triglycerides : undefined}
                      placeholder="140"
                    />
                    <TextField
                      label="Fasting Glucose (mg/dL)"
                      name="fastingGlucose"
                      type="number"
                      value={formData.fastingGlucose}
                      onChange={handleInputChange}
                      error={stepErrors.fastingGlucose ? stepErrors.fastingGlucose : undefined}
                      placeholder="95"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Medical History */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical History</h3>
                  
                  {/* Basic Medical History */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Basic Medical Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Smoking Status"
                        name="smoker"
                        value={formData.smoker}
                        onChange={handleInputChange}
                        error={stepErrors.smoker ? stepErrors.smoker : undefined}
                        options={["No", "Yes", "Former"]}
                        placeholder="Select"
                      />
                      <SelectField
                        label="Diabetes Status"
                        name="diabetes"
                        value={formData.diabetes}
                        onChange={handleInputChange}
                        error={stepErrors.diabetes ? stepErrors.diabetes : undefined}
                        options={["No", "Prediabetes", "Type 1", "Type 2"]}
                        placeholder="Select"
                      />
                    </div>
                    <div className="space-y-4 mt-4">
                      <TextArea
                        label="Current Medications"
                        name="medications"
                        value={formData.medications}
                        onChange={handleInputChange}
                        placeholder="e.g., Atorvastatin 20mg nightly"
                      />
                      <TextArea
                        label="Allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        placeholder="e.g., Penicillin, peanuts"
                      />
                    </div>
                  </div>

                  {/* Dynamic Medical Conditions */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Medical Conditions</h4>
                      <button
                        type="button"
                        onClick={addMedicalCondition}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm font-medium"
                      >
                        + Add Condition
                      </button>
                    </div>
                    
                    {formData.medicalConditions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No medical conditions added yet.</p>
                        <p className="text-sm">Click "Add Condition" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.medicalConditions.map((condition) => (
                          <MedicalConditionCard
                            key={condition.id}
                            condition={condition}
                            index={0}
                            onUpdate={updateMedicalCondition}
                            onRemove={removeMedicalCondition}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Surgical History */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Surgical History</h3>
                  
                  {/* Dynamic Surgical History */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Surgical Procedures</h4>
                      <button
                        type="button"
                        onClick={addSurgicalHistory}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm font-medium"
                      >
                        + Add Surgery
                      </button>
                    </div>
                    
                    {formData.surgicalHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No surgical procedures added yet.</p>
                        <p className="text-sm">Click "Add Surgery" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.surgicalHistory.map((surgery) => (
                          <SurgicalHistoryCard
                            key={surgery.id}
                            surgery={surgery}
                            index={0}
                            onUpdate={updateSurgicalHistory}
                            onRemove={removeSurgicalHistory}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 7: Emergency Contact */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Emergency Contact Name"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      error={stepErrors.emergencyContactName ? stepErrors.emergencyContactName : undefined}
                      placeholder="John Doe"
                    />
                    <TextField
                      label="Emergency Contact Phone"
                      name="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      error={stepErrors.emergencyContactPhone ? stepErrors.emergencyContactPhone : undefined}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {/* Step 8: Insurance */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Insurance & Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Insurance Provider"
                      name="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={handleInputChange}
                      placeholder="Blue Cross Blue Shield"
                    />
                    <TextField
                      label="Insurance Policy Number"
                      name="insuranceNumber"
                      value={formData.insuranceNumber}
                      onChange={handleInputChange}
                      placeholder="ABC123456789"
                    />
                    <SelectField
                      label="Preferred Language"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      options={["English", "Spanish", "French", "German", "Other"]}
                      placeholder="Select Language"
                    />
                    <SelectField
                      label="How did you hear about us?"
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                      options={["Google Search", "Social Media", "Friend/Family Referral", "Healthcare Provider", "Advertisement", "Other"]}
                      placeholder="Select Option"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={hasCurrentStepErrors}
                      className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                        hasCurrentStepErrors
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {hasCurrentStepErrors ? 'Complete Required Fields' : 'Next'}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
                    >
                      Submit Registration
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Chat Page Component
  const ChatPageComponent = () => (
    <ChatPage 
      medicalData={submittedData} 
      onBack={() => setCurrentPage('home')} 
    />
  );

  // Data Viewer Component
  const DataViewerComponent = () => (
    <DataViewer onBack={() => setCurrentPage('home')} />
  );

  // Main return statement with page navigation
  if (currentPage === 'myinfo') {
    return <MedicalHistoryPage />;
  } else if (currentPage === 'chat') {
    return <ChatPageComponent />;
  } else if (currentPage === 'data') {
    return <DataViewerComponent />;
  } else {
    return <HomePage />;
  }
}

// Helper Components
function TextField({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 outline-none transition ${
          error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
        }`}
      />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full rounded-lg border px-3 py-2 bg-white outline-none transition ${
          value ? "text-gray-900" : "text-gray-400"
        } ${
          error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-indigo-200"
        }`}
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </label>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition resize-y focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  );
}

function MedicalConditionCard({
  condition,
  index,
  onUpdate,
  onRemove,
}: {
  condition: MedicalCondition;
  index: number;
  onUpdate: (id: string, field: keyof MedicalCondition, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const organOptions = Object.keys(ORGAN_CONDITIONS);
  const conditionOptions = condition.organ ? ORGAN_CONDITIONS[condition.organ as keyof typeof ORGAN_CONDITIONS] || [] : [];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h5 className="text-sm font-medium text-gray-900">Condition #{index + 1}</h5>
        <button
          type="button"
          onClick={() => onRemove(condition.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Organ System</label>
          <select
            value={condition.organ}
            onChange={(e) => onUpdate(condition.id, 'organ', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select organ system</option>
            {organOptions.map(organ => (
              <option key={organ} value={organ}>{organ}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
          <select
            value={condition.condition}
            onChange={(e) => onUpdate(condition.id, 'condition', e.target.value)}
            disabled={!condition.organ}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200 ${
              !condition.organ ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select condition</option>
            {conditionOptions.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
        <textarea
          value={condition.details}
          onChange={(e) => onUpdate(condition.id, 'details', e.target.value)}
          placeholder="Provide additional details about this condition..."
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition resize-y focus:ring-2 focus:ring-indigo-200"
        />
      </div>
    </div>
  );
}

function SurgicalHistoryCard({
  surgery,
  index,
  onUpdate,
  onRemove,
}: {
  surgery: SurgicalHistory;
  index: number;
  onUpdate: (id: string, field: keyof SurgicalHistory, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const bodyPartOptions = Object.keys(BODY_PART_SURGERIES);
  const surgeryOptions = surgery.bodyPart ? BODY_PART_SURGERIES[surgery.bodyPart as keyof typeof BODY_PART_SURGERIES] || [] : [];
  
  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h5 className="text-sm font-medium text-gray-900">Surgery #{index + 1}</h5>
        <button
          type="button"
          onClick={() => onRemove(surgery.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Body Part</label>
          <select
            value={surgery.bodyPart}
            onChange={(e) => onUpdate(surgery.id, 'bodyPart', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select body part</option>
            {bodyPartOptions.map(part => (
              <option key={part} value={part}>{part}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Surgery Type</label>
          <select
            value={surgery.surgery}
            onChange={(e) => onUpdate(surgery.id, 'surgery', e.target.value)}
            disabled={!surgery.bodyPart}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200 ${
              !surgery.bodyPart ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select surgery</option>
            {surgeryOptions.map(surgeryType => (
              <option key={surgeryType} value={surgeryType}>{surgeryType}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
          <select
            value={surgery.year}
            onChange={(e) => onUpdate(surgery.id, 'year', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select year</option>
            {yearOptions.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
        <textarea
          value={surgery.details}
          onChange={(e) => onUpdate(surgery.id, 'details', e.target.value)}
          placeholder="Provide additional details about this surgery..."
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition resize-y focus:ring-2 focus:ring-indigo-200"
        />
      </div>
    </div>
  );
}

export default App
