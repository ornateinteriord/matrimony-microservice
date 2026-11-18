const getProjectName = (req) => {
  const header = req?.headers ? (req.headers['x-project-name'] || req.headers['x-project']) : undefined;
  if (header) {
    const clean = header.toLowerCase().replace(/[-_\s]/g, '');
    if (clean === 'sangamsathi') return 'Sangam-Sathi';
    if (clean === 'girijakalyana') return 'Girija-Kalyana';
    if (clean === 'shreeganda' || clean === 'shreegandha') return 'Shree-Ganda';
    return header;
  }
  if (req?.body && req.body.projectName) {
    return req.body.projectName;
  }
  return process.env.PROJECT_NAME || 'Girija-Kalyana';
};

module.exports = { getProjectName };

