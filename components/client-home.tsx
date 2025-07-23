"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import type { ContentItem } from "@/lib/content"
import MDXRenderer from "@/components/mdx-renderer"
import ContentRenderer from "@/components/content-renderer"

interface ClientHomeProps {
  fieldnotes: ContentItem[]
  philosophy: ContentItem | null
  contentWorthConsuming: ContentItem | null
}

export default function ClientHome({ fieldnotes, philosophy, contentWorthConsuming }: ClientHomeProps) {
  /* ────────────────────────────────
     section definitions
  ────────────────────────────────── */
  const sections = [
    "about",
    "experience",
    "projects",
    "fieldnotes",
    "inspirations",
    "content"
  ] as const

  type SectionKey = typeof sections[number]

  /* ────────────────────────────────
     state
  ────────────────────────────────── */
  const [activeSection, setActiveSection] = useState<SectionKey>("about")
  const [showTensorForest, setShowTensorForest] = useState(false)
  const [activeTensorForest, setActiveTensorForest] = useState(false)
  const [activeApocalypseHacks, setActiveApocalypseHacks] = useState(false)
  const [activeFieldnote, setActiveFieldnote] = useState<string | null>(null)

  /* ────────────────────────────────
     helpers
  ────────────────────────────────── */
  const selectSection = (section: SectionKey) => {
    setActiveSection(section)
    // Always reset detail views when selecting a section
    // This ensures clicking "projects" from detail pages goes to main projects page
    setActiveTensorForest(false)
    setActiveApocalypseHacks(false)
    setActiveFieldnote(null)
  }

  const selectTensorForest = () => {
    setActiveSection("projects")
    setActiveTensorForest(true)
    setActiveApocalypseHacks(false)
    setActiveFieldnote(null)
  }

  const selectApocalypseHacks = () => {
    setActiveSection("projects")
    setActiveTensorForest(false)
    setActiveApocalypseHacks(true)
    setActiveFieldnote(null)
  }

  const selectFieldnote = (slug: string) => {
    setActiveSection("fieldnotes")
    setActiveFieldnote(slug)
    setActiveTensorForest(false)
    setActiveApocalypseHacks(false)
  }

  // Get recent fieldnotes for sidebar (first 3)
  const recentFieldnotes = fieldnotes.slice(0, 3)

  /* ────────────────────────────────
     render
  ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* theme toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-12">
        {/* ───────────── sidebar ───────────── */}
        <nav className="md:text-right space-y-8 md:space-y-12 text-sm text-muted-foreground sticky top-12 self-start">
          {sections.map((section) => (
            <div key={section}>
              {/* Main section button */}
              <button
                onClick={() => selectSection(section)}
                className={cn(
                  "block w-full text-right transition-colors duration-200",
                  activeSection === section && !(section === "projects" && (activeTensorForest || activeApocalypseHacks)) && !(section === "fieldnotes" && activeFieldnote) 
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
              
              {/* Fieldnotes sub-items */}
              {section === "fieldnotes" && activeSection === "fieldnotes" && recentFieldnotes.length > 0 && (
                <div className="mt-4 space-y-2">
                  {recentFieldnotes.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => selectFieldnote(item.slug)}
                      className={cn(
                        "block w-full text-right text-xs transition-colors duration-200 pl-4",
                        activeFieldnote === item.slug ? "text-foreground font-medium" : "text-muted-foreground/60 hover:text-muted-foreground/80 font-light"
                      )}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ───────────── main content ───────────── */}
        <div className="text-base leading-relaxed">
          {activeTensorForest ? renderTensorForestContent() : 
           activeApocalypseHacks ? renderApocalypseHacksContent() : 
           activeFieldnote ? renderFieldnoteContent(activeFieldnote) :
           renderSectionContent(activeSection)}
          
          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              email me at{" "}
              <Link
                href="mailto:shayaan.azeem@uwaterloo.ca"
                className="link-blue hover-dark-7"
              >
                shayaan.azeem@uwaterloo.ca
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  /* ────────────────────────────────
     render fieldnote content
  ────────────────────────────────── */
  function renderFieldnoteContent(slug: string) {
    const fieldnote = fieldnotes.find(item => item.slug === slug)
    if (!fieldnote) return null

    return (
      <div className="pt-2">
        {/* Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <button 
            onClick={() => selectSection("fieldnotes")}
            className="hover:text-foreground transition-colors"
          >
            ← back to fieldnotes
          </button>
        </div>

        {/* Content */}
        <MDXRenderer item={fieldnote} />
      </div>
    )
  }

  /* ────────────────────────────────
     render tensorforest content
  ────────────────────────────────── */
  function renderTensorForestContent() {
    return (
      <div>
        {/* Hero Banner */}
        <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative h-80 overflow-hidden rounded-lg">
            <img 
              src="/tensorforest.png" 
              alt="TensorForest project cover" 
              className="w-full h-full object-cover object-center"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">TensorForest</h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Autonomous drone system for wildfire prediction and prevention
              </p>
            </div>
          </div>
        </div>

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
        <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative h-80 overflow-hidden rounded-lg">
            <img 
              src="/apoimages/vickyapo.png" 
              alt="Apocalypse Hacks project cover" 
              className="w-full h-full object-cover object-center"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Apocalypse Hacks</h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Canada's largest high school hackathon
              </p>
            </div>
          </div>
        </div>

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
      "projects:",
      "content worth consuming imo:",
      "my philosophy:"
    ]

    const renderWithHeading = (title: string, content: React.ReactNode) => (
      <div className="pt-2">
        <h2 className={cn("mb-2", boldHeadings.includes(title) && "font-bold")}>
          {title}
        </h2>
        {content}
      </div>
    )

    switch (section) {
      case "about":
        return (
          <div className="space-y-8 md:space-y-12">
            {/* Name and Social Icons */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
              <h1 className="text-2xl font-bold">shayaan azeem</h1>
              
                             {/* Social icons */}
               <div className="flex gap-3 sm:gap-4">
                                 <Link
                   href="https://twitter.com/shayaan_azeem"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                 >
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
                                 <Link
                   href="https://github.com/shayaanazeem1"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                 >
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </Link>
                                 <Link
                   href="https://linkedin.com/in/shayaan-azeem"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                 >
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
                                 <Link
                   href="mailto:shayaan.azeem@uwaterloo.ca"
                   className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                 >
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Intro */}
            <div>
            <p>i'm 18 years old, from toronto, and i like building things.</p>
            <p>
              incoming student studying applied math and ml at{" "}
              <Link
                href="https://uwaterloo.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-blue hover-dark-1"
              >
                @uwaterloo
              </Link>
              .
            </p>
          </div>

            {/* Experience */}
            {renderWithHeading("some cool things i've done in the past:", (
            <ul className="list-none space-y-2">
              <li className="tight-list-item">
                  spent a year building autonomous drones to predict forest fires
                  <br />
                  [backed by{" "}
                <Link
                  href="https://www.bloomberg.org/government-innovation/spurring-innovation-in-cities/youth-climate-action-fund/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-2"
                >
                  bloomberg philanthropies
                </Link>
                ] [
                <Link
                  href="https://www.joinef.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-3"
                >
                    offered $250k preseed
                </Link>
                ]
              </li>
              <li className="tight-list-item">
                worked as a growth intern at{" "}
                <Link
                  href="https://hackclub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-4"
                >
                  hack club
                </Link>
                , grew{" "}
                <Link
                  href="https://www.instagram.com/starthackclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-5"
                >
                  @starthackclub
                </Link>{" "}
                to 100k followers
              </li>
              <li className="tight-list-item">
                organized{" "}
                <Link
                  href="https://apocalypse.hackclub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-6"
                >
                  canada's largest high school hackathon
                </Link>
                , raised $50k
              </li>
              <li className="tight-list-item">
                founded{" "}
                <Link
                  href="https://wossrobotics.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-7"
                >
                  robotics club
                </Link>{" "}
                at my hs, ranked top 62 in the world
              </li>
              <li className="tight-list-item">
                won bronze [3rd place] at the{" "}
                <Link
                  href="https://wro-association.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-8"
                >
                  canadian world robot olympiad
                </Link>
                .
              </li>
            </ul>
            ))}

            {/* Journey */}
            {renderWithHeading("how i started:", (
              <>
            <p className="mb-2">
              i&apos;ve always been really creative, and a builder at heart, from a young age always wanted to sell
              things tried to become an entrepreneur with everything
            </p>
            <ul className="list-none space-y-2">
              <li className="tight-list-item">
                at 11 i started selling premade slime at school (honestly was profitable af not gonna lie)
              </li>
              <li className="tight-list-item">
                at 13 i was doing freelance video editing and design on upwork and fiverr (got banned from upwork for
                being underage)
              </li>
              <li className="tight-list-item">
                also at 13 i started a tech review youtube channel (hit 50k views 500 subs and got into twitter but
                lowkey gave up too early) {"{this taught me perfection is the enemy of..}"}
              </li>
              <li className="tight-list-item">at 14 i made my first $10k from crypto</li>
              <li className="tight-list-item">
                at 15 i launched my first venture dropshipping fingerprint padlocks (made one sale net loss 😭)
              </li>
            </ul>
              </>
            ))}

            {/* Future */}
            {renderWithHeading("where do i see myself in 10 years:", (
            <p>
              probably still building in tech, maybe in a niche like environmental or health tech. i&apos;m not exactly
              sure where i&apos;ll end up, but i know i want to be creating products that make a real positive impact on
              people&apos;s lives. i might also be involved in venture capital, supporting other builders. and i hope
              i&apos;m still fostering community and creating spaces for curious likeminded people to connect.
            </p>
            ))}

            {/* Photo */}
            <div className="mt-8 flex justify-center">
              <img 
                src="/000129720010.JPG" 
                alt="Shayaan in workshop" 
                className="shadow-md max-w-full h-auto"
                style={{ maxWidth: '600px' }}
              />
            </div>
          </div>
        )

      case "experience":
        return (
          <div className="pt-2">
            <div className="space-y-8">
              {/* Hack Club */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src="/hclogo.png" 
                      alt="Hack Club logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-px bg-border h-full mt-4"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">Content/Growth Intern</h3>
                      <p className="text-muted-foreground">Hack Club</p>
                    </div>
                    <span className="text-sm text-muted-foreground">jul 2024 - present</span>
                  </div>
                  <p className="mb-4">grew @starthackclub to 100k followers</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">social media marketing</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">content strategy</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">web content optimization</span>
                  </div>
                </div>
              </div>

              {/* Robotics Club */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src="/wbotlogo.jpg" 
                      alt="White Oaks Robotics logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-px bg-border h-full mt-4"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">President/Founder</h3>
                      <p className="text-muted-foreground">White Oaks Robotics Club</p>
                    </div>
                    <span className="text-sm text-muted-foreground">sep 2023 - present</span>
                  </div>
                  <p className="mb-4">started the robotics club at my school, grew it to 100+ members, top 100 teams in the world, qualified for vex worlds, won 8 regional/provincial awards, garnered $7500+ in funds</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">team management</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">project management</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">start-up leadership</span>
                  </div>
                </div>
              </div>

              {/* Apocalypse Hacks */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src="/apohackslogo.jpg" 
                      alt="Apocalypse Hacks logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-px bg-border h-full mt-4"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">Organizer</h3>
                      <p className="text-muted-foreground">Apocalypse Hacks (Backed by Hack Club and Shopify)</p>
                    </div>
                    <span className="text-sm text-muted-foreground">dec 2023 - jun 2024</span>
                  </div>
                  <p className="mb-4">founded canada's largest high school hackathon (150 attendees, 40+ projects shipped), raised $50k from sponsors like shopify and doordash with a team of 10</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">fundraising</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">project management</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">operations management</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">communication</span>
                  </div>
                </div>
              </div>

              {/* Electrathon Team */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">⚡</span>
                  </div>
                  <div className="w-px bg-border h-full mt-4"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">Head Captain</h3>
                      <p className="text-muted-foreground">WOSS Electrathon Team</p>
                    </div>
                    <span className="text-sm text-muted-foreground">jun - aug 2023</span>
                  </div>
                  <p className="mb-4">building an electric vehicle to race at uwaterloo, also trying to make it autonomous for fun</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">electric vehicles</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">computer vision</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">machine learning</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">autonomous systems</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">control systems</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">mechanical design</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-full text-sm">electrical engineering</span>
                  </div>
                </div>
              </div>

              {/* Linguistics Club */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src="/wosssling.jpg" 
                      alt="WOSS Linguistics Club logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">President</h3>
                      <p className="text-muted-foreground">Linguistics Club</p>
                    </div>
                    <span className="text-sm text-muted-foreground">sep 2024 - present</span>
                  </div>
                  <p className="mb-4">organized naclo competition, grew to 15 members</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "fieldnotes":
        return (
          <div className="pt-2">
            <h2 className="text-2xl font-bold mb-6">fieldnotes</h2>
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
                  <button
                    key={item.slug}
                    onClick={() => selectFieldnote(item.slug)}
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
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="px-2 py-1 bg-white/20 text-white/90 rounded-md text-xs">
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 2 && (
                                  <span className="px-2 py-1 bg-white/20 text-white/90 rounded-md text-xs">
                                    +{item.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case "projects":
        return renderWithHeading("projects:", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {/* vibetype */}
            <div className="rounded-lg p-3 bg-card transition-all duration-200 group ">
              <Link
                href="https://www.gptfixtsfor.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="h-48 mb-3 rounded-md overflow-hidden transition-all duration-300 group-hover:h-56 cursor-pointer">
                  <img 
                    src="/vibetype.png" 
                    alt="vibetype project cover" 
                    className="w-full h-full object-cover object-[center_30%]"
                  />
                </div>
              </Link>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">vibetype</h3>
              <div className="flex gap-2">
                <Link
                  href="https://devpost.com/software/vibetype"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
                <Link
                  href="https://www.gptfixtsfor.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </Link>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                an AI writing sidekick that lives in your browser. highlight text to rewrite, expand, or clean it up instantly. open the sidebar to pull context from your tabs and draft smarter, faster.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">html</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">css</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">javascript</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">inbound vc interest</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">offered spot in spur accelerator</span>
              </div>
            </div>

            {/* shoppy wrapped */}
            <div className="rounded-lg p-3 bg-card transition-all duration-200 group ">
              <Link
                href="https://github.com/ultratrikx/shoppy-wrapped/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="h-48 mb-3 rounded-md overflow-hidden transition-all duration-300 group-hover:h-56 cursor-pointer">
                  <img 
                    src="/shoppy.png" 
                    alt="shoppy wrapped project cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">shoppy wrapped</h3>
              <div className="flex gap-2">
                <Link
                  href="https://github.com/ultratrikx/shoppy-wrapped/pulls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </Link>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                spotify wrapped, but for your shopping. built with Shopify's Shop Mini framework. shows your top shops, spend, orders, and shopping style in a smooth stories-style recap.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">typescript</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">tailwind</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">shopify</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">won the Shopify Toronto Tech Week hackathon</span>
              </div>
            </div>

            {/* tensorforest */}
            <div className="rounded-lg p-4 bg-card transition-all duration-200 group ">
                <button
                  onClick={selectTensorForest}
                  className="block w-full"
                >
                  <div className="h-48 mb-4 rounded-md overflow-hidden transition-all duration-300 group-hover:h-56 cursor-pointer">
                    <img 
                      src="/tensorforest.png" 
                      alt="tensorforest project cover" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">tensorforest</h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectTensorForest}
                    className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary/80 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
                <p className="text-sm text-muted-foreground mb-4">
                  drones that predict and prevent forest fires. used remote sensing, AI, and physical sensors to detect risk zones and alert early.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">python</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">pytorch</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">tensorflow</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">hardware</span>
                </div>
              </div>

            {/* apocalypse hacks */}
            <div className="rounded-lg p-4 bg-card transition-all duration-200 group ">
                            <button
                onClick={selectApocalypseHacks}
                className="block w-full"
              >
                <div className="h-48 mb-4 rounded-md overflow-hidden transition-all duration-300 group-hover:h-56 cursor-pointer">
                  <img 
                    src="/apoimages/vickyapo.png" 
                    alt="apocalypse hacks project cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">apocalypse hacks</h3>
                <div className="flex gap-2">
                  <Link
                    href="https://apocalypse.hackclub.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary/80 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </Link>
                  <button
                    onClick={selectApocalypseHacks}
                    className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-secondary dark:hover:bg-secondary/80 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
              </div>
            </div>
              <p className="text-sm text-muted-foreground mb-4">
                founded canada's largest high school hackathon with 150 attendees and 40+ projects shipped. raised $50k from sponsors like shopify and doordash.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">event organizing</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">fundraising</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">project management</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">raised $50k</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-secondary dark:text-secondary-foreground rounded-md text-xs">150 attendees</span>
                </div>
              </div>
            </div>
        ))

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
        return renderWithHeading("content worth consuming imo:", (
            <ul className="list-none space-y-2">
              <li className="tight-list-item">
                <Link
                  href="https://www.fxnetworks.com/shows/the-bear"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-1"
                >
                  the bear
                </Link>{" "}
                [tv show]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://jamesclear.com/atomic-habits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-2"
                >
                  atomic habits
                </Link>{" "}
                – james clear [book]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://youtu.be/StMltAX0mp0?si=0T_LZzx2RxzdUvzk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-3"
                >
                  do hard things
                </Link>{" "}
                – casey neistat [video]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://www.warnerbros.com/movies/interstellar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-4"
                >
                  interstellar
                </Link>{" "}
                – christopher nolan [movie]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://www.paramount.com/movies/forrest-gump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-5"
                >
                  forrest gump
                </Link>{" "}
                – robert zemeckis [movie]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://paulgraham.com/philosophy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-6"
                >
                  how to do philosophy
                </Link>{" "}
                – paul graham [essay]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://www.penguinrandomhouse.com/books/566528/meditations-by-marcus-aurelius/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-7"
                >
                  meditations
                </Link>{" "}
                – marcus aurelius [book]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://paulgraham.com/lesson.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-8"
                >
                  the lesson to unlearn
                </Link>{" "}
                – paul graham [essay]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://www.sonypictures.com/movies/thepursuitofhappyness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-1"
                >
                  the pursuit of happyness
                </Link>{" "}
                – gabriele muccino [movie]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://orwell.ru/library/articles/Common_Toad/english/e_ctoad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-2"
                >
                  some thoughts on the common toad
                </Link>{" "}
                – george orwell [essay]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://blog.samaltman.com/idea-generation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-3"
                >
                  idea generation
                </Link>{" "}
                – sam altman [blog]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://blog.samaltman.com/what-i-wish-someone-had-told-me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-4"
                >
                  what i wish someone had told me
                </Link>{" "}
                – sam altman [blog]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://nav.al/reject-advice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-5"
                >
                  reject advice
                </Link>{" "}
                – naval ravikant [blog]
              </li>
              <li className="tight-list-item">
                <Link
                  href="https://harsehaj.substack.com/p/theres-no-thinking-without-writing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-blue hover-dark-6"
                >
                  there&apos;s no thinking without writing
                </Link>{" "}
                – harsehaj [short essay]
              </li>
            </ul>
        ))

      default:
        return null
    }
  }
} 