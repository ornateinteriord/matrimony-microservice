const UserModel = require("../../models/user");

const getUserCounts = async (req, res) => {
  try {
    const isFree = { $or: [{ type_of_user: 'FreeUser' }, { user_role: 'FreeUser' }], status: { $in: ['active', 'Active'] } };
    const isSilver = { $or: [{ type_of_user: 'SilverUser' }, { user_role: 'SilverUser' }], status: { $in: ['active', 'Active'] } };
    const isPremium = { $or: [{ type_of_user: 'PremiumUser' }, { user_role: 'PremiumUser' }], status: { $in: ['active', 'Active'] } };
    const isPending = { status: { $in: ['pending', 'Pending', 'inactive', 'Inactive'] }, user_role: { $ne: 'admin' } };
    const isSuccess = { status: { $in: ['active', 'Active'] }, user_role: { $ne: 'admin' } };

    const [
      freeUserCount,
      silverUserCount,
      premiumUserCount,
      assistancePendingCount,
      assistanceSuccessCount
    ] = await Promise.all([
      UserModel.countDocuments(isFree),
      UserModel.countDocuments(isSilver),
      UserModel.countDocuments(isPremium),
      UserModel.countDocuments(isPending),
      UserModel.countDocuments(isSuccess)
    ]);

    const totalPaidUsers = silverUserCount + premiumUserCount;

    res.status(200).json({
      success: true,
      counts: {
        freeUser: freeUserCount,
        silverUser: silverUserCount,
        premiumUser: premiumUserCount,
        totalPaidUsers,
        assistancePending: assistancePendingCount,
        assistanceSuccess: assistanceSuccessCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserCounts,
};