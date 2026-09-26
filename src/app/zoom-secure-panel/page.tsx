'use client';

import React, { useState, useEffect } from 'react';

export interface VacancyBreakdown {
    postNameZone: string;
    ur: string;
    obc: string;
    sc: string;
    st: string;
    ews: string;
    total: string;
}

export interface JobPost {
    _id?: string;
    id?: string;
    title: string;
    organization: string;
    postName: string;
    category: string;
    jobType: string;
    jobLocation: string;
    totalVacancy: string;

    notificationDate: string;
    applyStartDate: string;
    applyEndDate: string;
    feePaymentLastDate: string;
    correctionLastDate: string;
    examDate: string;
    admitCardDate: string;
    resultDate: string;

    feeGeneral: string;
    feeSCST: string;
    feeEWS: string;
    feeMode: string;

    educationalQualification: string;
    ageMin: string;
    ageMax: string;
    ageRelaxation: string;

    salaryPayScale: string;
    gradePay: string;
    experienceRequired: string;
    selectionProcess: string;

    vacancies: VacancyBreakdown[];

    thumbnailUrl: string;
    notificationPdfUrl: string;

    howToApply: string;
    applyLink: string;
    officialWebsite: string;
    notificationLink: string;
    syllabusLink?: string;
    admitCardLink?: string;
    answerKeyLink?: string;
    resultLink?: string;

    seoTitle: string;
    slug: string;
    focusKeywords: string;
    status: string;
    metaDescription: string;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_VACANCY: VacancyBreakdown = {
    postNameZone: 'General Post',
    ur: '0',
    obc: '0',
    sc: '0',
    st: '0',
    ews: '0',
    total: '0'
};

const INITIAL_FORM_DATA: JobPost = {
    title: '',
    organization: '',
    postName: '',
    category: 'latest-jobs',
    jobType: 'Government',
    jobLocation: 'All India',
    totalVacancy: '',

    notificationDate: getTodayDate(),
    applyStartDate: '',
    applyEndDate: '',
    feePaymentLastDate: '',
    correctionLastDate: '',
    examDate: '',
    admitCardDate: '',
    resultDate: '',

    feeGeneral: 'Rs. 500/-',
    feeSCST: 'Rs. 250/-',
    feeEWS: 'Rs. 500/-',
    feeMode: '',

    educationalQualification: '',
    ageMin: '18',
    ageMax: '37',
    ageRelaxation: 'As per rules',

    salaryPayScale: 'Rs. 19,900 - 63,200/- (Level 1)',
    gradePay: '1800 GP',
    experienceRequired: 'Fresher Eligible',
    selectionProcess: 'Written Exam -> Physical Test (PET) -> Document Verification -> Medical Exam',

    vacancies: [{ ...INITIAL_VACANCY }],

    thumbnailUrl: '',
    notificationPdfUrl: '',

    howToApply: `1. Visit the official website.\n2. Click on the Apply Online link.\n3. Complete the initial registration.\n4. Fill in the application form and upload required documents.\n5. Pay the application fee and submit the form.`,
    applyLink: '',
    officialWebsite: '',
    notificationLink: '',
    syllabusLink: '',
    admitCardLink: '',
    answerKeyLink: '',
    resultLink: '',

    seoTitle: '',
    slug: '',
    focusKeywords: 'RRB Group D, Railway Vacancy, Apply Online',
    status: 'Published',
    metaDescription: ''
};

export default function ZoomUpdateAdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [formData, setFormData] = useState<JobPost>(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/jobs');
            const data = await res.json();
            if (res.ok && data.success) {
                setJobs(data.data || []);
            }
        } catch (err) {
            console.error('Fetch Error:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchJobs();
    }, [isAuthenticated]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === 'title' && !editingJobId) {
                updated.slug = generateSlug(value);
                updated.seoTitle = value;
            }
            return updated;
        });
    };

    const handleVacancyChange = (index: number, field: keyof VacancyBreakdown, value: string) => {
        const currentVacancies = formData.vacancies || [{ ...INITIAL_VACANCY }];
        const updated = [...currentVacancies];
        updated[index] = { ...updated[index], [field]: value };

        const ur = parseInt(updated[index].ur || '0', 10);
        const obc = parseInt(updated[index].obc || '0', 10);
        const sc = parseInt(updated[index].sc || '0', 10);
        const st = parseInt(updated[index].st || '0', 10);
        const ews = parseInt(updated[index].ews || '0', 10);
        updated[index].total = (ur + obc + sc + st + ews).toString();

        setFormData((prev) => ({ ...prev, vacancies: updated }));
    };

    const addVacancyRow = () => {
        setFormData((prev) => ({
            ...prev,
            vacancies: [...(prev.vacancies || []), { ...INITIAL_VACANCY }]
        }));
    };

    const removeVacancyRow = (index: number) => {
        const currentVacancies = formData.vacancies || [{ ...INITIAL_VACANCY }];
        if (currentVacancies.length === 1) return;
        setFormData((prev) => ({
            ...prev,
            vacancies: currentVacancies.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const isEditing = Boolean(editingJobId);
        const endpoint = isEditing ? `/api/jobs/${editingJobId}` : '/api/jobs';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage(isEditing ? '✅ Job post updated successfully!' : '✅ New job post published successfully!');
                resetForm();
                fetchJobs();
                if (isEditing) setActiveTab('manage');
            } else {
                setMessage('❌ Error: ' + (data.message || 'Failed to save data.'));
            }
        } catch (err) {
            setMessage('❌ Internal server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (job: JobPost) => {
        setEditingJobId(job._id || job.id || null);
        setFormData({
            ...job,
            status: (job.status === 'Public' || !job.status) ? 'Published' : job.status,
            vacancies: job.vacancies && job.vacancies.length > 0 ? job.vacancies : [{ ...INITIAL_VACANCY }]
        });
        setActiveTab('create');
        setMessage('');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job post?')) return;

        try {
            const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                setMessage('✅ Job post deleted successfully.');
                fetchJobs();
            }
        } catch (err) {
            alert('Delete action failed.');
        }
    };

    const resetForm = () => {
        setFormData({ ...INITIAL_FORM_DATA, notificationDate: getTodayDate() });
        setEditingJobId(null);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const envUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
        const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'zoom@123';

        if (username.trim() === envUsername && password.trim() === envPassword) {
            setIsAuthenticated(true);
        } else {
            setLoginError('Invalid Username or Password');
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = (job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.organization || '').toLowerCase().includes(searchQuery.toLowerCase());

        const isJobPublished = job.status === 'Published' || job.status === 'Public' || !job.status;
        const isJobDraft = job.status === 'Draft';

        let matchesStatus = true;
        if (statusFilter === 'Published') {
            matchesStatus = isJobPublished;
        } else if (statusFilter === 'Draft') {
            matchesStatus = isJobDraft;
        }

        return matchesSearch && matchesStatus;
    });

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                    <h2 className="text-2xl font-black text-center text-red-600 mb-1">
                        ZOOM UPDATE ADMIN PANEL
                    </h2>
                    <p className="text-xs text-gray-500 text-center mb-6">Authorized Portal Access Only</p>
                    {loginError && <p className="text-red-600 text-xs text-center mb-4 bg-red-50 p-2 rounded border border-red-200">{loginError}</p>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Admin Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Username"
                                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none text-slate-800"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none text-slate-800"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition text-sm cursor-pointer">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eaf0f6] text-slate-800 pb-16">
            <header className="bg-[#0f172a] text-white py-3 px-6 shadow-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-red-600 text-white font-black px-3 py-1 rounded text-sm tracking-wide">ZOOM UPDATE</span>
                        <h1 className="font-bold text-xs md:text-sm text-slate-200">Admin Control Panel</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setActiveTab('create'); resetForm(); }}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1 ${activeTab === 'create' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            ➕ Add New Post
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1 ${activeTab === 'manage' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            📋 Manage Posts ({jobs.length})
                        </button>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {message && (
                    <div className={`mb-6 p-3 rounded text-xs font-bold text-center border ${message.includes('✅') ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
                        {message}
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="bg-white rounded shadow border border-slate-300 overflow-hidden">
                        <div className="bg-[#0f172a] text-white py-2.5 px-4 flex justify-between items-center border-b border-slate-800">
                            <h2 className="text-xs md:text-sm font-bold flex items-center gap-2">
                                📌 {editingJobId ? 'Edit Job Post' : 'Create New Job Post'}
                            </h2>
                            {editingJobId && (
                                <button onClick={resetForm} className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded">
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-5 text-slate-800">

                            {/* SECTION 1: JOB INFORMATION */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    1. 🏢 JOB INFORMATION
                                </h3>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. RRB Group D Recruitment 2026 Online Form"
                                        required
                                        className="w-full border border-slate-400 rounded p-1.5 text-xs focus:ring-1 focus:ring-red-500 outline-none text-slate-800"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Organization / Department *</label>
                                        <input
                                            type="text"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            placeholder="e.g. Railway Recruitment Board (RRB)"
                                            required
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Post Name *</label>
                                        <input
                                            type="text"
                                            name="postName"
                                            value={formData.postName}
                                            onChange={handleChange}
                                            placeholder="e.g. Track Maintainer, Assistant Pointsman"
                                            required
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs bg-white outline-none focus:ring-1 focus:ring-red-500 font-semibold text-slate-800"
                                        >
                                            <option value="top-banner">🔥 Top Banner</option>
                                            <option value="admit-card">🎴 Admit Card</option>
                                            <option value="current-job">💼 Current Job</option>
                                            <option value="result">📊 Result</option>
                                            <option value="answer-key">🔑 Answer Key</option>
                                            <option value="syllabus">📚 Syllabus</option>
                                            <option value="admission">🎓 Admission</option>
                                            <option value="university-update">🏛️ University Update</option>
                                            <option value="scholarship">🎓 Scholarship</option>
                                            <option value="upcoming-job">🔮 Upcoming Job</option>
                                            <option value="sarkari-yojana">📜 Sarkari Yojana</option>
                                            <option value="documents">📁 Documents</option>
                                            <option value="latest-blog">✍️ Latest Blog</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Type *</label>
                                        <select
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs bg-white outline-none focus:ring-1 focus:ring-red-500 font-semibold text-slate-800"
                                        >
                                            <option value="Government">Government</option>
                                            <option value="Private">Private</option>
                                            <option value="Apprenticeship">Apprenticeship</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Location</label>
                                        <input
                                            type="text"
                                            name="jobLocation"
                                            value={formData.jobLocation}
                                            onChange={handleChange}
                                            placeholder="All India"
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs outline-none text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Vacancy *</label>
                                        <input
                                            type="text"
                                            name="totalVacancy"
                                            value={formData.totalVacancy}
                                            onChange={handleChange}
                                            placeholder="e.g. 32,000 Posts"
                                            required
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs outline-none text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: IMPORTANT DATES TIMELINE */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    2. 📅 IMPORTANT DATES TIMELINE
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Notification Date</label>
                                        <input type="date" name="notificationDate" value={formData.notificationDate} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Apply Start Date</label>
                                        <input type="date" name="applyStartDate" value={formData.applyStartDate} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Apply Last Date</label>
                                        <input type="date" name="applyEndDate" value={formData.applyEndDate} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Fee Payment Last Date</label>
                                        <input type="date" name="feePaymentLastDate" value={formData.feePaymentLastDate} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Correction Date</label>
                                        <input type="date" name="correctionLastDate" value={formData.correctionLastDate} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Exam Date</label>
                                        <input type="text" name="examDate" value={formData.examDate} onChange={handleChange} placeholder="e.g. November 2026" className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Admit Card Date</label>
                                        <input type="text" name="admitCardDate" value={formData.admitCardDate} onChange={handleChange} placeholder="Before Exam" className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Result Date</label>
                                        <input type="text" name="resultDate" value={formData.resultDate} onChange={handleChange} placeholder="To Be Notified" className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: APPLICATION FEE */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    3. 💰 APPLICATION FEE
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">General / OBC / EBC</label>
                                        <input type="text" name="feeGeneral" value={formData.feeGeneral} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">SC / ST / Female</label>
                                        <input type="text" name="feeSCST" value={formData.feeSCST} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">EWS Fee</label>
                                        <input type="text" name="feeEWS" value={formData.feeEWS} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Mode</label>
                                        <input type="text" name="feeMode" value={formData.feeMode} onChange={handleChange} placeholder="Online / Offline" className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: QUALIFICATION & AGE LIMIT */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    4. 🎓 QUALIFICATION & AGE LIMIT
                                </h3>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Educational Qualification *</label>
                                    <textarea
                                        name="educationalQualification"
                                        value={formData.educationalQualification}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Class 10th Pass / 12th Pass / ITI Diploma / Bachelor Degree from recognized board or university."
                                        required
                                        className="w-full border border-slate-400 rounded p-1.5 text-xs outline-none text-slate-800"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Minimum Age</label>
                                        <input type="text" name="ageMin" value={formData.ageMin} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Maximum Age</label>
                                        <input type="text" name="ageMax" value={formData.ageMax} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Age Relaxation</label>
                                        <input type="text" name="ageRelaxation" value={formData.ageRelaxation} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 5: SALARY & SELECTION PROCESS */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    5. 💵 SALARY & SELECTION PROCESS
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Salary / Pay Scale</label>
                                        <input type="text" name="salaryPayScale" value={formData.salaryPayScale} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade Pay</label>
                                        <input type="text" name="gradePay" value={formData.gradePay} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Experience Required</label>
                                        <input type="text" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Selection Process</label>
                                    <textarea
                                        name="selectionProcess"
                                        value={formData.selectionProcess}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full border border-slate-400 rounded p-1.5 text-xs outline-none text-slate-800"
                                    />
                                </div>
                            </div>

                            {/* SECTION 6: VACANCY DETAILS BREAKDOWN */}
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center border-b border-red-500 pb-1">
                                    <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide">
                                        6. 📊 VACANCY DETAILS BREAKDOWN
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addVacancyRow}
                                        className="text-[10px] bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-2 py-0.5 rounded transition"
                                    >
                                        + Add Category Row
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left border border-slate-300">
                                        <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-300 text-[10px]">
                                            <tr>
                                                <th className="p-1.5 border-r border-slate-300">POST NAME / ZONE</th>
                                                <th className="p-1.5 border-r border-slate-300 text-center w-14">UR</th>
                                                <th className="p-1.5 border-r border-slate-300 text-center w-14">OBC</th>
                                                <th className="p-1.5 border-r border-slate-300 text-center w-14">SC</th>
                                                <th className="p-1.5 border-r border-slate-300 text-center w-14">ST</th>
                                                <th className="p-1.5 border-r border-slate-300 text-center w-14">EWS</th>
                                                <th className="p-1.5 border-r border-slate-300 text-center w-16">TOTAL</th>
                                                <th className="p-1.5 text-center w-14">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.vacancies?.map((vac, index) => (
                                                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="text"
                                                            value={vac.postNameZone}
                                                            onChange={(e) => handleVacancyChange(index, 'postNameZone', e.target.value)}
                                                            className="w-full p-1 border border-slate-300 rounded text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="number"
                                                            value={vac.ur}
                                                            onChange={(e) => handleVacancyChange(index, 'ur', e.target.value)}
                                                            className="w-full p-1 border border-slate-300 rounded text-center text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="number"
                                                            value={vac.obc}
                                                            onChange={(e) => handleVacancyChange(index, 'obc', e.target.value)}
                                                            className="w-full p-1 border border-slate-300 rounded text-center text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="number"
                                                            value={vac.sc}
                                                            onChange={(e) => handleVacancyChange(index, 'sc', e.target.value)}
                                                            className="w-full p-1 border border-slate-300 rounded text-center text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="number"
                                                            value={vac.st}
                                                            onChange={(e) => handleVacancyChange(index, 'st', e.target.value)}
                                                            className="w-full p-1 border border-slate-300 rounded text-center text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="number"
                                                            value={vac.ews}
                                                            onChange={(e) => handleVacancyChange(index, 'ews', e.target.value)}
                                                            className="w-full p-1 border border-slate-300 rounded text-center text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 border-r border-slate-200">
                                                        <input
                                                            type="text"
                                                            value={vac.total}
                                                            readOnly
                                                            className="w-full p-1 border border-slate-300 rounded bg-slate-100 font-bold text-center text-slate-800"
                                                        />
                                                    </td>
                                                    <td className="p-1 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVacancyRow(index)}
                                                            className="text-red-600 hover:text-red-800 text-[11px] font-semibold"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SECTION 7: THUMBNAIL & PDF DOCUMENT LINKS */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    7. 🖼️ THUMBNAIL & PDF DOCUMENT LINKS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Banner / Thumbnail URL (1200x630)</label>
                                        <input
                                            type="url"
                                            name="thumbnailUrl"
                                            value={formData.thumbnailUrl}
                                            onChange={handleChange}
                                            placeholder="https://domain.com/images/banner.jpg"
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Notification PDF Link</label>
                                        <input
                                            type="url"
                                            name="notificationPdfUrl"
                                            value={formData.notificationPdfUrl}
                                            onChange={handleChange}
                                            placeholder="https://domain.com/docs/notification.pdf"
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 8: IMPORTANT LINKS & HOW TO APPLY */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    8. 🔗 IMPORTANT LINKS & HOW TO APPLY
                                </h3>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">How to Apply Steps</label>
                                    <textarea
                                        name="howToApply"
                                        value={formData.howToApply}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full border border-slate-400 rounded p-2 text-xs outline-none text-slate-800 font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Apply Online Link *</label>
                                        <input type="url" name="applyLink" value={formData.applyLink} onChange={handleChange} required placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Website Link *</label>
                                        <input type="url" name="officialWebsite" value={formData.officialWebsite} onChange={handleChange} required placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Notification Link *</label>
                                        <input type="url" name="notificationLink" value={formData.notificationLink} onChange={handleChange} required placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Syllabus Link</label>
                                        <input type="url" name="syllabusLink" value={formData.syllabusLink} onChange={handleChange} placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Admit Card Link</label>
                                        <input type="url" name="admitCardLink" value={formData.admitCardLink} onChange={handleChange} placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Answer Key Link</label>
                                        <input type="url" name="answerKeyLink" value={formData.answerKeyLink} onChange={handleChange} placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Result Link</label>
                                        <input type="url" name="resultLink" value={formData.resultLink} onChange={handleChange} placeholder="https://..." className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 9: SEO SETTINGS (SEARCH ENGINE OPTIMIZATION) */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wide border-b border-red-500 pb-1">
                                    9. 🔍 SEO SETTINGS (SEARCH ENGINE OPTIMIZATION)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">SEO Meta Title</label>
                                        <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">URL Slug</label>
                                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Focus Keywords (Comma Separated)</label>
                                        <input type="text" name="focusKeywords" value={formData.focusKeywords} onChange={handleChange} className="w-full border border-slate-400 rounded p-1.5 text-xs text-slate-800" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Post Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full border border-slate-400 rounded p-1.5 text-xs bg-white font-bold text-emerald-700 outline-none"
                                        >
                                            <option value="Published" className="text-emerald-700">🟢 Published</option>
                                            <option value="Draft" className="text-amber-700">🟠 Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Meta Description (150 - 160 Characters)</label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full border border-slate-400 rounded p-2 text-xs outline-none text-slate-800"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded text-xs tracking-wider transition cursor-pointer shadow flex items-center justify-center gap-1.5 uppercase"
                            >
                                🚀 {loading ? 'PROCESSING...' : editingJobId ? 'SAVE CHANGES' : 'PUBLISH JOB POST'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'manage' && (
                    <div className="bg-white rounded shadow border border-slate-300 overflow-hidden">
                        <div className="p-3 bg-[#0f172a] text-white flex flex-col md:flex-row gap-2.5 justify-between items-center">
                            <h2 className="font-bold text-xs md:text-sm">📋 Manage Existing Posts</h2>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="p-1.5 text-xs rounded border border-slate-600 bg-[#1e293b] text-white placeholder-slate-400 outline-none w-full md:w-56 focus:border-red-500"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="p-1.5 text-xs rounded border border-slate-600 bg-[#1e293b] text-white font-semibold outline-none focus:border-red-500"
                                >
                                    <option value="All" className="bg-[#1e293b] text-white">All Status</option>
                                    <option value="Published" className="bg-[#1e293b] text-white">Published</option>
                                    <option value="Draft" className="bg-[#1e293b] text-white">Draft</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-300 text-[10px]">
                                    <tr>
                                        <th className="p-2.5 border-r border-slate-200">Title</th>
                                        <th className="p-2.5 border-r border-slate-200">Organization</th>
                                        <th className="p-2.5 border-r border-slate-200">Category</th>
                                        <th className="p-2.5 border-r border-slate-200">Status</th>
                                        <th className="p-2.5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJobs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center p-6 text-gray-500 font-medium">
                                                No posts found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <tr key={job._id || job.id} className="border-b border-slate-200 hover:bg-slate-50">
                                                <td className="p-2.5 font-bold text-slate-800 border-r border-slate-200">{job.title}</td>
                                                <td className="p-2.5 text-slate-600 border-r border-slate-200">{job.organization}</td>
                                                <td className="p-2.5 text-slate-600 uppercase font-semibold border-r border-slate-200">{job.category}</td>
                                                <td className="p-2.5 border-r border-slate-200">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${job.status === 'Draft' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                                                        {job.status === 'Draft' ? 'Draft' : 'Published'}
                                                    </span>
                                                </td>
                                                <td className="p-2.5 text-center">
                                                    <div className="flex justify-center gap-1.5">
                                                        <button
                                                            onClick={() => handleEdit(job)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(job._id || job.id || '')}
                                                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}