const { getSession } = require("./_lib/auth");

module.exports = async (req, res) => {
  const s = getSession(req);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ authenticated: !!s, username: s ? s.u : null });
};
