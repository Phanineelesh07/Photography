const fs = require('fs');

let controller = fs.readFileSync('server/controllers/adminController.js', 'utf8');

const approveUserCode = `
// @desc    Approve a user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isApproved = true;
    await user.save();
    
    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
`;

if (!controller.includes('approveUser')) {
  controller = controller.replace(
    "module.exports = {\n  getAllParticipants,\n  deleteUser,\n  updateUser\n};",
    approveUserCode + "\nmodule.exports = {\n  getAllParticipants,\n  deleteUser,\n  updateUser,\n  approveUser\n};"
  );
  fs.writeFileSync('server/controllers/adminController.js', controller);
  console.log('adminController.js updated');
}

let routes = fs.readFileSync('server/routes/adminRoutes.js', 'utf8');
if (!routes.includes('approveUser')) {
  routes = routes.replace(
    "getAllParticipants, deleteUser, updateUser } = require('../controllers/adminController');",
    "getAllParticipants, deleteUser, updateUser, approveUser } = require('../controllers/adminController');"
  );
  
  routes = routes.replace(
    "router.route('/users/:id').put(updateUser).delete(deleteUser);",
    "router.route('/users/:id').put(updateUser).delete(deleteUser);\nrouter.route('/users/:id/approve').put(approveUser);"
  );
  fs.writeFileSync('server/routes/adminRoutes.js', routes);
  console.log('adminRoutes.js updated');
}
