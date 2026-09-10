BEGIN;

UPDATE events
SET long_description = $copy$A Masterclass on Business Lifecycle Economics & Valuation Realities. The playbook that secures your Seed round can actively derail your Series C, later growth rounds, and eventual public-market readiness. Join StartupA2Z and investor Vivek Somani for a practical deep dive into how investor expectations evolve from TAM and narrative to unit economics, capital allocation, cash flow, Rule of 40, operating leverage, ROIC, and public-market valuation realities.$copy$,
    agenda = '[{"time":"5:00 PM","item":"Networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Masterclass with Vivek Somani"},{"time":"7:20 PM","item":"Closing remarks"},{"time":"7:30 PM","item":"Networking"}]'::jsonb,
    speakers = '[{"name":"Vivek Somani","role":"Investor and former customer-focused technology leader","bio":"Vivek brings an investor''s perspective to startup economics, capital efficiency, and valuation. He also shares practical investing education through OptionGig and hosts a Bay Area community for DIY investors.","imageUrl":"/speakers/vivek-somani-linkedin.jpg","linkedinUrl":"https://www.linkedin.com/in/meetviveksomani/","websiteUrl":"https://optiongig.com/","xUrl":"https://x.com/VivekChirps"},{"name":"Satish Govindappa","role":"Host, StartupA2Z"}]'::jsonb,
    image_url = '/event-covers/startupa2z-vivek-seed-to-series-c-luma-social-v2.png?v=20260909',
    updated_at = now()
WHERE slug = 'founders-pitch-mix-2026-09-15';

COMMIT;
