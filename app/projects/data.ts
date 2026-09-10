export type Project = {
  title: string;
  category: "work" | "project" | "community";
  badge: string;
  desc: string;
  images: string[];
  href: string;
  video?: string;
  hideVideoPoster?: boolean;
  videoEffect?: "halftone" | "ascii";
  imageEffect?: "ascii";
  hideOnHome?: boolean;
  fullWidth?: boolean;
  shortMedia?: boolean;
  period?: string;
  overlayLogo?: string;
  overlayText?: string;
  brandLogos?: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
};

export const PROJECTS: Project[] = [
  {
    title: "Forus",
    category: "work",
    badge: "Internship",
    desc: "I joined Forus as engineer #26, working across browser agents, agent harnesses, and backend infrastructure to help patients get their medication faster. I was there as the company raised its Series B through Series C.",
    images: ["/forus.svg"],
    href: "https://forus.com/",
    video: "/projects/forus-prior-authorization.mp4",
    hideVideoPoster: true,
    overlayLogo: "/projects/forus-light.svg",
    fullWidth: true,
    shortMedia: true,
    period: "Summer 2026",
  },
  {
    title: "General Learning",
    category: "work",
    badge: "Internship",
    desc: "Over Fall 2025, I worked at General Learning as a software engineer. Built and shipped new features used by 600K+ students. Learnt a lot and worked with some of the coolest people.",
    images: ["/projects/revisiondojo.png"],
    href: "https://www.generallearning.com/",
    video: "/projects/revisiondojo-source.mp4",
    videoEffect: "halftone",
    overlayText: "General Learning",
    fullWidth: true,
    period: "Fall 2025",
  },
  {
    title: "Do-Eve",
    category: "project",
    badge: "Won HackPrinceton",
    desc: "Poke, but for computer use. Built an iMessage agent that can use your laptop for you. It opens apps, runs scripts, organizes files, and handles random tasks just by texting it.",
    images: ["/projects/doeve.png"],
    href: "https://devpost.com/software/do-eve",
  },
  {
    title: "Coach Bob",
    category: "project",
    badge: "Won Hack the North",
    desc: "Built Street Fighter, but IRL. An AR pose-based fighting game where you hit targets and get scored in real time. Used Gemini to provide audio feedback and help you train.",
    images: ["/projects/coachbob.jpg"],
    href: "https://devpost.com/software/coach-bob",
    video: "/projects/coachbob-film.mp4?v=3",
    videoEffect: "ascii",
  },
  {
    title: "TensorForest",
    category: "project",
    badge: "Project",
    desc: "Drones that find early forest fire risks. Used remote sensing, NDVI, and onboard ML to detect dangerous vegetation zones and generate orthomosaic risk maps before fires start. Worked with the Town of Oakville to test it.",
    images: ["/projects/tensorforest.jpg"],
    href: "https://tensorforest.com/",
    video: "/projects/tensorforest-film.mp4",
    videoEffect: "ascii",
    fullWidth: true,
    shortMedia: true,
  },
  {
    title: "Performative Purity Test",
    category: "project",
    badge: "300K+ Users",
    desc: "Shipped a performative purity test that mixed the summer's ‘performative’ trend with the Rice Purity Test. Accidentally went viral and trended on Twitter for two days.",
    images: ["/projects/performativepurity.png"],
    href: "https://performativepuritytest.com/",
    hideOnHome: true,
  },
  {
    title: "Teen Builders Club",
    category: "community",
    badge: "Community",
    desc: "Made the community I always wanted. Hosted weekly coworking and demo nights, and built a space for ambitious young people to meet each other and actually build.",
    images: ["/projects/teenbuildersclub.jpg"],
    href: "https://www.teenbuilders.club/",
  },
  {
    title: "Apocalypse Hacks",
    category: "community",
    badge: "Community",
    desc: "Started Canada’s largest high school hackathon with 150 attendees and 40+ projects shipped. Zombie apocalypse theme. Raised $50K from Shopify, DoorDash, and others. Handled outreach, operations, sponsorships, and everything in between.",
    images: ["/projects/apocalypse-hacks.jpg"],
    href: "https://apocalypse.hackclub.com/",
  },
  {
    title: "White Oaks Robotics",
    category: "community",
    badge: "2nd in Ontario",
    desc: "Started and scaled my school's robotics team to 100+ members. Built competitive robots, won the Excellence Award five times, and ranked in the top 62 of 2,400 teams worldwide. Handled design reviews, programming, scouting, and operations.",
    images: ["/projects/vex.jpg"],
    href: "https://wossrobotics.ca/",
  },
  {
    title: "UWaterloo.network",
    category: "project",
    badge: "Project",
    desc: "I built a webring for Waterloo friends :)",
    images: ["/projects/uwaterloonetwork.png"],
    href: "https://uwaterloo.network/",
  },
  {
    title: "Shoppywrapped",
    category: "project",
    badge: "Won Shopify Hackathon",
    desc: "Spotify Wrapped, but for your shopping. Built with Shopify's Shop Mini framework. Shows your top shops, spending, and order history in a clean Stories-style recap. Won the Shopify Toronto Tech Week Hackathon.",
    images: ["/projects/shoppy.png"],
    href: "https://github.com/ultratrikx/shoppy-wrapped/pulls",
    hideOnHome: true,
  },
  {
    title: "Vibetype",
    category: "project",
    badge: "Project",
    desc: "Built ‘Dia, but for Arc’ before Dia had sidebar tabs. An AI writing sidekick that lives in your browser. Highlight text to rewrite, expand, or clean it instantly. The sidebar reads your open tabs so it can help you draft much faster.",
    images: ["/projects/vibetype.png"],
    href: "https://www.gptfixtsfor.me/",
    hideOnHome: true,
  },
];
