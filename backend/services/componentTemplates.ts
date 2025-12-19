import { IComponentTemplate } from '../models/ComponentTemplate.js';

export const componentTemplates: Partial<IComponentTemplate>[] = [
    // 1. Hero Section
    {
        name: 'Hero Section',
        slug: 'hero-section',
        category: 'header',
        description: 'Eye-catching hero banner with title, subtitle, and call-to-action button',
        icon: 'Sparkles',
        fieldSchema: {
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Main Title',
                    required: true,
                    placeholder: 'Welcome to Our Platform',
                    default: 'Build Amazing Products'
                },
                {
                    name: 'subtitle',
                    type: 'textarea',
                    label: 'Subtitle',
                    required: false,
                    placeholder: 'A brief description...',
                    default: 'Create powerful APIs without writing code'
                },
                {
                    name: 'ctaText',
                    type: 'text',
                    label: 'Button Text',
                    required: true,
                    default: 'Get Started'
                },
                {
                    name: 'ctaLink',
                    type: 'url',
                    label: 'Button Link',
                    required: true,
                    default: '#'
                },
                {
                    name: 'backgroundImage',
                    type: 'image',
                    label: 'Background Image',
                    required: false
                }
            ]
        },
        defaultConfig: {
            layout: 'centered',
            colors: {
                primary: '#0ea5e9',
                secondary: '#d946ef',
                background: '#1e293b',
                text: '#ffffff'
            }
        }
    },

    // 2. Features Grid
    {
        name: 'Features Grid',
        slug: 'features-grid',
        category: 'content',
        description: 'Showcase your product features in a beautiful grid layout',
        icon: 'Grid3x3',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'Features'
                },
                {
                    name: 'sectionSubtitle',
                    type: 'textarea',
                    label: 'Section Subtitle',
                    required: false,
                    default: 'Everything you need to succeed'
                },
                {
                    name: 'features',
                    type: 'text',
                    label: 'Features (JSON Array)',
                    required: true,
                    placeholder: '[{"icon":"Zap","title":"Fast","description":"Lightning fast performance"}]',
                    default: JSON.stringify([
                        { icon: 'Zap', title: 'Fast Performance', description: 'Lightning-fast load times' },
                        { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security' },
                        { icon: 'Users', title: 'Collaborative', description: 'Work together seamlessly' }
                    ])
                }
            ]
        },
        defaultConfig: {
            layout: 'grid-3',
            colors: {
                primary: '#0ea5e9',
                background: '#ffffff',
                text: '#1e293b'
            }
        }
    },

    // 3. Contact Form
    {
        name: 'Contact Form',
        slug: 'contact-form',
        category: 'form',
        description: 'Simple contact form with customizable fields',
        icon: 'Mail',
        fieldSchema: {
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Form Title',
                    required: true,
                    default: 'Get in Touch'
                },
                {
                    name: 'subtitle',
                    type: 'textarea',
                    label: 'Form Subtitle',
                    required: false,
                    default: 'We\'d love to hear from you'
                },
                {
                    name: 'email',
                    type: 'text',
                    label: 'Recipient Email',
                    required: true,
                    placeholder: 'contact@example.com'
                },
                {
                    name: 'showPhone',
                    type: 'boolean',
                    label: 'Include Phone Field',
                    required: false,
                    default: true
                },
                {
                    name: 'showMessage',
                    type: 'boolean',
                    label: 'Include Message Field',
                    required: false,
                    default: true
                }
            ]
        },
        defaultConfig: {
            layout: 'centered',
            colors: {
                primary: '#0ea5e9',
                background: '#f8fafc',
                text: '#1e293b'
            }
        }
    },

    // 4. About Section
    {
        name: 'About Section',
        slug: 'about-section',
        category: 'content',
        description: 'Tell your story with text and image',
        icon: 'Info',
        fieldSchema: {
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'About Us'
                },
                {
                    name: 'content',
                    type: 'textarea',
                    label: 'Content',
                    required: true,
                    placeholder: 'Tell your story...',
                    default: 'We are passionate about building great products.'
                },
                {
                    name: 'image',
                    type: 'image',
                    label: 'Image',
                    required: false
                },
                {
                    name: 'imagePosition',
                    type: 'select',
                    label: 'Image Position',
                    required: false,
                    options: ['left', 'right'],
                    default: 'right'
                }
            ]
        },
        defaultConfig: {
            layout: 'two-column',
            colors: {
                background: '#ffffff',
                text: '#1e293b'
            }
        }
    },

    // 5. Testimonials
    {
        name: 'Testimonials',
        slug: 'testimonials',
        category: 'content',
        description: 'Display customer testimonials and reviews',
        icon: 'MessageSquare',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'What Our Customers Say'
                },
                {
                    name: 'testimonials',
                    type: 'text',
                    label: 'Testimonials (JSON Array)',
                    required: true,
                    placeholder: '[{"name":"John Doe","role":"CEO","content":"Amazing!","avatar":""}]',
                    default: JSON.stringify([
                        { name: 'John Doe', role: 'CEO, Company', content: 'This product changed everything for us!', avatar: '' },
                        { name: 'Jane Smith', role: 'Developer', content: 'Incredibly easy to use and powerful.', avatar: '' }
                    ])
                }
            ]
        },
        defaultConfig: {
            layout: 'carousel',
            colors: {
                primary: '#0ea5e9',
                background: '#f8fafc',
                text: '#1e293b'
            }
        }
    },

    // 6. Pricing Table
    {
        name: 'Pricing Table',
        slug: 'pricing-table',
        category: 'content',
        description: 'Display pricing plans in a comparison table',
        icon: 'DollarSign',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'Pricing Plans'
                },
                {
                    name: 'plans',
                    type: 'text',
                    label: 'Plans (JSON Array)',
                    required: true,
                    placeholder: '[{"name":"Basic","price":"$9","features":["Feature 1"]}]',
                    default: JSON.stringify([
                        { name: 'Basic', price: '$9', period: '/month', features: ['Feature 1', 'Feature 2'], highlighted: false },
                        { name: 'Pro', price: '$29', period: '/month', features: ['Everything in Basic', 'Feature 3', 'Feature 4'], highlighted: true },
                        { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Feature 5', 'Priority Support'], highlighted: false }
                    ])
                }
            ]
        },
        defaultConfig: {
            layout: 'grid-3',
            colors: {
                primary: '#0ea5e9',
                secondary: '#d946ef',
                background: '#ffffff',
                text: '#1e293b'
            }
        }
    },

    // 7. Footer
    {
        name: 'Footer',
        slug: 'footer',
        category: 'footer',
        description: 'Footer with links, social media, and copyright',
        icon: 'Layout',
        fieldSchema: {
            fields: [
                {
                    name: 'companyName',
                    type: 'text',
                    label: 'Company Name',
                    required: true,
                    default: 'Your Company'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    required: false,
                    default: 'Building amazing products since 2024'
                },
                {
                    name: 'links',
                    type: 'text',
                    label: 'Links (JSON Array)',
                    required: false,
                    placeholder: '[{"title":"About","url":"/about"}]',
                    default: JSON.stringify([
                        { title: 'About', url: '/about' },
                        { title: 'Contact', url: '/contact' },
                        { title: 'Privacy', url: '/privacy' }
                    ])
                },
                {
                    name: 'socialLinks',
                    type: 'text',
                    label: 'Social Links (JSON)',
                    required: false,
                    placeholder: '{"twitter":"","linkedin":""}',
                    default: JSON.stringify({ twitter: '', linkedin: '', github: '' })
                },
                {
                    name: 'copyright',
                    type: 'text',
                    label: 'Copyright Text',
                    required: false,
                    default: '© 2024 Your Company. All rights reserved.'
                }
            ]
        },
        defaultConfig: {
            layout: 'multi-column',
            colors: {
                background: '#1e293b',
                text: '#ffffff'
            }
        }
    },

    // 8. Product Grid
    {
        name: 'Product Grid',
        slug: 'product-grid',
        category: 'content',
        description: 'Display products in a responsive grid layout with images, prices, and details',
        icon: 'Grid3x3',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: false,
                    default: 'Our Products'
                },
                {
                    name: 'sectionSubtitle',
                    type: 'textarea',
                    label: 'Section Subtitle',
                    required: false,
                    default: 'Discover our amazing collection'
                },
                {
                    name: 'dataSource',
                    type: 'select',
                    label: 'Data Source',
                    required: true,
                    options: ['admin-panel', 'manual'],
                    default: 'admin-panel'
                },
                {
                    name: 'columns',
                    type: 'select',
                    label: 'Columns',
                    required: false,
                    options: ['2', '3', '4'],
                    default: '3'
                },
                {
                    name: 'showPrice',
                    type: 'boolean',
                    label: 'Show Price',
                    required: false,
                    default: true
                },
                {
                    name: 'showButton',
                    type: 'boolean',
                    label: 'Show Action Button',
                    required: false,
                    default: true
                }
            ]
        },
        defaultConfig: {
            layout: 'grid-3',
            colors: {
                primary: '#0ea5e9',
                background: '#ffffff',
                text: '#1e293b'
            }
        }
    },

    // 9. Product List
    {
        name: 'Product List',
        slug: 'product-list',
        category: 'content',
        description: 'Display products in a list/card format with detailed information',
        icon: 'Grid3x3',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: false,
                    default: 'Featured Products'
                },
                {
                    name: 'dataSource',
                    type: 'select',
                    label: 'Data Source',
                    required: true,
                    options: ['admin-panel', 'manual'],
                    default: 'admin-panel'
                },
                {
                    name: 'layout',
                    type: 'select',
                    label: 'Layout Style',
                    required: false,
                    options: ['list', 'cards'],
                    default: 'cards'
                }
            ]
        },
        defaultConfig: {
            layout: 'list',
            colors: {
                primary: '#0ea5e9',
                background: '#f8fafc',
                text: '#1e293b'
            }
        }
    },

    // 10. Services Grid
    {
        name: 'Services Grid',
        slug: 'services-grid',
        category: 'content',
        description: 'Showcase your services with icons, titles, and descriptions',
        icon: 'Grid3x3',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'Our Services'
                },
                {
                    name: 'sectionSubtitle',
                    type: 'textarea',
                    label: 'Section Subtitle',
                    required: false,
                    default: 'What we offer'
                },
                {
                    name: 'dataSource',
                    type: 'select',
                    label: 'Data Source',
                    required: true,
                    options: ['admin-panel', 'manual'],
                    default: 'admin-panel'
                },
                {
                    name: 'columns',
                    type: 'select',
                    label: 'Columns',
                    required: false,
                    options: ['2', '3', '4'],
                    default: '3'
                }
            ]
        },
        defaultConfig: {
            layout: 'grid-3',
            colors: {
                primary: '#0ea5e9',
                background: '#ffffff',
                text: '#1e293b'
            }
        }
    },

    // 11. Team Section
    {
        name: 'Team Section',
        slug: 'team-section',
        category: 'content',
        description: 'Display team members with photos, names, roles, and bios',
        icon: 'Users',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'Meet Our Team'
                },
                {
                    name: 'sectionSubtitle',
                    type: 'textarea',
                    label: 'Section Subtitle',
                    required: false,
                    default: 'The people behind our success'
                },
                {
                    name: 'dataSource',
                    type: 'select',
                    label: 'Data Source',
                    required: true,
                    options: ['admin-panel', 'manual'],
                    default: 'admin-panel'
                },
                {
                    name: 'columns',
                    type: 'select',
                    label: 'Columns',
                    required: false,
                    options: ['2', '3', '4'],
                    default: '3'
                },
                {
                    name: 'showSocial',
                    type: 'boolean',
                    label: 'Show Social Links',
                    required: false,
                    default: true
                }
            ]
        },
        defaultConfig: {
            layout: 'grid-3',
            colors: {
                primary: '#0ea5e9',
                background: '#f8fafc',
                text: '#1e293b'
            }
        }
    },

    // 12. Gallery
    {
        name: 'Gallery',
        slug: 'gallery',
        category: 'media',
        description: 'Image gallery with lightbox functionality',
        icon: 'Image',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: false,
                    default: 'Gallery'
                },
                {
                    name: 'dataSource',
                    type: 'select',
                    label: 'Data Source',
                    required: true,
                    options: ['admin-panel', 'manual'],
                    default: 'admin-panel'
                },
                {
                    name: 'columns',
                    type: 'select',
                    label: 'Columns',
                    required: false,
                    options: ['2', '3', '4', '5'],
                    default: '4'
                },
                {
                    name: 'enableLightbox',
                    type: 'boolean',
                    label: 'Enable Lightbox',
                    required: false,
                    default: true
                }
            ]
        },
        defaultConfig: {
            layout: 'grid-4',
            colors: {
                background: '#ffffff'
            }
        }
    },

    // 13. FAQ Accordion
    {
        name: 'FAQ Accordion',
        slug: 'faq-accordion',
        category: 'content',
        description: 'Expandable FAQ section with questions and answers',
        icon: 'HelpCircle',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: true,
                    default: 'Frequently Asked Questions'
                },
                {
                    name: 'sectionSubtitle',
                    type: 'textarea',
                    label: 'Section Subtitle',
                    required: false,
                    default: 'Find answers to common questions'
                },
                {
                    name: 'dataSource',
                    type: 'select',
                    label: 'Data Source',
                    required: true,
                    options: ['admin-panel', 'manual'],
                    default: 'admin-panel'
                },
                {
                    name: 'defaultOpen',
                    type: 'boolean',
                    label: 'First Item Open by Default',
                    required: false,
                    default: true
                }
            ]
        },
        defaultConfig: {
            layout: 'accordion',
            colors: {
                primary: '#0ea5e9',
                background: '#f8fafc',
                text: '#1e293b'
            }
        }
    },

    // 14. Stats/Metrics
    {
        name: 'Stats Section',
        slug: 'stats-section',
        category: 'content',
        description: 'Display key numbers and achievements',
        icon: 'TrendingUp',
        fieldSchema: {
            fields: [
                {
                    name: 'sectionTitle',
                    type: 'text',
                    label: 'Section Title',
                    required: false,
                    default: 'Our Impact'
                },
                {
                    name: 'stats',
                    type: 'text',
                    label: 'Stats (JSON Array)',
                    required: true,
                    placeholder: '[{"value":"1000+","label":"Customers"}]',
                    default: JSON.stringify([
                        { value: '10K+', label: 'Happy Customers', icon: 'Users' },
                        { value: '99%', label: 'Satisfaction Rate', icon: 'Star' },
                        { value: '24/7', label: 'Support', icon: 'Clock' },
                        { value: '50+', label: 'Countries', icon: 'Globe' }
                    ])
                },
                {
                    name: 'layout',
                    type: 'select',
                    label: 'Layout',
                    required: false,
                    options: ['horizontal', 'grid'],
                    default: 'horizontal'
                }
            ]
        },
        defaultConfig: {
            layout: 'horizontal',
            colors: {
                primary: '#0ea5e9',
                background: '#1e293b',
                text: '#ffffff'
            }
        }
    },

    // 15. CTA Banner
    {
        name: 'CTA Banner',
        slug: 'cta-banner',
        category: 'content',
        description: 'Call-to-action banner with title, description, and button',
        icon: 'Megaphone',
        fieldSchema: {
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    required: true,
                    default: 'Ready to Get Started?'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    required: false,
                    default: 'Join thousands of satisfied customers today'
                },
                {
                    name: 'primaryButtonText',
                    type: 'text',
                    label: 'Primary Button Text',
                    required: true,
                    default: 'Get Started'
                },
                {
                    name: 'primaryButtonLink',
                    type: 'url',
                    label: 'Primary Button Link',
                    required: true,
                    default: '#'
                },
                {
                    name: 'secondaryButtonText',
                    type: 'text',
                    label: 'Secondary Button Text',
                    required: false,
                    default: 'Learn More'
                },
                {
                    name: 'secondaryButtonLink',
                    type: 'url',
                    label: 'Secondary Button Link',
                    required: false,
                    default: '#'
                },
                {
                    name: 'backgroundImage',
                    type: 'image',
                    label: 'Background Image',
                    required: false
                }
            ]
        },
        defaultConfig: {
            layout: 'centered',
            colors: {
                primary: '#0ea5e9',
                secondary: '#d946ef',
                background: '#1e293b',
                text: '#ffffff'
            }
        }
    },

    // 16. Newsletter
    {
        name: 'Newsletter Signup',
        slug: 'newsletter-signup',
        category: 'form',
        description: 'Email newsletter subscription form',
        icon: 'Mail',
        fieldSchema: {
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    required: true,
                    default: 'Subscribe to Our Newsletter'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    required: false,
                    default: 'Get the latest updates and news delivered to your inbox'
                },
                {
                    name: 'buttonText',
                    type: 'text',
                    label: 'Button Text',
                    required: true,
                    default: 'Subscribe'
                },
                {
                    name: 'placeholder',
                    type: 'text',
                    label: 'Input Placeholder',
                    required: false,
                    default: 'Enter your email'
                },
                {
                    name: 'showPrivacyNote',
                    type: 'boolean',
                    label: 'Show Privacy Note',
                    required: false,
                    default: true
                }
            ]
        },
        defaultConfig: {
            layout: 'inline',
            colors: {
                primary: '#0ea5e9',
                background: '#f8fafc',
                text: '#1e293b'
            }
        }
    }
];
