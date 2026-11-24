const profile = require("../../models/profile");
const UserModel = require("../../models/user");
const { getPaginationParams } = require("../../utils/pagination");

const AssistancePending = async (req, res) => {
  try {
    const { page, pageSize } = getPaginationParams(req);
    const { type_of_user } = req.body || {};
    
    const filter = {
      status: { $in: ['inactive', 'Inactive', 'pending', 'Pending'] },
      user_role: { $ne: 'admin' },
    };

    if (type_of_user && type_of_user !== 'all') {
      filter.$or = [
        { type_of_user: type_of_user },
        { user_role: type_of_user },
      ];
    }

    const totalRecords = await UserModel.countDocuments(filter);
    
    const pendingUsers = await UserModel.find(filter)
      .sort({ createdAt: -1, _id: -1 }) 
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    const content = pendingUsers.map(u => ({
      ...u,
      registration_no: u.ref_no || u.registration_no,
      ref_no: u.ref_no || u.registration_no,
    }));

    res.status(200).json({
      success: true,
      content,
      currentPage: page,
      pageSize: pageSize,
      totalRecords: totalRecords
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const assistanceSuccess = async (req, res) => {
  try {
    const { page, pageSize } = getPaginationParams(req);
    const { type_of_user } = req.body || {};
    
    const filter = {
      status: { $in: ['active', 'Active'] },
      user_role: { $ne: 'admin' },
    };

    if (type_of_user && type_of_user !== 'all') {
      filter.$or = [
        { type_of_user: type_of_user },
        { user_role: type_of_user },
      ];
    }

    const totalRecords = await UserModel.countDocuments(filter);
    
    const activeUsers = await UserModel.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    const content = activeUsers.map(u => ({
      ...u,
      registration_no: u.ref_no || u.registration_no,
      ref_no: u.ref_no || u.registration_no,
    }));

    res.status(200).json({
      success: true,
      content,
      currentPage: page,
      pageSize: pageSize,
      totalRecords: totalRecords
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  AssistancePending,
  assistanceSuccess
};