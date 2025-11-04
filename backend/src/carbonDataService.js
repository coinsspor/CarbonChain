import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CarbonDataService {
  constructor() {
    this.projects = [];
    this.credits = [];
    this.loadData();
  }

  loadData() {
    try {
      console.log('📊 Loading carbon credit data...');

      const projectsPath = join(__dirname, '../data/projects.json');
      const creditsPath = join(__dirname, '../data/credits.json');

      const projectsData = readFileSync(projectsPath, 'utf-8');
      const creditsData = readFileSync(creditsPath, 'utf-8');

      this.projects = JSON.parse(projectsData);
      this.credits = JSON.parse(creditsData);

      console.log(`✅ Loaded ${this.projects.length} projects`);
      console.log(`✅ Loaded ${this.credits.length} credits`);
      console.log('🎉 Carbon data loaded successfully!');

    } catch (error) {
      console.error('❌ Error loading carbon data:', error);
      this.projects = [];
      this.credits = [];
    }
  }

  getAllProjects() {
    return this.projects;
  }

  getProjectById(projectId) {
    return this.projects.find(p => p.id === projectId);
  }

  getAllCredits() {
    return this.credits;
  }

  getStats() {
    const totalProjects = this.projects.length;
    const totalIssued = this.projects.reduce((sum, p) => sum + (parseInt(p.issued) || 0), 0);
    const totalRetired = this.projects.reduce((sum, p) => sum + (parseInt(p.retired) || 0), 0);
    const available = totalIssued - totalRetired;

    // REGISTRY
    const byRegistry = this.projects.reduce((acc, project) => {
      let registry = project.registry || 'unknown';
      registry = registry.toString().toLowerCase().trim();
      
      const validRegistries = ['verra', 'gold-standard', 'art-trees', 'climate-action-reserve', 
                               'american-carbon-registry', 'berkeley', 'carbonplan', 'unknown'];
      
      if (!validRegistries.includes(registry)) {
        registry = 'unknown';
      }
      
      acc[registry] = (acc[registry] || 0) + 1;
      return acc;
    }, {});

    // COUNTRY
    const byCountry = this.projects.reduce((acc, project) => {
      const country = project.country || 'unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    const topCountries = Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    return {
      totalProjects,
      totalIssued,
      totalRetired,
      available,
      byRegistry,
      topCountries
    };
  }
}

const carbonDataService = new CarbonDataService();
export default carbonDataService;
