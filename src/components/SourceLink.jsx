export default function SourceLink({ s }) {
  return (
    <p className="mt-2 text-xs text-slate-500">
      Source: <a className="underline" href={s.sourceUrl} target="_blank" rel="noreferrer">{s.sourceName}</a>
      {" · "}{s.verificationStatus === "verified" && s.lastVerifiedAt ? `verified ${new Date(s.lastVerifiedAt).toLocaleDateString()}` : s.verificationStatus.replace("_", " ")}
    </p>
  );
}
