export type Project = {
  title: string;
  category: "work" | "project" | "community";
  desc: string | (string | { label: string; href: string })[];
  images: string[];
  href: string;
  video?: string;
  videoEffect?: "halftone" | "ascii";
  imageEffect?: "ascii";
  shortMedia?: boolean;
  period?: string;
  award?: string;
  featured?: boolean;
  overlayLogo?: string;
  overlayText?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Forus",
    category: "work",
    desc: "I joined Forus as engineer #26, working across browser agents, agent harnesses, and backend infrastructure to help patients get their medication faster. I was there as the company raised its Series B through Series C.",
    images: ["/forus.svg"],
    href: "https://forus.com/",
    video: "/projects/forus-prior-authorization.mp4",
    overlayLogo: "/projects/forus-light.svg",
    shortMedia: true,
    period: "2026",
    featured: true,
  },
  {
    title: "General Learning",
    category: "work",
    desc: "Over Fall 2025, I worked at General Learning as a software engineer. Built and shipped new features used by 600K+ students. Learnt a lot and worked with some of the coolest people.",
    images: ["/projects/revisiondojo.png"],
    href: "https://www.generallearning.com/",
    video: "/projects/revisiondojo-source.mp4",
    videoEffect: "halftone",
    overlayText: "General Learning",
    period: "2025",
    featured: true,
  },
  {
    title: "Do-Eve",
    category: "project",
    desc: "Poke, but for computer use. Built an iMessage agent that can use your laptop for you. It opens apps, runs scripts, organizes files, and handles random tasks just by texting it.",
    images: ["/projects/doeve.png"],
    href: "https://devpost.com/software/do-eve",
  },
  {
    title: "Coach Bob",
    category: "project",
    desc: "Built Street Fighter, but IRL. An AR pose-based fighting game where you hit targets and get scored in real time. Used Gemini to provide audio feedback and help you train.",
    images: ["/projects/coachbob.jpg"],
    href: "https://devpost.com/software/coach-bob",
    video: "/projects/coachbob-film.mp4",
    videoEffect: "ascii",
    award: "Hack The North Winner",
    featured: true,
  },
  {
    title: "TensorForest",
    category: "project",
    desc: "Drones that find early forest fire risks. Used remote sensing, NDVI, and onboard ML to detect dangerous vegetation zones and generate orthomosaic risk maps before fires start. Worked with the Town of Oakville to test it.",
    images: ["/projects/tensorforest.jpg"],
    href: "https://tensorforest.com/",
    video: "/projects/tensorforest-film.mp4",
    videoEffect: "ascii",
    shortMedia: true,
    featured: true,
  },
  {
    title: "Performative Purity Test",
    category: "project",
    desc: "Shipped a performative purity test that mixed the summer's ‘performative’ trend with the Rice Purity Test. Accidentally went viral and trended on Twitter for two days.",
    images: ["/projects/performativepurity.png"],
    href: "https://performativepuritytest.com/",
  },
  {
    title: "Teen Builders Club",
    category: "community",
    desc: "Made the community I always wanted. Hosted weekly coworking and demo nights, and built a space for ambitious young people to meet each other and actually build.",
    images: ["/projects/teenbuildersclub.jpg"],
    href: "https://www.teenbuilders.club/",
  },
  {
    title: "Apocalypse Hacks",
    category: "community",
    desc: "Started Canada’s largest high school hackathon with 150 attendees and 40+ projects shipped. Zombie apocalypse theme. Raised $50K from Shopify, DoorDash, and others. Handled outreach, operations, sponsorships, and everything in between.",
    images: ["/projects/apocalypse-hacks.jpg"],
    href: "https://apocalypse.hackclub.com/",
  },
  {
    title: "White Oaks Robotics",
    category: "community",
    desc: "Started and scaled my school's robotics team to 100+ members. Built competitive robots, won the Excellence Award five times, and ranked in the top 62 of 2,400 teams worldwide. Handled design reviews, programming, scouting, and operations.",
    images: ["/projects/vex.jpg"],
    href: "https://wossrobotics.ca/",
  },
  {
    title: "uwaterloo.network",
    category: "project",
    desc: [
      "Built a webring for Waterloo friends that inspired students at ",
      { label: "Cornell", href: "http://www.bigred.network/" },
      ", ",
      { label: "Guelph", href: "http://www.uguelph.network/" },
      ", and ",
      { label: "UT Austin", href: "http://www.utexas.network/" },
      " to create .network sites for their own schools. A friend at Columbia bought ",
      { label: "columbia.network", href: "http://www.columbia.network/" },
      " too.",
    ],
    images: ["/projects/uwaterloonetwork.png"],
    href: "https://uwaterloo.network/",
  },
  {
    title: "Shoppywrapped",
    category: "project",
    desc: "Spotify Wrapped, but for your shopping. Built with Shopify's Shop Mini framework. Shows your top shops, spending, and order history in a clean Stories-style recap. Won the Shopify Toronto Tech Week Hackathon.",
    images: ["/projects/shoppy.png"],
    href: "https://github.com/ultratrikx/shoppy-wrapped/pulls",
  },
  {
    title: "Vibetype",
    category: "project",
    desc: "Built ‘Dia, but for Arc’ before Dia had sidebar tabs. An AI writing sidekick that lives in your browser. Highlight text to rewrite, expand, or clean it instantly. The sidebar reads your open tabs so it can help you draft much faster.",
    images: ["/projects/vibetype.png"],
    href: "https://www.gptfixtsfor.me/",
  },
];
