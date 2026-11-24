const PromotersModel = require("../../models/promoters/Promoters");
const ProfileModel = require("../../models/profile");
const UserModel = require("../../models/user");
const PromotersEarningsModel = require("../../models/promoters/PromotersEarnings");
const PromoterTransactionModel = require("../../models/promoters/PromotersTransaction");
const { FormatDate } = require("../../utils/DateFormate");



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

const getPromoterUserStats = async (_req, res) => {
  try {
    // Get all promoters
    const promoters = await PromotersModel.find({}, { promoter_id: 1, promoter_name: 1 });

    // Loop through promoters and calculate counts
    const results = await Promise.all(
      promoters.map(async (promoter) => {
        const promoterId = promoter.promoter_id;

        // Find all users referred by this promoter from unified user_tbl
        const users = await UserModel.find(
          { refered_by: { $regex: new RegExp(`^${promoterId}$`, "i") } },
          { type_of_user: 1, user_role: 1 }
        ).lean();

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

    if (!promoter_id || promoter_id.trim() === "" || promoter_id === "undefined" || promoter_id === "null") {
      return res.status(400).json({
        success: false,
        message: "promoter_id is required in params",
      });
    }

    const trimmedPromoterId = promoter_id.trim();

    // Query unified user_tbl directly
    const users = await UserModel.aggregate([
      {
        $match: {
          $or: [
            { refered_by: { $regex: new RegExp(`^${trimmedPromoterId}$`, "i") } },
            { refered_name: { $regex: new RegExp(`^${trimmedPromoterId}$`, "i") } }
          ]
        }
      },
      {
        $addFields: {
          registration_no: { $ifNull: ["$registration_no", "$ref_no"] },
          ref_no: { $ifNull: ["$ref_no", "$registration_no"] },
          user_role: { $ifNull: ["$user_role", "$type_of_user", "FreeUser"] },
          type_of_user: { $ifNull: ["$type_of_user", "$user_role", "FreeUser"] },
          userTypeOrder: {
            $switch: {
              branches: [
                { case: { $regexMatch: { input: { $ifNull: ["$type_of_user", "$user_role"] }, regex: /premium/i } }, then: 1 },
                { case: { $regexMatch: { input: { $ifNull: ["$type_of_user", "$user_role"] }, regex: /silver/i } }, then: 2 },
                { case: { $regexMatch: { input: { $ifNull: ["$type_of_user", "$user_role"] }, regex: /free/i } }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      {
        $sort: {
          userTypeOrder: 1,
          _id: -1,
          registration_date: -1
        }
      },
      {
        $project: {
          userTypeOrder: 0,
          password: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      promoter_id: trimmedPromoterId,
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
    const { promoter_name, promoter_id, mobile, email, username, password, country, company_name, account_number, bank_ifsc } = req.body;

    if (!promoter_name || !promoter_id || !mobile || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Promoter Name, Promoter ID, Mobile, Email, Username, and Password are required fields",
      });
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

const referUserByPromoter = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !email.trim() || !phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Both email and phone number are required.",
      });
    }

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

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refered_by: promoterId,
          refered_name: promoterName,
        },
      }
    );

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
    return res.status(500).json({ success: false, message: "Server error while referring user", error: error.message });
  }
};

module.exports = {getPromoters,getPromotersEarnings, 
  getPromotersTransactions,updatePromoterStatus ,
   getPromoterUserStats, getUsersByPromoter,
  getAllPromotersAllData, addPromoter, referUserByPromoter};