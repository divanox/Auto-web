import ProductGridRenderer from './renderers/ProductGridRenderer';
import ServicesGridRenderer from './renderers/ServicesGridRenderer';
import TeamRenderer from './renderers/TeamRenderer';
import GalleryRenderer from './renderers/GalleryRenderer';

interface ComponentRendererProps {
    templateSlug: string;
    configuration?: any;
    content?: any;
}

const ComponentRenderer = ({ templateSlug, configuration, content }: ComponentRendererProps) => {
    // Map template slugs to their renderer components
    const rendererMap: Record<string, React.ComponentType<any>> = {
        'product-grid': ProductGridRenderer,
        'product-list': ProductGridRenderer, // Can use same renderer with different config
        'services-grid': ServicesGridRenderer,
        'team-section': TeamRenderer,
        'gallery': GalleryRenderer,
    };

    const RendererComponent = rendererMap[templateSlug];

    if (!RendererComponent) {
        // For components without dynamic data renderers, show a placeholder
        return (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <p className="text-gray-500">
                    Component: <span className="font-semibold">{templateSlug}</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    This component type doesn't have a renderer yet
                </p>
            </div>
        );
    }

    return <RendererComponent configuration={configuration} content={content} />;
};

export default ComponentRenderer;
