import { Card } from 'react-bootstrap';

function MiniStat({ label, value, trend, tone }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="text-muted small">{label}</div>
        <div className="d-flex align-items-end justify-content-between mt-2">
          <span className="fs-4 fw-bold">{value}</span>
          <span className={`badge bg-${tone}-subtle text-${tone}`}>{trend}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MiniStat;
