const fs = require('fs');

// 1. Update submissionController.js
let controllerPath = 'server/controllers/submissionController.js';
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

const deleteController = `
// @desc    Delete a submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Optional: Delete from disk (ignoring for now to prevent accidental wipe)
    await submission.deleteOne();
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting submission' });
  }
};

module.exports = {`;
if (!controllerContent.includes('deleteSubmission')) {
  controllerContent = controllerContent.replace('module.exports = {', deleteController);
  // just add it to exports
  controllerContent = controllerContent.replace('module.exports = {', 'module.exports = {\n  deleteSubmission,');
  fs.writeFileSync(controllerPath, controllerContent);
}

// 2. Update submissionRoutes.js
let routesPath = 'server/routes/submissionRoutes.js';
let routesContent = fs.readFileSync(routesPath, 'utf8');
if (!routesContent.includes('deleteSubmission')) {
  routesContent = routesContent.replace('getMySubmission\n} = require(', 'getMySubmission,\n  deleteSubmission\n} = require(');
  routesContent = routesContent.replace("router.get('/leaderboard', protect, admin, getLeaderboard);", "router.get('/leaderboard', protect, admin, getLeaderboard);\nrouter.delete('/:id', protect, admin, deleteSubmission);");
  fs.writeFileSync(routesPath, routesContent);
}

// 3. Update submissionService.js
let servicePath = 'client/src/services/submissionService.js';
let serviceContent = fs.readFileSync(servicePath, 'utf8');
if (!serviceContent.includes('deleteSubmission')) {
  serviceContent = serviceContent.replace('export const getLeaderboard =', 'export const deleteSubmission = async (id) => {\n  return await fetchWithAuth(`/submissions/${id}`, { method: \'DELETE\' });\n};\n\nexport const getLeaderboard =');
  fs.writeFileSync(servicePath, serviceContent);
}

console.log('Backend and Services updated');
