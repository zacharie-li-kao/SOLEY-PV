// The single map from panel cell (reading order, 3 columns x 4 rows) to section id.
export const CELLS = [
  { id: 'overview' }, { id: 'download' }, { id: 'quickstart' },
  { id: 'optics' }, { id: 'device' }, { id: 'analysis' },
  { id: 'gallery' }, { id: 'method' }, { id: 'roadmap' },
  { id: 'releases' }, { id: 'citation' }, { id: 'about' },
];

// Hashes of the previous tabbed site, still linked from papers and Zenodo.
export const LEGACY = {
  'overview-tab': 'overview', 'features-tab': 'optics', 'screenshots-tab': 'gallery',
  'download-tab': 'download', 'quickstart-tab': 'quickstart', 'technical-tab': 'method',
  'roadmap-tab': 'roadmap', 'patchnotes-tab': 'releases', 'citation-tab': 'citation',
  'contact-tab': 'about', features: 'optics', screenshots: 'gallery', technical: 'method',
  patchnotes: 'releases', contact: 'about',
};

// The single primary action, marked in ember on the panel.
export const PRIMARY = 'download';

export const DAY_START = 7;
export const NIGHT_START = 19;
export const THEME_KEY = 'soley-daynight';
