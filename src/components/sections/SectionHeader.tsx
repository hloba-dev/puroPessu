interface Props {
  eyebrow?: string;
  title: string;
  lead?: string;
  center?: boolean;
  id?: string;
  as?: 'h1' | 'h2';
}

export function SectionHeader({eyebrow, title, lead, center, id, as: Tag = 'h2'}: Props) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag id={id} className={`h2 ${eyebrow ? 'mt-3' : ''}`}>
        {title}
      </Tag>
      {lead && <p className={`lead mt-4 ${center ? 'mx-auto' : ''}`}>{lead}</p>}
    </div>
  );
}
