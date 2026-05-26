-- Blog articles and reader comments
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Crime Dossier Editorial',
  cover_image_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE blog_post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX blog_posts_published_at_idx ON blog_posts(published_at DESC);
CREATE INDEX blog_post_comments_post_id_idx ON blog_post_comments(blog_post_id);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update blog_posts" ON blog_posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete blog_posts" ON blog_posts FOR DELETE USING (true);

CREATE POLICY "Public read blog_post_comments" ON blog_post_comments FOR SELECT USING (true);
CREATE POLICY "Public insert blog_post_comments" ON blog_post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update blog_post_comments" ON blog_post_comments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete blog_post_comments" ON blog_post_comments FOR DELETE USING (true);

INSERT INTO blog_posts (slug, title, excerpt, content, author_name, cover_image_url, published_at) VALUES
(
  'serial-killer-profiling-modern-investigations',
  'Serial Killer Profiling in Modern Investigations',
  'How behavioral analysis, crime-scene patterns, and digital footprints help investigators narrow suspects in serial homicide cases.',
  E'Behavioral profiling remains one of the most debated tools in serial homicide investigations. While not evidence on its own, patterns in victim selection, ritual, and escalation can guide detectives when DNA or witnesses are scarce.\n\nModern units combine classic FBI-style profiling with geographic profiling software and social-media timelines. A cluster of disappearances near transit hubs, for example, may suggest an offender who studies routes rather than choosing victims at random.\n\nInvestigators stress that profiles are hypotheses: they must be tested against alibis, forensic results, and surveillance. High-profile failures in the 1980s and 1990s led to stricter protocols, but when used carefully, profiling still helps prioritize leads in complex, multi-jurisdiction cases.',
  'Crime Dossier Editorial',
  'https://images.unsplash.com/photo-1551836022-d5d88e9d962e?w=1200&h=630&fit=crop&q=80',
  now() - interval '12 days'
),
(
  'cold-cases-reopened-dna-technology',
  'Cold Cases Reopened: How DNA Changed Justice',
  'From partial touch DNA to genealogy databases, new science has cracked decades-old murders, rapes, and abductions once thought unsolvable.',
  E'For families waiting decades, a single match in a national database can reopen a case overnight. Touch DNA—recovered from door handles, ligatures, or discarded clothing—has convicted offenders who believed time had erased their traces.\n\nGenealogy investigations, controversial but effective, combine public family trees with crime-scene profiles to identify distant relatives and work forward to a suspect. Courts increasingly weigh privacy challenges against the public interest in resolving violent crimes.\n\nDefense teams scrutinize contamination risks and statistical reporting. Still, the trend is clear: cold-case units are busier than ever, and many jurisdictions now fund dedicated review teams for homicides older than twenty years.',
  'Dr. Elena Marsh',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=630&fit=crop&q=80',
  now() - interval '8 days'
),
(
  'psychology-white-collar-crime-networks',
  'The Psychology of White-Collar Crime Networks',
  'Fraud rings, corruption schemes, and corporate conspiracies often rely on trust, loyalty, and rationalization—not impulse.',
  E'Unlike street crime driven by opportunity and desperation, many financial crimes are planned over months. Offenders frequently occupy respected roles: accountants, executives, or public officials. They justify actions as temporary fixes or victimless adjustments.\n\nNetwork analysis maps who introduced whom, which shell companies moved funds, and where pressure was applied to stay silent. Whistleblowers remain rare; fear of retaliation and loss of career bind participants.\n\nProsecutors increasingly charge enterprises under racketeering statutes, treating entire firms as criminal organizations when leadership orchestrates systemic fraud.',
  'Crime Dossier Editorial',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop&q=80',
  now() - interval '5 days'
),
(
  'unsolved-heists-still-haunt-investigators',
  'Famous Unsolved Heists That Still Haunt Investigators',
  'From museum thefts to armored-truck ambushes, some robberies vanish with the loot—and without a single conviction.',
  E'Great robberies share choreography: inside knowledge, precise timing, and escape routes planned months ahead. When arrests fail, theories multiply—insider accomplices, corrupt guards, or art works smuggled across borders within hours.\n\nStolen masterpieces rarely surface on the open market; they become currency in underground trades. Cash heists face the opposite problem: bills are traced, yet launderers adapt faster than regulations.\n\nInvestigators keep cases active through informants and periodic media appeals. Even a small mistake—DNA on a discarded glove, metadata on a burner phone—can collapse a perfect plan years later.',
  'Marcus Hale',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
  now() - interval '2 days'
);
