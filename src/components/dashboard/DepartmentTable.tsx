'use client';

import { motion } from 'framer-motion';

interface Row {
  id: string;
  name: string;
  head: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  rate: number;
}

export default function DepartmentTable({ rows }: { rows: Row[] }) {
  return (
    <motion.div
      className="table-wrap"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
    >
      <table className="data-table" aria-label="Department attendance breakdown">
        <thead>
          <tr>
            <th scope="col">Department</th>
            <th scope="col">Head</th>
            <th scope="col">Present</th>
            <th scope="col">Late</th>
            <th scope="col">Absent</th>
            <th scope="col">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <motion.tr
              key={row.id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.28 }}
            >
              <td>
                <strong>{row.name}</strong>
                <br />
                <span className="tiny">{row.total} enrolled</span>
              </td>
              <td>{row.head}</td>
              <td>
                <span className="badge badge-present">{row.present}</span>
              </td>
              <td>
                <span className="badge badge-late">{row.late}</span>
              </td>
              <td>
                <span className="badge badge-absent">{row.absent}</span>
              </td>
              <td>
                <div className="row gap-8">
                  <div
                    style={{
                      width: 74,
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--color-hairline)',
                      overflow: 'hidden',
                    }}
                    aria-hidden="true"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(row.rate, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'var(--color-success)' }}
                    />
                  </div>
                  <strong>{row.rate}%</strong>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
