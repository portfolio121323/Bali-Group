import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, PhoneCall, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLocation, Link } from 'react-router-dom';

const STEPS = [
  'Project Scope',
  'Industry Sector',
  'Grain Variety',
  'Storage Capacity',
  'Contact Details',
  'Review & Submit'
];

export default function Quote() {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    projectType: 'New Greenfield Turnkey Plant',
    industry: 'Commercial Grain Trading',
    material: 'Wheat',
    capacity: '10000',
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');

  // Check URL params for pre-selected product or project
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const product = params.get('product');
    const project = params.get('project');
    if (product) {
      setFormData(prev => ({
        ...prev,
        projectType: `Equipment Specification: ${product}`,
        notes: `Inquiry regarding ${product}`
      }));
    } else if (project) {
      setFormData(prev => ({
        ...prev,
        projectType: `Similar Scope to ${project}`,
        notes: `Interested in facility similar to ${project}`
      }));
    }
  }, [location.search]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const generatedRef = `BG-ENQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setEnquiryRef(generatedRef);

    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        reference: generatedRef,
        status: 'New',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn("Notice: Firestore stored locally or offline mode active", error);
      try {
        const storedLeads = JSON.parse(localStorage.getItem('bali_leads') || '[]');
        storedLeads.push({ ...formData, reference: generatedRef, createdAt: new Date().toISOString() });
        localStorage.setItem('bali_leads', JSON.stringify(storedLeads));
      } catch (e) {
        // ignore
      }
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <Layout>
      <div className="bg-[#F6F6F4] min-h-screen pt-36 pb-24 text-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#0B0B0B]" />
              <span className="text-[#0B0B0B] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                ENGINEERING CONSULTATION & QUOTATION
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#0B0B0B] uppercase tracking-tight leading-[1.02] mb-4">
              PROJECT FEASIBILITY & ESTIMATE
            </h1>
            <p className="text-[#303236] text-base leading-relaxed">
              Complete the project parameters below. Our industrial engineering team in Chandigarh will calculate initial equipment sizing and provide an EPC proposal.
            </p>
          </div>

          {/* Progress Indicator */}
          {!isSubmitted && (
            <div className="mb-12">
              <div className="flex items-center justify-between relative mb-6">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#E9EAEC] z-0" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#0B0B0B] z-0 transition-all duration-300"
                  style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />
                
                {STEPS.map((step, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => idx <= currentStep && setCurrentStep(idx)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-none flex items-center justify-center font-bold text-xs transition-colors font-mono border",
                      idx < currentStep 
                        ? "bg-[#F4FF00] text-[#0B0B0B] border-[#0B0B0B]" 
                        : idx === currentStep 
                        ? "bg-[#0B0B0B] text-white border-[#0B0B0B]" 
                        : "bg-white text-[#A8AFB8] border-[#E9EAEC]"
                    )}>
                      {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-xs font-mono uppercase font-bold text-[#0B0B0B] text-center tracking-wider">
                STEP {currentStep + 1} OF {STEPS.length}: {STEPS[currentStep]}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white p-8 md:p-12 border border-[#E9EAEC] shadow-sm">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-[#F4FF00] flex items-center justify-center mx-auto mb-6 text-[#0B0B0B]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#0B0B0B] uppercase block mb-2">
                  REQUEST LOGGED WITH ENGINEERING DESK
                </span>
                <h2 className="text-3xl font-black text-[#0B0B0B] uppercase tracking-tight mb-4">
                  Feasibility Request Received
                </h2>
                <p className="text-[#303236] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                  Your project scope has been dispatched to our lead technical director. A structural feasibility summary and initial equipment layout will be prepared.
                </p>
                
                <div className="bg-[#F6F6F4] inline-block px-6 py-4 border border-[#E9EAEC] font-mono text-sm text-[#0B0B0B] mb-8 font-bold">
                  PROJECT REFERENCE: <span className="text-[#0B0B0B] bg-[#F4FF00] px-2 py-0.5 ml-2">{enquiryRef}</span>
                </div>

                <div className="pt-6 border-t border-[#E9EAEC] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
                  <span>Urgent technical requirement? Call direct:</span>
                  <a href="tel:+918872799999" className="font-bold text-[#0B0B0B] hover:text-[#0B0B0B] flex items-center gap-1.5 underline">
                    <PhoneCall className="w-3.5 h-3.5" /> +91 88727 99999
                  </a>
                </div>

                <div className="mt-8">
                  <Link 
                    to="/" 
                    className="inline-block bg-[#0B0B0B] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  
                  {/* Step 0: Scope */}
                  {currentStep === 0 && (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
                        What type of project are you planning?
                      </h3>
                      <p className="text-xs text-[#303236] mb-6">Select your primary execution requirement.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { title: 'New Greenfield Turnkey Plant', desc: 'Complete civil, silos, handling, and SCADA automation' },
                          { title: 'Expansion of Existing Plant', desc: 'Additional storage bins and conveying line capacity' },
                          { title: 'Equipment Supply & Replacement', desc: 'Elevators, chain conveyors, cleaners, or fans only' },
                          { title: 'Engineering & Feasibility Study', desc: 'Site survey, structural calculations, and 3D BIM design' }
                        ].map(opt => (
                          <div 
                            key={opt.title}
                            onClick={() => setFormData({...formData, projectType: opt.title})}
                            className={cn(
                              "border-2 p-6 cursor-pointer transition-all flex flex-col justify-between",
                              formData.projectType === opt.title 
                                ? "border-[#0B0B0B] bg-[#F6F6F4]" 
                                : "border-[#E9EAEC] hover:border-[#0B0B0B]/40"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-sm text-[#0B0B0B] uppercase">{opt.title}</span>
                              <div className={cn(
                                "w-4 h-4 border-2 transition-colors",
                                formData.projectType === opt.title ? "border-[#0B0B0B] bg-[#F4FF00]" : "border-[#A8AFB8]"
                              )} />
                            </div>
                            <p className="text-xs text-[#303236]">{opt.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Industry */}
                  {currentStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
                        Select your industry sector
                      </h3>
                      <p className="text-xs text-[#303236] mb-6">Equipment velocity and angles are engineered around your application.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          'Commercial Grain Trading',
                          'Rice & Flour Milling',
                          'Animal Feed Nutrition',
                          'Ethanol & Distilleries',
                          'Marine Port Terminals',
                          'Government Strategic Reserve'
                        ].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => setFormData({...formData, industry: opt})}
                            className={cn(
                              "border-2 p-5 cursor-pointer transition-all text-center flex flex-col items-center justify-center min-h-[90px]",
                              formData.industry === opt 
                                ? "border-[#0B0B0B] bg-[#F4FF00] text-[#0B0B0B] font-bold" 
                                : "border-[#E9EAEC] hover:border-[#0B0B0B]/40 text-[#303236]"
                            )}
                          >
                            <span className="text-xs font-bold uppercase tracking-wider">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Material */}
                  {currentStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
                        Primary Grain or Material Stored
                      </h3>
                      <p className="text-xs text-[#303236] mb-6">Bulk density and friction coefficients determine wall sheet gauge and stiffener spacing.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['Wheat', 'Paddy / Rice', 'Maize / Corn', 'Soybean', 'Barley', 'Rapeseed', 'Animal Feed Pellets', 'Other Bulk Cereal'].map(opt => (
                          <div 
                            key={opt}
                            onClick={() => setFormData({...formData, material: opt})}
                            className={cn(
                              "border-2 p-4 cursor-pointer transition-all text-center",
                              formData.material === opt 
                                ? "border-[#0B0B0B] bg-[#0B0B0B] text-[#F4FF00] font-bold" 
                                : "border-[#E9EAEC] hover:border-[#0B0B0B]/40 text-[#303236]"
                            )}
                          >
                            <span className="text-xs font-semibold uppercase">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Capacity */}
                  {currentStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
                        Target Storage Capacity (Metric Tonnes)
                      </h3>
                      <p className="text-xs text-[#303236] mb-6">Enter total planned volume in Metric Tonnes (MT).</p>

                      <div className="max-w-md">
                        <div className="relative">
                          <input 
                            type="number"
                            min="100"
                            placeholder="e.g. 10000"
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                            className="w-full text-4xl font-mono font-bold text-[#0B0B0B] bg-[#F6F6F4] border-2 border-[#0B0B0B] p-4 focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-[#0B0B0B]">
                            METRIC TONNES (MT)
                          </span>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {['2,500 MT', '5,000 MT', '10,000 MT', '20,000 MT', '50,000 MT', '100,000 MT'].map(preset => (
                            <button
                              type="button"
                              key={preset}
                              onClick={() => setFormData({...formData, capacity: preset.replace(/\D/g, '')})}
                              className="text-[11px] font-mono font-bold px-3 py-1.5 bg-[#F6F6F4] border border-[#E9EAEC] hover:border-[#0B0B0B] text-[#303236]"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Contact */}
                  {currentStep === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
                        Company & Contact Information
                      </h3>
                      <p className="text-xs text-[#303236] mb-6">Where should our engineering desk transmit the project dossier?</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-[#0B0B0B] uppercase tracking-wider block">
                            Full Name *
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="Engineering Director / Project Lead"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#F6F6F4] border border-[#E9EAEC] p-3.5 focus:border-[#0B0B0B] focus:outline-none text-sm text-[#0B0B0B]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-[#0B0B0B] uppercase tracking-wider block">
                            Company / Organization *
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="Enterprise or Trading House"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="w-full bg-[#F6F6F4] border border-[#E9EAEC] p-3.5 focus:border-[#0B0B0B] focus:outline-none text-sm text-[#0B0B0B]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-[#0B0B0B] uppercase tracking-wider block">
                            Work Email *
                          </label>
                          <input 
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[#F6F6F4] border border-[#E9EAEC] p-3.5 focus:border-[#0B0B0B] focus:outline-none text-sm text-[#0B0B0B]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-[#0B0B0B] uppercase tracking-wider block">
                            Direct Phone / WhatsApp *
                          </label>
                          <input 
                            type="tel"
                            required
                            placeholder="+country code phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-[#F6F6F4] border border-[#E9EAEC] p-3.5 focus:border-[#0B0B0B] focus:outline-none text-sm text-[#0B0B0B]"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-mono font-bold text-[#0B0B0B] uppercase tracking-wider block">
                            Specific Site Requirements or Existing Notes (Optional)
                          </label>
                          <textarea 
                            rows={3}
                            placeholder="Site dimensions, expected intake truck rate (TPH), rail unloading needs, or special climatic considerations..."
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full bg-[#F6F6F4] border border-[#E9EAEC] p-3.5 focus:border-[#0B0B0B] focus:outline-none text-sm text-[#0B0B0B]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Review */}
                  {currentStep === 5 && (
                    <motion.div 
                      key="step5"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-8"
                    >
                      <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
                        Review Project Feasibility Request
                      </h3>
                      <p className="text-xs text-[#303236] mb-6">Confirm parameters before submitting to our engineering team.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#F6F6F4] p-6 border border-[#E9EAEC]">
                        <div>
                          <h4 className="text-xs font-bold text-[#0B0B0B] uppercase tracking-widest mb-4 border-b border-[#E9EAEC] pb-2 font-mono">
                            Technical Scope
                          </h4>
                          <ul className="space-y-3 text-xs font-mono">
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Project Type:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.projectType}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Industry:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.industry}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Material:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.material}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Target Capacity:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.capacity ? `${Number(formData.capacity).toLocaleString()} MT` : 'Not specified'}</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#0B0B0B] uppercase tracking-widest mb-4 border-b border-[#E9EAEC] pb-2 font-mono">
                            Correspondent Details
                          </h4>
                          <ul className="space-y-3 text-xs font-mono">
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Name:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.name || 'Not provided'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Company:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.company || 'Not provided'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Email:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.email || 'Not provided'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-[#A8AFB8]">Phone:</span>
                              <span className="font-bold text-[#0B0B0B]">{formData.phone || 'Not provided'}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#303236]">
                        <ShieldCheck className="w-4 h-4 text-[#0B0B0B] shrink-0" />
                        <span>All project details and site specifications are held in strict non-disclosure compliance.</span>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Form Controls */}
                <div className="mt-12 flex items-center justify-between pt-6 border-t border-[#E9EAEC]">
                  <button 
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#303236] hover:text-[#0B0B0B] disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  
                  {currentStep < STEPS.length - 1 ? (
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="bg-[#0B0B0B] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#F4FF00] text-[#0B0B0B] px-8 py-4 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg"
                    >
                      {isSubmitting ? 'Transmitting Request...' : 'Submit Feasibility Request'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
