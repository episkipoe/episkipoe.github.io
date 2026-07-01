(function () {
  const people = window.FAMILY_MEMBERS || [];
  const form = document.querySelector("#person-form");
  const output = document.querySelector("#entry-output");
  const status = document.querySelector("#status");
  const copyButton = document.querySelector("#copy-entry");
  const familyOptions = document.querySelector("#family-options");
  const parent1 = document.querySelector("#parent-1");
  const parent2 = document.querySelector("#parent-2");
  const partner = document.querySelector("#partner");

  const fields = {
    name: document.querySelector("#person-name"),
    family: document.querySelector("#family-name"),
    gender: document.querySelector("#gender"),
    birthDate: document.querySelector("#birth-date"),
    deathDate: document.querySelector("#death-date"),
    marriageDate: document.querySelector("#marriage-date")
  };

  hydrateOptions();
  output.value = buildEntry();

  form.addEventListener("input", () => {
    clearStatus();
    output.value = buildEntry();
  });

  form.addEventListener("change", () => {
    clearStatus();
    output.value = buildEntry();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = validationError();
    if (error) {
      setStatus(error, true);
      return;
    }
    output.value = buildEntry();
    setStatus("Entry generated.");
  });

  copyButton.addEventListener("click", async () => {
    const error = validationError();
    if (error) {
      setStatus(error, true);
      return;
    }
    output.value = buildEntry();
    try {
      await navigator.clipboard.writeText(output.value);
      setStatus("Entry copied.");
    } catch (error) {
      output.select();
      setStatus("Select the entry and copy it manually.", true);
    }
  });

  function hydrateOptions() {
    const families = [...new Set(people.map((person) => person.family).filter(Boolean))].sort();
    familyOptions.innerHTML = families.map((family) => `<option value="${escapeHtml(family)}"></option>`).join("");

    const personOptions = people
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id)
      .map((person) => `<option value="${person.id}">${escapeHtml(person.name)} (${person.id})</option>`)
      .join("");

    [parent1, parent2, partner].forEach((select) => {
      select.innerHTML = `<option value="">None</option>${personOptions}`;
    });
  }

  function buildEntry() {
    const entry = {
      id: nextId(),
      name: fields.name.value.trim(),
      gender: fields.gender.value,
      family: fields.family.value.trim(),
      birthDate: fields.birthDate.value.trim(),
      deathDate: fields.deathDate.value.trim(),
      marriageDate: fields.marriageDate.value.trim(),
      partnerId: numberOrNull(partner.value),
      parent1Id: numberOrNull(parent1.value),
      parent2Id: numberOrNull(parent2.value)
    };

    const lines = [
      "  {",
      `    id: ${entry.id},`,
      `    name: ${quote(entry.name)},`
    ];

    if (entry.gender) lines.push(`    gender: ${quote(entry.gender)},`);
    if (entry.family) lines.push(`    family: ${quote(entry.family)},`);
    if (entry.birthDate) lines.push(`    birthDate: ${quote(entry.birthDate)},`);
    if (entry.deathDate) lines.push(`    deathDate: ${quote(entry.deathDate)},`);
    if (entry.marriageDate) lines.push(`    marriageDate: ${quote(entry.marriageDate)},`);
    if (entry.partnerId !== null) lines.push(`    partnerId: ${entry.partnerId},`);
    lines.push(`    parent1Id: ${entry.parent1Id === null ? "null" : entry.parent1Id},`);
    lines.push(`    parent2Id: ${entry.parent2Id === null ? "null" : entry.parent2Id}`);
    lines.push("  }");
    return lines.join("\n");
  }

  function validationError() {
    if (!fields.name.value.trim()) return "Name is required.";
    if (!fields.family.value.trim()) return "Family is required.";
    if (parent1.value && parent1.value === parent2.value) return "Parent 1 and Parent 2 must be different people.";
    if ([parent1.value, parent2.value].includes(partner.value) && partner.value) return "Partner cannot also be a parent.";
    return "";
  }

  function nextId() {
    return Math.max(0, ...people.map((person) => person.id || 0)) + 1;
  }

  function numberOrNull(value) {
    return value ? Number(value) : null;
  }

  function quote(value) {
    return JSON.stringify(value || "");
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
  }

  function clearStatus() {
    status.textContent = "";
    status.classList.remove("error");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
