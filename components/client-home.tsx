"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import type { SubstackArticle } from "@/lib/substack"
import MDXRenderer from "@/components/mdx-renderer"
import ContentRenderer from "@/components/content-renderer"
import AboutRenderer from "@/components/about-renderer"
import ContentWorthConsumingRenderer from "@/components/content-worth-consuming-renderer"
import CommandPalette from "@/components/command-palette"
import KeyboardHint from "@/components/keyboard-hint"
import HeroBanner from "@/components/hero-banner"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, Code, BookOpen, Heart, Bookmark, Search } from "lucide-react"


interface ClientHomeProps {
  fieldnotes: SubstackArticle[]
  philosophy: any
  contentWorthConsuming: any
  about: any
}

export default function ClientHome({ fieldnotes, philosophy, contentWorthConsuming, about }: ClientHomeProps) {
  /* ────────────────────────────────
     section definitions
  ────────────────────────────────── */
  const sections = [
    "about",
    "projects",
    "fieldnotes",
    "inspirations",
    "content",
    "photos"
  ] as const

  type SectionKey = typeof sections[number]

  /* ────────────────────────────────
     state
  ────────────────────────────────── */
  const [activeSection, setActiveSection] = useState<SectionKey>("about")
  const [showTensorForest, setShowTensorForest] = useState(false)
  const [activeTensorForest, setActiveTensorForest] = useState(false)
  const [activeApocalypseHacks, setActiveApocalypseHacks] = useState(false)
  const [activePhotoTab, setActivePhotoTab] = useState<'polaroids' | 'digital' | 'film'>('polaroids')
  const [projectFilter, setProjectFilter] = useState<'Everything' | 'Projects' | 'Communities' | 'Internship'>('Everything')

  /* ────────────────────────────────
     helpers
  ────────────────────────────────── */
  const selectSection = (section: SectionKey) => {
    setActiveSection(section)
    // Always reset detail views when selecting a section
    // This ensures clicking "projects" from detail pages goes to main projects page
    setActiveTensorForest(false)
    setActiveApocalypseHacks(false)
    // Reset photo tab to default when switching sections
    setActivePhotoTab('polaroids')
  }

  const selectTensorForest = () => {
    setActiveSection("projects")
    setActiveTensorForest(true)
    setActiveApocalypseHacks(false)
  }

  const selectApocalypseHacks = () => {
    setActiveSection("projects")
    setActiveTensorForest(false)
    setActiveApocalypseHacks(true)
  }


  // Command palette handlers
  const handleCommandNavigation = (section: string) => {
    const sectionKey = section as SectionKey
    selectSection(sectionKey)
  }


  const handleCommandProject = (project: string) => {
    if (project === 'tensorforest') {
      selectTensorForest()
    } else if (project === 'apocalypse') {
      selectApocalypseHacks()
    }
  }


  /* ────────────────────────────────
     render
  ────────────────────────────────── */
    return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Dotted pattern background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--foreground) / 0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 w-full flex flex-col items-center">
      {/* ───────────── mobile top bar ───────────── */}
      <div className="md:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Trigger command palette by simulating Cmd+K
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true
              })
              document.dispatchEvent(event)
            }}
            className="h-8 w-8 p-0 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border" />
          <Button
            variant={activeSection === 'about' && !activeTensorForest && !activeApocalypseHacks ? "default" : "ghost"}
            size="sm"
            onClick={() => selectSection('about')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant={activeSection === 'projects' && !activeTensorForest && !activeApocalypseHacks ? "default" : "ghost"}
            size="sm"
            onClick={() => selectSection('projects')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant={activeSection === 'fieldnotes' ? "default" : "ghost"}
            size="sm"
            onClick={() => selectSection('fieldnotes')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            variant={activeSection === 'inspirations' && !activeTensorForest && !activeApocalypseHacks ? "default" : "ghost"}
            size="sm"
            onClick={() => selectSection('inspirations')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant={activeSection === 'content' && !activeTensorForest && !activeApocalypseHacks ? "default" : "ghost"}
            size="sm"
            onClick={() => selectSection('content')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant={activeSection === 'photos' && !activeTensorForest && !activeApocalypseHacks ? "default" : "ghost"}
            size="sm"
            onClick={() => selectSection('photos')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Button>
          <div className="w-px h-4 bg-border" />
          <ModeToggle />
        </div>
      </div>

      {/* desktop theme toggle and command palette hint */}
      <div className="hidden md:flex absolute top-4 right-4 items-center gap-3">
        <KeyboardHint />
        <ModeToggle />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-12">

        {/* ───────────── desktop sidebar ───────────── */}
        <nav className="hidden md:block md:text-right space-y-8 md:space-y-12 text-sm text-muted-foreground sticky top-12 self-start">
          {sections.map((section) => (
            <div key={section}>
              {/* Main section button */}
              <button
                onClick={() => selectSection(section)}
                className={cn(
                  "block w-full text-right transition-colors duration-200",
                  activeSection === section && !(section === "projects" && (activeTensorForest || activeApocalypseHacks)) 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground/70 hover:text-muted-foreground",
                )}
              >
                {section === "content" ? "content worth consuming" : section === "inspirations" ? "my philosophy" : section}
              </button>
              
              {/* Project sub-items */}
              {section === "projects" && activeSection === "projects" && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={selectTensorForest}
                    className={cn(
                      "block w-full text-right text-xs transition-colors duration-200 pl-4",
                      activeTensorForest ? "text-foreground font-medium" : "text-muted-foreground/60 hover:text-muted-foreground/80 font-light",
                    )}
                  >
                    tensorforest
                  </button>
                  <button
                    onClick={selectApocalypseHacks}
                    className={cn(
                      "block w-full text-right text-xs transition-colors duration-200 pl-4",
                      activeApocalypseHacks ? "text-foreground font-medium" : "text-muted-foreground/60 hover:text-muted-foreground/80 font-light",
                    )}
                  >
                    apocalypse hacks
                  </button>
                </div>
              )}
              
            </div>
          ))}
        </nav>

        {/* ───────────── main content ───────────── */}
        <div className="text-base leading-relaxed">
          {activeTensorForest ? renderTensorForestContent() : 
           activeApocalypseHacks ? renderApocalypseHacksContent() : 
           renderSectionContent(activeSection)}
          
          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              email me at{" "}
              <Link
                href="mailto:shayaan.azeem@uwaterloo.ca"
                className="footer-email"
              >
                shayaan.azeem@uwaterloo.ca
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        fieldnotes={fieldnotes}
        onNavigate={handleCommandNavigation}
        onSelectProject={handleCommandProject}
        currentSection={activeSection}
        currentPage="Home"
      />
      </div>
    </div>
  )


  /* ────────────────────────────────
     render tensorforest content
  ────────────────────────────────── */
  function renderTensorForestContent() {
    return (
      <div>
        {/* Hero Banner */}
        <HeroBanner
          title="TensorForest"
          subtitle="Autonomous drone system for wildfire prediction and prevention"
          date="2023-12-01"
          tags={["AI", "Drones", "Environmental Tech", "Machine Learning"]}
          backgroundImage="/tensorforest.png"
        />

        {/* The Problem */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">The Problem</h2>
          <p className="mb-6">
            Wildfires have become increasingly frequent and severe, devastating forest ecosystems and contributing significantly to greenhouse gas emissions. The UN Environment Programme (UNEP) predicts a global rise in extreme wildfires by 14% by 2030, 30% by 2050, and 50% by 2100. Climate change and wildfires form a dangerous feedback loop, worsening the damage and increasing the need for fire prevention.
          </p>
          
          <div className="my-6 flex justify-center">
            <div className="w-3/4">
              <img
                src="/tensorforest/tensorforestv1.png"
                alt="TensorForest V1"
                className="rounded-lg w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Our first prototype of TensorForest, designed to capture high-resolution forest data for wildfire risk assessment.
              </p>
            </div>
          </div>

          <h2 className="text-2xl mb-4">The Opportunity</h2>
          <p className="mb-6">
            Effective wildfire prevention requires accurate, up to date/real-time data. However, current solutions have big limitations:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>
              <span className="font-medium">Expensive drones</span>: High-end wildfire monitoring drones cost $25,000 or more, making them inaccessible to many organizations and communities.
            </li>
            <li>
              <span className="font-medium">Manual surveying</span>: Traditional forest monitoring methods are slow, labor-intensive, and costly.
            </li>
            <li>
              <span className="font-medium">Limited access</span>: Fire departments in wealthier nations have access to advanced technology, while vulnerable communities, such as farmers in Kenya, Indonesia, and Vietnam, lack affordable wildfire prevention tools.
            </li>
            <li>
              <span className="font-medium">Satellite imagery limitations</span>: Satellites do not provide high-resolution, up-to-date data necessary for proactive fire prevention.
            </li>
          </ul>
        </div>

        {/* How It Works */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">How It Works</h2>
          <p className="mb-6">
            TensorForest is an autonomous drone system designed to provide high-resolution forest monitoring and wildfire prediction. The process includes:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>
              <span className="font-medium">Selecting a target region</span> for assessment.
            </li>
            <li>
              <span className="font-medium">Generating a flight plan</span> to autonomously cover the area.
            </li>
            <li>
              <span className="font-medium">Capturing multiple high-resolution images and spatial data</span>.
            </li>
            <li>
              <span className="font-medium">Stitching images together using OpenCV</span> to create a detailed forest map.
            </li>
            <li>
              <span className="font-medium">Generating a Digital Elevation Model (DEM)</span> by processing spatial points.
            </li>
            <li>
              <span className="font-medium">Running the data through a vision transformer model</span>, integrating climate data such as temperature and precipitation.
            </li>
            <li>
              <span className="font-medium">Producing a wildfire risk heat map</span>, classifying vegetation and identifying high-risk areas/how fire is likely to spread based on detected forest fire lines.
            </li>
            <li>
              <span className="font-medium">Utilizing data for fire prevention planning</span>, helping determine optimal locations to cut fire lines and mitigate wildfire spread.
            </li>
          </ul>

          <div className="my-8">
            <img
              src="/tensorforest/tensorforest v3 .png"
              alt="TensorForest V3"
              className="rounded-lg w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              The latest version of TensorForest featuring improved hardware and AI capabilities for more accurate wildfire risk prediction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div>
              <img
                src="/tensorforest/vegatation map capture, stich1.png"
                alt="Vegetation Map Capture"
                className="rounded-lg w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                A stitched vegetation map created by TensorForest, showcasing our ability to create comprehensive forest visualizations from multiple drone captures.
              </p>
            </div>
            <div>
              <img
                src="/tensorforest/Normalized Difference Vegetation Index  capture for heat map.png"
                alt="NDVI Capture for Heat Map"
                className="rounded-lg w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                An NDVI capture used to generate heat maps, showing vegetation health and potential fire risk areas.
              </p>
            </div>
            <div>
              <img
                src="/tensorforest/gopro to capture Normalized Difference Vegetation Index.png"
                alt="GoPro NDVI Capture"
                className="rounded-lg w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Our modified GoPro setup used to capture NDVI data, providing crucial vegetation health information for risk assessment.
              </p>
            </div>
            <div>
              <img
                src="/tensorforest/campimod.png"
                alt="Pi Computer Module"
                className="rounded-lg w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                The Raspberry Pi computer module with Edge TPU that powers our onboard image processing and AI analysis capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Current Development & Funding Needs */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">Current Development & Funding Needs</h2>
          <p className="mb-6">
            We are actively seeking microgrants and funding to enhance TensorForest's capabilities:
          </p>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>
              <span className="font-medium">Scaling hardware and software</span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acquiring higher-resolution LiDAR sensors for improved accuracy.</li>
                <li>Developing longer-range drones for large-scale forest monitoring.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Enhancing AI Model Accuracy</span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Continuing to train and refine the wildfire risk assessment model, requiring more computing power and diverse datasets for improved accuracy.
                </li>
              </ul>
            </li>
          </ol>

          <h2 className="text-2xl mb-4">Get Involved</h2>
          <p className="mb-6">
            We are continuously working on improving TensorForest. If you're interested in this project or want to collaborate, feel free to reach out at{" "}
            <a
              href="mailto:shayaanazeem10@gmail.com"
              className="text-blue-500 hover:underline"
            >
              shayaanazeem10@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    )
  }

  /* ────────────────────────────────
     render apocalypse hacks content
  ────────────────────────────────── */
  function renderApocalypseHacksContent() {
    return (
      <div>
        {/* Hero Banner */}
        <HeroBanner
          title="Apocalypse Hacks"
          subtitle="Canada's largest high school hackathon"
          date="2024-05-17"
          tags={["Hackathon", "Community", "High School", "Toronto"]}
          backgroundImage="/apoimages/vickyapo.png"
        />

        {/* Summary */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">Summary</h2>
          <p className="mb-6">
            Apocalypse Hacks is Canada's largest high school hackathon (as of March 2025). It took place from{" "}
            <span className="font-semibold">May 17-19, 2024</span>, at Shopify's Toronto office. We brought together 150+ high schoolers,
            and in just 36 hours, they built 40+ projects, including everything from a peashooter to Uber for automated drones.
          </p>

          <h2 className="text-2xl mb-4">Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {[
              {
                name: "Acon Lin",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/60.png",
                site: "https://aconlin.vercel.app/",
              },
              {
                name: "Arav Narula",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/71.png",
                site: "https://www.radioblahaj.com/?ref=apocalypse",
              },
              {
                name: "Mutammim Sarkar",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/92.png",
                site: "https://www.mutammim.com/",
              },
              {
                name: "Shayaan Azeem",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/83.png",
                site: "https://www.linkedin.com/in/shayaan-azeem/",
              },
              {
                name: "Ryan Di Lorenzo",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/04.png",
                site: "https://limeskey.com/",
              },
              {
                name: "Gregory Gu",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/15.png",
                site: "https://www.linkedin.com/in/gregory-gu-b777212ba/",
              },
              {
                name: "Sam Liu",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/26.png",
                site: "https://samliu.dev/",
              },
              {
                name: "Sarvesh Mohan Kumar",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/37.png",
                site: "https://www.linkedin.com/in/sarvesh-mohan-kumar-a009ba268/",
              },
              {
                name: "Evelyn Wong",
                img: "https://cloud-8bqvtn5zz-hack-club-bot.vercel.app/08.png",
                site: "http://evelynw.ong/",
              },
              {
                name: "Vivian Yuan",
                img: "https://cloud-jy1p4tt69-hack-club-bot.vercel.app/59.png",
                site: "https://www.linkedin.com/in/vivian-yuan-240716284/",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center mb-2"
              >
                <a
                  href={member.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-12 h-12 rounded-full mb-1"
                  />
                  <span className="text-gray-400 text-center text-sm">
                    {member.name}
                  </span>
                </a>
              </div>
            ))}
          </div>

          <h2 className="text-2xl mb-4">Why Did We Build This?</h2>
          <p className="mb-6">
            As someone who's been interested in hacking and building things for most of my high school life, I have often found myself
            yearning for a sense of community and belonging. Toronto, though it may be a hub of innovation, really doesn't and didn't have many
            opportunities for high schoolers interested in tech and building things. Now, yes, there are some hackathons hosted here and there,
            but nothing out of the ordinary. If you go to those events, you find no sense of purpose or fulfillment because everyone is there
            to pad their resumes…
          </p>
          <p className="mb-6">
            That realization led to Apocalypse Hacks. We wanted to create a space for like-minded high schoolers to come together and build
            cool sh*t. And I think we did that.
          </p>
        </div>

        {/* The Journey */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">The Journey</h2>
          <p className="mb-6">
            I joined the core team in early 2024. At that point, we were actively looking for sponsors and a venue, and we cold emailed a
            LOT. We got a ton of nos and maybes, but finally, Shopify said yes, and the rest? Well, that was history.
          </p>

          <h2 className="text-2xl mb-4">Rejection Emails</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <img
              src="/apoimages/rejection1.png"
              alt="Rejection Email 1"
              className="rounded-lg"
            />
            <img
              src="/apoimages/reject2.png"
              alt="Rejection Email 2"
              className="rounded-lg"
            />
            <img
              src="/apoimages/rejection3.png"
              alt="Rejection Email 3"
              className="rounded-lg"
            />
            <img
              src="/apoimages/rejection4.png"
              alt="Rejection Email 4"
              className="rounded-lg"
            />
          </div>

          <h2 className="text-2xl mb-4">Timeline of Talks with Shopify</h2>
          <p className="mb-4">
            This was definitely a lengthy process, and during this, we were still actively reaching out to other people and companies:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Jan 8 - Original email to Tobi</li>
            <li>Jan 11 - Follow-up #1 with Tobi</li>
            <li>Jan 15 - Original email to Tobi's EA</li>
            <li>Jan 16 - Follow-up #2 with Tobi (oops)</li>
            <li>Feb 13 - Email to Shopify eng person</li>
            <li>Feb 14 - Reply from someone else at Shopify</li>
            <li>Feb 20 - Exploratory call</li>
            <li>Feb 23 - Reply: "positive conversations"</li>
            <li>Feb 28 - Reply: "mostly approved"</li>
            <li>Mar 1 - Reply: "getting closer..."</li>
            <li>Mar 6 - Confirmation from Shopify!!!</li>
            <li>Mar 8 - We're actually gonna make this happen call!</li>
            <li>Mar 14 - Speaking with the event producer (shoutout to Jennifer for all the help) + visiting the venue</li>
          </ul>
        </div>

        {/* March 14 - The First Look at Shopify */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">March 14 - The First Look at Shopify</h2>
          <p className="mb-6">
            Walking into Shopify's Toronto HQ for the first time was surreal. It was everything we could've wanted and even more. The venue was
            huge, it had amazing views of the city, the CN Tower—it felt like the space motivated us even more than we already were.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <img
              src="/apoimages/shopify rooftop.png"
              alt="Shopify Rooftop"
              className="rounded-lg"
            />
            <img
              src="/apoimages/shopify interior.png"
              alt="Shopify Interior"
              className="rounded-lg"
            />
            <img
              src="/apoimages/torontoview.JPG"
              alt="Toronto View"
              className="rounded-lg"
            />
            <img
              src="/apoimages/teamselfie.jpg"
              alt="team View"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Money Problems & Hack Club */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">I Got 99 Problems, and Money is the Biggest One</h2>
          <p className="mb-6">
            The next week, we sent even more emails, got meetings with some big Canadian companies and banks, and kept grinding. Then, Hack
            Club reached out…
          </p>
          <p className="mb-6">
            They had been keeping an eye on what we were building, and seeing us secure Shopify as a venue convinced them that we were legit.
            They offered to fully acquire the event as their spring hackathon and back it with $35K USD.
          </p>

          <h2 className="text-2xl mb-4">April 2, 2024</h2>
          <p className="mb-6">
            At first, we weren't sure. But after talking it through, we realized this was the best thing that could've happened. Hack Club
            stood for the same values we did—empowering youth to build things they want to. It just made sense.
          </p>
          <p className="mb-6">
            With money in hand, we got to work. I built a Trello board with auto-assignments, time tracking, and Slack integration, which
            would be the basis of all this.
          </p>
          <div className="my-6">
            <img
              src="/apoimages/trello.png"
              alt="Trello Board"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Organizing the Event */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">Organizing the Event</h2>
          <p className="mb-6">
            Over the next few weeks, #apo-core on Slack became our home base. This is where we figured out:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Food (Poke bowls, Michelin-star donuts, boba)</li>
            <li>Custom PCB Badges (which, lol, didn't even arrive on time, but that's a story for another day)</li>
            <li>Snacks, Merch, Stickers, Shirts</li>
            <li>Caffeine Planning - We very proudly had more Red Bull and Awake at our high school hackathon than Hack the North managed to get for Canada's largest hackathon (weird flex, but okay, I know).</li>
            <li>Vendor Outreach - I remember getting responses from Chinese vendors on Alibaba at 4 AM hahah.</li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <img
              src="/apoimages/merch1.jpg"
              alt="Merchandise"
              className="rounded-lg"
            />
            <img
              src="/apoimages/sticker2.png"
              alt="Stickers"
              className="rounded-lg"
            />
            <img
              src="/apoimages/caffeine.jpg"
              alt="Caffeine"
              className="rounded-lg"
            />
          </div>

          <p className="mb-6">
            From March to May 17th, we barely slept. There were 2 AM Slack calls on school nights, all-day Saturday meetings, and a
            ridiculous amount of last-minute scrambling. But somehow, we made it happen.
          </p>
          <div className="my-6">
            <img
              src="/apoimages/12am.png"
              alt="Late Night Work"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* How We Organized */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">How We Organized (we were just built different tho lol)</h2>
          <p className="mb-4">
            Most hackathons have subteams, divisions, committees. We did not.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>
              <span className="font-medium">No Specified Roles</span> - People just took on what they were good at (me? Logistics,
              Branding/Marketing, Media, and a whole bunch of whatever else we needed, etc.).
            </li>
            <li>
              <span className="font-medium">Team-wide Stand-up Meetings</span> - NOT split by divisions or clusters. This allowed everyone to
              be in the loop and understand where we were all at.
            </li>
            <li>
              <span className="font-medium">Small but Agile Team</span> - Our team was 7-8 people until the very end when it became 10. Even
              at this scale, we remained agile, working in sync, sharing tasks, and being responsible for our own things much more easily.
              There was no redundancy, no one to report to, no stupid chains of command.
            </li>
            <li>
              <span className="font-medium">Idea-Driven Culture</span> - Anyone could pitch an idea. If you had something cool in mind
              and could pull it off, you just… did it. No approval process, no gatekeeping. I credit this ideology to Hack Club, but it was
              really instilled all throughout the team. I also credit{" "}
              <a
                href="https://aconlin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Acon
              </a>{" "}
              for leading by actually doing this! So many of our best ideas, like the card game and bottle cap currency, came from random
              late night Slack messages.
            </li>
          </ul>

          <div className="my-6">
            <img
              src="/apoimages/cardgame.jpg"
              alt="Card Game"
              className="rounded-lg"
            />
          </div>

          <h2 className="text-2xl mb-4">The Takeaway</h2>
          <p className="mb-6">
            If you have the ability to make it and think it's worth it to do so, then make it. Don't worry about semantics like titles and
            experience. The best way to learn is by doing. None of us actually knew how to do any of this beforehand, but it's probably more
            efficient to learn by doing, then breaking it, then building it again.
          </p>
        </div>

        {/* The Hackathon */}
        <div className="mb-10">
          <h2 className="text-2xl mb-4">May 17-19: The Hackathon</h2>
          <p className="mb-6">
            It was so crazy. Some things went wrong, some went well, but a lot went even better than we had planned. We had a full house—EVERY
            PERSON WHO SIGNED UP (with the exception of one) showed up. 150+ hackers. 36 hours. 40+ projects. Absolute insanity.
          </p>
          <p className="mb-6">
            I'm so grateful for everyone who attended and shipped a project! It was so cool to meet everyone and people with the same interests
            as me. Like I said in the beginning, we set out to create a place to meet our people, and we definitely did just that.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 my-6">
            <img
              src="/apoimages/event0.jpg"
              alt="Event Image 0"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/event1.jpeg"
              alt="Event Image 1"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/event2.jpg"
              alt="Event Image 2"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/event3.jpg"
              alt="Event Image 3"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/event4.png"
              alt="Event Image 4"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/event6.jpg"
              alt="Event Image 6"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/lightiningtalk1.jpg"
              alt="Lightning Talk"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/lockedineddie.png"
              alt="Locked in Eddie"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/selfie.png"
              alt="Selfie"
              className="rounded-lg object-cover h-full w-full"
            />
            <img
              src="/apoimages/workshop1.png"
              alt="Workshop 1"
              className="rounded-lg object-cover h-full w-full"
            />
          </div>

          <p className="mb-4 text-center">
            Check out this documentary I made to recap the event! :)
          </p>
          <div className="flex justify-center my-8">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/QvCoISXfcE8"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex justify-center my-8">
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/track/1oAwsWBovWRIp7qLMGPIet?utm_source=generator&theme=0"
              width="80%"
              height="100"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    )
  }

  /* ────────────────────────────────
     render section content
  ────────────────────────────────── */
  function renderSectionContent(section: SectionKey) {
    const boldHeadings = [
      "how i started:",
      "some cool things i've done in the past:",
      "where do i see myself in 10 years:",
      "projects",
      "content worth consuming imo:",
      "my philosophy:"
    ]

    const renderWithHeading = (title: string, content: React.ReactNode) => (
      <div className="pt-2">
        <h2 className={cn("text-4xl font-bold mb-8", boldHeadings.includes(title) && "font-bold")}>
          {title}
        </h2>
        {content}
      </div>
    )

    switch (section) {
      case "about":
        return (
          <div>
            {/* Name */}
            <h1 className="text-3xl font-bold mb-6 group cursor-default">
              <span className="group-hover:hidden">Shayaan Azeem</span>
              <span className="hidden group-hover:inline">شایان عظیم</span>
            </h1>
            
            {/* Dynamic About Content */}
            {about ? (
              <AboutRenderer content={about.content} />
            ) : (
              <p className="text-muted-foreground">No about content available.</p>
            )}

            {/* Projects Section Below */}
            <div className="mt-8">
              {renderProjectsSection()}
            </div>
          </div>
        )

      case "fieldnotes":
        return (
          <div className="pt-2">
            <h2 className="text-4xl font-bold mb-4">fieldnotes</h2>
            <p className="text-lg text-muted-foreground mb-8">
              thoughts, observations, and learnings from my journey
            </p>
            
            {fieldnotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">no fieldnotes yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {fieldnotes.map((item) => (
                  <a
                    key={item.slug}
                    href={item.substackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left transition-all duration-200 cursor-pointer group "
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden transition-all duration-300 group-hover:h-56">
                      {/* Background Image */}
                      {item.banner ? (
                        <img 
                          src={item.banner} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900" />
                      )}
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
                      
                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="text-white">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-white/90 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-white/90 text-sm mb-3 line-clamp-2">
                            {item.summary}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70 text-sm">
                              {new Date(item.date).toLocaleDateString('en', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )

      case "projects":
        return renderProjectsSection()

      case "inspirations":
        return (
          <div className="pt-2">
            {philosophy ? (
              <MDXRenderer item={philosophy} />
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Philosophy</h2>
                <p className="text-muted-foreground">Philosophy content not found. Create a philosophy.md file in the content directory.</p>
              </div>
            )}
          </div>
        )
      case "content":
        return (
          <div className="pt-2">
            {contentWorthConsuming ? (
              <div>
                <h2 className="text-4xl font-bold mb-8">{contentWorthConsuming.title}</h2>
                <ContentWorthConsumingRenderer content={contentWorthConsuming.content} />
              </div>
            ) : (
              <div>
                <h2 className="text-4xl font-bold mb-8">Content Worth Consuming</h2>
                <p className="text-muted-foreground">Content not found. Create a content-worth-consuming.md file in the content directory.</p>
              </div>
            )}
          </div>
        )

      case "photos":
        return renderPhotosContent()

      default:
        return null
    }
  }

  /* ────────────────────────────────
     render projects content
  ────────────────────────────────── */
  function renderProjectsSection() {
    interface Project {
      title: string;
      type: 'Internship' | 'Project' | 'Community';
      image: string;
      description: string;
      badge?: {
        text: string;
        className: string; // Using className to apply highlight classes
      };
      year?: string;
      link?: string;
      action?: () => void;
      tags?: string[]; // Keeping tags for optional additional details
    }

    const allProjects: Project[] = [
      {
        title: "revisiondojo (YCF24)",
        type: "Internship",
        image: "/revisiondojo.png",
        description: "Get instant feedback on your EE research question. built rice purity test but for being performative, following the performative trend from this summer.",
        tags: ["funsies"],
        link: "https://revisiondojo.com" // Assumed or generic
      },
      {
        title: "performativepuritytest.com",
        type: "Project",
        image: "/performativepurity.png",
        description: "built rice purity test but for being performative, following the performative trend from this summer, the hardest part about this was not programming it but making the questions",
        badge: { text: "300k+ users", className: "link-hackclub" },
        link: "https://performativepuritytest.com"
      },
      {
        title: "coach bob",
        type: "Project",
        image: "/coachbob.jpeg",
        description: "street fighter but irl",
        badge: { text: "won hackthenorth", className: "link-bloomberg" },
        link: "https://devpost.com/software/coach-bob" // Assumed
      },
      {
        title: "do-eve",
        type: "Project",
        image: "/doeve.png",
        description: "built an imessage computer use agent which could control your computer, using...",
        badge: { text: "won hackprinceton", className: "link-teenbuilders" },
        link: "https://devpost.com/software/do-eve" // Assumed
      },
      {
        title: "tensorforest",
        type: "Project",
        image: "/tensorforest.png",
        description: "drones that predict and prevent forest fires. used remote sensing, AI, and physical sensors to detect risk zones and alert early.",
        action: selectTensorForest
      },
      {
        title: "teen builders club",
        type: "Community",
        image: "/teenbuildersclub.jpg",
        description: "built what i always wished i had, a community of other people interested in making cool sh*t, hosted meetups/coworking sessions/demo nights- still tinkering with this"
      },
      {
        title: "white oaks robotics",
        type: "Community",
        image: "/vex.png",
        description: "started my schools robotics team, grew it to 100+ members, built world class robots, won excellence award 5x, design award, torunament champion",
        badge: { text: "2nd in Ontario", className: "link-robotics" }
      },
      {
        title: "apocalypse hacks",
        type: "Community",
        image: "/apoimages/vickyapo.png",
        description: "i started canadas largest high school hackathon, but made it whimsical with theme of \"build something to survive an apocalypse\", raised 50k for this",
        action: selectApocalypseHacks
      },
      {
        title: "vibetype",
        type: "Project",
        image: "/vibetype.png",
        description: "built this at a hackathon on my birthday earlier this year-wanted to build a browser extension which would let me",
        link: "https://www.gptfixtsfor.me/"
      },
      {
        title: "shoppywrapped",
        type: "Project",
        image: "/shoppy.png",
        description: "built an imessage agent which could control your computer, using... spotify wrapped, but for your shopping. built with Shopify's Shop Mini framework.",
        badge: { text: "won shopify hackathon", className: "link-olympiad" },
        link: "https://github.com/ultratrikx/shoppy-wrapped/pulls"
      }
    ];

    const filteredProjects = projectFilter === 'Everything' 
      ? allProjects 
      : allProjects.filter(p => {
          if (projectFilter === 'Projects') return p.type === 'Project';
          if (projectFilter === 'Communities') return p.type === 'Community';
          return p.type === projectFilter;
        });

    return (
      <div>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {['Everything', 'Projects', 'Communities', 'Internship'].map((filter) => (
            <button
              key={filter}
              onClick={() => setProjectFilter(filter as any)}
              className={cn(
                "px-4 py-1 text-sm transition-colors duration-200",
                projectFilter === filter 
                  ? "bg-foreground text-background" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div key={index} className="flex flex-col group transition-colors">
              {/* Image Container */}
              <div 
                className="relative mb-4 overflow-hidden aspect-[16/10] cursor-pointer bg-muted transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] dark:group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                onClick={() => {
                  if (project.action) project.action();
                  else if (project.link) window.open(project.link, '_blank');
                }}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium leading-tight">{project.title}</h3>
                  {project.badge && (
                    <span className={cn("text-[10px] font-medium ml-2 shrink-0", project.badge.className)}>
                      {project.badge.text}
                    </span>
                  )}
                  {!project.badge && (
                    <span className="text-sm text-muted-foreground ml-2 shrink-0">
                      {project.type === 'Community' ? 'community' : project.type.toLowerCase()}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {project.tags && project.tags.length > 0 && (
                    <span className="block mb-1 text-[10px] opacity-70">{project.tags.join(', ')}</span>
                  )}
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ────────────────────────────────
     render photos content
  ────────────────────────────────── */
  function renderPhotosContent() {
    
    // Polaroid photos
    const polaroidPhotos = [
      {
        id: "1",
        title: "the start of something big",
        location: "WeWork Toronto",
        image: "/polaroids/the start of something big.png",
        songUrl: "https://open.spotify.com/track/1zgHn1EqUyA0HqNYMdJ5ia?si=b10022a78daa4fa1"
      },
      {
        id: "2",
        title: "apocalypse w/ greg",
        location: "Shopify Toronto",
        image: "/polaroids/apogreg.png",
        songUrl: "https://open.spotify.com/track/0mEdbdeRFQwBhN4xfyIeUM?si=e6bb613c681245fd"
      },
      {
        id: "3",
        title: "lost in toronto",
        location: "Toronto, ON",
        image: "/polaroids/lost in toronto.png",
        songUrl: "https://open.spotify.com/track/5kDgJffgJ0lYHTSiaXFWNw?si=590001762a2840ce"
      },
      {
        id: "4",
        title: "the one where ayaan turns five",
        location: "Jersey City, NJ",
        image: "/polaroids/ayaanturns5.png",
        songUrl: "https://open.spotify.com/track/4I4aQGNJ2HufloNtB65nxR?si=c579a5e4bb6042c2"
      },
      {
        id: "5",
        title: "airplane thoughts",
        location: "Above Michigan",
        image: "/polaroids/airplanethoughts.png",
        songUrl: "https://open.spotify.com/track/19nu3H3vjeZ505i450lz8R?si=424f25c49b9f4b30"
      },
      {
        id: "6",
        title: "break things build better",
        location: "Shopify Toronto",
        image: "/polaroids/breakbuildbetter.png",
        songUrl: "https://open.spotify.com/track/1oAwsWBovWRIp7qLMGPIet?si=d9e5bb4900954ea5"
      },
      {
        id: "7",
        title: "water water water loo loo loo",
        location: "Waterloo, ON",
        image: "/polaroids/water water.png",
        songUrl: "https://open.spotify.com/track/1v0uVPU6BWcbog5BiWLWVa?si=0a01a3cab11149a9"
      },
      {
        id: "8",
        title: "robotics presidents!",
        location: "Oakville, ON",
        image: "/polaroids/nobel physic.PNG",
        songUrl: "https://open.spotify.com/track/7kv7zBjMtVf0eIJle2VZxn?si=997f5b3c5ef24430"
      },
      {
        id: "9",
        title: "777",
        location: "Toronto, ON",
        image: "/polaroids/777.png",
        songUrl: "https://open.spotify.com/track/32J2bR5gnepj9uHPGVGStr?si=84a55b42ab404585"
      },
      {
        id: "19",
        title: "ycombinator core",
        location: "Waterloo, ON",
        image: "/polaroids/water water water.png",
        songUrl: "https://open.spotify.com/track/1Ukxccao1BlWrPhYkcXbwZ?si=9fee189e2ea547bb"
      },
      {
        id: "11",
        title: "dumbo!",
        location: "New York City, NY",
        image: "/polaroids/dumbo.png",
        songUrl: " https://open.spotify.com/track/6wXPV6dNRAhFavrRaCdMXT?si=990666c03feb4eea"
      },
      {
        id: "12",
        title: "roomies",
        location: "Oakville, ON",
        image: "/polaroids/10xeng.png",
        songUrl: "https://open.spotify.com/track/1auxYwYrFRqZP7t3s7w4um?si=3cf2d5a2f7b74500"
      },
      {
        id: "13",
        title: "entropy ifykyk",
        location: "Oakville, ON",
        image: "/polaroids/entropy ifyyk.PNG",
        songUrl: "https://open.spotify.com/track/551xyaSJsg8hILXFq9JdST?si=b8651a2af5384226"
      },
      {
        id: "14",
        title: "senior sunrise",
        location: "Oakville, ON",
        image: "/polaroids/senior sunrise.PNG",
        songUrl: "https://open.spotify.com/track/0NUqi0ps17YpLUC3kgsZq0?si=027549695c894f41"
      },
      {
        id: "15",
        title: "end of the beginning - djo",
        location: "Chicago, IL",
        image: "/polaroids/end of the begining.png",
        songUrl: "https://open.spotify.com/track/3qhlB30KknSejmIvZZLjOD?si=2d6b0e552475446b"
      },
      {
        id: "16",
        title: "first hackathon i went to",
        location: "WeWork Toronto",
        image: "/polaroids/TheGang.png",
        songUrl: "https://open.spotify.com/track/6wXPV6dNRAhFavrRaCdMXT?si=990666c03feb4eea"
      },
      {
        id: "17",
        title: "spanish lattes in nyc",
        location: "New York City, NY",
        image: "/polaroids/spanish lattes in nyc.png",
        songUrl: "https://open.spotify.com/track/0TL0LFcwIBF5eX7arDIKxY?si=5dab4294e9d84b81"
      },
      {
        id: "18",
        title: "robotics exec social",
        location: "Oakville, ON",
        image: "/polaroids/execsocial.PNG",
        songUrl: "https://open.spotify.com/track/1Ukxccao1BlWrPhYkcXbwZ?si=9fee189e2ea547bb"
      }
    ];

    // Film emulation photos
    const filmPhotos = [
      {
        id: "film1",
        location: "New York City, NY",
        image: "/emulation/littlepak.JPG"
      },
      {
        id: "film2",
        location: "New York City, NY",
        image: "/emulation/mainbridge.JPG"
      },
      {
        id: "film3",
        location: "New York City, NY",
        image: "/emulation/brownbuilding.JPG"
      },
      {
        id: "film4",
        location: "New York City, NY",
        image: "/emulation/pipe.JPG"
      },
      {
        id: "film5",
        location: "New York City, NY",
        image: "/emulation/sidebridge.JPG"
      },
      {
        id: "film6",
        location: "New York City, NY",
        image: "/emulation/atm.JPG"
      }
    ];

    // Disposable photos
    const disposablePhotos = [
      {
        id: "disp1",
        location: "Toronto, ON",
        image: "/disposable/IMG_3442.JPG"
      },
      {
        id: "disp2",
        location: "Toronto, ON",
        image: "/disposable/IMG_3445.JPG"
      },
      {
        id: "disp3",
        location: "Oakville, ON",
        image: "/disposable/IMG_3446.JPG"
      },
      {
        id: "disp4",
        location: "Toronto, ON",
        image: "/disposable/IMG_3448.JPG"
      },
      {
        id: "disp5",
        location: "Oakville, ON",
        image: "/disposable/IMG_3449.JPG"
      },
      {
        id: "disp6",
        location: "Toronto, ON",
        image: "/disposable/IMG_3450.JPG"
      },
      {
        id: "disp7",
        location: "Toronto, ON",
        image: "/disposable/IMG_3447.JPG"
      },
      {
        id: "disp8",
        location: "Oakville, ON",
        image: "/disposable/000138910025.jpg"
      },
      {
        id: "disp9",
        location: "Toronto, ON",
        image: "/disposable/000114970025.jpg"
      },
      {
        id: "disp10",
        location: "Oakville, ON",
        image: "/disposable/000114970006.jpg"
      },
      {
        id: "disp11",
        location: "Toronto, ON",
        image: "/disposable/000114970001.jpg"
      },
      {
        id: "disp12",
        location: "Oakville, ON",
        image: "/disposable/000114970005.jpg"
      },
      {
        id: "disp13",
        location: "Toronto, ON",
        image: "/disposable/000129720005.jpg"
      },
      {
        id: "disp14",
        location: "Oakville, ON",
        image: "/disposable/000129720006.jpg"
      },
      {
        id: "disp15",
        location: "Toronto, ON",
        image: "/disposable/000138910005.jpg"
      },
      {
        id: "disp16",
        location: "Oakville, ON",
        image: "/disposable/IMG_3418.JPG"
      },
      {
        id: "disp17",
        location: "Toronto, ON",
        image: "/disposable/IMG_3424.JPG"
      },
      {
        id: "disp18",
        location: "Oakville, ON",
        image: "/disposable/IMG_3440.JPG"
      },
      {
        id: "disp19",
        location: "Toronto, ON",
        image: "/disposable/IMG_3439.JPG"
      },
      {
        id: "disp20",
        location: "Oakville, ON",
        image: "/disposable/IMG_3461.JPG"
      },
      {
        id: "disp21",
        location: "Toronto, ON",
        image: "/disposable/IMG_3459.JPG"
      },
      {
        id: "disp22",
        location: "Oakville, ON",
        image: "/disposable/IMG_3453.JPG"
      },
      {
        id: "disp23",
        location: "Toronto, ON",
        image: "/disposable/IMG_3455.JPG"
      },
      {
        id: "disp24",
        location: "Oakville, ON",
        image: "/disposable/IMG_3435.JPG"
      },
      {
        id: "disp25",
        location: "Toronto, ON",
        image: "/disposable/IMG_3433.JPG"
      }
    ];

    // Get photos based on active tab
    const getDisplayPhotos = () => {
      switch(activePhotoTab) {
        case 'polaroids':
          return polaroidPhotos;
        case 'digital':
          return filmPhotos;
        case 'film':
          return disposablePhotos;
        default:
          return polaroidPhotos;
      }
    };

    const displayPhotos = getDisplayPhotos();

    return (
      <div className="pt-2">
        <h2 className="text-4xl font-bold mb-8">photos</h2>
        <p className="text-lg text-muted-foreground mb-8">
          a collection of polaroids, film emulation, and disposable camera shots
        </p>
        
        {/* Tabs */}
        <div className="flex justify-center mb-12 space-x-2">
          <button 
            onClick={() => setActivePhotoTab('polaroids')} 
            className={`px-4 py-1 rounded-full text-sm ${activePhotoTab === 'polaroids' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}
          >
            polaroids
          </button>
          <button 
            onClick={() => setActivePhotoTab('film')} 
            className={`px-4 py-1 rounded-full text-sm ${activePhotoTab === 'film' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}
          >
            film
          </button>
          <button 
            onClick={() => setActivePhotoTab('digital')} 
            className={`px-4 py-1 rounded-full text-sm ${activePhotoTab === 'digital' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}
          >
            digital
          </button>
        </div>
        
        {/* Photo grid with different layouts based on tab */}
        {activePhotoTab === 'digital' ? (
          // Digital layout - larger images in a 2-column grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
            {displayPhotos.map((photo) => (
              <div key={photo.id} className="flex flex-col group mb-6">
                <div className="relative overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={photo.image} 
                    alt={photo.location} 
                    className="w-full h-auto object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm text-muted-foreground">{photo.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : activePhotoTab === 'film' ? (
          // Film layout - structured grid like the experience page
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {displayPhotos.map((photo) => (
                <div key={photo.id} className="group aspect-[4/3]">
                  <div className="relative h-full overflow-hidden dark:shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <img 
                      src={photo.image} 
                      alt={photo.location} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Polaroids layout - smaller images in a 3-column grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {displayPhotos.map((photo) => (
              <div key={photo.id} className="flex flex-col items-center group">
                <a href={photo.songUrl} target="_blank" rel="noopener noreferrer" className="relative overflow-hidden dark:shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src={photo.image} 
                    alt={photo.title || photo.location} 
                    className="w-full max-w-[240px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </a>
                <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.title && <p className="text-sm text-foreground">{photo.title}</p>}
                  <p className="text-xs text-muted-foreground">{photo.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
} 