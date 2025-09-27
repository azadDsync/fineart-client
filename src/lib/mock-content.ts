// Temporary mock content for Events & Announcements.
// Replace with API integration (REST/GraphQL) later.

export interface EventItem {
  id: string;
  title: string;
  date: string; // e.g. '2025-09-28'
  shortDate: string; // e.g. 'Sep 28'
  description: string;
  location: string;
  category: string; // Workshop, Exhibition, Critique, Community, etc.
  time?: string; // optional time window
}

export interface AnnouncementItem {
  id: string;
  title: string;
  summary: string;
  category: string; // Call, Opportunity, Program, Facilities, Community
  date: string; // ISO
  shortDate: string; // For badges
  pinned?: boolean;
}

export const eventsData: EventItem[] = [
  {
    id: 'e1',
    title: 'Figure Study Workshop',
    date: '2025-09-28',
    shortDate: 'Sep 28',
    description: 'Hands-on session focusing on gesture & proportion with live model guidance.',
    location: 'Studio A',
    category: 'Workshop',
    time: '10:00 – 13:00'
  },
  {
    id: 'e2',
    title: 'Ink & Wash Techniques',
    date: '2025-10-02',
    shortDate: 'Oct 02',
    description: 'Explore tonal layering and atmosphere using minimal palettes.',
    location: 'Room 3',
    category: 'Technique Lab',
    time: '15:00 – 17:00'
  },
  {
    id: 'e3',
    title: 'Urban Sketch Walk',
    date: '2025-10-06',
    shortDate: 'Oct 06',
    description: 'On-location sketching to capture spontaneous scenes and light.',
    location: 'Old Town',
    category: 'Community',
    time: '09:30 – 11:00'
  },
  {
    id: 'e4',
    title: 'Portfolio Review Night',
    date: '2025-10-11',
    shortDate: 'Oct 11',
    description: 'Peer + mentor critique focusing on narrative cohesion and presentation.',
    location: 'Gallery Hall',
    category: 'Critique',
    time: '18:00 – 20:30'
  },
  {
    id: 'e5',
    title: 'Mixed Media Collage Lab',
    date: '2025-10-15',
    shortDate: 'Oct 15',
    description: 'Experiment with texture integration across paper, fabric & found material.',
    location: 'Workshop Loft',
    category: 'Workshop',
    time: '14:00 – 16:30'
  }
];

export const announcementsData: AnnouncementItem[] = [
  {
    id: 'a1',
    title: 'Submissions Open: Autumn Showcase',
    summary: 'Submit up to 3 pieces exploring transition, decay, or renewal themes.',
    category: 'Call',
    date: '2025-09-19',
    shortDate: 'Sep 19',
    pinned: true
  },
  {
    id: 'a2',
    title: 'New Residency Partnership',
    summary: 'We’ve partnered with Atelier Nord for a month-long winter residency.',
    category: 'Opportunity',
    date: '2025-09-18',
    shortDate: 'Sep 18'
  },
  {
    id: 'a3',
    title: 'Mentor Slot Signups',
    summary: 'One-on-one critique sessions now available with visiting illustrators.',
    category: 'Program',
    date: '2025-09-17',
    shortDate: 'Sep 17'
  },
  {
    id: 'a4',
    title: 'Print Lab Upgrades',
    summary: 'Enhanced archival pigment printer + textured paper stocks added.',
    category: 'Facilities',
    date: '2025-09-14',
    shortDate: 'Sep 14'
  },
  {
    id: 'a5',
    title: 'Volunteer Docent Crew',
    summary: 'Help host the upcoming public open studios & earn exhibition credits.',
    category: 'Community',
    date: '2025-09-13',
    shortDate: 'Sep 13'
  }
];

export const eventCategories = Array.from(new Set(eventsData.map(e => e.category)));
export const announcementCategories = Array.from(new Set(announcementsData.map(a => a.category)));

// Alumni ------------------------------------------------------------
export interface AlumniProfile {
  id: string;
  name: string;
  discipline: string; // Illustration, Sculpture, Concept Art, Fashion, etc.
  gradYear: number;
  location: string;
  avatarUrl?: string;
  focusTags: string[]; // e.g. ["figurative", "ink", "surreal"]
  bio: string;
  highlight?: string; // short notable achievement
  website?: string;
  socials?: { platform: string; url: string }[];
}

export const alumniData: AlumniProfile[] = [
  {
    id: 'al1',
    name: 'Sofia Liang',
    discipline: 'Illustration',
    gradYear: 2022,
    location: 'Toronto, CA',
    focusTags: ['ink', 'narrative', 'mythology'],
    bio: 'Creates atmospheric ink sequences exploring fragmented cultural memory and dream logic.',
    highlight: 'Shortlisted for Northern Narrative Award 2025',
    website: 'https://example.com/sofia'
  },
  {
    id: 'al2',
    name: 'Marco Reyes',
    discipline: 'Sculpture',
    gradYear: 2021,
    location: 'Barcelona, ES',
    focusTags: ['found objects', 'assemblage', 'eco'],
    bio: 'Transforms industrial scrap into modular ecological forms exploring regeneration.',
    highlight: 'Residency: Atelier Nord Winter 2025'
  },
  {
    id: 'al3',
    name: 'Amina Farouk',
    discipline: 'Concept Art',
    gradYear: 2023,
    location: 'Cairo, EG',
    focusTags: ['worldbuilding', 'digital matte', 'architecture'],
    bio: 'Worldbuilding artist focusing on speculative urban ecologies and light atmospherics.',
    highlight: 'Lead environment artist on indie title “Glass Atlas”'
  },
  {
    id: 'al4',
    name: 'Jonas Kuhl',
    discipline: 'Fashion Illustration',
    gradYear: 2020,
    location: 'Berlin, DE',
    focusTags: ['gesture', 'fabric dynamics', 'runway'],
    bio: 'Captures kinetic silhouettes and transient textile motion in mixed media overlays.',
    highlight: 'Printed in AvantForm Quarterly'
  },
  {
    id: 'al5',
    name: 'Priya Nair',
    discipline: 'Mixed Media',
    gradYear: 2019,
    location: 'Bangalore, IN',
    focusTags: ['collage', 'textile', 'memory'],
    bio: 'Layered collage & textile-based memory mapping referencing family oral histories.',
    highlight: 'Solo exhibit “Threaded Echoes”'
  }
];

export const alumniDisciplines = Array.from(new Set(alumniData.map(a => a.discipline))).sort();
export const alumniTags = Array.from(new Set(alumniData.flatMap(a => a.focusTags))).sort();
