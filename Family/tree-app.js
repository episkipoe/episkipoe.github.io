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
  updateLayeredTargets();
  nodes.forEach((node) => {
    node.x = node.targetX;
    node.y = node.targetY;
  });

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
  let searchTimer = null;

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance((d) => (d.type === "partner" ? 72 : 132))
        .strength((d) => (d.type === "partner" ? 0.96 : 0.26))
    )
    .force("charge", d3.forceManyBody().strength(-360))
    .force("collision", d3.forceCollide().radius((d) => d.radius + 34).iterations(2))
    .force("x", d3.forceX((d) => d.targetX).strength(0.72))
    .force("y", d3.forceY((d) => d.targetY).strength(0.96))
    .on("tick", ticked);

  svg.call(zoom);
  hydrateControls();
  resize();
  render();
  updateSelection(selectedId, { center: false });
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
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(focusSearchMatch, 180);
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
      updateSelection(selectedId, { center: false });
      fitToView();
    });

    fitButton.addEventListener("click", fitToView);

    details.addEventListener("click", (event) => {
      const button = event.target.closest("[data-person-id]");
      if (!button) return;
      updateSelection(Number(button.dataset.personId));
    });
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
    const matchedIds = matchingNodeIds();
    const isSearching = searchTerm.length > 0;

    nodeLayer.selectAll(".person-node").each(function (d) {
      const matched = matchedIds.has(d.id);
      const visible = visibleIds.has(d.id);
      const connected = connectedIds.has(d.id);
      d3.select(this)
        .classed("is-selected", d.id === selectedId)
        .classed("is-match", Boolean(isSearching && matched))
        .classed("is-dimmed", isSearching ? !matched : !visible || !connected)
        .attr("aria-hidden", visible ? "false" : "true");
    });

    linkLayer.selectAll("line").each(function (d) {
      const sourceId = typeof d.source === "object" ? d.source.id : d.source;
      const targetId = typeof d.target === "object" ? d.target.id : d.target;
      const visible = visibleIds.has(sourceId) && visibleIds.has(targetId);
      const connected = connectedIds.has(sourceId) && connectedIds.has(targetId);
      const searchConnected = matchedIds.has(sourceId) || matchedIds.has(targetId);
      d3.select(this).classed("is-dimmed", isSearching ? !searchConnected : !visible || !connected);
    });

    updateStats(isSearching ? matchedIds : visibleIds);
  }

  function updateSelection(id, options = { center: true }) {
    selectedId = id;
    const member = nodeById.get(id);
    const parents = parentIds(member);
    const children = [...(childrenByParent.get(id) || [])].sort((a, b) => {
      return birthTime(memberById.get(a)) - birthTime(memberById.get(b));
    });
    const partners = partnerLinks
      .filter((link) => link.source.id === id || link.source === id || link.target.id === id || link.target === id)
      .map((link) => {
        const partnerId = (link.source.id ?? link.source) === id ? link.target.id ?? link.target : link.source.id ?? link.source;
        return partnerId;
      });

    details.innerHTML = `
      <p class="eyebrow">Selected Person</p>
      <h2>${escapeHtml(member.name)}</h2>
      <dl>
        <div><dt>Family</dt><dd>${escapeHtml(member.family || "Unknown")}</dd></div>
        <div><dt>Generation</dt><dd>${member.generation + 1}</dd></div>
        <div><dt>Born</dt><dd>${formatDate(member.birthDate) || "Not listed"}</dd></div>
        <div><dt>Died</dt><dd>${formatDate(member.deathDate) || "Not listed"}</dd></div>
        <div><dt>Married</dt><dd>${formatDate(member.marriageDate) || "Not listed"}</dd></div>
        <div><dt>Parents</dt><dd>${personLinks(parents, "Not listed")}</dd></div>
        <div><dt>Partner link</dt><dd>${personLinks(partners, "Not listed")}</dd></div>
        <div><dt>Children</dt><dd>${personLinks(children, "None listed")}</dd></div>
      </dl>
    `;

    applyState();
    if (options.center) centerNode(member, options.scale);
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

  function matchingNodeIds() {
    return new Set(
      nodes
        .filter((node) => !searchTerm || node.name.toLowerCase().includes(searchTerm))
        .map((node) => node.id)
    );
  }

  function focusSearchMatch() {
    if (!searchTerm) return;
    const match = nodes
      .filter((node) => node.name.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        return (
          Number(!aName.startsWith(searchTerm)) - Number(!bName.startsWith(searchTerm)) ||
          aName.localeCompare(bName)
        );
      })[0];

    if (match) updateSelection(match.id, { center: true, scale: 1.34 });
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

  function centerNode(member, scaleOverride) {
    const node = nodes.find((item) => item.id === member.id);
    if (!node || Number.isNaN(node.x) || Number.isNaN(node.y)) return;
    const scale = scaleOverride || Math.max(1.12, d3.zoomTransform(svg.node()).k || 1);
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
    updateLayeredTargets();
    simulation
      .force("x", d3.forceX((d) => d.targetX).strength(0.72))
      .force("y", d3.forceY((d) => d.targetY).strength(0.96))
      .alpha(0.32)
      .restart();
  }

  function updateLayeredTargets() {
    const generations = d3.group(nodes, (node) => node.generation);
    const maxGeneration = d3.max(nodes, (node) => node.generation) || 0;
    const rowGap = Math.max(148, Math.min(210, (height() - 190) / Math.max(1, maxGeneration)));
    const generationNumbers = [...generations.keys()].sort((a, b) => a - b);

    generationNumbers.forEach((generation) => {
      const generationNodes = generations.get(generation);
      const units = generation === 2
        ? thirdGenerationUnits(generationNodes)
        : displayUnitsForGeneration(generationNodes);
      placeUnits(units, generation, rowGap);
    });
  }

  function placeUnits(units, generation, rowGap) {
    const spacing = Math.max(122, Math.min(190, (width() - 180) / Math.max(1, units.length - 1 || 1)));
    const totalWidth = spacing * (units.length - 1);
    const startX = width() / 2 - totalWidth / 2;

    units.forEach((unit, index) => {
      const centerX = unit.targetX ?? startX + index * spacing;
      const y = 95 + generation * rowGap;

      if (unit.length === 1) {
        unit[0].targetX = centerX;
        unit[0].targetY = y;
        return;
      }

      unit[0].targetX = centerX - 40;
      unit[0].targetY = y;
      unit[1].targetX = centerX + 40;
      unit[1].targetY = y;
    });
  }

  function thirdGenerationUnits(generationNodes) {
    const units = displayUnitsForGeneration(generationNodes);
    const grouped = d3.group(units, parentKeyForUnit);
    const groups = [...grouped.entries()].map(([parentKey, parentUnits]) => {
      const parentCenter = parentCenterForKey(parentKey);
      const sortedUnits = parentUnits.sort(compareSiblingUnits);
      const siblingSpacing = Math.max(102, Math.min(138, 520 / Math.max(1, sortedUnits.length)));
      const totalWidth = siblingSpacing * (sortedUnits.length - 1);

      sortedUnits.forEach((unit, index) => {
        unit.targetX = parentCenter + index * siblingSpacing - totalWidth / 2;
      });

      return {
        key: parentKey,
        targetX: parentCenter,
        width: Math.max(132, totalWidth + 112),
        units: sortedUnits
      };
    });

    groups.sort((a, b) => a.targetX - b.targetX);

    let rightEdge = -Infinity;
    groups.forEach((group) => {
      const leftEdge = group.targetX - group.width / 2;
      if (leftEdge < rightEdge + 24) {
        const shift = rightEdge + 24 - leftEdge;
        group.targetX += shift;
        group.units.forEach((unit) => {
          unit.targetX += shift;
        });
      }
      rightEdge = group.targetX + group.width / 2;
    });

    const minX = d3.min(groups, (group) => group.targetX - group.width / 2) ?? 0;
    const maxX = d3.max(groups, (group) => group.targetX + group.width / 2) ?? width();
    const overflowLeft = Math.max(0, 80 - minX);
    const overflowRight = Math.max(0, maxX - (width() - 80));
    const finalShift = overflowLeft || -overflowRight;

    if (finalShift) {
      groups.forEach((group) => {
        group.units.forEach((unit) => {
          unit.targetX += finalShift;
        });
      });
    }

    return groups.flatMap((group) => group.units);
  }

  function displayUnitsForGeneration(generationNodes) {
    const remaining = new Set(generationNodes.map((node) => node.id));
    const units = [];
    const sorted = [...generationNodes].sort(compareTreeOrder);

    sorted.forEach((node) => {
      if (!remaining.has(node.id)) return;
      const partner = node.partnerId !== null && node.partnerId !== undefined ? nodeById.get(node.partnerId) : null;

      if (partner && partner.generation === node.generation && remaining.has(partner.id)) {
        const pair = [node, partner].sort(comparePartnerPair);
        units.push(pair);
        remaining.delete(pair[0].id);
        remaining.delete(pair[1].id);
        return;
      }

      units.push([node]);
      remaining.delete(node.id);
    });

    return units.sort(compareDisplayUnits);
  }

  function compareDisplayUnits(a, b) {
    return compareTreeOrder(a[0], b[0]);
  }

  function compareSiblingUnits(a, b) {
    const aAnchor = anchorNodeForUnit(a);
    const bAnchor = anchorNodeForUnit(b);
    return birthTime(aAnchor) - birthTime(bAnchor) || aAnchor.name.localeCompare(bAnchor.name);
  }

  function anchorNodeForUnit(unit) {
    return unit.find((node) => parentIds(node).length) || unit[0];
  }

  function parentKeyForUnit(unit) {
    const anchor = anchorNodeForUnit(unit);
    const parents = parentIds(anchor).sort((a, b) => a - b);
    return parents.length ? parents.join("-") : `self-${anchor.id}`;
  }

  function parentCenterForKey(parentKey) {
    const parentIds = parentKey
      .split("-")
      .map((id) => Number(id))
      .filter((id) => nodeById.has(id));

    if (!parentIds.length) return width() / 2;

    const parentXs = parentIds
      .map((id) => nodeById.get(id).targetX)
      .filter((x) => Number.isFinite(x));

    if (!parentXs.length) return width() / 2;
    return d3.mean(parentXs);
  }

  function comparePartnerPair(a, b) {
    return (
      Number(a.gender === "F") - Number(b.gender === "F") ||
      birthYear(a) - birthYear(b) ||
      a.name.localeCompare(b.name)
    );
  }

  function compareTreeOrder(a, b) {
    return (
      familyRank(a) - familyRank(b) ||
      parentSortKey(a).localeCompare(parentSortKey(b)) ||
      birthYear(a) - birthYear(b) ||
      a.name.localeCompare(b.name)
    );
  }

  function parentSortKey(member) {
    const parentIds = [member.parent1Id, member.parent2Id]
      .filter((id) => id !== null && id !== undefined)
      .sort((a, b) => a - b);
    if (parentIds.length) return parentIds.join("-");

    const partner = member.partnerId !== null && member.partnerId !== undefined ? memberById.get(member.partnerId) : null;
    if (!partner) return `self-${member.id}`;
    return [partner.parent1Id, partner.parent2Id]
      .filter((id) => id !== null && id !== undefined)
      .sort((a, b) => a - b)
      .join("-") || `partner-${partner.id}`;
  }

  function familyRank(member) {
    if (member.family === "Bennett") return 0;
    if (member.family === "Reynolds") return 1;
    return 2;
  }

  function birthYear(member) {
    const match = String(member.birthDate || "").match(/^(\d{4})/);
    return match ? Number(match[1]) : 9999;
  }

  function birthTime(member) {
    const value = String(member.birthDate || "");
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return birthYear(member) * 10000 + 9999;
    return Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
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

  function parentIds(member) {
    return [member.parent1Id, member.parent2Id]
      .filter((id) => id !== null && id !== undefined)
      .filter((id) => memberById.has(id));
  }

  function personLinks(ids, fallback) {
    if (!ids.length) return fallback;
    return `<div class="name-list">${ids.map(personButton).join("")}</div>`;
  }

  function personButton(id) {
    const person = memberById.get(id);
    if (!person) return "";
    return `<button class="person-link" type="button" data-person-id="${id}">${escapeHtml(person.name)}</button>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
