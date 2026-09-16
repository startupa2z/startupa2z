const base = "/static/images/events/2026-09-15";

export const september15Gallery = {
  slug: "founders-pitch-mix-2026-09-15",
  number: "04",
  title: "What Raises Your Seed Round Will Sink Your Series C",
  shortTitle: "Seed to Series C Masterclass",
  date: "September 15, 2026",
  isoDate: "2026-09-15",
  month: "SEP",
  day: "15",
  year: "2026",
  venue: "Hacker Dojo",
  city: "Mountain View, California",
  recapPath: "/events/founders-pitch-mix-2026-09-15",
  galleryPath: "/gallery/founders-pitch-mix-2026-09-15",
  hasRecap: true,
  description: "Scenes from StartupA2Z’s September 15 masterclass with Vivek Somani: founders gathered at Hacker Dojo to explore business lifecycle economics, fundraising expectations, and valuation realities.",
  photos: [
    "The September 15 masterclass speaker presenting beside an introductory slide at Hacker Dojo",
    "A wide view of founders listening to the September 15 masterclass at Hacker Dojo",
    "Attendees facing the stage during StartupA2Z’s Seed to Series C masterclass",
    "The StartupA2Z audience seated beside Hacker Dojo’s mural during the September 15 session",
  ].map((alt, index) => ({
    id: index + 1,
    src: `${base}/event-04-${String(index + 1).padStart(2, "0")}-v1.jpg`,
    thumbnail: `${base}/event-04-${String(index + 1).padStart(2, "0")}-v1-thumb.jpg`,
    alt,
  })),
};
