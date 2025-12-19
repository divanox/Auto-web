import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectComponentsAPI, ProjectComponent } from '../services/api';
import Layout from '../components/Layout';
import ComponentRenderer from '../components/ComponentRenderer';
import { ArrowLeft, Eye, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';

// Component Renderers
const HeroRenderer = ({ content, config }: any) => (
    <section
        className="min-h-[500px] flex items-center justify-center text-center px-8"
        style={{
            backgroundColor: config.colors?.background || '#1e293b',
            color: config.colors?.text || '#ffffff'
        }}
    >
        <div className="max-w-4xl">
            <h1
                className="text-5xl md:text-6xl font-bold mb-6"
                style={{
                    background: `linear-gradient(135deg, ${config.colors?.primary || '#0ea5e9'}, ${config.colors?.secondary || '#d946ef'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                {content.title || 'Welcome'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
                {content.subtitle || 'Build amazing things'}
            </p>
            {content.ctaText && (
                <a
                    href={content.ctaLink || '#'}
                    className="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:scale-105"
                    style={{
                        background: `linear-gradient(135deg, ${config.colors?.primary || '#0ea5e9'}, ${config.colors?.secondary || '#d946ef'})`
                    }}
                >
                    {content.ctaText}
                </a>
            )}
        </div>
    </section>
);

const FeaturesRenderer = ({ content, config }: any) => {
    let features = [];
    try {
        features = typeof content.features === 'string' ? JSON.parse(content.features) : content.features || [];
    } catch (e) {
        features = [];
    }

    return (
        <section
            className="py-20 px-8"
            style={{ backgroundColor: config.colors?.background || '#ffffff' }}
        >
            <div className="max-w-6xl mx-auto">
                {content.sectionTitle && (
                    <h2
                        className="text-4xl font-bold text-center mb-4"
                        style={{ color: config.colors?.text || '#1e293b' }}
                    >
                        {content.sectionTitle}
                    </h2>
                )}
                {content.sectionSubtitle && (
                    <p className="text-xl text-center mb-12 opacity-70" style={{ color: config.colors?.text }}>
                        {content.sectionSubtitle}
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature: any, index: number) => (
                        <div key={index} className="text-center p-6 rounded-xl bg-white/50 backdrop-blur">
                            <div
                                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                                style={{ backgroundColor: config.colors?.primary || '#0ea5e9' }}
                            >
                                {feature.icon?.charAt(0) || '★'}
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: config.colors?.text }}>
                                {feature.title}
                            </h3>
                            <p className="opacity-70" style={{ color: config.colors?.text }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ContactRenderer = ({ content, config }: any) => (
    <section
        className="py-20 px-8"
        style={{ backgroundColor: config.colors?.background || '#f8fafc' }}
    >
        <div className="max-w-2xl mx-auto">
            <h2
                className="text-4xl font-bold text-center mb-4"
                style={{ color: config.colors?.text || '#1e293b' }}
            >
                {content.title || 'Contact Us'}
            </h2>
            {content.subtitle && (
                <p className="text-center mb-8 opacity-70" style={{ color: config.colors?.text }}>
                    {content.subtitle}
                </p>
            )}
            <form className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                    style={{ borderColor: config.colors?.primary }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                    style={{ borderColor: config.colors?.primary }}
                />
                {content.showPhone && (
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                        style={{ borderColor: config.colors?.primary }}
                    />
                )}
                {content.showMessage && (
                    <textarea
                        placeholder="Message"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                        style={{ borderColor: config.colors?.primary }}
                    />
                )}
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: config.colors?.primary || '#0ea5e9' }}
                >
                    Send Message
                </button>
            </form>
        </div>
    </section>
);

const AboutRenderer = ({ content, config }: any) => (
    <section
        className="py-20 px-8"
        style={{ backgroundColor: config.colors?.background || '#ffffff' }}
    >
        <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${content.imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}>
                <div>
                    <h2
                        className="text-4xl font-bold mb-6"
                        style={{ color: config.colors?.text || '#1e293b' }}
                    >
                        {content.title || 'About Us'}
                    </h2>
                    <p className="text-lg leading-relaxed opacity-80" style={{ color: config.colors?.text }}>
                        {content.content || 'Tell your story here...'}
                    </p>
                </div>
                {content.image && (
                    <div className="rounded-2xl overflow-hidden">
                        <img src={content.image} alt={content.title} className="w-full h-auto" />
                    </div>
                )}
            </div>
        </div>
    </section>
);

const FooterRenderer = ({ content, config }: any) => {
    let links = [];
    let socialLinks = {};
    try {
        links = typeof content.links === 'string' ? JSON.parse(content.links) : content.links || [];
        socialLinks = typeof content.socialLinks === 'string' ? JSON.parse(content.socialLinks) : content.socialLinks || {};
    } catch (e) { }

    return (
        <footer
            className="py-12 px-8"
            style={{ backgroundColor: config.colors?.background || '#1e293b', color: config.colors?.text || '#ffffff' }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{content.companyName || 'Company'}</h3>
                        <p className="opacity-70">{content.description}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {links.map((link: any, index: number) => (
                                <li key={index}>
                                    <a href={link.url} className="opacity-70 hover:opacity-100 transition-opacity">
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            {Object.entries(socialLinks).map(([platform, url]: any) => url && (
                                <a key={platform} href={url} className="opacity-70 hover:opacity-100 transition-opacity">
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center opacity-70">
                    {content.copyright || '© 2024 All rights reserved'}
                </div>
            </div>
        </footer>
    );
};

// Static component renderers (for components without dynamic data)
const staticRenderers: Record<string, any> = {
    'hero-section': HeroRenderer,
    'features-grid': FeaturesRenderer,
    'contact-form': ContactRenderer,
    'about-section': AboutRenderer,
    'footer': FooterRenderer,
};

const SitePreview = () => {
    const { id } = useParams<{ id: string }>();
    const [components, setComponents] = useState<ProjectComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        if (id) {
            fetchComponents();
        }
    }, [id]);

    const fetchComponents = async () => {
        if (!id) return;

        try {
            const response = await projectComponentsAPI.getAll(id);
            setComponents(response.data.data.components.filter((c: ProjectComponent) => c.isActive));
        } catch (error) {
            console.error('Error fetching components:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="spinner"></div>
                </div>
            </Layout>
        );
    }

    const viewportWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px'
    };

    return (
        <Layout>
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <Link to={`/projects/${id}/components`} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Components
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* View Mode Selector */}
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('desktop')}
                                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white shadow' : ''}`}
                                title="Desktop View"
                            >
                                <Monitor className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('tablet')}
                                className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-white shadow' : ''}`}
                                title="Tablet View"
                            >
                                <Tablet className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('mobile')}
                                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white shadow' : ''}`}
                                title="Mobile View"
                            >
                                <Smartphone className="w-5 h-5" />
                            </button>
                        </div>

                        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                            <ExternalLink className="w-4 h-4" />
                            Publish
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="bg-gray-100 min-h-screen flex justify-center p-8">
                    <div
                        className="bg-white shadow-2xl transition-all duration-300 overflow-auto"
                        style={{
                            width: viewportWidths[viewMode],
                            maxWidth: '100%',
                            minHeight: '600px'
                        }}
                    >
                        {components.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[600px] text-gray-500">
                                <Eye className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-xl">No components added yet</p>
                                <Link
                                    to={`/projects/${id}/components`}
                                    className="mt-4 text-primary-600 hover:text-primary-700"
                                >
                                    Add components to get started →
                                </Link>
                            </div>
                        ) : (
                            components.map((component) => {
                                // Check if it's a static component with a dedicated renderer
                                const StaticRenderer = staticRenderers[component.templateId.slug];

                                return (
                                    <div key={component._id} className="relative group">
                                        {StaticRenderer ? (
                                            <StaticRenderer
                                                content={component.content}
                                                config={component.configuration}
                                            />
                                        ) : (
                                            <div className="py-12 px-8">
                                                <div className="max-w-6xl mx-auto">
                                                    <ComponentRenderer
                                                        templateSlug={component.templateId.slug}
                                                        configuration={component.configuration}
                                                        content={component.content}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <Link
                                            to={`/projects/${id}/components/${component._id}/edit`}
                                            className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SitePreview;
