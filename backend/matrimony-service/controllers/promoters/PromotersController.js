const mongoose = require("mongoose");
const PromotersModel = require("../../models/promoters/Promoters");
const ProfileModel = require("../../models/profile");
const PromotersEarningsModel = require("../../models/promoters/PromotersEarnings");
const PromoterTransactionModel = require("../../models/promoters/PromotersTransaction");
const { FormatDate } = require("../../utils/DateFormate");
const { getCasteFilter } = require("../../utils/casteFilter");
const InterestModel = require("../../models/Intrest/Intrest");
const UserModel = require("../../models/user");
const { handleControllerError } = require("../../utils/errorHandler");

const getPaginationParams = (req) => {
  const page = parseInt(req.body.page, 10) || parseInt(req.query.page, 10) || 0;
  const pageSize = parseInt(req.body.pageSize, 10) || parseInt(req.query.pageSize, 10) || 10;
  return { page, pageSize };
};


const getPromoters = async(req,res)=>{
    try {
        const Promoters = await PromotersModel.find().sort({ _id: -1 });
        res.status(200).json({ success: true, Promoters });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
}
const getPromotersEarnings = async (req, res) => {
  try {
    const Earnings = await PromotersEarningsModel.aggregate([
      {
        $match: {
          referal_by: { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: { $toUpper: "$referal_by" },
          totalAmount: { $sum: { $toDouble: "$amount_earned" } },
          count: { $sum: 1 },
          status: { $first: "$status" },
        }
      },
      {
        $lookup: {
          from: "promoter_tbl",
          localField: "_id",
          foreignField: "promoter_id",
          as: "promoterInfo"
        }
      },
      {
        $unwind: {
          path: "$promoterInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          referal_by: "$_id",
          totalAmount: 1,
          count: 1,
          status: 1,
          promoter_name: "$promoterInfo.promoter_name",
          email: "$promoterInfo.email",
          mobile: "$promoterInfo.mobile",
          account_number: "$promoterInfo.account_number",
          bank_ifsc: "$promoterInfo.bank_ifsc",
          company_name: "$promoterInfo.company_name"
        }
      },
      {
        $sort: { referal_by: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      Earnings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPromotersAllData = async (req, res) => {
  try {
    const promoterId = req.params.promoter_id;
    if (!promoterId) {
      return res.status(400).json({
        success: false,
        message: "promoter_id is required in params",
      });
    }

    const records = await PromotersEarningsModel.aggregate([
      {
        $match: {
          $or: [
            { referal_by: { $regex: new RegExp(`^${promoterId}$`, "i") } },
            { refered_by: { $regex: new RegExp(`^${promoterId}$`, "i") } }
          ]
        }
      },
      {
        $sort: { transaction_date: -1 } 
      }
    ]);

    res.status(200).json({
      success: true,
      promoterId,
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getPromotersTransactions = async(req,res)=>{
    try {
        const Transactions = await PromoterTransactionModel.find().sort({ _id: -1 });
        res.status(200).json({ success: true, Transactions });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
}
const updatePromoterStatus = async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body; 

  try {
    const updatedPromoter = await PromotersModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPromoter) {
      return res.status(404).json({ success: false, message: "Promoter not found" });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      promoter: updatedPromoter,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPromoterUserStats = async (req, res) => {
  try {
    // Get all promoters
    const promoters = await PromotersModel.find({}, { promoter_id: 1, promoter_name: 1 });

    // Loop through promoters and calculate counts
    const results = await Promise.all(
      promoters.map(async (promoter) => {
        const promoterId = promoter.promoter_id;

        const query = { refered_by: { $regex: new RegExp(`^${promoterId}$`, "i") } };
        const casteFilter = getCasteFilter(req);
        if (casteFilter) {
          query.caste = casteFilter;
        }

        // Find all users referred by this promoter from unified user_tbl
        const users = await UserModel.find(query, { type_of_user: 1, user_role: 1, ref_no: 1, registration_no: 1 }).lean();

        // Count types
        const freeCount = users.filter(u => {
          const r = (u.user_role || u.type_of_user || "").toLowerCase().trim();
          return r === "freeuser" || r === "free" || (!r.includes("silver") && !r.includes("premium"));
        }).length;
        const silverCount = users.filter(u => {
          const r = (u.user_role || u.type_of_user || "").toLowerCase().trim();
          return r === "silveruser" || r === "silver";
        }).length;
        const premiumCount = users.filter(u => {
          const r = (u.user_role || u.type_of_user || "").toLowerCase().trim();
          return r === "premiumuser" || r === "premium";
        }).length;
        const totalCount = users.length;

        return {
          promoter_id: promoterId,
          promoter_name: promoter.promoter_name,
          freeCount,
          silverCount,
          premiumCount,
          totalCount
        };
      })
    );

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching promoter stats:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getUsersByPromoter = async (req, res) => {
  try {
    const { promoter_id } = req.params;

    // Use logged in promoter identity as primary truth if caller is promoter
    const effectivePromoterId = (
      (req.user?.user_role === 'promoter' ? (req.user?.promoter_id || req.user?.username) : null) ||
      promoter_id ||
      req.user?.promoter_id ||
      req.user?.username ||
      ''
    ).trim();

    if (!effectivePromoterId || effectivePromoterId === "undefined" || effectivePromoterId === "null") {
      return res.status(400).json({
        success: false,
        message: "promoter_id or username is required in params",
      });
    }

    const escapedEffectiveId = effectivePromoterId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const promoterDoc = await PromotersModel.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${escapedEffectiveId}$`, "i") } },
        { promoter_id: { $regex: new RegExp(`^${escapedEffectiveId}$`, "i") } },
      ],
    });

    const promoterCodes = new Set();
    if (effectivePromoterId) promoterCodes.add(effectivePromoterId);
    if (req.user?.promoter_id) promoterCodes.add(req.user.promoter_id.trim());
    if (req.user?.username) promoterCodes.add(req.user.username.trim());
    if (promoterDoc) {
      if (promoterDoc.promoter_id) promoterCodes.add(promoterDoc.promoter_id.trim());
      if (promoterDoc.username) promoterCodes.add(promoterDoc.username.trim());
    }

    const validCodes = Array.from(promoterCodes).filter(c => c && c !== 'undefined' && c !== 'null');
    const regexList = validCodes.map(code => new RegExp(`^\\s*${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i'));

    const matchObj = {
      $or: [
        { refered_by: { $in: regexList } },
        { refered_name: { $in: regexList } }
      ]
    };

    // Fetch directly from unified user_tbl
    const userTblUsers = await UserModel.find(matchObj).lean();

    const userMap = new Map();
    for (const u of userTblUsers) {
      const reg = (u.ref_no || u.registration_no || '').trim().toUpperCase();
      if (!reg) continue;
      userMap.set(reg, {
        ...u,
        registration_no: reg,
        ref_no: reg,
        refered_by: u.refered_by || '',
        refered_name: u.refered_name || '',
        contactinfo: u.mobile_no || u.contactinfo || '',
        user_role: u.user_role || u.type_of_user || 'FreeUser',
        type_of_user: u.type_of_user || u.user_role || 'FreeUser',
        status: u.status || 'Pending',
        image: u.image || '',
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        caste: u.caste || '',
        city: u.city || '',
      });
    }

    // STRICT CHECK: Ensure every single user in userMap was referred by this promoter!
    const validCodesLower = validCodes.map(c => c.toLowerCase().trim());
    for (const [reg, u] of userMap.entries()) {
      const ref = (u.refered_by || u.refered_name || '').toLowerCase().trim();
      if (!ref || !validCodesLower.includes(ref)) {
        userMap.delete(reg);
      }
    }

    const roleOrder = (r) => {
      const s = (r || '').toLowerCase();
      if (s.includes('premium')) return 1;
      if (s.includes('silver')) return 2;
      return 3;
    };

    const users = Array.from(userMap.values()).sort((a, b) => {
      const orderA = roleOrder(a.user_role || a.type_of_user);
      const orderB = roleOrder(b.user_role || b.type_of_user);
      if (orderA !== orderB) return orderA - orderB;
      const dateA = new Date(a.createdAt || a.registration_date || 0).getTime();
      const dateB = new Date(b.createdAt || b.registration_date || 0).getTime();
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      promoter_id: effectivePromoterId,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Error fetching users by promoter:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const addPromoter = async (req, res) => {
  try {
    let { promoter_name, promoter_id, mobile, email, username, password, country, company_name, account_number, bank_ifsc } = req.body;

    if (!promoter_name || !mobile || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Promoter Name, Mobile, Email, Username, and Password are required fields",
      });
    }

    // Auto-generate promoter_id if not provided
    if (!promoter_id || !promoter_id.trim()) {
      const cleanName = promoter_name.replace(/[^a-zA-Z]/g, '').toUpperCase();
      const prefix = (cleanName.length >= 4 ? cleanName.substring(0, 4) : cleanName.padEnd(4, 'PROM')).substring(0, 4);
      let candidateId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
      let count = 0;
      while (await PromotersModel.findOne({ promoter_id: candidateId }) && count < 20) {
        candidateId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
        count++;
      }
      promoter_id = candidateId;
    }

    const trimmedPromoterId = promoter_id.trim().toUpperCase();

    if (!/^[A-Z]{4}\d{4}$/.test(trimmedPromoterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Promoter ID format. Must start with 4 alphabets followed by 4 numbers (e.g., ABCD1234).",
      });
    }

    // Check if promoter_id, email, mobile, or username already exists
    const existingId = await PromotersModel.findOne({ promoter_id: trimmedPromoterId });
    if (existingId) {
      return res.status(409).json({ success: false, message: "This Promoter ID already exists!" });
    }

    const existingEmail = await PromotersModel.findOne({ email: email.trim() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: "This Email ID already exists!" });
    }

    const existingMobile = await PromotersModel.findOne({ mobile: mobile.trim() });
    if (existingMobile) {
      return res.status(409).json({ success: false, message: "This Mobile Number already exists!" });
    }

    const existingUsername = await PromotersModel.findOne({ username: username.trim() });
    if (existingUsername) {
      return res.status(409).json({ success: false, message: "This Username already exists!" });
    }

    // Generate numeric id
    const lastPromoter = await PromotersModel.findOne().sort({ id: -1 });
    const newId = (lastPromoter && !isNaN(lastPromoter.id)) ? lastPromoter.id + 1 : 1;

    const registration_date = FormatDate(new Date());

    const newPromoter = new PromotersModel({
      id: newId,
      registration_date,
      promoter_name: promoter_name.trim(),
      membership_type: req.body.membership_type ? req.body.membership_type.trim() : "Promoter",
      promoter_id: trimmedPromoterId,
      email: email.trim(),
      mobile: mobile.trim(),
      country: country ? country.trim() : "India",
      company_name: company_name ? company_name.trim() : "Not Updated",
      account_number: account_number ? account_number.trim() : "Not Updated",
      account_status: "Not Updated",
      bank_ifsc: bank_ifsc ? bank_ifsc.trim() : "Not Updated",
      username: username.trim(),
      password: password.trim(),
      status: "active",
    });

    await newPromoter.save();

    res.status(201).json({
      success: true,
      message: "Promoter added successfully",
      promoter: newPromoter,
    });
  } catch (error) {
    console.error("Error adding promoter:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getPromoterSentInterests = async (req, res) => {
  try {
    const { promoter_id } = req.params;
    if (!promoter_id) {
      return res.status(400).json({ success: false, message: "promoter_id is required" });
    }

    const casteFilter = getCasteFilter(req);
    const matchObj = { refered_by: { $regex: new RegExp(`^${promoter_id}$`, "i") } };
    if (casteFilter) {
      matchObj.caste = casteFilter;
    }

    // 1. Get all users referred by this promoter from unified user_tbl
    const users = await UserModel.find(matchObj, { registration_no: 1, ref_no: 1 }).lean();
    const userRegNos = users.map(u => u.registration_no || u.ref_no).filter(Boolean);

    if (userRegNos.length === 0) {
      return res.status(200).json({ success: true, count: 0, content: [] });
    }

    // 2. Get interests where sender is in userRegNos
    const interests = await InterestModel.find({ sender: { $in: userRegNos } }).sort({ createdAt: -1 });

    // 3. Populate sender and recipient profiles directly from user_tbl
    const senderIds = [...new Set(interests.map(i => i.sender))];
    const recipientIds = [...new Set(interests.map(i => i.recipient))];
    const allProfileIds = [...new Set([...senderIds, ...recipientIds])];
    
    const profiles = await UserModel.find({
      $or: [
        { registration_no: { $in: allProfileIds } },
        { ref_no: { $in: allProfileIds } }
      ]
    }, {
      registration_no: 1, ref_no: 1, name: 1, first_name: 1, last_name: 1, age: 1, user_caste: 1, caste: 1, city: 1, Images: 1, image: 1, gender: 1
    }).lean();

    const populatedInterests = interests.map(interest => {
      const senderProfile = profiles.find(p => p.registration_no === interest.sender || p.ref_no === interest.sender);
      const recipientProfile = profiles.find(p => p.registration_no === interest.recipient || p.ref_no === interest.recipient);
      return {
        ...interest.toObject(),
        senderProfile: senderProfile ? {
          ...senderProfile,
          registration_no: senderProfile.registration_no || senderProfile.ref_no,
          user_caste: senderProfile.user_caste || senderProfile.caste,
          Images: senderProfile.Images || (senderProfile.image ? [senderProfile.image] : [])
        } : null,
        recipientProfile: recipientProfile ? {
          ...recipientProfile,
          registration_no: recipientProfile.registration_no || recipientProfile.ref_no,
          user_caste: recipientProfile.user_caste || recipientProfile.caste,
          Images: recipientProfile.Images || (recipientProfile.image ? [recipientProfile.image] : [])
        } : null
      };
    });

    res.status(200).json({ success: true, count: populatedInterests.length, content: populatedInterests });
  } catch (error) {
    console.error("Error fetching promoter sent interests:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getPromoterReceivedInterests = async (req, res) => {
  try {
    const { promoter_id } = req.params;
    if (!promoter_id) {
      return res.status(400).json({ success: false, message: "promoter_id is required" });
    }

    const casteFilter = getCasteFilter(req);
    const matchObj = { refered_by: { $regex: new RegExp(`^${promoter_id}$`, "i") } };
    if (casteFilter) {
      matchObj.caste = casteFilter;
    }

    // 1. Get all users referred by this promoter from unified user_tbl
    const users = await UserModel.find(matchObj, { registration_no: 1, ref_no: 1 }).lean();
    const userRegNos = users.map(u => u.registration_no || u.ref_no).filter(Boolean);

    if (userRegNos.length === 0) {
      return res.status(200).json({ success: true, count: 0, content: [] });
    }

    // 2. Get interests where recipient is in userRegNos
    const interests = await InterestModel.find({ recipient: { $in: userRegNos } }).sort({ createdAt: -1 });

    // 3. Populate sender and recipient profiles directly from user_tbl
    const senderIds = [...new Set(interests.map(i => i.sender))];
    const recipientIds = [...new Set(interests.map(i => i.recipient))];
    const allProfileIds = [...new Set([...senderIds, ...recipientIds])];
    
    const profiles = await UserModel.find({
      $or: [
        { registration_no: { $in: allProfileIds } },
        { ref_no: { $in: allProfileIds } }
      ]
    }, {
      registration_no: 1, ref_no: 1, name: 1, first_name: 1, last_name: 1, age: 1, user_caste: 1, caste: 1, city: 1, Images: 1, image: 1, gender: 1
    }).lean();

    const populatedInterests = interests.map(interest => {
      const senderProfile = profiles.find(p => p.registration_no === interest.sender || p.ref_no === interest.sender);
      const recipientProfile = profiles.find(p => p.registration_no === interest.recipient || p.ref_no === interest.recipient);
      return {
        ...interest.toObject(),
        senderProfile: senderProfile ? {
          ...senderProfile,
          registration_no: senderProfile.registration_no || senderProfile.ref_no,
          user_caste: senderProfile.user_caste || senderProfile.caste,
          Images: senderProfile.Images || (senderProfile.image ? [senderProfile.image] : [])
        } : null,
        recipientProfile: recipientProfile ? {
          ...recipientProfile,
          registration_no: recipientProfile.registration_no || recipientProfile.ref_no,
          user_caste: recipientProfile.user_caste || recipientProfile.caste,
          Images: recipientProfile.Images || (recipientProfile.image ? [recipientProfile.image] : [])
        } : null
      };
    });

    res.status(200).json({ success: true, count: populatedInterests.length, content: populatedInterests });
  } catch (error) {
    console.error("Error fetching promoter received interests:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getPromoterUserImageVerification = async (req, res) => {
  try {
    const { promoter_id } = req.params;
    if (!promoter_id) {
      return res.status(400).json({ success: false, message: "promoter_id is required" });
    }

    const { page, pageSize } = getPaginationParams(req);
    const casteFilter = getCasteFilter(req);
    const status = (req.body?.status || req.query?.status || "").toLowerCase().trim();

    // Match referred by promoter (supports promoter_id or username or regex)
    let resolvedPromoterIds = [promoter_id];
    try {
      const promoterDoc = await PromotersModel.findOne({
        $or: [
          { promoter_id: { $regex: new RegExp(`^${promoter_id}$`, "i") } },
          { username: { $regex: new RegExp(`^${promoter_id}$`, "i") } },
          { email: { $regex: new RegExp(`^${promoter_id}$`, "i") } }
        ]
      });
      if (promoterDoc) {
        if (promoterDoc.promoter_id) resolvedPromoterIds.push(promoterDoc.promoter_id);
        if (promoterDoc.username) resolvedPromoterIds.push(promoterDoc.username);
      }
    } catch (e) {
      console.warn("Could not resolve promoter doc:", e.message);
    }

    const uniquePromoterIds = Array.from(new Set(resolvedPromoterIds.filter(Boolean)));
    const referedByPattern = uniquePromoterIds.map(id => `^${id}$`).join("|");

    const matchFilter = {
      refered_by: { $regex: new RegExp(referedByPattern, "i") },
    };

    if (status === "active") {
      matchFilter.image_verification = { $in: ["active", "Active"] };
    } else if (status === "all") {
      // Show all users referred by promoter
    } else {
      // Default: pending
      matchFilter.$or = [
        { image_verification: { $in: ["pending", "Pending"] } },
        { image_verification: { $exists: false } },
        { image_verification: null },
        { image_verification: "" }
      ];
    }

    if (casteFilter) {
      matchFilter.caste = casteFilter;
    }

    const totalRecords = await UserModel.countDocuments(matchFilter);
    const users = await UserModel.find(matchFilter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    const content = users.map((u) => {
      const regNo = u.ref_no || u.registration_no || "";
      const primaryImg = u.image || (Array.isArray(u.images) && u.images.length > 0 ? u.images[0] : null);
      return {
        ...u,
        registration_no: regNo,
        ref_no: regNo,
        image: primaryImg,
        image_verification: (u.image_verification || "pending").toLowerCase(),
      };
    });

    return res.status(200).json({
      success: true,
      content,
      currentPage: page,
      pageSize,
      totalRecords,
    });
  } catch (error) {
    console.error("getPromoterUserImageVerification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch image verification data",
      error: error.message
    });
  }
};

const updatePromoterUserImageVerification = async (req, res) => {
  try {
    const { regno } = req.params;
    const { image_verification } = req.body;

    if (!regno) {
      return res.status(400).json({ success: false, message: "Registration number required" });
    }

    const targetStatus = (image_verification || "").toLowerCase().trim();
    if (!targetStatus) {
      return res.status(400).json({ success: false, message: "image_verification status is required" });
    }

    const trimmedRegno = String(regno).trim();
    const filter = {
      $or: [
        { registration_no: trimmedRegno },
        { ref_no: trimmedRegno },
        { registration_no: { $regex: new RegExp(`^${trimmedRegno}$`, "i") } },
        { ref_no: { $regex: new RegExp(`^${trimmedRegno}$`, "i") } },
      ]
    };

    const updateDoc = {
      $set: {
        image_verification: targetStatus,
      }
    };

    // Update directly in unified user_tbl
    const updatedUser = await UserModel.findOneAndUpdate(filter, updateDoc, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Image verification status updated to ${targetStatus} successfully`,
      data: updatedUser
    });
  } catch (error) {
    console.error("updatePromoterUserImageVerification error:", error);
    return res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
};

const getPromoterDashboardData = async (req, res) => {
  try {
    const { promoter_id } = req.params;
    if (!promoter_id || promoter_id === "undefined" || promoter_id === "null") {
      return res.status(400).json({ success: false, message: "promoter_id is required" });
    }

    const trimmedId = promoter_id.trim();

    // 1. Fetch promoter profile
    const promoter = await PromotersModel.findOne({
      $or: [
        { promoter_id: { $regex: new RegExp(`^${trimmedId}$`, "i") } },
        { username: trimmedId },
        { email: { $regex: new RegExp(`^${trimmedId}$`, "i") } },
      ],
    });

    if (!promoter) {
      return res.status(404).json({ success: false, message: "Promoter profile not found" });
    }

    const resolvedPromoterId = promoter.promoter_id;

    // 2. Fetch referred users directly from unified user_tbl
    const matchObj = { refered_by: { $regex: new RegExp(`^${resolvedPromoterId}$`, "i") } };

    const users = await UserModel.find(matchObj, {
      ref_no: 1,
      registration_no: 1,
      first_name: 1,
      last_name: 1,
      type_of_user: 1,
      user_role: 1,
      status: 1,
      createdAt: 1,
      registration_date: 1,
    }).lean();

    const totalUsers = users.length;
    const isSilv = (u) => {
      const r = (u.user_role || u.type_of_user || "").toLowerCase().trim();
      return r === "silveruser" || r === "silver";
    };
    const isPrem = (u) => {
      const r = (u.user_role || u.type_of_user || "").toLowerCase().trim();
      return r === "premiumuser" || r === "premium";
    };
    const isFree = (u) => {
      const r = (u.user_role || u.type_of_user || "").toLowerCase().trim();
      return r === "freeuser" || r === "free" || (!isSilv(u) && !isPrem(u));
    };

    const freeUsers = users.filter(isFree).length;
    const silverUsers = users.filter(isSilv).length;
    const premiumUsers = users.filter(isPrem).length;
    const activeUsers = users.filter((u) => (u.status || "").toLowerCase().trim() === "active").length;
    const pendingUsers = users.filter((u) => {
      const s = (u.status || "").toLowerCase().trim();
      return s === "pending" || s === "approval pending" || s === "approval_pending";
    }).length;
    const expiredUsers = users.filter((u) => (u.status || "").toLowerCase().trim() === "expired").length;
    const inactiveUsers = users.filter((u) => (u.status || "").toLowerCase().trim() === "inactive").length;

    // 3. Fetch earnings records
    const earningsRecords = await PromotersEarningsModel.find({
      $or: [
        { referal_by: { $regex: new RegExp(`^${resolvedPromoterId}$`, "i") } },
        { refered_by: { $regex: new RegExp(`^${resolvedPromoterId}$`, "i") } },
      ],
    });

    let totalEarnings = earningsRecords.reduce((sum, item) => {
      const val = parseFloat(item.amount_earned) || 0;
      return sum + val;
    }, 0);

    const paidReferredCount = silverUsers + premiumUsers;
    if (totalEarnings === 0 && paidReferredCount > 0) {
      totalEarnings = paidReferredCount * 100;
    }

    // 4. Fetch transactions (paid amounts)
    const transactions = await PromoterTransactionModel.find({
      $or: [
        { promoter_id: { $regex: new RegExp(`^${resolvedPromoterId}$`, "i") } },
        { referal_by: { $regex: new RegExp(`^${resolvedPromoterId}$`, "i") } },
      ],
    });

    const paidAmount = transactions.reduce((sum, item) => {
      const val = parseFloat(item.paid_amount || item.amount || 0);
      return sum + val;
    }, 0);

    const pendingAmount = Math.max(0, totalEarnings - paidAmount);

    res.status(200).json({
      success: true,
      promoter: {
        id: promoter.id,
        promoter_name: promoter.promoter_name,
        promoter_id: promoter.promoter_id,
        email: promoter.email,
        mobile: promoter.mobile,
        membership_type: promoter.membership_type || "Premium Promoter",
        registration_date: promoter.registration_date,
        company_name: promoter.company_name,
        account_number: promoter.account_number,
        bank_ifsc: promoter.bank_ifsc,
        country: promoter.country || "India",
        status: promoter.status,
      },
      stats: {
        totalUsers,
        freeUsers,
        silverUsers,
        premiumUsers,
        activeUsers,
        pendingUsers,
        expiredUsers,
        inactiveUsers,
        registrationEarnings: totalUsers,
        assistanceEarnings: 0,
        renewalEarnings: 0,
        totalEarnings,
        paidAmount,
        pendingAmount,
      },
    });
  } catch (error) {
    console.error("Error in getPromoterDashboardData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePromoterProfile = async (req, res) => {
  try {
    const { promoter_id } = req.params;
    if (!promoter_id) {
      return res.status(400).json({ success: false, message: "promoter_id is required" });
    }

    const {
      fullName,
      email,
      phone,
      address,
      country,
      accountNumber,
      ifscCode,
    } = req.body;

    const trimmedId = promoter_id.trim();

    const updateFields = {};
    if (fullName) updateFields.promoter_name = fullName.trim();
    if (email) updateFields.email = email.trim();
    if (phone) updateFields.mobile = phone.trim();
    if (address !== undefined) updateFields.company_name = address.trim();
    if (country) updateFields.country = country.trim();
    if (accountNumber !== undefined) updateFields.account_number = accountNumber.trim();
    if (ifscCode !== undefined) updateFields.bank_ifsc = ifscCode.trim();

    const updatedPromoter = await PromotersModel.findOneAndUpdate(
      {
        $or: [
          { promoter_id: { $regex: new RegExp(`^${trimmedId}$`, "i") } },
          { username: trimmedId },
          { email: { $regex: new RegExp(`^${trimmedId}$`, "i") } },
        ],
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPromoter) {
      return res.status(404).json({ success: false, message: "Promoter not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      promoter: updatedPromoter,
    });
  } catch (error) {
    console.error("Error in updatePromoterProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const activateFreeUserByPromoter = async (req, res) => {
  try {
    const { registration_no } = req.params;
    const bodyId = req.body?._id || req.body?.id;
    const project = (req.headers['x-project'] || req.headers['x-project-name'] || '').toLowerCase().replace(/[-_\s]/g, '');

    // Allow in sangamsathi and girijakalyana only
    if (project && !project.includes('sangam') && !project.includes('girija')) {
      return res.status(400).json({
        success: false,
        message: 'Promoter activation of users is only supported for Sangam-Sathi and Girija-Kalyana',
      });
    }

    if (!registration_no) {
      return res.status(400).json({ success: false, message: 'Registration number is required' });
    }

    const trimmedRegNo = registration_no.trim();
    const escapedRegNo = trimmedRegNo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regRegex = new RegExp(`^${escapedRegNo}$`, 'i');
    const isObjectId = mongoose.Types.ObjectId.isValid(trimmedRegNo);
    const targetFilter = {
      $or: [
        { registration_no: regRegex },
        { ref_no: regRegex },
        ...(isObjectId ? [{ _id: trimmedRegNo }] : []),
      ],
    };

    // Verify promoter ownership
    const promoterId = (req.user?.promoter_id || req.user?.username || '').trim();
    let promoterDoc = null;
    if (promoterId) {
      const escapedPromoterId = promoterId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      promoterDoc = await PromotersModel.findOne({
        $or: [
          { username: { $regex: new RegExp(`^${escapedPromoterId}$`, 'i') } },
          { promoter_id: { $regex: new RegExp(`^${escapedPromoterId}$`, 'i') } },
          { email: { $regex: new RegExp(`^${escapedPromoterId}$`, 'i') } },
        ]
      });
    }

    const validPromoterCodes = new Set();
    if (promoterId) validPromoterCodes.add(promoterId.toLowerCase());
    if (req.user?.promoter_id) validPromoterCodes.add(req.user.promoter_id.trim().toLowerCase());
    if (req.user?.username) validPromoterCodes.add(req.user.username.trim().toLowerCase());
    if (promoterDoc) {
      if (promoterDoc.promoter_id) validPromoterCodes.add(promoterDoc.promoter_id.trim().toLowerCase());
      if (promoterDoc.username) validPromoterCodes.add(promoterDoc.username.trim().toLowerCase());
      if (promoterDoc.email) validPromoterCodes.add(promoterDoc.email.trim().toLowerCase());
      if (promoterDoc.promoter_name) validPromoterCodes.add(promoterDoc.promoter_name.trim().toLowerCase());
    }

    const promoterRegexList = Array.from(validPromoterCodes).map(
      (c) => new RegExp(`^\\s*${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i')
    );

    let userDoc = null;

    // 1. If explicit MongoDB _id was passed, use it directly
    if (bodyId && mongoose.Types.ObjectId.isValid(bodyId)) {
      userDoc = await UserModel.findById(bodyId);
    }

    // 2. Prioritize finding the exact user document in user_tbl that was referred by THIS promoter
    if (!userDoc) {
      userDoc = await UserModel.findOne({
        $and: [
          targetFilter,
          {
            $or: [
              { refered_by: { $in: promoterRegexList } },
              { refered_name: { $in: promoterRegexList } },
            ],
          },
        ],
      });
    }

    // 3. Fallback: prioritize Pending record, then any match
    if (!userDoc) {
      userDoc = await UserModel.findOne({ ...targetFilter, status: { $regex: /pending/i } }) || await UserModel.findOne(targetFilter);
    }

    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const userReferedBy = (userDoc.refered_by || '').trim().toLowerCase();
    const userReferedName = (userDoc.refered_name || '').trim().toLowerCase();
    
    // Check if this user was referred by the logged in promoter
    const isReferred =
      (userReferedBy && validPromoterCodes.has(userReferedBy)) ||
      (userReferedName && validPromoterCodes.has(userReferedName));

    if (!isReferred) {
      return res.status(400).json({
        success: false,
        message: 'You can only activate users who registered using your referral code',
      });
    }

    // Determine user role / plan type from user_tbl
    const rawRole = (
      userDoc.user_role ||
      userDoc.type_of_user ||
      ''
    ).trim().toLowerCase();

    // Promoters are only barred from activating paid accounts (Silver/Premium/Gold).
    // All free users (freeuser, free, user, empty/default) can be activated by the promoter!
    const isPaidUser =
      rawRole.includes('silver') ||
      rawRole.includes('premium') ||
      rawRole.includes('gold');

    if (isPaidUser) {
      return res.status(400).json({
        success: false,
        message: 'Promoters are only permitted to activate Free Users. Paid membership accounts (Silver/Premium) require Admin verification.',
      });
    }

    const currentStatus = (userDoc.status || '').trim().toLowerCase();
    if (currentStatus === 'active') {
      return res.status(400).json({
        success: false,
        message: 'User is already active',
      });
    }

    // Activate the profile directly in user_tbl
    const promoterDefaultCode = promoterDoc?.promoter_id || req.user?.promoter_id || promoterDoc?.username || req.user?.username || '';
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userDoc._id },
      {
        $set: {
          status: 'active',
          type_of_user: 'FreeUser',
          user_role: 'FreeUser',
          image_verification: 'active',
          refered_by: userDoc.refered_by || promoterDefaultCode,
        },
      },
      { new: true }
    );

    // Send active email notification
    try {
      const { getActiveMessage } = require('../../utils/EmailMessages');
      const { sendMail } = require('../../utils/EmailService');
      const projectName = req.projectName || process.env.PROJECT_NAME || 'Girija-Kalyana';
      const { activatedSubject, activatedMessage } = getActiveMessage(updatedUser, projectName);
      if (activatedSubject && activatedMessage && updatedUser.email_id) {
        await sendMail(updatedUser.email_id, activatedSubject, activatedMessage, projectName);
      }
    } catch (emailErr) {
      console.error('Error sending activation email:', emailErr);
    }

    const userName = (updatedUser.first_name || '') + ' ' + (updatedUser.last_name || '');
    return res.status(200).json({
      success: true,
      message: `User ${userName.trim()} (${trimmedRegNo}) has been activated successfully!`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('activateFreeUserByPromoter error:', error);
    return handleControllerError(res, error, 'Server error while activating user');
  }
};

const referUserByPromoter = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !email.trim() || !phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Both email and phone number are required.",
      });
    }

    // Resolve logged in promoter
    const promoterIdentifier = (
      req.user?.promoter_id ||
      req.user?.username ||
      req.user?.ref_no ||
      ""
    ).trim();

    const escapedPromoterId = promoterIdentifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const promoterDoc = await PromotersModel.findOne({
      $or: [
        { promoter_id: { $regex: new RegExp(`^${escapedPromoterId}$`, "i") } },
        { username: { $regex: new RegExp(`^${escapedPromoterId}$`, "i") } },
      ],
    });

    const promoterId = (promoterDoc?.promoter_id || promoterIdentifier).trim();
    const promoterName = (promoterDoc?.promoter_name || req.user?.first_name || "").trim();

    if (!promoterId) {
      return res.status(401).json({
        success: false,
        message: "Logged in promoter details not found.",
      });
    }

    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const digitsOnlyPhone = cleanPhone.replace(/\D/g, "");
    const phoneLast10 = digitsOnlyPhone.slice(-10);

    const emailRegex = new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    const phoneConditions = [{ mobile_no: cleanPhone }];
    if (digitsOnlyPhone && digitsOnlyPhone !== cleanPhone) {
      phoneConditions.push({ mobile_no: digitsOnlyPhone });
    }
    if (phoneLast10 && phoneLast10 !== digitsOnlyPhone && phoneLast10 !== cleanPhone) {
      phoneConditions.push({ mobile_no: phoneLast10 });
    }
    if (phoneLast10) {
      phoneConditions.push({ mobile_no: { $regex: new RegExp(`${phoneLast10}$`) } });
    }

    // Search user_tbl by email and phone both
    const user = await UserModel.findOne({
      $and: [
        {
          $or: [
            { email_id: { $regex: emailRegex } },
            { username: { $regex: emailRegex } },
          ],
        },
        {
          $or: phoneConditions,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided email and phone number.",
      });
    }

    // Check if user is already referred
    // If refered_by and refered_name empty or field not found then only update else give error message this user already refered by someone else
    const hasReferral = Boolean(
      (user.refered_by && typeof user.refered_by === "string" && user.refered_by.trim() !== "") ||
      (user.refered_name && typeof user.refered_name === "string" && user.refered_name.trim() !== "")
    );

    if (hasReferral) {
      return res.status(400).json({
        success: false,
        message: "this user already refered by someone else",
      });
    }

    // Update user_tbl with logged in promoter info
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refered_by: promoterId,
          refered_name: promoterName,
        },
      }
    );

    // If pending transaction exists, update promocode
    try {
      const TransactionModel = require("../../models/Transaction");
      const targetRegNo = user.ref_no || user.registration_no;
      if (targetRegNo) {
        await TransactionModel.updateMany(
          { registration_no: targetRegNo, status: "PENDING" },
          { $set: { promocode: promoterId } }
        );
      }
    } catch (txnErr) {
      console.warn("Could not update transaction promocode:", txnErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "User referred successfully!",
      data: {
        refered_by: promoterId,
        refered_name: promoterName,
        user_id: user.user_id,
        ref_no: user.ref_no || user.registration_no,
        first_name: user.first_name,
        last_name: user.last_name,
        email_id: user.email_id || user.username,
        mobile_no: user.mobile_no,
      },
    });
  } catch (error) {
    console.error("referUserByPromoter error:", error);
    return handleControllerError(res, error, "Server error while referring user");
  }
};

module.exports = {
  getPromoters,
  getPromotersEarnings,
  getPromotersTransactions,
  updatePromoterStatus,
  getPromoterUserStats,
  getUsersByPromoter,
  getAllPromotersAllData,
  addPromoter,
  getPromoterSentInterests,
  getPromoterReceivedInterests,
  getPromoterUserImageVerification,
  updatePromoterUserImageVerification,
  getPromoterDashboardData,
  updatePromoterProfile,
  activateFreeUserByPromoter,
  referUserByPromoter,
};