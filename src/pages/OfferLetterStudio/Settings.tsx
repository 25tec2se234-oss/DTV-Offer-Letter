import React, { useState, useEffect } from 'react';
import { Save, Building, Users, Briefcase, ChevronRight, ShieldCheck, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Signatory {
  id: string;
  name: string;
  title: string;
  initials: string;
  color: string;
}

const DEFAULT_SIGNATORIES: Signatory[] = [
  { id: '1', name: 'Kumar Kartikey', title: 'Founder & CEO', initials: 'K', color: 'from-indigo-500 to-purple-600' },
  { id: '2', name: 'Kaushiki Singh', title: 'Co-Founder', initials: 'K', color: 'from-rose-500 to-orange-500' }
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // App State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dtv_company_settings');
    return saved ? JSON.parse(saved) : {
      company_name: 'Digital Twin Verse',
      brand_name: 'DTV',
      legal_entity_name: 'Digital Twin Verse Pvt Ltd',
      website: 'https://digitaltwinvrs.com/',
      company_email: 'contact@digitaltwinvrs.com',
      company_phone: '',
      company_address: 'Bangalore, India',
      offer_prefix: 'DTV-OFR'
    };
  });

  const [signatories, setSignatories] = useState<Signatory[]>(() => {
    const saved = localStorage.getItem('dtv_signatories');
    return saved ? JSON.parse(saved) : DEFAULT_SIGNATORIES;
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSignatory, setEditingSignatory] = useState<Signatory | null>(null);
  const [formData, setFormData] = useState({ name: '', title: '', color: 'from-indigo-500 to-purple-600' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('dtv_company_settings', JSON.stringify(settings));
      setLoading(false);
      showToast('Settings saved successfully!');
    }, 600);
  };

  const handleSaveSignatory = () => {
    if (!formData.name || !formData.title) return;
    
    let updated;
    if (editingSignatory) {
      updated = signatories.map(s => 
        s.id === editingSignatory.id 
          ? { ...s, name: formData.name, title: formData.title, initials: formData.name.charAt(0).toUpperCase(), color: formData.color }
          : s
      );
      showToast('Signatory updated!');
    } else {
      const newSig = {
        id: Date.now().toString(),
        name: formData.name,
        title: formData.title,
        initials: formData.name.charAt(0).toUpperCase(),
        color: formData.color
      };
      updated = [...signatories, newSig];
      showToast('Signatory added!');
    }
    
    setSignatories(updated);
    localStorage.setItem('dtv_signatories', JSON.stringify(updated));
    closeModal();
  };

  const handleDeleteSignatory = (id: string) => {
    if (confirm('Are you sure you want to remove this signatory?')) {
      const updated = signatories.filter(s => s.id !== id);
      setSignatories(updated);
      localStorage.setItem('dtv_signatories', JSON.stringify(updated));
      showToast('Signatory removed.');
    }
  };

  const openModal = (sig?: Signatory) => {
    if (sig) {
      setEditingSignatory(sig);
      setFormData({ name: sig.name, title: sig.title, color: sig.color });
    } else {
      setEditingSignatory(null);
      setFormData({ name: '', title: '', color: 'from-indigo-500 to-purple-600' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSignatory(null);
  };

  const colorOptions = [
    'from-indigo-500 to-purple-600',
    'from-rose-500 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-blue-500 to-cyan-400',
    'from-amber-400 to-orange-500',
    'from-pink-500 to-rose-400'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
          Studio Preferences
        </h1>
        <p className="text-sm md:text-base text-gray-400 mt-1">Configure company details, branding, and authorized signatories.</p>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] font-semibold flex items-center"
          >
            <ShieldCheck className="w-5 h-5 mr-3" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#161920]/80 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.02]">
           <div className="p-4 md:p-6 flex md:block overflow-x-auto gap-2 md:gap-0">
             <div className="hidden md:block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Configuration</div>
             <nav className="flex md:space-y-2 md:block w-full">
               <button 
                 className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'company' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                 onClick={() => setActiveTab('company')}
               >
                 <div className="flex items-center whitespace-nowrap">
                   <Building className="w-5 h-5 md:mr-3 mr-2" />
                   <span className="font-semibold text-sm">Company Profile</span>
                 </div>
                 {activeTab === 'company' && <ChevronRight className="w-4 h-4 hidden md:block" />}
               </button>
               <button 
                 className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-4 py-3 rounded-xl transition-all md:mt-2 ${activeTab === 'signatories' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                 onClick={() => setActiveTab('signatories')}
               >
                 <div className="flex items-center whitespace-nowrap">
                   <Users className="w-5 h-5 md:mr-3 mr-2" />
                   <span className="font-semibold text-sm">Signatories</span>
                 </div>
                 {activeTab === 'signatories' && <ChevronRight className="w-4 h-4 hidden md:block" />}
               </button>
             </nav>
           </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-4 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'company' && (
              <motion.div 
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl space-y-8"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 border-b border-white/10 pb-4">Legal & Brand Identity</h3>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company Name *</label>
                      <input 
                        type="text" 
                        value={settings.company_name}
                        onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brand / Short Name</label>
                      <input 
                        type="text" 
                        value={settings.brand_name}
                        onChange={(e) => setSettings({...settings, brand_name: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Legal Entity Name</label>
                      <input 
                        type="text" 
                        value={settings.legal_entity_name || ''}
                        onChange={(e) => setSettings({...settings, legal_entity_name: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 border-b border-white/10 pb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Website URL</label>
                      <input 
                        type="text" 
                        value={settings.website || ''}
                        onChange={(e) => setSettings({...settings, website: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Corporate Email</label>
                      <input 
                        type="email" 
                        value={settings.company_email || ''}
                        onChange={(e) => setSettings({...settings, company_email: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Registered Address</label>
                      <textarea 
                        value={settings.company_address || ''}
                        onChange={(e) => setSettings({...settings, company_address: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 md:pt-6 flex justify-end">
                  <button 
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'signatories' && (
              <motion.div 
                key="signatories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-8 border-b border-white/10 pb-4">
                  <h3 className="text-lg md:text-xl font-bold text-white">Authorized Signatories</h3>
                  <button onClick={() => openModal()} className="flex items-center justify-center text-sm font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 transition-colors">
                    <Plus className="w-4 h-4 mr-2" /> Add New
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {signatories.map((sig) => (
                    <div key={sig.id} className="bg-[#0f1115] border border-white/10 rounded-2xl p-4 md:p-6 hover:border-white/20 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 md:space-x-5">
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr ${sig.color} flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shrink-0`}>
                            {sig.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <h4 className="font-bold text-white text-base md:text-lg">{sig.name}</h4>
                               <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-xs md:text-sm text-gray-400 flex items-center mt-1 font-medium">
                              <Briefcase className="w-3 h-3 md:w-4 md:h-4 mr-2 opacity-50" />
                              {sig.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                          <button onClick={() => openModal(sig)} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-2 rounded-lg flex items-center">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSignatory(sig.id)} className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-lg flex items-center">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {signatories.length === 0 && (
                    <div className="text-center py-10 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                      No signatories added yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Signatory Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#161920] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-xl font-bold text-white">{editingSignatory ? 'Edit Signatory' : 'Add Signatory'}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name *</label>
                  <input 
                    type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job Title *</label>
                  <input 
                    type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. HR Manager"
                    className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Avatar Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((gradient) => (
                      <button 
                        key={gradient}
                        onClick={() => setFormData({...formData, color: gradient})}
                        className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient} ${formData.color === gradient ? 'ring-2 ring-white ring-offset-2 ring-offset-[#161920]' : 'opacity-70 hover:opacity-100'} transition-all`}
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSaveSignatory} disabled={!formData.name || !formData.title} className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50">
                    {editingSignatory ? 'Update' : 'Add Signatory'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Settings;
