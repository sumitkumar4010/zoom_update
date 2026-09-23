'use client';

import { useState, useEffect } from 'react';

export interface JobPost {
    _id?: string;
    id?: string;
    title: string;
    category: string;
    department: string;
    postDate: string;
    applyStartDate: string;
    applyEndDate: string;
    feeGeneral: string;
    feeSCST: string;
    ageMin: string;
    ageMax: string;
    totalPost: string;
    eligibility: string;
    applyLink: string;
    notificationLink: string;
    officialWebsite: string;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM_DATA: JobPost = {
    title: '',
    category: 'latest-jobs',
    department: '',
    postDate: getTodayDate(),
    applyStartDate: '',
    applyEndDate: '',
    feeGeneral: '',
    feeSCST: '',
    ageMin: '18',
    ageMax: '37',
    totalPost: '',
    eligibility: '',
    applyLink: '',
    notificationLink: '',
    officialWebsite: '',
};

export default function SecretAdminPanel() {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Active Tab State
    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

    // Jobs State
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFetchingJobs, setIsFetchingJobs] = useState(false);

    // Form State
    const [formData, setFormData] = useState<JobPost>(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch Posts from API
    const fetchJobs = async () => {
        setIsFetchingJobs(true);
        try {
            const res = await fetch('/api/jobs');
            const data = await res.json();
            if (res.ok && data.success) {
                setJobs(data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setIsFetchingJobs(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobs();
        }
    }, [isAuthenticated]);

    // Handle Auth Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setIsAuthenticated(true);
                setUsername('');
                setPassword('');
            } else {
                setLoginError('❌ ' + (data.message || 'Invalid Credentials!'));
            }
        } catch (err) {
            setLoginError('❌ Server Connection Error.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Create or Update Job Post
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
                setMessage(isEditing ? '✅ Job Post Updated Successfully!' : '✅ Job Post Created Successfully!');
                resetForm();
                fetchJobs();
                if (isEditing) setActiveTab('manage');
            } else {
                setMessage('❌ ' + (data.message || 'Error saving post.'));
            }
        } catch (err) {
            setMessage('❌ Server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Populate Data into Form for Editing
    const handleEdit = (job: JobPost) => {
        const id = job._id || job.id;
        if (!id) return;
        setEditingJobId(id);
        setFormData(job);
        setActiveTab('create');
        setMessage('');
    };

    // Delete Job Post
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job post?')) return;

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setMessage('✅ Post deleted successfully.');
                fetchJobs();
            } else {
                alert('Failed to delete post: ' + (data.message || ''));
            }
        } catch (err) {
            alert('Error deleting post.');
        }
    };

    const resetForm = () => {
        setFormData({ ...INITIAL_FORM_DATA, postDate: getTodayDate() });
        setEditingJobId(null);
    };

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
                    <h2 className="text-xl font-bold text-center text-red-700 mb-2">
                        ZOOM UPDATE - Secret Control Panel
                    </h2>
                    <p className="text-xs text-gray-500 text-center mb-6">Authorized Personnel Only</p>

                    {loginError && (
                        <p className="text-red-600 text-xs font-bold mb-4 text-center bg-red-50 p-2 rounded border border-red-200">
                            {loginError}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Admin ID</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Secret Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded transition text-sm cursor-pointer disabled:opacity-50"
                        >
                            {loginLoading ? 'Verifying...' : 'Unlock Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Header Navbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 gap-4">
                    <h1 className="text-lg font-bold text-gray-800">FastJob Management Panel</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setActiveTab('create');
                                resetForm();
                            }}
                            className={`px-4 py-2 rounded text-xs font-bold transition cursor-pointer ${
                                activeTab === 'create'
                                    ? 'bg-red-700 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            + {editingJobId ? 'Edit Mode' : 'Add New Post'}
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`px-4 py-2 rounded text-xs font-bold transition cursor-pointer ${
                                activeTab === 'manage'
                                    ? 'bg-red-700 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Manage Posts ({jobs.length})
                        </button>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="bg-gray-800 text-white text-xs px-3 py-2 rounded font-semibold hover:bg-gray-900 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {message && (
                    <div
                        className={`mb-6 p-3 rounded text-sm font-semibold text-center ${
                            message.includes('✅')
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* TAB 1: ADD / EDIT FORM */}
                {activeTab === 'create' && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="bg-red-700 text-white py-4 px-6 flex justify-between items-center">
                            <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide">
                                {editingJobId ? '✏️ Edit Job Post' : '🚀 Post New Job Entry'}
                            </h2>
                            {editingJobId && (
                                <button
                                    onClick={resetForm}
                                    className="text-xs bg-white text-red-700 font-bold px-3 py-1 rounded hover:bg-gray-100"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-red-600 uppercase border-b pb-1">
                                    1. Basic Job Details
                                </h3>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Bihar Police SI Online Form 2026"
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500 bg-white"
                                        >
                                            <option value="top-banner">🔥 Top Banner Link</option>
                                            <option value="latest-jobs">Latest Jobs</option>
                                            <option value="admit-card">Admit Card</option>
                                            <option value="result">Result</option>
                                            <option value="syllabus">Syllabus</option>
                                            <option value="admission">Admission</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            placeholder="e.g. BPSSC Bihar"
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dates & Fees */}
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-bold text-red-600 uppercase border-b pb-1">
                                    2. Dates & Fees
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Post Date</label>
                                        <input
                                            type="date"
                                            name="postDate"
                                            value={formData.postDate}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Apply Start</label>
                                        <input
                                            type="date"
                                            name="applyStartDate"
                                            value={formData.applyStartDate}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Apply Last Date</label>
                                        <input
                                            type="date"
                                            name="applyEndDate"
                                            value={formData.applyEndDate}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Fee (General / OBC)</label>
                                        <input
                                            type="text"
                                            name="feeGeneral"
                                            value={formData.feeGeneral}
                                            onChange={handleChange}
                                            placeholder="700"
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Fee (SC / ST)</label>
                                        <input
                                            type="text"
                                            name="feeSCST"
                                            value={formData.feeSCST}
                                            onChange={handleChange}
                                            placeholder="400"
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Eligibility & Links */}
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-bold text-red-600 uppercase border-b pb-1">
                                    3. Links & Details
                                </h3>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Eligibility</label>
                                    <textarea
                                        name="eligibility"
                                        rows={2}
                                        value={formData.eligibility}
                                        onChange={handleChange}
                                        placeholder="Graduation in any stream..."
                                        className="w-full border border-gray-300 rounded p-2 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Apply Online Link</label>
                                        <input
                                            type="url"
                                            name="applyLink"
                                            value={formData.applyLink}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Notification Link</label>
                                        <input
                                            type="url"
                                            name="notificationLink"
                                            value={formData.notificationLink}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 text-center flex justify-end gap-3">
                                {editingJobId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2.5 px-6 rounded transition text-sm cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-10 rounded transition shadow text-sm cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingJobId ? '💾 Save Changes' : '🚀 Publish Job Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2: MANAGE POSTS (EDIT / DELETE) */}
                {activeTab === 'manage' && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                            <h2 className="text-lg font-bold text-gray-800">All Active Job Posts</h2>
                            <input
                                type="text"
                                placeholder="🔍 Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded p-2 text-sm w-full sm:w-64 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        {isFetchingJobs ? (
                            <p className="text-center text-sm text-gray-500 py-8">Loading posts...</p>
                        ) : filteredJobs.length === 0 ? (
                            <p className="text-center text-sm text-gray-500 py-8">No matching posts found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 border-b text-gray-700">
                                            <th className="p-3">Title</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">Post Date</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredJobs.map((job) => {
                                            const id = job._id || job.id || '';
                                            return (
                                                <tr key={id} className="border-b hover:bg-gray-50">
                                                    <td className="p-3 font-semibold text-gray-900">{job.title}</td>
                                                    <td className="p-3 text-gray-600">
                                                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                                                            {job.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-500">{job.postDate}</td>
                                                    <td className="p-3 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(job)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition cursor-pointer text-xs"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded transition cursor-pointer text-xs"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}