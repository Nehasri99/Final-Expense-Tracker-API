const UserModel = require('../Models/User'); // Adjust path to your User model if needed
const bcrypt = require('bcrypt');
/**
 * @description Get profile details (name, email) for the logged-in user.
 * @route GET /api/users/profile
 * @access Private (requires authentication)
 */
const getUserProfile = async (req, res) => {
    try {
        // Your authentication middleware should add user info to req.user
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'Not authorized, user ID missing' });
        }

        // Find user by ID from the token, select only name and email
        const user = await UserModel.findById(req.user._id).select('name email');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send back the profile data
        res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; 

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 4) { 
         return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long' });
    }

    try {
        // 1. Fetch the user *only* to compare the current password
        const user = await UserModel.findById(userId).select('+password'); // Select password explicitly if needed
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 2. Compare the provided current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        // 3. Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // 4. Use findByIdAndUpdate to update ONLY the password field
        await UserModel.findByIdAndUpdate(userId, { 
            $set: { password: hashedNewPassword } 
        });

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        // It seems you had console.warn here, changing to console.error
        console.error('Error changing password:', error); 
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// Export the function so the router can use it
module.exports = {
    getUserProfile,
    changePassword,
};