-- Apply after 20260805_business_profiles.sql. This preserves the approved
-- Keyframe profile while removing only the original demo directory records.
DELETE FROM businesses
WHERE slug IN (
  'lumina-ai', 'chordpay', 'biosettle', 'forge-robotics',
  'streamflow', 'greenfleet', 'medbridge-ai', 'paynova'
);

INSERT INTO businesses (
  slug, name, pitch, stage, location, category, tags, website_url,
  contact_name, contact_email, published, status, journey, challenges,
  challenge_solution
)
VALUES (
  'keyframe',
  'Keyframe',
  'Keyframe helps brands and creators turn ideas into launch-ready AI films—faster and more affordably than traditional video production, without compromising creative quality.',
  'Series A',
  'Mountain View, CA',
  'AI',
  ARRAY['Generative AI', 'AI Video', 'Filmmaking', 'Advertising', 'Content Creation'],
  'https://www.keyframe.art/',
  'digvijay',
  'digvijay@keyframe.ai',
  true,
  'published',
  $copy$Keyframe emerged from a clear problem: producing high-quality brand video is traditionally expensive, slow and difficult to scale. Existing AI-video workflows also require creators to move between several tools, spend money experimenting with unusable generations and manually assemble the final output.

The founders began developing a simpler, production-focused workflow that combines AI generation with human creative direction. Their objective is not merely to generate isolated clips, but to make professional filmmaking accessible to smaller brands and creators without traditional production budgets.$copy$,
  $copy$Traditional video agencies require significant budgets and long timelines.
AI-video creators often need five or more disconnected tools.
Maintaining visual quality, creative consistency and storytelling across shots is difficult.
AI-generated footage frequently requires expensive experimentation and manual correction.
Brands need more content across launches, advertisements and social media than traditional production can support.$copy$,
  $copy$Keyframe combines creative professionals with structured AI-production workflows instead of relying on a single prompt. It offers an assisted agency service alongside an application and API, allowing customers to select the level of creative and technical involvement they need.

According to its website, one customer reported receiving a film within three days at substantially lower cost than traditional agency quotations. Treat performance claims as customer testimonials, not independently verified metrics.$copy$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  pitch = EXCLUDED.pitch,
  stage = EXCLUDED.stage,
  location = EXCLUDED.location,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  website_url = EXCLUDED.website_url,
  contact_name = EXCLUDED.contact_name,
  contact_email = EXCLUDED.contact_email,
  published = EXCLUDED.published,
  status = EXCLUDED.status,
  journey = EXCLUDED.journey,
  challenges = EXCLUDED.challenges,
  challenge_solution = EXCLUDED.challenge_solution,
  updated_at = now();

DELETE FROM business_founders
WHERE business_id = (SELECT id FROM businesses WHERE slug = 'keyframe')
  AND name IN ('Digvijay Goswami', 'Sidharth Raja');

INSERT INTO business_founders (business_id, name, role, linkedin_url, journey, display_order)
SELECT id, 'Digvijay Goswami', 'Co-founder', 'https://www.linkedin.com/in/digvijaygoswami/',
  $copy$Digvijay leads Keyframe’s business, customer and creative vision. His background combines economics, business development and community leadership. His work on Keyframe is driven by the belief that professional filmmaking should become as accessible as writing—allowing brands and creators to translate ideas into finished films without traditional production constraints.$copy$,
  0
FROM businesses WHERE slug = 'keyframe';

INSERT INTO business_founders (business_id, name, role, journey, display_order)
SELECT id, 'Sidharth Raja', 'Co-founder',
  $copy$Sidharth leads Keyframe’s technology and product development. Before Keyframe, he worked at Google, where he helped develop early versions of Gemini Live and speech infrastructure used across Android products. Earlier, he was a founding engineer for Uber Lite, which reached more than ten million installations. He brings experience building large-scale AI, speech and consumer-product systems.$copy$,
  1
FROM businesses WHERE slug = 'keyframe';
