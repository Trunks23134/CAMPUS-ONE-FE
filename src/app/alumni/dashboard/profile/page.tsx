'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

type ContactInfo = {
  email: string;
  contactNumber: string;
  mailingAddress: string;
};

const initialContactInfo: ContactInfo = {
  email: 'jertznaval57@gmail.com',
  contactNumber: '09171234567',
  mailingAddress: 'Street, Barangay, City, Province',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-[16px] font-medium text-slate-950">{children}</span>;
}

function StaticValue({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-6 text-[#58739b]">{children}</p>;
}

function ContactInput({
  label,
  value,
  onChange,
  type = 'text',
  readOnly,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  readOnly: boolean;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      {multiline ? (
        <textarea
          className="min-h-[84px] w-full rounded-[12px] border border-[#dbe3f1] bg-white px-4 py-3 text-[15px] text-slate-700 outline-none transition focus:border-[#6c8ef7]"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          aria-readonly={readOnly}
          rows={3}
        />
      ) : (
        <input
          className="h-11 w-full rounded-[12px] border border-[#dbe3f1] bg-white px-4 text-[15px] text-slate-700 outline-none transition focus:border-[#6c8ef7]"
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          aria-readonly={readOnly}
        />
      )}
    </label>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [contactDraft, setContactDraft] = useState<ContactInfo>(initialContactInfo);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const profileName = user?.name ?? 'John Doe';
  const nameParts = profileName.trim().split(/\s+/);
  const profileDetails = {
    lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Doe',
    firstName: nameParts[0] || 'John',
    middleInitial: 'M',
    suffix: 'Jr.',
    birthdate: 'January 15, 1998',
    academicUnit: 'School of Engineering',
    collegeDepartment: 'Computer Science',
    yearGraduated: '2020',
  };

  const handleContactAction = () => {
    setIsEditingContact((current) => !current);
  };

  const handleCancelEdit = () => {
    setContactDraft(initialContactInfo);
    setIsEditingContact(false);
  };

  return (
    <section className="mx-auto w-full max-w-[1450px] px-4 py-4 sm:px-6 sm:py-6" aria-label="Profile settings">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <article className="rounded-[22px] border border-[#e8edf6] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-7 sm:py-7" aria-label="User information">
          <header>
            <h2 className="text-[27px] font-extrabold tracking-[-0.04em] text-slate-950">Personal Info</h2>
            <p className="mt-3 text-[15px] leading-6 text-[#58739b]">Review your profile details and update your contact information when needed.</p>
          </header>

          <div className="mt-6 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <FieldLabel>Last Name</FieldLabel>
                <StaticValue>{profileDetails.lastName}</StaticValue>
              </div>
              <div>
                <FieldLabel>First Name</FieldLabel>
                <StaticValue>{profileDetails.firstName}</StaticValue>
              </div>
              <div>
                <FieldLabel>Middle Initial</FieldLabel>
                <StaticValue>{profileDetails.middleInitial}</StaticValue>
              </div>
              <div>
                <FieldLabel>Suffix</FieldLabel>
                <StaticValue>{profileDetails.suffix}</StaticValue>
              </div>
            </div>

            <div>
              <FieldLabel>Birthdate</FieldLabel>
              <StaticValue>{profileDetails.birthdate}</StaticValue>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <FieldLabel>Academic Unit</FieldLabel>
                <StaticValue>{profileDetails.academicUnit}</StaticValue>
              </div>
              <div>
                <FieldLabel>College Department</FieldLabel>
                <StaticValue>{profileDetails.collegeDepartment}</StaticValue>
              </div>
              <div>
                <FieldLabel>Year Graduated</FieldLabel>
                <StaticValue>{profileDetails.yearGraduated}</StaticValue>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[22px] border border-[#e8edf6] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-7 sm:py-7" aria-label="Editable contact information">
          <header>
            <h2 className="text-[27px] font-extrabold tracking-[-0.04em] text-slate-950">Contact Details</h2>
            <p className="mt-3 text-[15px] leading-6 text-[#58739b]">Only these fields can be edited.</p>
          </header>

          <div className="mt-6 space-y-5">
            <ContactInput
              label="Email Address"
              type="email"
              value={contactDraft.email}
              onChange={(value) => setContactDraft((current) => ({ ...current, email: value }))}
              readOnly={!isEditingContact}
            />

            <ContactInput
              label="Contact Number"
              type="tel"
              value={contactDraft.contactNumber}
              onChange={(value) => setContactDraft((current) => ({ ...current, contactNumber: value }))}
              readOnly={!isEditingContact}
            />

            <ContactInput
              label="Mailing Address"
              value={contactDraft.mailingAddress}
              onChange={(value) => setContactDraft((current) => ({ ...current, mailingAddress: value }))}
              readOnly={!isEditingContact}
              multiline
            />

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                className="inline-flex h-11 items-center rounded-full bg-[#4e79ff] px-5 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(78,121,255,0.22)] transition hover:bg-[#3f6df5]"
                type="button"
                onClick={handleContactAction}
              >
                {isEditingContact ? 'Save Changes' : 'Update Information'}
              </button>

              {isEditingContact ? (
                <button
                  className="h-11 rounded-full border border-[#dbe3f1] px-5 text-[15px] font-semibold text-[#58739b] transition hover:bg-slate-50"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
