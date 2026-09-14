function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="d-flex justify-content-between align-items-end gap-3 mb-4 flex-wrap">
      <div>
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="section-title mb-0">{title}</h2>
        {subtitle ? <p className="text-muted mt-2 mb-0">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
