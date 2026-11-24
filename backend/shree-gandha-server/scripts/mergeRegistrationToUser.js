/**
 * Script: mergeRegistrationToUser.js
 * Description: Reads records from registration_tbl, matches registration_tbl.email_id
 * with user_tbl.username (and email_id), combines all registration data, and moves/merges
 * into user_tbl.
 *
 * Usage:
 *   node scripts/mergeRegistrationToUser.js [--dry-run]
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const isDryRun = process.argv.includes('--dry-run');

const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

async function mergeRegistrationToUser() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Error: MONGODB_URI not found in environment variables.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB... (Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE MIGRATION'})`);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully.\n');

  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  if (!collectionNames.includes('registration_tbl')) {
    console.log('Notice: collection "registration_tbl" does not exist in the database. Nothing to merge.');
    await mongoose.disconnect();
    process.exit(0);
  }

  if (!collectionNames.includes('user_tbl')) {
    console.log('Notice: collection "user_tbl" does not exist in the database.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const regCollection = db.collection('registration_tbl');
  const userCollection = db.collection('user_tbl');

  const totalReg = await regCollection.countDocuments();
  console.log(`Found ${totalReg} document(s) in "registration_tbl". Scanning...\n`);

  const regCursor = regCollection.find({});
  let matchedCount = 0;
  let updatedCount = 0;
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  while (await regCursor.hasNext()) {
    const regDoc = await regCursor.next();
    const rawEmail = regDoc.email_id || regDoc.username || '';
    const cleanEmail = rawEmail.trim();

    if (!cleanEmail) {
      console.warn(`[SKIP] registration_tbl document (ID: ${regDoc._id}, RegNo: ${regDoc.registration_no || 'N/A'}) has no email_id. Skipping.`);
      skippedCount++;
      continue;
    }

    try {
      const emailRegex = new RegExp(`^${escapeRegex(cleanEmail)}$`, 'i');

      // Check user_tbl username (or email_id)
      const existingUser = await userCollection.findOne({
        $or: [
          { username: { $regex: emailRegex } },
          { email_id: { $regex: emailRegex } },
          ...(regDoc.registration_no ? [{ registration_no: regDoc.registration_no }, { ref_no: regDoc.registration_no }] : [])
        ]
      });

      // Prepare fields to merge from registration_tbl
      // Exclude _id to prevent overwriting user_tbl _id
      const { _id, ...regFields } = regDoc;

      // Clean up undefined / null fields that might clear existing user_tbl values
      const fieldsToMerge = {};
      for (const [key, val] of Object.entries(regFields)) {
        if (val !== undefined && val !== null && val !== '') {
          fieldsToMerge[key] = val;
        }
      }

      // Sync aliases
      if (fieldsToMerge.registration_no && !fieldsToMerge.ref_no) {
        fieldsToMerge.ref_no = fieldsToMerge.registration_no;
      }
      if (fieldsToMerge.ref_no && !fieldsToMerge.registration_no) {
        fieldsToMerge.registration_no = fieldsToMerge.ref_no;
      }
      if (fieldsToMerge.email_id && !fieldsToMerge.username) {
        fieldsToMerge.username = fieldsToMerge.email_id;
      }
      if (fieldsToMerge.username && !fieldsToMerge.email_id) {
        fieldsToMerge.email_id = fieldsToMerge.username;
      }
      if (fieldsToMerge.type_of_user && !fieldsToMerge.user_role) {
        fieldsToMerge.user_role = fieldsToMerge.type_of_user;
      }
      if (fieldsToMerge.user_role && !fieldsToMerge.type_of_user) {
        fieldsToMerge.type_of_user = fieldsToMerge.user_role;
      }

      if (existingUser) {
        matchedCount++;

        // Keep existing credentials if present in user_tbl
        if (existingUser.password && !fieldsToMerge.password) {
          // password preserved
        } else if (existingUser.password) {
          delete fieldsToMerge.password; // Do not overwrite user password
        }

        if (existingUser.user_id && fieldsToMerge.user_id) {
          delete fieldsToMerge.user_id; // Do not overwrite unique user_id
        }

        if (!isDryRun) {
          await userCollection.updateOne(
            { _id: existingUser._id },
            { $set: fieldsToMerge }
          );
        }

        updatedCount++;
        console.log(`[MERGED] email_id "${cleanEmail}" matched user_tbl username "${existingUser.username}" (Ref: ${existingUser.ref_no || existingUser.registration_no})`);
      } else {
        // Document in registration_tbl does not exist in user_tbl -> move to user_tbl
        const lastUser = await userCollection.findOne({ user_id: { $type: "number" } }, { sort: { user_id: -1 } });
        const nextUserId = (lastUser?.user_id || 1000) + 1;

        const newUserData = {
          ...fieldsToMerge,
          user_id: nextUserId,
          username: cleanEmail,
          email_id: cleanEmail,
          ref_no: fieldsToMerge.registration_no || fieldsToMerge.ref_no || `REF_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          registration_no: fieldsToMerge.registration_no || fieldsToMerge.ref_no,
          user_role: fieldsToMerge.type_of_user || 'FreeUser',
          type_of_user: fieldsToMerge.type_of_user || 'FreeUser',
          status: fieldsToMerge.status || 'Pending',
          createdAt: regDoc.createdAt || new Date(),
          updatedAt: new Date(),
        };

        if (!isDryRun) {
          await userCollection.insertOne(newUserData);
        }

        insertedCount++;
        console.log(`[INSERTED] email_id "${cleanEmail}" moved as new record into user_tbl`);
      }
    } catch (docErr) {
      errorCount++;
      console.error(`[ERROR] Processing ${cleanEmail}:`, docErr.message);
    }
  }

  console.log('\n=============================================');
  console.log(`MIGRATION SUMMARY (${isDryRun ? 'DRY RUN' : 'COMPLETED'}):`);
  console.log(`Total scanned from registration_tbl : ${totalReg}`);
  console.log(`Matched with user_tbl              : ${matchedCount}`);
  console.log(`Updated in user_tbl                : ${updatedCount}`);
  console.log(`Newly inserted into user_tbl       : ${insertedCount}`);
  console.log(`Skipped (missing email)            : ${skippedCount}`);
  console.log(`Errors                             : ${errorCount}`);
  console.log('=============================================\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

mergeRegistrationToUser().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
