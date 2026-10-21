const fs = require("fs");

const file = "src/pages/AdminDashboard.js";
let source = fs.readFileSync(file, "utf8");

if (!source.includes("id: 'gallery'")) {
  const anchor = "{ id: 'analytics', label: 'Analytics', icon: '📈' }";
  if (!source.includes(anchor)) {
    throw new Error("Analytics tab anchor not found. No changes made.");
  }

  source = source.replace(
    anchor,
    "{ id: 'gallery', label: 'Gallery', icon: '' },\n  " + anchor
  );
}

if (!source.includes("activeTab === 'gallery'")) {
  const anchor = "{(activeTab === 'users' || activeTab === 'analytics') && (";
  if (!source.includes(anchor)) {
    throw new Error("Dashboard content anchor not found. No changes made.");
  }

  source = source.replace(
    anchor,
    "{activeTab === 'gallery' && (\n  <div className=\"space-y-6\"><GalleryManager /></div>\n)}\n\n      " + anchor
  );
}

fs.writeFileSync(file, source, "utf8");
console.log("Gallery tab added without emoji.");
