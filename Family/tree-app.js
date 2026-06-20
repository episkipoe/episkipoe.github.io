(function () {
  const members = (window.FAMILY_MEMBERS || []).map((member) => ({ ...member }));
  const chart = document.querySelector(".tree-chart");
  const svg = d3.select("#family-tree");
  const viewport = svg.append("g").attr("class", "viewport");
  const linkLayer = viewport.append("g").attr("class", "links");
  const nodeLayer = viewport.append("g").attr("class", "nodes");
  const searchInput = document.querySelector("#member-search");
  const generationFilter = document.querySelector("#generation-filter");
  const resetButton = document.querySelector("#reset-view");
  const fitButton = document.querySelector("#fit-view");
  const details = document.querySelector("#member-details");
  const stats = document.querySelector("#tree-stats");

  const width = () => chart.clientWidth;
  const height = () => chart.clientHeight;
  const memberById = new Map(members.map((member) => [member.id, member]));
  const childrenByParent = new Map();
  const partnerPairs = new Map();

  members.forEach((member) => {
    [member.parent1Id, member.parent2Id].forEach((parentId) => {
      if (parentId === null || parentId === undefined) return;
      if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
      childrenByParent.get(parentId).push(member.id);
    });

    addPartnerPair(member.parent1Id, member.parent2Id, member.id);
    addPartnerPair(member.id, member.partnerId);
  });

  const nodes = members.map((member) => ({
    ...member,
    generation: generationFor(member),
    radius: member.featured ? 30 : 24
  }));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const parentLinks = members.flatMap((member) => {
    return [member.parent1Id, member.parent2Id]
      .filter((parentId) => parentId !== null && parentId !== undefined && memberById.has(parentId))
      .map((parentId) => ({
        source: parentId,
        target: member.id,
        type: "parent"
      }));
  });

  const partnerLinks = Array.from(partnerPairs.values()).map((pair) => ({
    ...pair,
    type: "partner"
  }));

  const links = [...parentLinks, ...partnerLinks];
  const zoom = d3.zoom().scaleExtent([0.28, 2.6]).on("zoom", (event) => {
    viewport.attr("transform", event.transform);
  });

  let selectedId = members.find((member) => member.featured)?.id ?? members[0]?.id;
  let searchTerm = "";
  let activeGeneration = "all";

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance((d) => (d.type === "partner" ? 76 : 150))
        .strength((d) => (d.type === "partner" ? 0.58 : 0.76))
    )
    .force("charge", d3.forceManyBody().strength(-920))
    .force("collision", d3.forceCollide().radius((d) => d.radius + 34).iterations(2))
    .force("x", d3.forceX((d) => width() / 2 + familyOffset(d)).strength(0.065))
    .force("y", d3.forceY((d) => 120 + d.generation * 178).strength(0.22))
    .on("tick", ticked);

  svg.call(zoom);
  hydrateControls();
  resize();
  render();
  updateSelection(selectedId);
  window.addEventListener("resize", resize);

  function hydrateControls() {
    const generations = [...new Set(nodes.map((node) => node.generation))].sort((a, b) => a - b);

    generations.forEach((generation) => {
      const option = document.createElement("option");
      option.value = String(generation);
      option.textContent = `Generation ${generation + 1}`;
      generationFilter.appendChild(option);
    });

    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      applyState();
    });

    generationFilter.addEventListener("change", (event) => {
      activeGeneration = event.target.value;
      applyState();
    });

    resetButton.addEventListener("click", () => {
      searchInput.value = "";
      generationFilter.value = "all";
      searchTerm = "";
      activeGeneration = "all";
      selectedId = members.find((member) => member.featured)?.id ?? members[0]?.id;
      nodes.forEach((node) => {
        node.fx = null;
        node.fy = null;
      });
      applyState();
      fitToView();
    });

    fitButton.addEventListener("click", fitToView);
  }

  function render() {
    linkLayer
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", (d) => `link ${d.type}-link`);

    const node = nodeLayer
      .selectAll(".person-node")
      .data(nodes, (d) => d.id)
      .join((enter) => {
        const group = enter
          .append("g")
          .attr("class", "person-node")
          .attr("tabindex", 0)
          .attr("role", "button")
          .attr("aria-label", (d) => `Select ${d.name}`)
          .on("click", (event, d) => updateSelection(d.id))
          .on("keydown", (event, d) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              updateSelection(d.id);
            }
          })
          .call(
            d3
              .drag()
              .on("start", dragStarted)
              .on("drag", dragged)
              .on("end", dragEnded)
          );

        group
          .append("circle")
          .attr("r", (d) => d.radius)
          .attr("class", (d) => `avatar ${genderClass(d.gender)}`);

        group
          .append("text")
          .attr("class", "initials")
          .attr("dy", "0.36em")
          .text((d) => initials(d.name));

        group
          .append("text")
          .attr("class", "node-label")
          .attr("y", (d) => d.radius + 18)
          .text((d) => d.name);

        return group;
      });

    node.append("title").text((d) => d.name);
    applyState();
    setTimeout(fitToView, 250);
  }

  function ticked() {
    linkLayer
      .selectAll("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodeLayer.selectAll(".person-node").attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  function applyState() {
    const visibleIds = visibleNodeIds();
    const connectedIds = connectedNodeIds(selectedId);

    nodeLayer.selectAll(".person-node").each(function (d) {
      const matched = !searchTerm || d.name.toLowerCase().includes(searchTerm);
      const visible = visibleIds.has(d.id);
      const connected = connectedIds.has(d.id);
      d3.select(this)
        .classed("is-selected", d.id === selectedId)
        .classed("is-match", Boolean(searchTerm && matched))
        .classed("is-dimmed", !visible || !connected)
        .attr("aria-hidden", visible ? "false" : "true");
    });

    linkLayer.selectAll("line").each(function (d) {
      const sourceId = typeof d.source === "object" ? d.source.id : d.source;
      const targetId = typeof d.target === "object" ? d.target.id : d.target;
      const visible = visibleIds.has(sourceId) && visibleIds.has(targetId);
      const connected = connectedIds.has(sourceId) && connectedIds.has(targetId);
      d3.select(this).classed("is-dimmed", !visible || !connected);
    });

    updateStats(visibleIds);
  }

  function updateSelection(id) {
    selectedId = id;
    const member = nodeById.get(id);
    const parents = parentNames(member);
    const children = (childrenByParent.get(id) || []).map((childId) => memberById.get(childId).name);
    const partners = partnerLinks
      .filter((link) => link.source.id === id || link.source === id || link.target.id === id || link.target === id)
      .map((link) => {
        const partnerId = (link.source.id ?? link.source) === id ? link.target.id ?? link.target : link.source.id ?? link.source;
        return memberById.get(partnerId).name;
      });

    details.innerHTML = `
      <p class="eyebrow">Selected Person</p>
      <h2>${member.name}</h2>
      <dl>
        <div><dt>Family</dt><dd>${member.family || "Unknown"}</dd></div>
        <div><dt>Generation</dt><dd>${member.generation + 1}</dd></div>
        <div><dt>Born</dt><dd>${formatDate(member.birthDate) || "Not listed"}</dd></div>
        <div><dt>Died</dt><dd>${formatDate(member.deathDate) || "Not listed"}</dd></div>
        <div><dt>Married</dt><dd>${formatDate(member.marriageDate) || "Not listed"}</dd></div>
        <div><dt>Parents</dt><dd>${parents.length ? parents.join(" and ") : "Not listed"}</dd></div>
        <div><dt>Partner link</dt><dd>${partners.length ? partners.join(", ") : "Not listed"}</dd></div>
        <div><dt>Children</dt><dd>${children.length ? children.join(", ") : "None listed"}</dd></div>
      </dl>
    `;

    applyState();
    centerNode(member);
  }

  function updateStats(visibleIds) {
    const generations = new Set(nodes.filter((node) => visibleIds.has(node.id)).map((node) => node.generation));
    stats.innerHTML = `
      <span><strong>${visibleIds.size}</strong> people</span>
      <span><strong>${partnerLinks.length}</strong> partner links</span>
      <span><strong>${generations.size}</strong> generations shown</span>
    `;
  }

  function visibleNodeIds() {
    return new Set(
      nodes
        .filter((node) => activeGeneration === "all" || String(node.generation) === activeGeneration)
        .filter((node) => !searchTerm || node.name.toLowerCase().includes(searchTerm))
        .map((node) => node.id)
    );
  }

  function connectedNodeIds(id) {
    const ids = new Set([id]);
    const member = memberById.get(id);
    if (!member) return ids;

    [member.parent1Id, member.parent2Id].forEach((parentId) => {
      if (parentId !== null && parentId !== undefined) ids.add(parentId);
    });

    (childrenByParent.get(id) || []).forEach((childId) => ids.add(childId));

    partnerLinks.forEach((link) => {
      const sourceId = link.source.id ?? link.source;
      const targetId = link.target.id ?? link.target;
      if (sourceId === id) ids.add(targetId);
      if (targetId === id) ids.add(sourceId);
    });

    return ids;
  }

  function centerNode(member) {
    const node = nodes.find((item) => item.id === member.id);
    if (!node || Number.isNaN(node.x) || Number.isNaN(node.y)) return;
    const scale = d3.zoomTransform(svg.node()).k || 1;
    const transform = d3.zoomIdentity
      .translate(width() / 2 - node.x * scale, height() / 2 - node.y * scale)
      .scale(scale);
    svg.transition().duration(550).call(zoom.transform, transform);
  }

  function fitToView() {
    const bounds = viewport.node().getBBox();
    if (!bounds.width || !bounds.height) return;

    const fullWidth = width();
    const fullHeight = height();
    const scale = Math.min(1.25, 0.88 / Math.max(bounds.width / fullWidth, bounds.height / fullHeight));
    const translate = [
      fullWidth / 2 - scale * (bounds.x + bounds.width / 2),
      fullHeight / 2 - scale * (bounds.y + bounds.height / 2)
    ];

    svg
      .transition()
      .duration(650)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  function resize() {
    svg.attr("viewBox", `0 0 ${width()} ${height()}`);
    simulation
      .force("x", d3.forceX((d) => width() / 2 + familyOffset(d)).strength(0.065))
      .force("y", d3.forceY((d) => 120 + d.generation * 178).strength(0.22))
      .alpha(0.32)
      .restart();
  }

  function generationFor(member, seen = new Set()) {
    if (seen.has(member.id)) return 0;
    seen.add(member.id);
    const parentIds = [member.parent1Id, member.parent2Id].filter((id) => id !== null && id !== undefined);
    if (!parentIds.length) {
      const partner = member.partnerId !== null && member.partnerId !== undefined ? memberById.get(member.partnerId) : null;
      const partnerParents = partner
        ? [partner.parent1Id, partner.parent2Id].filter((id) => id !== null && id !== undefined)
        : [];
      if (partnerParents.length) return generationFor(partner, seen);
      return 0;
    }
    return 1 + Math.max(...parentIds.map((id) => generationFor(memberById.get(id), seen)));
  }

  function parentNames(member) {
    return [member.parent1Id, member.parent2Id]
      .filter((id) => id !== null && id !== undefined)
      .map((id) => memberById.get(id)?.name)
      .filter(Boolean);
  }

  function addPartnerPair(sourceId, targetId, childId) {
    if (sourceId === null || sourceId === undefined || targetId === null || targetId === undefined) return;
    if (!memberById.has(sourceId) || !memberById.has(targetId) || sourceId === targetId) return;

    const pairId = [sourceId, targetId].sort((a, b) => a - b).join("-");
    if (!partnerPairs.has(pairId)) {
      partnerPairs.set(pairId, {
        source: sourceId,
        target: targetId,
        children: []
      });
    }
    if (childId !== null && childId !== undefined && !partnerPairs.get(pairId).children.includes(childId)) {
      partnerPairs.get(pairId).children.push(childId);
    }
  }

  function formatDate(value) {
    if (!value) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [year, month, day] = value.split("-");
    return `${Number(month)}/${Number(day)}/${year}`;
  }

  function familyOffset(member) {
    if (member.family === "Bennett") return -120;
    if (member.family === "Reynolds") return 120;
    return 0;
  }

  function genderClass(gender) {
    if (gender === "F") return "avatar-female";
    if (gender === "M") return "avatar-male";
    return "avatar-neutral";
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.25).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = event.x;
    d.fy = event.y;
  }
})();
