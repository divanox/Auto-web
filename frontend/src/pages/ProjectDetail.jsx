import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, modulesAPI } from '../services/api';
import Layout from '../components/Layout';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  RefreshCw,
  Package,
  FileText,
  Users,
  ShoppingCart,
  Plus,
  X
} from 'lucide-react';

const moduleIcons = {
  Package,
  FileText,
  Users,
  ShoppingCart,
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  const [enabledModules, setEnabledModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, modulesRes, enabledRes] = await Promise.all([
        projectsAPI.getOne(id),
        modulesAPI.getAll(),
        modulesAPI.getProjectModules(id),
      ]);

      setProject(projectRes.data.data.project);
      setAvailableModules(modulesRes.data.data.modules);
      setEnabledModules(enabledRes.data.data.modules);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableModule = async (moduleId) => {
    try {
      await modulesAPI.enableModule(id, { moduleId });
      fetchData();
    } catch (error) {
      console.error('Error enabling module:', error);
      alert('Failed to enable module');
    }
  };

  const handleDisableModule = async (moduleId) => {
    if (!confirm('Are you sure you want to disable this module?')) return;
    
    try {
      await modulesAPI.disableModule(id, moduleId);
      fetchData();
    } catch (error) {
      console.error('Error disabling module:', error);
      alert('Failed to disable module');
    }
  };

  const handleRegenerateToken = async () => {
    if (!confirm('This will invalidate your current API token. Continue?')) return;
    
    try {
      const response = await projectsAPI.regenerateToken(id);
      setProject(response.data.data.project);
    } catch (error) {
      console.error('Error regenerating token:', error);
      alert('Failed to regenerate token');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
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

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found</p>
          <Link to="/projects" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  const enabledModuleIds = enabledModules.map(m => m.moduleId._id);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.name}</h1>
          <p className="text-gray-600">{project.description || 'No description'}</p>
        </div>

        {/* API Credentials */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">API Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-sm">
                  {project.baseUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(project.baseUrl)}
                  className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copiedToken ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-sm font-mono">
                  {project.apiToken}
                </code>
                <button
                  onClick={() => copyToClipboard(project.apiToken)}
                  className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleRegenerateToken}
                  className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  title="Regenerate Token"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enabled Modules */}
        {enabledModules.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Enabled Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enabledModules.map((pm) => {
                const module = pm.moduleId;
                const Icon = moduleIcons[module.icon] || Package;
                return (
                  <div key={pm._id} className="bg-white/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{module.name}</h3>
                        <p className="text-sm text-gray-600">/{module.slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisableModule(module._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Modules */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Available Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModules.map((module) => {
              const Icon = moduleIcons[module.icon] || Package;
              const isEnabled = enabledModuleIds.includes(module._id);
              
              return (
                <div
                  key={module._id}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isEnabled
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white/50 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isEnabled ? 'bg-green-500' : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {isEnabled && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Enabled
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{module.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  {!isEnabled && (
                    <button
                      onClick={() => handleEnableModule(module._id)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Enable Module
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
