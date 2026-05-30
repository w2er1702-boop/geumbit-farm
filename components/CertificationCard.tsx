import type { Locale } from '@/i18n';

export type Certification = {
  id: string;
  name: Record<Locale, string>;
  issuer: Record<Locale, string>;
  certificateNo?: string;
  issuedAt: string;
  expiresAt?: string;
  image?: string;
  pdf?: string;
};

type Props = {
  entry: Certification;
  locale: Locale;
  newTabLabel: string;
};

export function CertificationCard({ entry, locale, newTabLabel }: Props) {
  const name = entry.name[locale];
  const issuer = entry.issuer[locale];

  return (
    <article className="double-border bg-[var(--color-parchment-2)] p-6 flex flex-col">
      <div className="aspect-[4/3] bg-[var(--color-parchment)] mb-4 flex items-center justify-center overflow-hidden border border-[var(--color-rule)]">
        {entry.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={entry.image}
            alt={name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span
            className="text-5xl text-[var(--color-gold)] opacity-30 font-bold"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
            aria-hidden="true"
          >
            認證
          </span>
        )}
      </div>

      <h3 className="display text-lg leading-snug">{name}</h3>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{issuer}</p>

      <dl className="mt-4 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs text-[var(--color-ink-muted)]">
        {entry.certificateNo && (
          <>
            <dt className="label-section opacity-70">NO.</dt>
            <dd className="mono">{entry.certificateNo}</dd>
          </>
        )}
        <dt className="label-section opacity-70">ISSUED</dt>
        <dd className="mono">{entry.issuedAt}</dd>
        {entry.expiresAt && (
          <>
            <dt className="label-section opacity-70">EXPIRES</dt>
            <dd className="mono">{entry.expiresAt}</dd>
          </>
        )}
      </dl>

      {entry.pdf && (
        <a
          href={entry.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block link-gold-underline label-section text-[var(--color-oxblood)] self-start"
        >
          PDF <span aria-hidden="true">↗</span>
          <span className="sr-only"> {newTabLabel}</span>
        </a>
      )}
    </article>
  );
}
