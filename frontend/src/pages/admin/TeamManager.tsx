import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI, AdminDataItem } from '../../services/adminDataAPI';
import { Plus, Edit2, Trash2, X, Upload, Loader } from 'lucide-react';

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    photo: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
}

const TeamManager = () => {
    const { id } = useParams<{ id: string }>();
    const [members, setMembers] = useState<AdminDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<AdminDataItem | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<TeamMember>({
        name: '',
        role: '',
        bio: '',
        photo: '',
        email: '',
        linkedin: '',
        twitter: ''
    });

    useEffect(() => {
        if (id) {
            fetchMembers();
        }
    }, [id]);

    const fetchMembers = async () => {
        if (!id) return;

        try {
            const response = await adminDataAPI.getAll(id, 'team');
            setMembers(response.data.data.items);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !id) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const response = await adminDataAPI.uploadImage(id, file);
            const imageUrl = `${import.meta.env.VITE_API_URL}${response.data.data.url}`;
            setFormData({ ...formData, photo: imageUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            if (editingMember) {
                await adminDataAPI.update(id, 'team', editingMember._id, formData);
            } else {
                await adminDataAPI.create(id, 'team', formData);
            }

            fetchMembers();
            closeModal();
        } catch (error) {
            console.error('Error saving team member:', error);
            alert('Failed to save team member');
        }
    };

    const handleDelete = async (memberId: string) => {
        if (!id || !confirm('Are you sure you want to delete this team member?')) return;

        try {
            await adminDataAPI.delete(id, 'team', memberId);
            fetchMembers();
        } catch (error) {
            console.error('Error deleting team member:', error);
            alert('Failed to delete team member');
        }
    };

    const openModal = (member?: AdminDataItem) => {
        if (member) {
            setEditingMember(member);
            setFormData(member.data as TeamMember);
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: '',
                bio: '',
                photo: '',
                email: '',
                linkedin: '',
                twitter: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMember(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Team</h2>
                    <p className="text-gray-600">Manage your team members</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Team Member
                </button>
            </div>

            {members.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No team members yet</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first team member</p>
                    <button
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                        Add Your First Team Member
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => {
                        const data = member.data as TeamMember;
                        return (
                            <div key={member._id} className="glass rounded-2xl p-6 card-hover text-center">
                                {data.photo ? (
                                    <img
                                        src={data.photo}
                                        alt={data.name}
                                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        {data.name.charAt(0)}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{data.name}</h3>
                                <p className="text-sm text-primary-500 mb-3">{data.role}</p>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{data.bio}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(member)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white/50 hover:bg-white text-gray-700 px-4 py-2 rounded-lg transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                                <div className="flex items-center gap-4">
                                    {formData.photo && (
                                        <img
                                            src={formData.photo}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    )}
                                    <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-all">
                                        {uploading ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
                                                Upload Photo
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                    <input
                                        type="url"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                                    <input
                                        type="url"
                                        value={formData.twitter}
                                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                        placeholder="https://twitter.com/..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                                >
                                    {editingMember ? 'Update Member' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManager;
