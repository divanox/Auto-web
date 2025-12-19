import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI } from '../../services/adminDataAPI';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    photo: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
}

interface TeamRendererProps {
    configuration?: {
        columns?: number;
        showSocial?: boolean;
    };
}

const TeamRenderer = ({ configuration }: TeamRendererProps) => {
    const { id } = useParams<{ id: string }>();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="spinner mx-auto"></div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-500">No team members available</p>
            </div>
        );
    }

    const columns = configuration?.columns || 3;
    const gridClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

    return (
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
            {members.map((item) => {
                const member = item.data as TeamMember;
                return (
                    <div key={item._id} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
                        {member.photo ? (
                            <img
                                src={member.photo}
                                alt={member.name}
                                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                {member.name.charAt(0)}
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                        <p className="text-sm text-primary-500 font-medium mb-3">{member.role}</p>
                        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

                        {configuration?.showSocial !== false && (
                            <div className="flex items-center justify-center gap-3">
                                {member.email && (
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                                {member.twitter && (
                                    <a
                                        href={member.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TeamRenderer;
