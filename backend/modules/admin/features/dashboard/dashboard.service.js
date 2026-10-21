const mongoose = require("mongoose");
const Property = require("../../../properties/property.model");
const User = require("../../../users/user.model");

async function countTeamMembers() {
  const db = mongoose.connection.db;
  if (!db) return 0;

  try {
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const teamCollection = collections.find(({ name }) =>
      /team.?members?/i.test(name)
    );

    return teamCollection
      ? await db.collection(teamCollection.name).countDocuments({})
      : 0;
  } catch {
    return 0;
  }
}

async function getOverview() {
  const [
    totalProperties,
    pendingProperties,
    approvedProperties,
    totalUsers,
    totalTeamMembers
  ] = await Promise.all([
    Property.countDocuments({}),
    Property.countDocuments({ status: "pending" }),
    Property.countDocuments({ status: "approved" }),
    User.countDocuments({}),
    countTeamMembers()
  ]);

  return {
    properties: {
      total: totalProperties,
      pending: pendingProperties,
      approved: approvedProperties
    },
    users: { total: totalUsers },
    team: { total: totalTeamMembers }
  };
}

module.exports = { getOverview };
