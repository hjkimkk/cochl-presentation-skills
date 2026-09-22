// Machine-readable report → sync-report.json

export function buildJsonReport(component, design, code, result) {
  return {
    component,
    status: result.status,
    generatedAt: new Date().toISOString(),
    designSource: design.ref,
    codeSource: code.ref,
    designMeta: design.meta,
    codeVersion: code.meta.version,
    codeName: code.meta.codeName || component,
    summary: result.summary,
    differences: result.differences.map((d) => ({
      label: d.label,
      category: d.category,
      mode: d.mode,
      status: d.status,
      severity: d.severity,
      designKey: d.designKey,
      codeKey: d.codeKey,
      designValue: d.designValue ?? null,
      codeValue: d.codeValue ?? null,
      designSource: d.designSource,
      codeSource: d.codeSource,
      detail: d.detail ?? null,
      note: d.note ?? null,
      suggestedAction: d.suggestedAction,
    })),
  };
}
