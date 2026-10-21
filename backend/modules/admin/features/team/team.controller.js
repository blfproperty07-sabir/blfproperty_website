const service = require("./team.service");

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      const status = error.status || (error.name === "CastError" ? 400 : 500);
      if (status >= 500) console.error("[Team API Error]", error.stack || error.message);

      if (res.headersSent) return next(error);

      return res.status(status).json({
        success: false,
        message: status >= 500 ? "Team request failed." : error.message,
        ...(error.code === "DUPLICATE_EMAIL" || error.code === "DUPLICATE_TEAM_EMAIL"
          ? { error: error.code }
          : {})
      });
    }
  };
}

const list = asyncHandler(async (req, res) => {
  const data = await service.listTeamMembers(req.query);
  res.json({ success: true, data });
});

const about = asyncHandler(async (req, res) => {
  const data = await service.listTeamMembers({});
  res.json({ success: true, data });
});

const active = asyncHandler(async (req, res) => {
  const data = await service.listTeamMembers({});
  res.json({ success: true, data });
});

const getById = asyncHandler(async (req, res) => {
  const teamMember = await service.getTeamMemberById(req.params.id);
  res.json({ success: true, data: { teamMember } });
});

const create = asyncHandler(async (req, res) => {
  const teamMember = await service.createTeamMember(req.body, req.file, req.user);
  res.status(201).json({
    success: true,
    message: "Team member added successfully.",
    data: { teamMember }
  });
});

const update = asyncHandler(async (req, res) => {
  const teamMember = await service.updateTeamMember(req.params.id, req.body, req.file);
  res.json({ success: true, message: "Team member updated successfully.", data: { teamMember } });
});

const remove = asyncHandler(async (req, res) => {
  await service.deleteTeamMember(req.params.id);
  res.json({ success: true, message: "Team member removed successfully." });
});

const toggleStatus = asyncHandler(async (req, res) => {
  const teamMember = await service.toggleTeamMemberStatus(req.params.id);
  res.json({ success: true, data: { teamMember } });
});

const statistics = asyncHandler(async (req, res) => {
  const stats = await service.getStatistics();
  res.json({ success: true, data: { statistics: stats } });
});

const byDepartment = asyncHandler(async (req, res) => {
  const teamMembers = await service.listByDepartment(req.params.department);
  res.json({ success: true, data: { teamMembers } });
});

const search = asyncHandler(async (req, res) => {
  const teamMembers = await service.searchTeamMembers(req.query.q);
  res.json({ success: true, data: { teamMembers } });
});

module.exports = {
  list, about, active, getById, create, update,
  remove, toggleStatus, statistics, byDepartment, search
};
