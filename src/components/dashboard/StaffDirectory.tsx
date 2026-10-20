'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Plus, Search, UserMinus, X } from 'lucide-react';
import type { Staff } from '@/types';
import { formatShortDate } from '@/lib/date';

interface Props {
  initialStaff: Staff[];
  departments: string[];
  locations: string[];
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  department: 'Academics',
  role: '',
  location: '',
  joinedAt: new Date().toISOString().slice(0, 10),
};

export default function StaffDirectory({ initialStaff, departments, locations }: Props) {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.staffCode.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());
      return (
        matchesSearch &&
        (!department || member.department === department) &&
        (!status || member.status === status) &&
        (!location || member.location === location)
      );
    });
  }, [staff, search, department, status, location]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => {
    setForm({ ...emptyForm, location: locations[0] ?? '' });
    setEditing(null);
    setModal('add');
  };

  const openEdit = (member: Staff) => {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      department: member.department,
      role: member.role,
      location: member.location,
      joinedAt: member.joinedAt,
    });
    setEditing(member);
    setModal('edit');
  };

  const submit = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      if (modal === 'add') {
        const response = await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const payload = (await response.json()) as { staff?: Staff; error?: string };
        if (!response.ok || !payload.staff) {
          setFeedback({ kind: 'error', text: payload.error ?? 'Could not add the staff member.' });
          return;
        }
        setStaff((current2) => [payload.staff as Staff, ...current2]);
        setFeedback({ kind: 'success', text: `${payload.staff.name} added to the directory.` });
      } else if (editing) {
        const response = await fetch(`/api/staff/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const payload = (await response.json()) as { staff?: Staff; error?: string };
        if (!response.ok || !payload.staff) {
          setFeedback({ kind: 'error', text: payload.error ?? 'Could not update the staff member.' });
          return;
        }
        setStaff((current2) => current2.map((member) => (member.id === payload.staff?.id ? (payload.staff as Staff) : member)));
        setFeedback({ kind: 'success', text: 'Staff details updated.' });
      }
      setModal(null);
    } catch {
      setFeedback({ kind: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (member: Staff) => {
    const nextStatus = member.status === 'active' ? 'inactive' : 'active';
    setBusy(true);
    try {
      const response = await fetch(`/api/staff/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        setStaff((current2) =>
          current2.map((entry) => (entry.id === member.id ? { ...entry, status: nextStatus } : entry)),
        );
        setFeedback({
          kind: 'success',
          text: `${member.name} is now ${nextStatus === 'active' ? 'active' : 'deactivated'}.`,
        });
      } else {
        setFeedback({ kind: 'error', text: 'Could not change the account status.' });
      }
    } catch {
      setFeedback({ kind: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Staff directory</h1>
          <p>{staff.length} people enrolled. {staff.filter((member) => member.status === 'active').length} active.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} aria-hidden="true" /> Add New Staff
        </button>
      </div>

      {feedback ? (
        <p className={`notice notice-${feedback.kind}`} role="status" style={{ marginBottom: 14 }}>
          {feedback.text}
        </p>
      ) : null}

      <section className="card">
        <div className="filters">
          <div className="search-input">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search name, staff code or email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              aria-label="Search staff"
            />
          </div>
          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by department"
          >
            <option value="">All departments</option>
            {departments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by location"
          >
            <option value="">All locations</option>
            {locations.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Staff member</th>
                <th scope="col">ID number</th>
                <th scope="col">Department</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
                <th scope="col">This month</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="cell-person">
                      <span className={`avatar-circle avatar-sm avatar-tone-${member.avatarTone}`}>
                        {member.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                      </span>
                      <span>
                        <strong>{member.name}</strong>
                        <small>{member.email}</small>
                      </span>
                    </div>
                  </td>
                  <td>{member.staffCode}</td>
                  <td>{member.department}</td>
                  <td>{member.role}</td>
                  <td>{formatShortDate(member.joinedAt)}</td>
                  <td>
                    <div className="row gap-8">
                      <strong>{member.attendanceRate}%</strong>
                      <span className={member.status === 'active' ? 'badge badge-present' : 'badge badge-leave'}>
                        {member.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link href={`/admin/staff/${member.id}`} className="icon-button" aria-label={`View ${member.name}`} title="View profile">
                        <Eye size={14} aria-hidden="true" />
                      </Link>
                      <button type="button" className="icon-button" aria-label={`Edit ${member.name}`} title="Edit" onClick={() => openEdit(member)}>
                        <Pencil size={14} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`${member.status === 'active' ? 'Deactivate' : 'Reactivate'} ${member.name}`}
                        title={member.status === 'active' ? 'Deactivate' : 'Reactivate'}
                        onClick={() => toggleStatus(member)}
                        disabled={busy}
                      >
                        <UserMinus size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!current.length ? <p className="empty-state">No staff match those filters.</p> : null}
        </div>

        <div className="row between wrap gap-12" style={{ marginTop: 16 }}>
          <p className="tiny">
            Showing {current.length} of {filtered.length} staff
          </p>
          <div className="row gap-8">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </button>
            <span className="chip">
              Page {page} of {pages}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page >= pages}
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={modal === 'add' ? 'Add new staff' : 'Edit staff'}>
          <div className="modal">
            <div className="modal-head">
              <div>
                <h2 className="heading-4">{modal === 'add' ? 'Add New Staff' : 'Edit staff details'}</h2>
                <p>Enrolment codes are generated automatically after saving.</p>
              </div>
              <button type="button" className="icon-button" aria-label="Close" onClick={() => setModal(null)}>
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="staff-name">Full name</label>
                <input id="staff-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="staff-email">Work email</label>
                <input id="staff-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="staff-phone">Phone</label>
                <input id="staff-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+2547..." />
              </div>
              <div className="field">
                <label htmlFor="staff-department">Department</label>
                <select id="staff-department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>
                  {departments.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="staff-role">Role</label>
                <input id="staff-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Teacher, HR Officer" required />
              </div>
              <div className="field">
                <label htmlFor="staff-location">Location</label>
                <select id="staff-location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })}>
                  {locations.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="staff-joined">Date joined</label>
                <input id="staff-joined" type="date" value={form.joinedAt} onChange={(event) => setForm({ ...form, joinedAt: event.target.value })} />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={submit} disabled={busy || !form.name || !form.email}>
                {busy ? 'Saving' : modal === 'add' ? 'Add staff member' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
