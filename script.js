// let elections = [];
// const candidates = [];
// const voters = [];
// const complaints = [];
// const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)]; let toastTimer, studentSignedIn = false, ballotSubmitted = false;
// const selections = { President: "", "General Secretary": "", Treasurer: "" };

// async function loadElections() {
//   try {
//     const response = await fetch(
//       "http://localhost:3000/api/elections"
//     );

//     const data = await response.json();

//     if (!response.ok || !data.success) {
//       throw new Error("Failed to load elections");
//     }

//     elections = data.elections;

//     console.log("Elections loaded from database:", elections);

//     // Refresh the election tables after loading data
//     renderElections();
//     renderOverview();

//     if (studentSignedIn) {
//       renderBallot();
//     }

//   } catch (error) {
//     console.error("Error loading elections:", error);
//     toast("Could not load elections from the server.");
//   }
// }

// function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3000) }
// function statusPill(status) { return `<span class="status-pill ${status.toLowerCase()}">${status}</span>` }
// function avatar(initials, color = "") { return `<span class="mini-avatar ${color}">${initials}</span>` }
// function emptyRow(cols, message = "No matching records found") { return `<tr><td colspan="${cols}"><div class="empty-state"><strong>${message}</strong>Try changing your search or filters.</div></td></tr>` }





// function electionRow(e, overview = false) {
//     const id = e.id ?? e.election_id;
//     const name = e.name || e.election_name || "Untitled Election";
//     const type = e.type || "Student Council";
//     const status = (e.status || "upcoming").toLowerCase();
//     const endDate = e.end || (
//         e.end_time
//             ? new Date(e.end_time).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "2-digit",
//                 year: "numeric"
//             })
//             : "—"
//     );

//     const item = {
//         ...e,
//         id,
//         name,
//         type,
//         status: status.charAt(0).toUpperCase() + status.slice(1),
//         eligible: e.eligible ?? 0,
//         votes: e.votes ?? 0,
//         progress: e.progress ?? 0,
//         end: endDate
//     };

//     return `<tr>
//         <td>
//             <div class="table-name">
//                 ${avatar(
//                     item.type === "Sports Committee" ? "SC" :
//                     item.type === "Technical Committee" ? "TC" : "SC",
//                     item.status === "Completed" ? "green" :
//                     item.status === "Upcoming" ? "orange" : ""
//                 )}
//                 <span>
//                     ${item.name}
//                     <small>${item.type} · #EL-${String(item.id).padStart(3, "0")}</small>
//                 </span>
//             </div>
//         </td>
//         <td>${statusPill(item.status)}</td>
//         ${overview ? "" : `<td>${item.eligible.toLocaleString()}</td><td>${item.votes.toLocaleString()}</td>`}
//         ${overview ? `<td><div class="participation"><div class="progress-track"><span style="width:${item.progress}%"></span></div><em>${item.progress}%</em></div></td>` : ""}
//         <td>${item.end}</td>
//         ${overview
//             ? `<td><button class="action-btn" data-election-detail="${item.id}" aria-label="View election">···</button></td>`
//             : `<td>
//                 <button class="row-action" data-election-detail="${item.id}">View details</button>
//                 <button class="row-action" data-election-edit="${item.id}">Edit</button>
//             </td>`
//         }
//     </tr>`;
// }





// function renderOverview() {
//   $("#overviewElectionRows").innerHTML = elections.length ? elections.map(e => electionRow(e, true)).join("") : emptyRow(5, "No elections have been created yet");
//   const live = elections.filter(e => e.status === "Live").length;
//   $("#totalVotersStat").textContent = voters.length.toLocaleString();
//   $("#activeElectionsStat").textContent = elections.filter(e => e.status === "Live" || e.status === "Upcoming").length;
//   $("#votesSubmittedStat").textContent = elections.reduce((sum, e) => sum + e.votes, 0).toLocaleString();
// }


// function renderElections() {
//   const q = $("#electionSearch").value.toLowerCase();
//   const f = $("#electionFilter").value;

//   const list = elections.filter(e => {
//     const name = e.name || e.election_name || "";
//     const status = (e.status || "").toLowerCase();

//     const matchesStatus =
//       f === "all" ||
//       status === f.toLowerCase() ||
//       (f === "Live" && status === "active");

//     return matchesStatus && name.toLowerCase().includes(q);
//   });

//   $("#electionsRows").innerHTML = list.length
//     ? list.map(e => {
//       const item = {
//         id: e.id ?? e.election_id,
//         name: e.name || e.election_name,
//         type: e.type || "Student Council",
//         status: (e.status || "upcoming").charAt(0).toUpperCase()
//           + (e.status || "upcoming").slice(1),
//         eligible: e.eligible || 0,
//         votes: e.votes || 0,
//         end: e.end || new Date(e.end_time).toLocaleDateString(),
//         progress: e.progress || 0
//       };

//       return electionRow(item);
//     }).join("")
//     : emptyRow(
//       6,
//       elections.length
//         ? "No matching elections"
//         : "No elections have been created yet"
//     );

//   $("#electionCount").textContent =
//     `${list.length} election${list.length === 1 ? "" : "s"}`;
// }


// function renderCandidates() { const q = $("#candidateSearch").value.toLowerCase(), p = $("#candidatePosition").value, list = candidates.filter(c => (p === "all" || c.position === p) && (c.name.toLowerCase().includes(q) || c.position.toLowerCase().includes(q) || c.branch.toLowerCase().includes(q))); $("#candidateGrid").innerHTML = list.length ? list.map(c => `<article class="candidate-card"><div class="candidate-top"><div class="candidate-avatar ${c.color}">${c.initials}</div><div><h3>${c.name}</h3><div class="branch">${c.branch} · ${c.id}</div></div></div><span class="tag tag-blue">${c.position.toUpperCase()}</span><p>${c.manifesto}</p><div class="candidate-meta"><span>Votes received <strong>${c.votes.toLocaleString()}</strong></span><button data-candidate="${c.id}">View profile ↗</button></div></article>`).join("") : `<div class="panel empty-state"><strong>${candidates.length ? "No candidates found" : "No candidates registered yet"}</strong>${candidates.length ? "Try another name or position." : "Candidates will appear here after they are registered."}</div>`; }
// function renderVoters() { const q = $("#voterSearch").value.toLowerCase(), f = $("#voterFilter").value, list = voters.filter(v => (f === "all" || v.status === f) && `${v.name} ${v.id} ${v.branch}`.toLowerCase().includes(q)); $("#votersRows").innerHTML = list.length ? list.map(v => `<tr><td><div class="table-name">${avatar(v.initials)}<span>${v.name}<small>Student voter</small></span></div></td><td>${v.id}</td><td>${v.branch}</td><td>${v.year}</td><td>${statusPill(v.status === "Verified" ? "live" : "upcoming").replace("live", "Verified").replace("upcoming", "Pending")}</td><td>${v.voted === "Yes" ? '<span class="status-pill completed">Yes</span>' : '<span style="color:#a1aaba">Not yet</span>'}</td></tr>`).join("") : emptyRow(6, voters.length ? "No matching voter records" : "No voter records yet"); }
// function renderResults() { const sorted = [...candidates.filter(c => c.position === "President")].sort((a, b) => b.votes - a.votes), max = sorted.length ? Math.max(...sorted.map(c => c.votes)) : 1; $("#presidentResults").innerHTML = sorted.length ? sorted.map((c, i) => `<div><div class="result-row-head"><span>${i === 0 ? "🏆 " : ""}${c.name}</span><strong>${c.votes.toLocaleString()} votes · ${Math.round(c.votes / (sorted.reduce((s, x) => s + x.votes, 0) || 1) * 100)}%</strong></div><div class="result-track"><span class="${i === 1 ? "runner" : i > 1 ? "third" : ""}" style="width:${c.votes / max * 100}%"></span></div></div>`).join("") : `<div class="empty-state"><strong>No results available yet</strong>Results will appear after an election has votes.</div>`; }
// function renderComplaints() { const q = $("#complaintSearch").value.toLowerCase(), f = $("#complaintFilter").value, list = complaints.filter(c => (f === "all" || c.status === f) && `${c.id} ${c.desc} ${c.student}`.toLowerCase().includes(q)); $("#complaintsRows").innerHTML = list.length ? list.map(c => `<tr><td><div class="table-name"><span class="mini-avatar orange">⚑</span><span>${c.id}<small class="complaint-desc">${c.desc}</small></span></div></td><td>${c.student}</td><td>${c.election}</td><td>${c.date}</td><td><span class="status-pill ${c.status === "Pending" ? "upcoming" : "live"}">${c.status}</span></td><td><button class="row-action" data-complaint="${c.id}" ${c.status === "Resolved" ? "disabled" : ""}>${c.status === "Resolved" ? "Resolved" : "Resolve"}</button></td></tr>`).join("") : emptyRow(6, complaints.length ? "No matching complaints" : "No complaints submitted yet"); const pending = complaints.filter(c => c.status === "Pending").length; $("#pendingComplaintCount").textContent = String(pending).padStart(2, "0"); $("#complaintStatusTag").textContent = `${pending} need attention`; }
// const viewMeta = { overview: ["Overview", "ADMIN WORKSPACE", "Good morning, Admin ✦", "Here's what's happening with your campus elections today."], elections: ["Elections", "ELECTION MANAGEMENT", "Election management", "Create, schedule and monitor campus elections."], candidates: ["Candidates", "CANDIDATE DIRECTORY", "Meet the candidates", "Browse candidates, their positions and manifestos."], voters: ["Voters", "VOTER MANAGEMENT", "Voter directory", "Review student registration and voting eligibility."], results: ["Results", "RESULTS & ANALYTICS", "Election results", "Explore turnout, candidate performance and election summaries."], complaints: ["Complaints", "COMPLAINT MANAGEMENT", "Complaints & reports", "Review election-related concerns submitted by students."], "student-login": ["Student login", "STUDENT PORTAL", "Welcome to your campus", "Sign in to preview the student election portal."], "cast-vote": ["Cast vote", "STUDENT PORTAL", "Cast your vote", "Review the ballot and make your demo selections."] };


// function showView(view) { if (!viewMeta[view]) return; if (view === "cast-vote" && !studentSignedIn) { toast("Please sign in to the student portal first."); view = "student-login" } $$(".view").forEach(v => v.classList.toggle("active", v.id === `view-${view}`)); $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === view)); const [crumb, eyebrow, title, sub] = viewMeta[view]; $("#crumbTitle").textContent = crumb; $("#pageEyebrow").textContent = eyebrow; $("#pageTitle").textContent = title; $("#pageSubtitle").textContent = sub; $("#globalHeading").style.display = view === "student-login" || view === "cast-vote" ? "none" : "flex"; $("#createElectionBtn").style.display = view === "elections" || view === "overview" ? "inline-flex" : "none"; if (view === "elections") renderElections(); if (view === "candidates") renderCandidates(); if (view === "voters") renderVoters(); if (view === "results") renderResults(); if (view === "complaints") renderComplaints(); if (view === "cast-vote") renderBallot(); $("#sidebar").classList.remove("open"); window.scrollTo({ top: 0, behavior: "smooth" }); }
// $$(".nav-item").forEach(b => b.addEventListener("click", () => showView(b.dataset.view))); $$("[data-go]").forEach(b => b.addEventListener("click", () => showView(b.dataset.go)));

// loadElections();

// ["electionSearch", "electionFilter"].forEach(id => $("#" + id).addEventListener(id.endsWith("Search") ? "input" : "change", renderElections));["candidateSearch", "candidatePosition"].forEach(id => $("#" + id).addEventListener(id.endsWith("Search") ? "input" : "change", renderCandidates));["voterSearch", "voterFilter"].forEach(id => $("#" + id).addEventListener(id.endsWith("Search") ? "input" : "change", renderVoters));["complaintSearch", "complaintFilter"].forEach(id => $("#" + id).addEventListener(id.endsWith("Search") ? "input" : "change", renderComplaints));


// $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open")); $("#helpBtn").addEventListener("click", () => $("#helpDialog").showModal()); $("#notificationBtn").addEventListener("click", () => toast("You’re all caught up — no new notifications.")); $("#createElectionBtn").addEventListener("click", () => $("#electionDialog").showModal());
// $$(".close-modal").forEach(btn => btn.addEventListener("click", () => btn.closest("dialog").close()));
// $("#cancelElectionBtn").addEventListener("click", () => $("#electionDialog").close());





// $("#electionForm").addEventListener("submit", async e => {

//   let editingElectionId = null;

//   e.preventDefault();

//   const form = e.currentTarget;

//   const submitButton = form.querySelector('button[type="submit"]');

//   submitButton.disabled = true;

//   const data = new FormData(form);


//   const name = String(data.get("name")).trim();
//   const description = String(data.get("description") || "").trim();
//   const start = data.get("start");
//   const end = data.get("end");

//   if (!name) {
//     toast("Please enter an election name.");
//     return;
//   }

//   if (!start || !end || end < start) {
//     toast("End date must be on or after the start date.");
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:3000/api/elections", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         election_name: name,
//         description: description,
//         start_time: `${start} 09:00:00`,
//         end_time: `${end} 17:00:00`
//       })
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Could not create election.");
//     }

//     form.reset();
//     $("#electionDialog").close();

//     await loadElections();

//     renderResults();

//     toast("Election saved successfully in MySQL!");
//     showView("elections");

//   } catch (error) {
//     console.error("Error creating election:", error);
//     toast(error.message || "Could not connect to the server.");
//   } finally {
//     submitButton.disabled = false;
//   }
// });




// document.addEventListener("click", e => {
//   const detail = e.target.closest("[data-election-detail]");

//   const editButton = e.target.closest("[data-election-edit]");

// if (editButton) {
//     const id = Number(editButton.dataset.electionEdit);

//     const item = elections.find(
//         x => Number(x.id ?? x.election_id) === id
//     );

//     if (!item) {
//         toast("Election not found.");
//         return;
//     }

//     editingElectionId = id;

//     const form = $("#electionForm");

//     form.elements.namedItem("name").value =
//         item.name || item.election_name || "";

//     form.elements.namedItem("start").value =
//         (item.start || item.start_time || "").slice(0, 10);

//     form.elements.namedItem("end").value =
//         (item.endDate || item.end_time || item.end || "").slice(0, 10);

//     $("#electionDialog").showModal();
// }


//   if (detail) {
//     const item = elections.find(
//       x => Number(x.id ?? x.election_id) === Number(detail.dataset.electionDetail)
//     );

//     if (item) {
//       toast(
//         `${item.name || item.election_name} · ${item.status} · ${item.votes || 0} votes`
//       );
//     }
//   }

//   const cand = e.target.closest("[data-candidate]");
//   if (cand) {
//     const item = candidates.find(x => x.id === cand.dataset.candidate);
//     toast(`${item.name} · ${item.position} · ${item.votes} votes (demo data)`)
//   } const complaint = e.target.closest("[data-complaint]");
//   if (complaint) {
//     const item = complaints.find(x => x.id === complaint.dataset.complaint); if (item && item.status === "Pending") {
//       item.status = "Resolved";
//       renderComplaints();

//       toast(`${item.id} marked as resolved.`)
//     }
//   }
// });









// $("#exportVoters").addEventListener("click", () => { const rows = [["Name", "Student ID", "Branch", "Year", "Verification", "Voted"], ...voters.map(v => [v.name, v.id, v.branch, v.year, v.status, v.voted])], csv = rows.map(r => r.map(x => `"${String(x).replaceAll('"', '""')}"`).join(",")).join("\r\n"), blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "voter-directory-demo.csv"; a.click(); URL.revokeObjectURL(a.href); toast("Sample voter directory exported as CSV.") });
// $("#chartRange").addEventListener("change", e => toast(e.target.value === "month" ? "Monthly chart selected (sample visual)." : "Weekly chart selected (sample visual).")); $("#resultElection").addEventListener("change", e => toast(`${e.target.value} selected. Displayed results are illustrative demo data.`));
// /* Student portal demo login: accepts any syntactically valid email and a 4+ character password. */

// $("#studentLoginForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = $("#studentEmail").value.trim();
//   const password = $("#studentPassword").value;
//   const errorBox = $("#loginError");
//   const submitButton = e.currentTarget.querySelector(
//     'button[type="submit"]'
//   );

//   errorBox.textContent = "";
//   submitButton.disabled = true;
//   submitButton.textContent = "Signing in...";



// try {
//     const isEditing = editingElectionId !== null;

//     const response = await fetch(
//         isEditing
//             ? `http://localhost:3000/api/elections/${editingElectionId}`
//             : "http://localhost:3000/api/elections",
//         {
//             method: isEditing ? "PUT" : "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 election_name: name,
//                 description: description,
//                 start_time: `${start} 09:00:00`,
//                 end_time: `${end} 17:00:00`
//             })
//         }
//     );

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//         throw new Error(result.message || "Could not save election.");
//     }

//     form.reset();
//     $("#electionDialog").close();

//     editingElectionId = null;

//     await loadElections();
//     renderResults();

//     toast(
//         isEditing
//             ? "Election updated successfully in MySQL!"
//             : "Election saved successfully in MySQL!"
//     );

//     showView("elections");

// } catch (error) {
//     console.error("Error saving election:", error);
//     toast(error.message || "Could not save election.");
// } finally {
//     submitButton.disabled = false;
// }




//     const data = await response.json();

//     if (!response.ok || !data.success) {
//       throw new Error(data.message || "Login failed");
//     }

//     const student = data.student;
//     studentSignedIn = true;

//     $("#pageTitle").textContent = `Welcome, ${student.full_name}`;
//     $("#sidebar .profile-info strong").textContent = student.full_name;
//     $("#sidebar .profile-info span").textContent = "Student portal";
//     $("#sidebar .admin-avatar").textContent = student.full_name
//       .split(/\s+/)
//       .map(name => name[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase();

//     errorBox.textContent = "";
//     toast("Student login successful!");
//     showView("cast-vote");

//   } catch (error) {
//     errorBox.textContent =
//       error.message === "Failed to fetch"
//         ? "Cannot connect to the server. Check that the backend is running."
//         : error.message;

//   } finally {
//     submitButton.disabled = false;
//     submitButton.innerHTML = 'Sign in to portal <span>→</span>';
//   }
// });



// function renderBallot() {
//   if (!elections.some(e => e.status === "Live")) { $("#view-cast-vote").innerHTML = `<div class="submitted-state"><div class="submitted-icon">▣</div><h2>No active election</h2><p>There is no election open for voting yet. An administrator must create and activate an election before students can cast a vote.</p><button class="secondary-btn" id="goToAdminElections">Go to election management</button></div>`; $("#goToAdminElections").addEventListener("click", () => showView("elections")); return; } if (ballotSubmitted) { $("#view-cast-vote").innerHTML = `<div class="submitted-state"><div class="submitted-icon">✓</div><h2>Demo ballot recorded</h2><p>Your selections were confirmed in this page session only. No vote was sent to a server or stored in a database.</p><button class="secondary-btn" id="editDemoBallot">Return to ballot preview</button></div>`; $("#editDemoBallot").addEventListener("click", () => { ballotSubmitted = false; location.reload() }); return }
//   const positions = [["President", "presidentOptions"], ["General Secretary", "secretaryOptions"], ["Treasurer", "treasurerOptions"]]; positions.forEach(([position, containerId]) => { $("#" + containerId).innerHTML = candidates.filter(c => c.position === position).map(c => `<label class="ballot-option ${selections[position] === c.id ? "selected" : ""}"><input type="radio" name="${position.replaceAll(" ", "-")}" value="${c.id}" ${selections[position] === c.id ? "checked" : ""}><span class="candidate-avatar ${c.color}">${c.initials}</span><span class="ballot-option-copy"><strong>${c.name}</strong><small>${c.branch}</small></span><span class="radio-indicator"></span></label>`).join(""); }); $$(".ballot-option input").forEach(input => input.addEventListener("change", () => { const candidate = candidates.find(c => c.id === input.value); selections[candidate.position] = candidate.id; renderBallot() })); updateBallotSummary();
// }
// function updateBallotSummary() { const positions = ["President", "General Secretary", "Treasurer"], count = positions.filter(p => selections[p]).length; $("#selectedCount").textContent = `${count} of 3`; $("#selectedProgress").style.width = `${count / 3 * 100}%`; const ids = ["president", "secretary", "treasurer"]; positions.forEach((p, i) => { const c = candidates.find(c => c.id === selections[p]); const el = $("#sum-" + ids[i]); el.textContent = c ? c.name : "Not selected"; el.classList.toggle("chosen", !!c) }); }
// $("#ballotForm").addEventListener("submit", e => { e.preventDefault(); const positions = ["President", "General Secretary", "Treasurer"], missing = positions.filter(p => !selections[p]); if (missing.length) { toast("Please select a candidate for: " + missing.join(", ")); return } $("#voteReviewList").innerHTML = positions.map(p => `<div class="vote-review-item"><span>${p}</span><strong>${candidates.find(c => c.id === selections[p]).name}</strong></div>`).join(""); $("#confirmVoteDialog").showModal(); });
// $("#backToBallot").addEventListener("click", () => $("#confirmVoteDialog").close()); $("#confirmVoteForm").addEventListener("submit", e => { e.preventDefault(); ballotSubmitted = true; $("#confirmVoteDialog").close(); toast("Demo ballot confirmed — no real vote was submitted."); renderBallot(); });
// renderOverview(); renderElections(); renderCandidates(); renderVoters(); renderResults(); renderComplaints(); renderBallot();















































































// VoteSphere frontend script
// Connects election management and student login to the Node.js backend.

let elections = [];
let candidates = [];
const voters = [];
const complaints = [];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

let toastTimer;
let studentSignedIn = false;
let ballotSubmitted = false;
let editingElectionId = null;
let currentStudentId = null;
let currentRole = null;
let currentUser = null;

// Selections are keyed by database position_id so any number of positions is supported.
const selections = Object.create(null);
let ballotPositions = [];
let ballotElectionId = null;
let ballotLoading = false;

const API_BASE = "";


function renderVotingActivityChart() {
  const svg = $(".chart-svg");
  const labels = $(".x-labels");
  const yLabels = $(".y-labels");
  const range = $("#chartRange")?.value || "all";
  if (!svg || !labels || !yLabels) return;

  const sorted = [...elections].sort((a, b) => Number(a.election_id ?? a.id) - Number(b.election_id ?? b.id));
  const visible = range === "latest" ? sorted.slice(-5) : sorted;
  if (!visible.length) {
    svg.innerHTML = "";
    labels.innerHTML = "<span>No election data</span>";
    yLabels.innerHTML = "<span>—</span><span>—</span><span>—</span><span>—</span><span>—</span><span>0</span>";
    return;
  }

  const voteCounts = visible.map(election => Math.max(0, Number(election.votes || 0)));
  const eligibleCounts = visible.map(election => Math.max(0, Number(election.eligible_voters || 0)));
  const maxValue = Math.max(1, ...voteCounts, ...eligibleCounts);
  const chartHeight = 190;
  const chartWidth = 650;
  const xFor = index => visible.length === 1 ? chartWidth / 2 : index * chartWidth / (visible.length - 1);
  const yFor = value => chartHeight - (value / maxValue) * chartHeight;
  const votePoints = voteCounts.map((value, index) => [xFor(index), yFor(value)]);
  const eligiblePoints = eligibleCounts.map((value, index) => [xFor(index), yFor(value)]);
  const pathFor = points => points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(" ");
  const votePath = pathFor(votePoints);
  const eligiblePath = pathFor(eligiblePoints);
  const areaPath = `${votePath} L${votePoints[votePoints.length - 1][0].toFixed(1)} 190 L${votePoints[0][0].toFixed(1)} 190 Z`;
  const ticks = Array.from({length: 6}, (_, index) => Math.round(maxValue * (5 - index) / 5));

  yLabels.innerHTML = ticks.map(value => `<span>${value.toLocaleString()}</span>`).join("");
  labels.innerHTML = visible.map(election => {
    const name = election.election_name || election.name || "Election";
    const shortName = name.length > 12 ? `${name.slice(0, 11)}…` : name;
    return `<span title="${escapeHtml(name)}">${escapeHtml(shortName)}</span>`;
  }).join("");

  svg.setAttribute("viewBox", `0 0 ${chartWidth} 220`);
  svg.setAttribute("aria-label", "Live database chart comparing votes cast and eligible voters by election");
  svg.innerHTML = `
    <defs>
      <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#0e9f9a" stop-opacity=".24"></stop>
        <stop offset="100%" stop-color="#0e9f9a" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    <path class="area-path" d="${areaPath}"></path>
    <path class="line-path" d="${votePath}" style="stroke:#0e9f9a"></path>
    <path d="${eligiblePath}" fill="none" stroke="#aab8cc" stroke-width="2" stroke-dasharray="5 5" vector-effect="non-scaling-stroke"></path>
    ${votePoints.map((point, index) => `<circle cx="${point[0]}" cy="${point[1]}" r="4" style="stroke:#0e9f9a"><title>${escapeHtml(visible[index].election_name || visible[index].name || "Election")}: ${voteCounts[index]} votes</title></circle>`).join("")}
    ${eligiblePoints.map((point, index) => `<circle cx="${point[0]}" cy="${point[1]}" r="3" style="stroke:#aab8cc"><title>${escapeHtml(visible[index].election_name || visible[index].name || "Election")}: ${eligibleCounts[index]} eligible voters</title></circle>`).join("")}
  `;
}

function updateBallotElectionStatus() {
  const badge = $("#ballotElectionStatus");
  if (!badge) return;
  const active = elections.find(election => ["active", "live"].includes(String(election.status || "").toLowerCase()));
  const upcoming = elections
    .filter(election => String(election.status || "").toLowerCase() === "upcoming")
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];
  if (active) {
    badge.textContent = "VOTING OPEN";
    badge.className = "tag tag-green";
  } else if (upcoming) {
    badge.textContent = "UPCOMING ELECTION";
    badge.className = "tag tag-orange";
  } else {
    badge.textContent = "NO ACTIVE ELECTION";
    badge.className = "tag tag-orange";
  }
}

async function loadElections() {
  try {
    const response = await fetch(`${API_BASE}/api/elections`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load elections.");
    }

    elections = Array.isArray(data.elections) ? data.elections.map(election => ({ ...election, status: election.computed_status || election.status })) : [];
    console.log("Elections loaded from database:", elections);
    updateBallotElectionStatus();
    renderVotingActivityChart();
    renderElections();
    renderOverview();
    populateResultElectionOptions();
    renderResults();

    if (studentSignedIn) {
      await renderBallot();
    }
  } catch (error) {
    console.error("Error loading elections:", error);
    toast("Could not load elections from the server.");
  }
}


async function loadPositionsForElection(electionId) {
  const response = await fetch(`${API_BASE}/api/positions?election_id=${encodeURIComponent(electionId)}`);
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "Could not load election positions.");
  return Array.isArray(data.positions) ? data.positions : [];
}

async function loadPositionElections() {
  const select = $("#positionElectionSelect");
  if (!select) return;
  select.innerHTML = '<option value="">Loading elections...</option>';
  try {
    const response = await fetch(`${API_BASE}/api/elections`);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load elections.");
    const upcoming = (data.elections || []).filter(election => {
      const status = String(election.computed_status || election.status || "").toLowerCase();
      const start = new Date(election.start_time);
      return status === "upcoming" && !Number.isNaN(start.getTime()) && start > new Date();
    });
    select.innerHTML = '<option value="">Select an election</option>';
    upcoming.forEach(election => {
      const option = document.createElement("option");
      option.value = election.election_id;
      option.textContent = election.election_name;
      select.appendChild(option);
    });
    if (!upcoming.length) select.innerHTML = '<option value="">No upcoming elections available</option>';
  } catch (error) {
    console.error("Error loading elections for positions:", error);
    select.innerHTML = '<option value="">Could not load elections</option>';
    toast(error.message || "Could not load elections.");
  }
}

function toast(message) {
  const element = $("#toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 3000);
}

function statusPill(status) {
  return `<span class="status-pill ${String(status || "upcoming").toLowerCase()}">${status || "Upcoming"}</span>`;
}

function avatar(initials, color = "") {
  return `<span class="mini-avatar ${color}">${initials}</span>`;
}

function emptyRow(columns, message = "No matching records found") {
  return `<tr><td colspan="${columns}"><div class="empty-state"><strong>${message}</strong>Try changing your search or filters.</div></td></tr>`;
}

function effectiveElectionStatus(election) {
  return String(election.computed_status || election.status || "upcoming").toLowerCase();
}

function normalizeElection(election) {
  const statusRaw = effectiveElectionStatus(election);
  const endRaw = election.end || election.end_time || "";
  let formattedEnd = "—";

  if (endRaw) {
    const parsed = new Date(endRaw);
    formattedEnd = Number.isNaN(parsed.getTime())
      ? String(endRaw).slice(0, 10)
      : parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
  }

  return {
    ...election,
    id: Number(election.id ?? election.election_id),
    name: election.name || election.election_name || "Untitled Election",
    type: election.type || "Student Council",
    status: statusRaw === "active" ? "Live" : statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1),
    eligible: Number(election.eligible_voters ?? election.eligible ?? 0),
    votes: Number(election.votes ?? 0),
    studentsVoted: Number(election.students_voted ?? 0),
    positionsContested: Number(election.positions_contested ?? 0),
    progress: Number(election.eligible_voters ?? election.eligible ?? 0)
      ? Math.round(Number(election.students_voted ?? 0) / Number(election.eligible_voters ?? election.eligible) * 100)
      : 0,
    start: election.start || election.start_time || "",
    end: formattedEnd
  };
}

function electionRow(election, overview = false) {
  const item = normalizeElection(election);
  const initials = item.type === "Sports Committee"
    ? "SC"
    : item.type === "Technical Committee" ? "TC" : "SC";
  const avatarColor = item.status === "Completed"
    ? "green"
    : item.status === "Upcoming" ? "orange" : "";

  return `<tr>
        <td>
            <div class="table-name">
                ${avatar(initials, avatarColor)}
                <span>${item.name}<small>${item.type} · #EL-${String(item.id).padStart(3, "0")}</small></span>
            </div>
        </td>
        <td>${statusPill(item.status)}</td>
        ${overview ? "" : `<td>${item.eligible.toLocaleString()}</td><td>${item.votes.toLocaleString()}</td>`}
        ${overview ? `<td><div class="participation"><div class="progress-track"><span style="width:${item.progress}%"></span></div><em>${item.progress}%</em></div></td>` : ""}
        <td>${item.end}</td>
        ${overview
      ? `<td><button class="action-btn" data-election-detail="${item.id}" aria-label="View election">···</button></td>`
      : `<td>
    <button class="row-action" data-election-detail="${item.id}">View details</button>
    <button class="row-action" data-election-edit="${item.id}">Edit</button>
    <button class="row-action" data-election-delete="${item.id}">Delete</button>
</td>`
    }
    </tr>`;
}

function renderOverview() {
  const overviewRows = $("#overviewElectionRows");
  if (overviewRows) {
    overviewRows.innerHTML = elections.length
      ? elections.map(election => electionRow(election, true)).join("")
      : emptyRow(5, "No elections have been created yet");
  }

  const totalVoters = $("#totalVotersStat");
  const activeElections = $("#activeElectionsStat");
  const votesSubmitted = $("#votesSubmittedStat");

  if (totalVoters) totalVoters.textContent = voters.length.toLocaleString();
  if (activeElections) {
    activeElections.textContent = elections.filter(election => {
      const status = effectiveElectionStatus(election);
      return status === "live" || status === "active";
    }).length.toLocaleString();
  }
  if (votesSubmitted) {
    votesSubmitted.textContent = elections.reduce(
      (sum, election) => sum + Number(election.votes || 0), 0
    ).toLocaleString();
  }

  const totalVotersFoot = document.querySelector("#totalVotersStat")?.closest(".stat-card")?.querySelector(".stat-foot span");
  if (totalVotersFoot) totalVotersFoot.textContent = voters.length ? "Registered student records" : "No voter records yet";
  const activeFoot = document.querySelector("#activeElectionsStat")?.closest(".stat-card")?.querySelector(".stat-foot span");
  if (activeFoot) {
    const upcoming = elections.filter(election => effectiveElectionStatus(election) === "upcoming").length;
    activeFoot.textContent = upcoming ? `${upcoming} upcoming` : "Currently accepting votes";
  }
  const votesFoot = document.querySelector("#votesSubmittedStat")?.closest(".stat-card")?.querySelector(".stat-foot span");
  if (votesFoot) votesFoot.textContent = elections.length ? "Recorded across all elections" : "No votes submitted";

  const pendingComplaints = document.querySelector("#pendingComplaintCount");
  const complaintFoot = pendingComplaints?.closest(".stat-card")?.querySelector(".stat-foot span");
  if (complaintFoot && pendingComplaints) {
    complaintFoot.textContent = Number(pendingComplaints.textContent || 0) === 1 ? "Needs attention" : "Awaiting review";
  }

  const liveElection = elections.find(election => ["active", "live"].includes(effectiveElectionStatus(election)));
  const livePanel = document.querySelector(".election-panel");
  if (livePanel) {
    const badge = livePanel.querySelector(".panel-header .tag");
    const title = livePanel.querySelector(".live-election-details h3");
    const description = livePanel.querySelector(".live-election-details p");
    const turnout = livePanel.querySelector(".live-progress-label strong");
    const progress = livePanel.querySelector(".progress-track.large span");
    if (liveElection) {
      const item = normalizeElection(liveElection);
      const eligible = Number(liveElection.eligible_voters ?? liveElection.eligible ?? 0);
      const voted = Number(liveElection.students_voted ?? 0);
      const percentage = eligible ? Math.round(voted / eligible * 100) : 0;
      if (badge) { badge.textContent = "LIVE NOW"; badge.className = "tag tag-green"; }
      if (title) title.textContent = item.name;
      if (description) description.textContent = `${Number(liveElection.votes || 0).toLocaleString()} votes recorded so far.`;
      if (turnout) turnout.textContent = `${percentage}%`;
      if (progress) progress.style.width = `${percentage}%`;
    } else {
      const upcoming = elections.find(election => effectiveElectionStatus(election) === "upcoming");
      if (badge) { badge.textContent = upcoming ? "UPCOMING" : "NO ACTIVE ELECTION"; badge.className = "tag tag-orange"; }
      if (title) title.textContent = upcoming ? normalizeElection(upcoming).name : "No active election";
      if (description) description.textContent = upcoming ? "Voting will open at the scheduled start time." : "Create or schedule an election to get started.";
      if (turnout) turnout.textContent = "—";
      if (progress) progress.style.width = "0%";
    }
  }
}

function renderElections() {
  const rows = $("#electionsRows");
  if (!rows) return;

  const searchInput = $("#electionSearch");
  const filterInput = $("#electionFilter");
  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const filter = filterInput ? filterInput.value.toLowerCase() : "all";

  const list = elections.filter(election => {
    const item = normalizeElection(election);
    const status = effectiveElectionStatus(election);
    const matchesStatus = filter === "all"
      || status === filter
      || (filter === "live" && (status === "active" || status === "live"));
    return matchesStatus && item.name.toLowerCase().includes(query);
  });

  rows.innerHTML = list.length
    ? list.map(election => electionRow(election)).join("")
    : emptyRow(6, elections.length ? "No matching elections" : "No elections have been created yet");

  const count = $("#electionCount");
  if (count) count.textContent = `${list.length} election${list.length === 1 ? "" : "s"}`;
}



function populateResultElectionOptions() {
  const select = $("#resultElection");
  if (!select) return;
  const previous = select.value;
  select.innerHTML = '';
  if (!elections.length) {
    select.innerHTML = '<option value="">No elections yet</option>';
    return;
  }
  elections.forEach(election => {
    const option = document.createElement("option");
    option.value = String(election.election_id ?? election.id);
    option.textContent = election.election_name || election.name || `Election ${option.value}`;
    select.appendChild(option);
  });
  if (elections.some(election => String(election.election_id ?? election.id) === previous)) {
    select.value = previous;
  } else {
    select.value = String(elections[0].election_id ?? elections[0].id);
  }
}

async function loadVoters() {
  try {
    const response = await fetch(`${API_BASE}/api/students`);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load student directory.");
    voters.splice(0, voters.length, ...(data.students || []).map(student => ({
      id: Number(student.student_id),
      name: student.full_name,
      email: student.email,
      branch: student.department || "Not specified",
      year: student.year_of_study || "—",
      status: student.verification_status || "Verified",
      voted: student.voted || "No",
      initials: String(student.full_name || "S").split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase()
    })));
    renderVoters();
    renderOverview();
    const total = voters.length;
    const voted = voters.filter(voter => voter.voted === "Yes").length;
    if ($("#registeredStudentCount")) $("#registeredStudentCount").textContent = total.toLocaleString();
    if ($("#verifiedVoterCount")) $("#verifiedVoterCount").textContent = voters.filter(voter => voter.status === "Verified").length.toLocaleString();
    if ($("#notYetVotedCount")) $("#notYetVotedCount").textContent = Math.max(0, total - voted).toLocaleString();
  } catch (error) {
    console.error("Error loading student directory:", error);
    toast("Could not load the student directory from the server.");
  }
}



async function loadCandidates() {
  try {

const response = await fetch(`${API_BASE}/api/candidates`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load candidates.");
    }

    candidates = data.candidates.map(candidate => ({
      id: candidate.candidate_id,
      electionId: Number(candidate.election_id),
      status: candidate.status,
      positionId: Number(candidate.position_id),
      name: candidate.full_name,
      position: candidate.position_name,
      branch: candidate.election_name,
      manifesto: candidate.manifesto || "No manifesto provided.",
      votes: 0,
      initials: candidate.full_name
        .split(/\s+/)
        .map(part => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "blue"
    }));

    const positionFilter = $("#candidatePosition");
    if (positionFilter) {
      const previousValue = positionFilter.value;
      const positionNames = [...new Set(candidates.map(candidate => candidate.position).filter(Boolean))].sort();
      positionFilter.innerHTML = '<option value="all">All positions</option>';
      positionNames.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        positionFilter.appendChild(option);
      });
      if (positionNames.includes(previousValue)) positionFilter.value = previousValue;
    }
    renderCandidates();
    renderCandidateApplications(data.candidates);
    if (studentSignedIn) await renderBallot();
  } catch (error) {
    console.error("Error loading candidates:", error);
    toast("Could not load candidates from the server.");
  }
}




function renderCandidateApplications(candidateList) {
  const rows = document.getElementById("candidateApplicationsRows");
  const count = document.getElementById("pendingCandidatesCount");

  if (!rows) return;

  const pendingCount = candidateList.filter(
    candidate => candidate.status === "pending"
  ).length;

  if (count) {
    count.textContent = `${pendingCount} pending`;
  }

  if (candidateList.length === 0) {
    rows.innerHTML = `
            <tr>
                <td colspan="6">No candidate applications found.</td>
            </tr>
        `;
    return;
  }

  rows.innerHTML = candidateList.map(candidate => `
        <tr>
            <td>
                <strong>${candidate.full_name}</strong><br>
                <small>${candidate.email}</small>
            </td>
            <td>${candidate.election_name}</td>
            <td>${candidate.position_name}</td>
            <td>${candidate.manifesto || "No manifesto provided."}</td>
            <td>${candidate.status}</td>
            <td>
                ${candidate.status === "pending"
      ? `
                            <button data-approve="${candidate.candidate_id}">
                                Approve
                            </button>
                            <button data-reject="${candidate.candidate_id}">
                                Reject
                            </button>
                        `
      : "Reviewed"
    }
            </td>
        </tr>
    `).join("");
}



async function updateCandidateStatus(candidateId, status) {
  try {
   
const response = await fetch(
  `${API_BASE}/api/candidates/${candidateId}/status`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: status })
  }
);


    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update candidate status.");
    }

    toast(`Candidate ${status} successfully!`);

    await loadCandidates();

  } catch (error) {
    console.error("Error updating candidate status:", error);
    toast("Could not update candidate status.");
  }
}





document.addEventListener("click", function (event) {
  const approveButton = event.target.closest("[data-approve]");
  const rejectButton = event.target.closest("[data-reject]");

  if (approveButton) {
    const candidateId = approveButton.dataset.approve;
    updateCandidateStatus(candidateId, "approved");
  }

  if (rejectButton) {
    const candidateId = rejectButton.dataset.reject;
    updateCandidateStatus(candidateId, "rejected");
  }
});





function renderCandidates() {
  const grid = $("#candidateGrid");
  if (!grid) return;

  const query = $("#candidateSearch")?.value.toLowerCase() || "";
  const position = $("#candidatePosition")?.value || "all";
  const list = candidates.filter(candidate =>
    (position === "all" || candidate.position === position)
    && (candidate.name.toLowerCase().includes(query)
      || candidate.position.toLowerCase().includes(query)
      || candidate.branch.toLowerCase().includes(query))
  );

  grid.innerHTML = list.length
    ? list.map(candidate => `<article class="candidate-card">
            <div class="candidate-top"><div class="candidate-avatar ${candidate.color}">${candidate.initials}</div>
            <div><h3>${candidate.name}</h3><div class="branch">${candidate.branch} · ${candidate.id}</div></div></div>
            <span class="tag tag-blue">${candidate.position.toUpperCase()}</span><p>${candidate.manifesto}</p>
            <div class="candidate-meta"><span>Votes received <strong>${candidate.votes.toLocaleString()}</strong></span><button data-candidate="${candidate.id}">View profile ↗</button></div>
        </article>`).join("")
    : `<div class="panel empty-state"><strong>${candidates.length ? "No candidates found" : "No candidates registered yet"}</strong>${candidates.length ? "Try another name or position." : "Candidates will appear here after they are registered."}</div>`;
}

function renderVoters() {
  const rows = $("#votersRows");
  if (!rows) return;
  const query = $("#voterSearch")?.value.toLowerCase() || "";
  const filter = $("#voterFilter")?.value || "all";
  const list = voters.filter(voter =>
    (filter === "all" || voter.status === filter)
    && `${voter.name} ${voter.id} ${voter.branch}`.toLowerCase().includes(query)
  );

  rows.innerHTML = list.length
    ? list.map(voter => `<tr>
            <td><div class="table-name">${avatar(voter.initials)}<span>${voter.name}<small>Student voter</small></span></div></td>
            <td>${voter.id}</td><td>${voter.branch}</td><td>${voter.year}</td>
            <td>${statusPill(voter.status === "Verified" ? "live" : "upcoming").replace("live", "Verified").replace("upcoming", "Pending")}</td>
            <td>${voter.voted === "Yes" ? '<span class="status-pill completed">Yes</span>' : '<span style="color:#a1aaba">Not yet</span>'}</td>
        </tr>`).join("")
    : emptyRow(6, voters.length ? "No matching voter records" : "No voter records yet");
}

async function renderResults() {
  // Election results are administrator-only; skip this request for students and signed-out visitors.
  if (currentRole !== "admin") return;

  const container = $("#resultsByPosition") || $("#presidentResults");
  if (!container) return;
  const electionSelect = $("#resultElection");
  const electionId = electionSelect?.value;
  const url = electionId ? `${API_BASE}/api/results?election_id=${encodeURIComponent(electionId)}` : `${API_BASE}/api/results`;
  container.innerHTML = '<div class="empty-state">Loading results...</div>';
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load results.");
    const results = Array.isArray(data.results) ? data.results : [];
    const groups = new Map();
    results.forEach(result => {
      const key = Number(result.position_id);
      if (!groups.has(key)) groups.set(key, { name: result.position_name, candidates: [] });
      groups.get(key).candidates.push({ name: result.full_name, votes: Number(result.vote_count || 0) });
    });
    if (!results.length) {
      container.innerHTML = '<div class="empty-state"><strong>No results available yet</strong><p>Approved candidates and recorded votes will appear here.</p></div>';
    } else {
      container.innerHTML = [...groups.values()].map(group => {
        const max = Math.max(1, ...group.candidates.map(candidate => candidate.votes));
        const total = group.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
        return `<section class="result-position-group"><h3>${escapeHtml(group.name)}</h3>${group.candidates.map((candidate, index) => `
          <div><div class="result-row-head"><span>${index === 0 && total > 0 ? "🏆 " : ""}${escapeHtml(candidate.name)}</span><strong>${candidate.votes.toLocaleString()} votes · ${Math.round(candidate.votes / (total || 1) * 100)}%</strong></div>
          <div class="result-track"><span class="${index === 1 ? "runner" : index > 1 ? "third" : ""}" style="width:${candidate.votes / max * 100}%"></span></div></div>`).join("")}</section>`;
      }).join("");
    }
    const summary = data.summary || {};
    const selectedElection = elections.find(election => String(election.election_id ?? election.id) === String(electionId));
    if ($("#resultElectionName")) $("#resultElectionName").textContent = selectedElection?.election_name || selectedElection?.name || "All elections";
    const eligible = Number(summary.eligible_voters || 0);
    const voted = Number(summary.students_voted || 0);
    if ($("#resultVotesCast")) $("#resultVotesCast").textContent = Number(summary.total_votes || 0).toLocaleString();
    if ($("#resultNotVoted")) $("#resultNotVoted").textContent = Math.max(0, eligible - voted).toLocaleString();
    if ($("#resultEligible")) $("#resultEligible").textContent = eligible.toLocaleString();
    if ($("#resultPositions")) $("#resultPositions").textContent = Number(summary.positions_contested || 0).toLocaleString();
    if ($("#resultTurnout")) $("#resultTurnout").textContent = `${eligible ? Math.round(voted / eligible * 100) : 0}%`;
  } catch (error) {
    console.error("Error loading election results:", error);
    container.innerHTML = `<div class="empty-state"><strong>Could not load results</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}
function renderComplaints() {
  const rows = $("#complaintsRows");
  if (!rows) return;
  const query = $("#complaintSearch")?.value.toLowerCase() || "";
  const filter = $("#complaintFilter")?.value || "all";
  const list = complaints.filter(complaint =>
    (filter === "all" || complaint.status === filter)
    && `${complaint.id} ${complaint.desc} ${complaint.student}`.toLowerCase().includes(query)
  );

  rows.innerHTML = list.length
    ? list.map(complaint => `<tr>
            <td><div class="table-name"><span class="mini-avatar orange">⚑</span><span>${complaint.id}<small class="complaint-desc">${complaint.desc}</small></span></div></td>
            <td>${complaint.student}</td><td>${complaint.election}</td><td>${complaint.date}</td>
            <td><span class="status-pill ${complaint.status === "Pending" ? "upcoming" : "live"}">${complaint.status}</span></td>
            <td><button class="row-action" data-complaint="${complaint.id}" ${complaint.status === "Resolved" ? "disabled" : ""}>${complaint.status === "Resolved" ? "Resolved" : "Resolve"}</button></td>
        </tr>`).join("")
    : emptyRow(6, complaints.length ? "No matching complaints" : "No complaints submitted yet");

  const pending = complaints.filter(complaint => complaint.status === "Pending").length;
  if ($("#pendingComplaintCount")) $("#pendingComplaintCount").textContent = String(pending).padStart(2, "0");
  if ($("#complaintStatusTag")) $("#complaintStatusTag").textContent = `${pending} need attention`;
}

const viewMeta = {
  overview: ["Overview", "ADMIN WORKSPACE", "Good morning, Admin ✦", "Here's what's happening with your campus elections today."],
  elections: ["Elections", "ELECTION MANAGEMENT", "Election management", "Create, schedule and monitor campus elections."],
  candidates: ["Candidates", "CANDIDATE DIRECTORY", "Meet the candidates", "Browse candidates, their positions and manifestos."],
  voters: ["Voters", "VOTER MANAGEMENT", "Voter directory", "Review student registration and voting eligibility."],
  results: ["Results", "RESULTS & ANALYTICS", "Election results", "Explore turnout, candidate performance and election summaries."],
  complaints: ["Complaints", "COMPLAINT MANAGEMENT", "Complaints & reports", "Review election-related concerns submitted by students."],
  "student-login": ["Student login", "STUDENT PORTAL", "Welcome to your campus", "Sign in to the student election portal."],
  "cast-vote": ["Cast vote", "STUDENT PORTAL", "Cast your vote", "Review the ballot and make your demo selections."]
};

function showView(view) {
  if (!viewMeta[view]) return;
  if (!currentRole) { document.body.classList.add("auth-required"); return; }
  const adminViews = ["overview", "elections", "candidates", "voters", "results", "complaints"];
  if (currentRole === "student" && adminViews.includes(view)) { toast("This section is available to administrators only."); view = "cast-vote"; }
  if (currentRole === "admin" && ["student-login", "cast-vote"].includes(view)) { toast("Student sign-in is required to access the ballot."); view = "overview"; }
  if (view === "cast-vote" && !studentSignedIn) {
    toast("Please sign in to the student portal first.");
    view = "student-login";
  }

  $$(".view").forEach(element => element.classList.toggle("active", element.id === `view-${view}`));
  $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === view));

  const [crumb, eyebrow, title, subtitle] = viewMeta[view];
  if ($("#crumbTitle")) $("#crumbTitle").textContent = crumb;
  if ($("#pageEyebrow")) $("#pageEyebrow").textContent = eyebrow;
  if ($("#pageTitle")) $("#pageTitle").textContent = title;
  if ($("#pageSubtitle")) $("#pageSubtitle").textContent = subtitle;
  if ($("#globalHeading")) $("#globalHeading").style.display = view === "student-login" || view === "cast-vote" ? "none" : "flex";
  if ($("#createElectionBtn")) $("#createElectionBtn").style.display = view === "elections" || view === "overview" ? "inline-flex" : "none";

  if (view === "overview") renderOverview();
  if (view === "elections") renderElections();
  if (view === "candidates") renderCandidates();
  if (view === "voters") renderVoters();
  if (view === "results") renderResults();
  if (view === "complaints") renderComplaints();
  if (view === "cast-vote") renderBallot();

  $("#sidebar")?.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$(".nav-item").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
$$("[data-go]").forEach(button => button.addEventListener("click", () => showView(button.dataset.go)));

["electionSearch", "electionFilter"].forEach(id => {
  const element = $("#" + id);
  if (element) element.addEventListener(id.endsWith("Search") ? "input" : "change", renderElections);
});
["candidateSearch", "candidatePosition"].forEach(id => {
  const element = $("#" + id);
  if (element) element.addEventListener(id.endsWith("Search") ? "input" : "change", renderCandidates);
});
["voterSearch", "voterFilter"].forEach(id => {
  const element = $("#" + id);
  if (element) element.addEventListener(id.endsWith("Search") ? "input" : "change", renderVoters);
});
["complaintSearch", "complaintFilter"].forEach(id => {
  const element = $("#" + id);
  if (element) element.addEventListener(id.endsWith("Search") ? "input" : "change", renderComplaints);
});

$("#menuBtn")?.addEventListener("click", () => $("#sidebar")?.classList.toggle("open"));
$("#helpBtn")?.addEventListener("click", () => $("#helpDialog")?.showModal());

function resetElectionForm() {
  const form = $("#electionForm");
  if (form) form.reset();
  editingElectionId = null;
  const submitButton = form?.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = "Create election";
}

$("#createElectionBtn")?.addEventListener("click", () => {
  resetElectionForm();
  $("#electionDialog")?.showModal();
});

$("#addStudentBtn")?.addEventListener("click", () => {
  $("#studentForm")?.reset();
  $("#studentDialog")?.showModal();
});

$("#cancelStudentBtn")?.addEventListener("click", () => {
  $("#studentDialog")?.close();
  $("#studentForm")?.reset();
});

$("#studentForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const yearValue = String(formData.get("year_of_study") || "");
  const payload = {
    full_name: String(formData.get("full_name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    department: String(formData.get("department") || "").trim(),
    year_of_study: yearValue ? Number(yearValue) : null
  };
  submitButton.disabled = true;
  try {
    const response = await fetch(`${API_BASE}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Could not add student.");
    form.reset();
    $("#studentDialog")?.close();
    await loadVoters();
    toast(`Student record created. Student ID: ${result.student.student_id}`);
  } catch (error) {
    console.error("Error creating student:", error);
    toast(error.message || "Could not add student.");
  } finally {
    submitButton.disabled = false;
  }
});

$("#createPositionBtn")?.addEventListener("click", async () => {
  await loadPositionElections();
  $("#positionDialog")?.showModal();
});

$("#cancelPositionBtn")?.addEventListener("click", () => {
  $("#positionDialog")?.close();
  $("#positionForm")?.reset();
});

$("#positionForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const payload = {
    election_id: Number(formData.get("election_id")),
    position_name: String(formData.get("position_name") || "").trim(),
    description: String(formData.get("description") || "").trim()
  };
  if (!payload.election_id || !payload.position_name) {
    toast("Select an election and enter a position name.");
    return;
  }
  submitButton.disabled = true;
  try {
    const response = await fetch(`${API_BASE}/api/positions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Could not create position.");
    form.reset();
    $("#positionDialog")?.close();
    toast("Position created successfully in MySQL!");
    if (ballotElectionId === payload.election_id) await renderBallot();
  } catch (error) {
    console.error("Error creating position:", error);
    toast(error.message || "Could not create position.");
  } finally {
    submitButton.disabled = false;
  }
});

$$(".close-modal").forEach(button => button.addEventListener("click", () => {
  button.closest("dialog")?.close();
  if (button.closest("#electionDialog")) resetElectionForm();
}));

$("#cancelElectionBtn")?.addEventListener("click", () => {
  $("#electionDialog")?.close();
  resetElectionForm();
});

$("#electionForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const description = String(data.get("description") || "").trim();
  const start = String(data.get("start") || "");
  const end = String(data.get("end") || "");

  if (!name) {
    toast("Please enter an election name.");
    return;
  }
  if (!start || !end || end <= start) {
    toast("End date must be after the start date.");
    return;
  }

  const isEditing = editingElectionId !== null;
  submitButton.disabled = true;

  try {
    const response = await fetch(
      isEditing ? `${API_BASE}/api/elections/${editingElectionId}` : `${API_BASE}/api/elections`,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          election_name: name,
          description,
          start_time: `${start} 09:00:00`,
          end_time: `${end} 17:00:00`
        })
      }
    );

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not save election.");
    }

    form.reset();
    $("#electionDialog")?.close();
    editingElectionId = null;
    if (submitButton) submitButton.textContent = "Create election";

    await loadElections();
    renderResults();
    toast(isEditing ? "Election updated successfully in MySQL!" : "Election saved successfully in MySQL!");
    showView("elections");
  } catch (error) {
    console.error("Error saving election:", error);
    toast(error.message || "Could not connect to the server.");
  } finally {
    submitButton.disabled = false;
  }
});

document.addEventListener("click", event => {
  const editButton = event.target.closest("[data-election-edit]");
  const deleteButton = event.target.closest("[data-election-delete]");


  if (deleteButton) {
    const id = Number(deleteButton.dataset.electionDelete);

    const rawElection = elections.find(
      item => Number(item.id ?? item.election_id) === id
    );

    if (!rawElection) {
      toast("Election not found.");
      return;
    }

    const item = normalizeElection(rawElection);

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    deleteButton.disabled = true;

fetch(`${API_BASE}/api/elections/${id}`, {
  method: "DELETE"
})

      .then(async response => {
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not delete election."
          );
        }

        await loadElections();
        toast("Election deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting election:", error);
        toast(error.message || "Could not delete election.");
      })
      .finally(() => {
        deleteButton.disabled = false;
      });

    return;
  }
  if (editButton) {
    const id = Number(editButton.dataset.electionEdit);
    const rawElection = elections.find(item => Number(item.id ?? item.election_id) === id);
    if (!rawElection) {
      toast("Election not found.");
      return;
    }

    const item = normalizeElection(rawElection);
    editingElectionId = id;
    const form = $("#electionForm");
    form.elements.namedItem("name").value = item.name;
    form.elements.namedItem("start").value = String(item.start || "").slice(0, 10);
    form.elements.namedItem("end").value = String(rawElection.end_time || rawElection.endDate || rawElection.end || "").slice(0, 10);
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.textContent = "Save changes";
    $("#electionDialog")?.showModal();
    return;
  }

  const detailButton = event.target.closest("[data-election-detail]");
  if (detailButton) {
    const id = Number(detailButton.dataset.electionDetail);
    const rawElection = elections.find(item => Number(item.id ?? item.election_id) === id);
    if (rawElection) {
      const item = normalizeElection(rawElection);
      toast(`${item.name} · ${item.status} · ${item.votes} votes`);
    }
  }

  const candidateButton = event.target.closest("[data-candidate]");
  if (candidateButton) {
    const item = candidates.find(candidate => String(candidate.id) === candidateButton.dataset.candidate);
    if (item) toast(`${item.name} · ${item.position} · ${item.status}`);
  }

  const complaintButton = event.target.closest("[data-complaint]");
  if (complaintButton) {
    const item = complaints.find(complaint => String(complaint.id) === complaintButton.dataset.complaint);
    if (item && item.status === "Pending") {
      item.status = "Resolved";
      renderComplaints();
      toast(`${item.id} marked as resolved.`);
    }
  }
});

$("#exportVoters")?.addEventListener("click", () => {
  const rows = [["Name", "Student ID", "Branch", "Year", "Verification", "Voted"],
  ...voters.map(voter => [voter.name, voter.id, voter.branch, voter.year, voter.status, voter.voted])];
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = "voter-directory-demo.csv";
  link.click();
  URL.revokeObjectURL(url);
  toast("Sample voter directory exported as CSV.");
});

$("#chartRange")?.addEventListener("change", () => renderVotingActivityChart());
$("#resultElection")?.addEventListener("change", () => renderResults());

// Student login is authenticated by the backend; passwords are never checked in the browser.
$("#studentLoginForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("#studentEmail").value.trim();
  const password = $("#studentPassword").value;
  const errorBox = $("#loginError");
  const submitButton = event.currentTarget.querySelector('button[type="submit"]');

  errorBox.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Signing in...";

  try {
    const response = await fetch(`${API_BASE}/api/students/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login failed.");
    }

    const student = data.student;
    currentStudentId = Number(student.student_id);
    studentSignedIn = true;
    applyAuthenticatedRole("student", student);
    const fullName = student.full_name || student.name || email.split("@")[0];
    if ($("#pageTitle")) $("#pageTitle").textContent = `Welcome, ${fullName}`;
    if ($("#sidebar .profile-info strong")) $("#sidebar .profile-info strong").textContent = fullName;
    if ($("#sidebar .profile-info span")) $("#sidebar .profile-info span").textContent = "Student portal";
    if ($("#sidebar .admin-avatar")) {
      $("#sidebar .admin-avatar").textContent = fullName.split(/\s+/)
        .map(part => part[0]).join("").slice(0, 2).toUpperCase();
    }

    errorBox.textContent = "";
    toast("Student login successful!");
    showView("cast-vote");
  } catch (error) {
    errorBox.textContent = error.message === "Failed to fetch"
      ? "Cannot connect to the server. Check that the backend is running."
      : error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Sign in to portal <span>→</span>';
  }
});

function getActiveElection() {
  return elections.find(election => {
    const status = effectiveElectionStatus(election);
    return status === "active" || status === "live";
  }) || null;
}

function getBallotPreviewElection() {
  const active = getActiveElection();
  if (active) return active;
  return elections
    .filter(election => effectiveElectionStatus(election) === "upcoming")
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0] || null;
}

async function renderBallot() {
  const ballotContainer = $("#ballotPositions");
  if (!ballotContainer || ballotSubmitted || ballotLoading) return;
  let election = getBallotPreviewElection();
  const activeElection = getActiveElection();
  if (!election) {
    ballotPositions = [];
    ballotElectionId = null;
    ballotContainer.innerHTML = '<div class="empty-state"><strong>No election is scheduled.</strong><p>An administrator must create an election before positions can be displayed.</p></div>';
    updateBallotSummary();
    if ($("#ballotElectionStatus")) {
      $("#ballotElectionStatus").textContent = "NO SCHEDULED ELECTION";
      $("#ballotElectionStatus").className = "tag tag-orange";
    }
    return;
  }
  ballotLoading = true;
  ballotElectionId = Number(election.election_id);
  try {
    ballotPositions = await loadPositionsForElection(ballotElectionId);
    if (!activeElection && ballotPositions.length === 0) {
      const upcomingElections = elections
        .filter(item => effectiveElectionStatus(item) === "upcoming")
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      for (const upcomingElection of upcomingElections) {
        if (Number(upcomingElection.election_id) === ballotElectionId) continue;
        const availablePositions = await loadPositionsForElection(Number(upcomingElection.election_id));
        if (availablePositions.length) {
          election = upcomingElection;
          ballotElectionId = Number(upcomingElection.election_id);
          ballotPositions = availablePositions;
          break;
        }
      }
    }
    const votingOpen = !!activeElection && Number(activeElection.election_id) === ballotElectionId;
    if ($("#ballotElectionStatus")) {
      $("#ballotElectionStatus").textContent = votingOpen ? "VOTING OPEN" : "VOTING NOT OPEN";
      $("#ballotElectionStatus").className = votingOpen ? "tag tag-green" : "tag tag-orange";
    }
    const heading = $(".vote-election-heading h3");
    if (heading) heading.textContent = election.election_name || election.name || "Election ballot";
    const description = $(".vote-election-heading p");
    if (description) description.textContent = votingOpen
      ? "Choose one approved candidate for each available position."
      : "Previewing the upcoming election. Voting is disabled until the scheduled start time.";
    if (!ballotPositions.length) {
      ballotContainer.innerHTML = '<div class="empty-state"><strong>No positions have been created for this election.</strong><p>An administrator can add positions from Election Management.</p></div>';
      updateBallotSummary();
      return;
    }
    ballotContainer.innerHTML = ballotPositions.map((position, index) => {
      const approved = candidates.filter(candidate =>
        candidate.electionId === ballotElectionId &&
        candidate.positionId === Number(position.position_id) &&
        String(candidate.status).toLowerCase() === "approved"
      );
      const positionId = Number(position.position_id);
      const selectedId = Number(selections[positionId] || 0);
      const options = approved.length ? approved.map(candidate => `
        <label class="ballot-option ${selectedId === Number(candidate.id) ? "selected" : ""}">
          <input type="radio" name="position-${positionId}" data-position-id="${positionId}" value="${Number(candidate.id)}" ${selectedId === Number(candidate.id) ? "checked" : ""} ${votingOpen ? "" : "disabled"}>
          <span class="candidate-avatar ${candidate.color}">${escapeHtml(candidate.initials)}</span>
          <span class="ballot-option-copy"><strong>${escapeHtml(candidate.name)}</strong><small>${escapeHtml(candidate.branch || "Student")}</small></span>
          <span class="radio-indicator"></span>
        </label>`).join("") : '<div class="empty-state"><strong>No approved candidates yet</strong><p>Approved candidates for this position will appear here.</p></div>';
      return `<section class="panel ballot-section">
        <div class="ballot-section-head"><div><span class="position-number ${index % 3 === 1 ? "purple-num" : index % 3 === 2 ? "green-num" : ""}">${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(position.position_name)}</h3><p>${escapeHtml(position.description || "Choose one candidate")}</p></div></div><span class="required-label">${approved.length ? "Required" : "Not available"}</span></div>
        <div class="ballot-options">${options}</div>
      </section>`;
    }).join("");
    Object.keys(selections).forEach(key => {
      if (!ballotPositions.some(position => String(position.position_id) === key)) delete selections[key];
    });
    updateBallotSummary();
  } catch (error) {
    console.error("Error rendering ballot:", error);
    ballotContainer.innerHTML = `<div class="empty-state"><strong>Could not load ballot positions.</strong><p>${escapeHtml(error.message || "Check the backend connection.")}</p></div>`;
    updateBallotSummary();
  } finally {
    ballotLoading = false;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

$("#ballotPositions")?.addEventListener("change", event => {
  const input = event.target.closest("input[data-position-id]");
  if (!input) return;
  const positionId = Number(input.dataset.positionId);
  const candidateId = Number(input.value);
  if (!positionId || !candidateId) return;
  selections[positionId] = candidateId;
  updateBallotSummary();
});

function updateBallotSummary() {
  const electionId = ballotElectionId;
  const relevantPositions = ballotPositions.filter(position => candidates.some(candidate =>
    candidate.electionId === Number(electionId) &&
    candidate.positionId === Number(position.position_id) &&
    String(candidate.status).toLowerCase() === "approved"
  ));
  const selectedCount = relevantPositions.filter(position => selections[Number(position.position_id)]).length;
  const total = relevantPositions.length;
  if ($("#selectedCount")) $("#selectedCount").textContent = `${selectedCount} of ${total}`;
  if ($("#selectedProgress")) $("#selectedProgress").style.width = `${total ? selectedCount / total * 100 : 0}%`;
  const summary = $("#summaryPositions");
  if (!summary) return;
  if (!ballotPositions.length) {
    summary.innerHTML = '<div class="empty-state">No positions loaded yet.</div>';
    return;
  }
  summary.innerHTML = ballotPositions.map((position, index) => {
    const candidate = candidates.find(item =>
      item.id === Number(selections[Number(position.position_id)]) &&
      item.electionId === Number(electionId) &&
      item.positionId === Number(position.position_id) &&
      String(item.status).toLowerCase() === "approved"
    );
    return `<div><span>${String(index + 1).padStart(2, "0")}</span> ${escapeHtml(position.position_name)} <b class="${candidate ? "chosen" : ""}">${candidate ? escapeHtml(candidate.name) : "Not selected"}</b></div>`;
  }).join("");
}

$("#ballotForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const activeElection = getActiveElection();
  if (!activeElection) {
    toast("Voting is not open yet. You can preview the upcoming ballot.");
    return;
  }
  const requiredPositions = ballotPositions.filter(position => candidates.some(candidate =>
    candidate.electionId === Number(activeElection.election_id) &&
    candidate.positionId === Number(position.position_id) &&
    String(candidate.status).toLowerCase() === "approved"
  ));
  if (!requiredPositions.length) {
    toast("No approved candidates are available for this election.");
    return;
  }
  const missing = requiredPositions.filter(position => !selections[Number(position.position_id)]);
  if (missing.length) {
    toast("Please select a candidate for: " + missing.map(position => position.position_name).join(", "));
    return;
  }
  const selectedCandidates = requiredPositions.map(position => candidates.find(candidate =>
    candidate.id === Number(selections[Number(position.position_id)]) &&
    candidate.electionId === Number(activeElection.election_id) &&
    candidate.positionId === Number(position.position_id) &&
    String(candidate.status).toLowerCase() === "approved"
  )).filter(Boolean);
  if (selectedCandidates.length !== requiredPositions.length) {
    toast("One or more selections are no longer valid. Please review your ballot.");
    return;
  }
  const reviewList = $("#voteReviewList");
  if (reviewList) reviewList.innerHTML = selectedCandidates.map(candidate => {
    const position = ballotPositions.find(item => Number(item.position_id) === candidate.positionId);
    return `<div class="vote-review-item"><span>${escapeHtml(position?.position_name || candidate.position)}</span><strong>${escapeHtml(candidate.name)}</strong></div>`;
  }).join("");
  $("#confirmVoteDialog")?.showModal();
});

$("#backToBallot")?.addEventListener("click", () => $("#confirmVoteDialog")?.close());



$("#confirmVoteForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!currentStudentId) {
    toast("Please log in before casting your vote.");
    return;
  }
  const activeElection = getActiveElection();
  if (!activeElection) {
    toast("Voting is not open yet.");
    return;
  }
  const requiredPositions = ballotPositions.filter(position => candidates.some(candidate =>
    candidate.electionId === Number(activeElection.election_id) &&
    candidate.positionId === Number(position.position_id) &&
    String(candidate.status).toLowerCase() === "approved"
  ));
  const votes = requiredPositions.map(position => {
    const candidateId = Number(selections[Number(position.position_id)] || 0);
    const candidate = candidates.find(item =>
      item.id === candidateId &&
      item.electionId === Number(activeElection.election_id) &&
      item.positionId === Number(position.position_id) &&
      String(item.status).toLowerCase() === "approved"
    );
    return candidate ? {
      student_id: currentStudentId,
      election_id: Number(activeElection.election_id),
      position_id: Number(position.position_id),
      candidate_id: Number(candidate.id)
    } : null;
  }).filter(Boolean);
  if (!votes.length || votes.length !== requiredPositions.length) {
    toast("Please review all required selections before submitting.");
    return;
  }
  const submitButton = event.currentTarget.querySelector('button[type="submit"]');
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Submitting..."; }
  try {
    const response = await fetch(`${API_BASE}/api/votes/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Failed to record vote.");
    $("#confirmVoteDialog")?.close();
    ballotSubmitted = true;
    const form = $("#ballotForm");
    if (form) form.innerHTML = '<div class="submitted-state"><div class="submitted-icon">✓</div><h2>Vote recorded</h2><p>Your selections were saved to the database successfully.</p></div>';
    toast("Your vote was recorded successfully!");
    await loadVoters();
    await renderResults();
  } catch (error) {
    console.error("Error submitting vote:", error);
    toast(error.message || "Could not submit your vote.");
  } finally {
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = "Submit vote"; }
  }
});

function applyAuthenticatedRole(role,user){
  currentRole=role;currentUser=user||{};
  document.body.classList.remove("auth-required","admin-role","student-role");
  document.body.classList.add(role+"-role");
  if($("#authGate"))$("#authGate").style.display="none";

  const workspaceLabel=$(".sidebar .workspace-label:not(.secondary-label)");
  const secondaryLabel=$(".sidebar .secondary-label");
  const nav=$(".sidebar .nav-list");
  const brandCaption=$(".sidebar .brand small");
  const sidebarAvatar=$("#sidebar .admin-avatar");
  const profileName=$("#sidebar .profile-info strong");
  const profileRole=$("#sidebar .profile-info span");

  if(role==="student"){
    studentSignedIn=true;
    currentStudentId=Number(user.student_id);
    const name=user.full_name||user.name||user.email||"Student";
    const initials=name.trim().split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase();
    if(workspaceLabel)workspaceLabel.textContent="STUDENT WORKSPACE";
    if(secondaryLabel)secondaryLabel.style.display="none";
    if(nav)nav.setAttribute("aria-label","Student navigation");
    if(brandCaption)brandCaption.textContent="STUDENT ELECTIONS";
    if(profileName)profileName.textContent=name;
    if(profileRole)profileRole.textContent="Student portal";
    if(sidebarAvatar)sidebarAvatar.textContent=initials;
    showView("cast-vote");
    loadElections();loadCandidates();
  }else{
    studentSignedIn=false;
    currentStudentId=null;
    if(workspaceLabel)workspaceLabel.textContent="ADMIN WORKSPACE";
    if(secondaryLabel){secondaryLabel.style.display="block";secondaryLabel.textContent="STUDENT PORTAL PREVIEW";}
    if(nav)nav.setAttribute("aria-label","Administrator navigation");
    if(brandCaption)brandCaption.textContent="CAMPUS ELECTIONS";
    if(profileName)profileName.textContent="Administrator";
    if(profileRole)profileRole.textContent=user.email||"Election administrator";
    if(sidebarAvatar)sidebarAvatar.textContent="A";
    showView("overview");
    loadElections();loadCandidates();loadVoters();
  }
}
$("#adminLoginForm")?.addEventListener("submit",async event=>{
  event.preventDefault();const error=$("#adminLoginError"),button=event.currentTarget.querySelector('button[type="submit"]');error.textContent="";button.disabled=true;button.textContent="Signing in...";
  try{const response=await fetch(`${API_BASE}/api/admin/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("#adminLoginEmail").value.trim(),password:$("#adminLoginPassword").value})});
    const data=await response.json();if(!response.ok||!data.success)throw new Error(data.message||"Admin login failed.");applyAuthenticatedRole("admin",data.user);toast("Admin login successful.");
  }catch(error){$("#adminLoginError").textContent=error.message==="Failed to fetch"?"Cannot connect to the server.":error.message;}
  finally{button.disabled=false;button.textContent="Open admin workspace →";}
});
$("#gateStudentLoginForm")?.addEventListener("submit",async event=>{
  event.preventDefault();const error=$("#gateStudentLoginError"),button=event.currentTarget.querySelector('button[type="submit"]');error.textContent="";button.disabled=true;button.textContent="Signing in...";
  try{const response=await fetch(`${API_BASE}/api/students/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("#gateStudentEmail").value.trim(),password:$("#gateStudentPassword").value})});
    const data=await response.json();if(!response.ok||!data.success)throw new Error(data.message||"Student login failed.");applyAuthenticatedRole("student",data.student);toast("Student login successful.");
  }catch(error){$("#gateStudentLoginError").textContent=error.message==="Failed to fetch"?"Cannot connect to the server.":error.message;}
  finally{button.disabled=false;button.textContent="Open student portal →";}
});
$("#logoutBtn")?.addEventListener("click",async()=>{try{await fetch(`${API_BASE}/api/logout`,{method:"POST"});}catch(error){console.warn("Logout request failed",error);}
  currentRole=null;currentUser=null;currentStudentId=null;studentSignedIn=false;document.body.classList.remove("admin-role","student-role");document.body.classList.add("auth-required");if($("#authGate"))$("#authGate").style.display="grid";
  if($("#adminLoginPassword"))$("#adminLoginPassword").value="";if($("#gateStudentPassword"))$("#gateStudentPassword").value="";
});
async function initializeAuthentication(){try{const response=await fetch(`${API_BASE}/api/auth/me`);const data=await response.json();if(response.ok&&data.success){applyAuthenticatedRole(data.role,data.user);return;}}catch(error){console.warn("No existing authenticated session.",error);}document.body.classList.add("auth-required");}
initializeAuthentication();
