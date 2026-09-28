import FootnoteLink from "./FootnoteLink";
import PhotoGallery from "./PhotoGallery";
import FlowDiagram from "./FlowDiagram";
import InlineImagePreview from "./InlineImagePreview";
import Image from "next/image";
import styles from "./murph-e.module.css";

export default function ArticleBody() {
  return (
    <>
      <p>I wasn’t sure what to build at this hackathon, but I had two goals coming into the weekend:</p>
      <ol>
        <li>I wanted to use a frontier model in an interesting or novel context.</li>
        <li>I wanted to build something that involved hardware.</li>
      </ol>
      <p>The initial inspiration came from <InlineImagePreview label="Stickerbox" src="/murph-e/photos/11-stickerbox.webp" alt="Stickerbox, the initial inspiration." width={960} height={640} logo="/murph-e/stickerbox-logo.svg" />. I thought something that could generate an interactive experience, like an arcade game, could be really fun.</p>
      <p>After a long FaceTime call with my teammates on Thursday night, we decided on “a whimsical arcade machine.” You’d walk up to a retro arcade machine, describe whatever game you wanted, and be able to play it.</p>
      <PhotoGallery photos={["facetime", "planning"]} overlap />
      <p>We wanted the project to actually feel immersive, as if it were a real arcade machine, so we started by looking to buy a cheap one on Marketplace. We quickly realized there was no way our budget or timeline was going to allow us to get a preexisting arcade machine and the parts needed to retrofit the internals to work for us.</p>
      <PhotoGallery photos={["initialDesign"]} />
      <ul>
        <li>We found an old 27 inch Sony Trinitron CRT on Facebook Marketplace for $10 and decided to build around it.</li>
        <li>To mount the CRT, we got a steel tire rack and used an angle grinder from Home Depot to make it fit the TV.</li>
        <li>For the outer shell, we used cardboard boxes, cut them into the shape of an arcade machine, and spray-painted them before securing them to the frame.</li>
      </ul>
      <PhotoGallery photos={["grinding", "painting", "assembly"]} />
      <p>For the software, it wasn’t exactly obvious how to use a model to generate a game fast enough. How do you turn a simple prompt like “Mario Kart, but with planes” into a fully fledged playable game quickly enough that someone can walk up to an arcade machine and immediately start playing?</p>
      <FlowDiagram name="prompt-to-game" title="From a spoken prompt to an arcade game" />
      <p>Our first approach was to have a model write the whole game. We built a small JavaScript runtime that handled common pieces like pixel graphics, sound, scoring, and controller input. From there, <code>Luna</code> took the player’s spoken request and turned it into a more detailed game specification. <code>GPT 5.6 Sol</code> would then write a complete game.</p>
      <p>The results were pretty mid, tbh. A Brick Breaker or Tetris clone would technically work, but there was usually something slightly wrong. Movement might feel awkward, collisions would behave strangely, enemies would be boring, and the game just wouldn’t give you much reason to keep playing. They were playable, but they didn’t have the thing good arcade games have where, when you lose, you immediately want to play again.</p>
      <p>Our initial prompt optimized for small programs and tiny sprites because we thought that would make generation more reliable and quicker. We also gave the model a fairly restrictive list of game genres. A request for a fighting game, for example, could end up classified as a dodge game because that was the closest category available.</p>
      <p>We loosened those constraints and tried using a more capable model. We moved generation to <code>Astra</code>, gave it more time to reason, added explicit game design guidance, and provided concrete examples of how things like movement, enemies, collisions, and game loops are implemented in our runtime.</p>
      <p>The games improved significantly. The mechanics were more coherent, and the model was much more capable of turning a weird request into something that resembled an actual game. The price for this quality was significantly slower generation time. Successful generations took around 5 minutes each, far too long to wait for a game to generate.</p>
      <p>Looking through what the model was generating made the bottleneck pretty obvious. For every request, <code>Astra</code> was rebuilding almost everything from scratch. Ask for a racing game, and it would rewrite vehicle movement, collisions, enemy behaviour, lap tracking, scoring, sprites, animations, and a bunch of other logic common across different games.</p>
      <p>So instead of trying to make one-shot generation from scratch better, we changed what “generation” meant. We had <code>Astra</code> spend more time, around 10 minutes per game, upfront building and refining a small catalog of base games. A base game was essentially a tested implementation of a particular set of mechanics. A racing foundation, for example, already knew how to handle a track, movement, laps, collisions, opponents, and scoring. Other foundations gave us things like platforming, shooting, dodging, or flying. Alongside those games, we kept reusable sprites, animations, sounds, and configurable behaviours.</p>
      <p>I found that when we gave the model access to the foundational games and asked it to change or improve something, it was much faster than when we asked it to invent the entire game at once. Now the model didn’t need to reinvent an entire game. If someone asked for “Mario Kart, but with planes,” we could reuse the racing mechanics from one game, reuse plane assets and flight behaviour from another, and only generate the parts necessary to connect or modify them.</p>
      <p>With reusable foundations, we needed something that could look at a game request, look at the components we had available, and choose the right ones extremely quickly. I’d been seeing <code>Jev</code> on Twitter, and its speed made this kind of selection problem interesting to try it on.</p>
      <p>So our process became the following: <code>Luna</code> took the player’s vague idea and expanded it into a detailed game plan. <code>Jev</code> looked through the foundations and reusable components we already had and selected the ones that best matched that plan. <code>Astra</code> then wrote whatever was still missing: configuration, glue code, or genuinely new behaviour that couldn’t be reused.</p>
      <FlowDiagram name="jev-reuse-flow" title="Generating a game from scratch and reusing components with Jev" />
      <p>Going back to our Mario Kart, but with planes test, without a foundation, the model wrote the game from scratch. That generation took <code>4m 2.1s</code> and produced <code>27,856</code> characters of JavaScript.</p>
      <p>Once we had a racing foundation that could be reused and built upon, the model only needed to describe how that existing game should change. The same request took <code>15.5s</code> vs. <code>242.1s</code>, and the amount of newly generated code fell from <code>27,856</code> characters to <code>217</code>. That was much closer to the interaction we originally wanted: say something weird, wait a few seconds, and start playing.</p>
      <p>There are still obvious limitations to this approach. Our foundations were fairly large. If your request happened to map nicely onto one of them, things worked really well. If you asked for something completely outside our existing base cases, the model still had to generate a lot more from scratch. But as more people played with the machine and generated games, our DB grew. Over time, that would make game generation faster as our base set of existing things increased.</p>
      <p>For the control panel of the arcade machine, we wanted to build a joystick and four-button assembly. We did this by desoldering an analog joystick from a broken Nintendo controller. A larger 3D-printed joystick was mounted on top of the smaller existing one to give players finer control over their movements. The four-button assembly was also 3D printed and allowed users to navigate the arcade UI.</p>
      <PhotoGallery photos={["controller"]} />
      <p>All of the components on the arcade’s control panel ran on an <code>ESP32</code> mcu and were soldered onto protoboards. Custom firmware running on the mcu calibrated the joystick, debounced the buttons, and let browser games read the controls as input.</p>
      <figure className={styles.circuitDiagram} aria-label="Analog joystick circuit diagram">
        <Image src="/murph-e/photos/12-joystick-schematic.svg" alt="Joystick circuit: X and Y potentiometers powered at 3.3 volts, with 1 kilohm resistors and 100 nanofarad capacitors filtering the ADC inputs." width={480} height={465} sizes="(max-width: 600px) calc(100vw - 80px), 480px" />
      </figure>
      <p>We also decided to add multiplayer. Conveniently, everyone at Hack the North was already walking around with a programmable badge around their neck. So we turned the badges themselves into controllers.</p>
      <p>We built a Lua app for them. When someone plugged their badge into the machine, we could install the app, which sent us their name, badge ID, and button presses. That meant hackers, sponsors, and judges could walk up and play using hardware they already had. The badge screens showed each person their player number and the controls for whatever game was currently running.</p>
      <PhotoGallery photos={["badge", "playing"]} />
      <p><strong>We ended up being semifinalists,</strong> but unfortunately, the machine decided to aptly live by its name during judging. We’d called it <strong>Murph-E, after Murphy’s law.</strong><sup className={styles.footnoteMarker}><FootnoteLink id="murphy-note-ref" href="#murphy-note" aria-label="Footnote 1: Murphy’s law and Interstellar" role="doc-noteref">1</FootnoteLink></sup></p>
      <PhotoGallery photos={["team"]} />
      <p>There are a few things I’d want to do differently if we kept working on it:</p>
      <ul>
        <li>Modularize the game library into much smaller reusable mechanics so we can reliably one-shot ideas that don’t fit neatly into one of our existing base games.</li>
        <li>Make the game gen faster and more robust, especially for requests that still require genuinely new mechanics. I’d iterate on the planning stage after the initial prompt.</li>
        <li>Build a much <InlineImagePreview label="smaller tabletop enclosure" src="/murph-e/arcade-mockup.webp" alt="Concept mockup of a compact yellow Murph-E tabletop arcade cabinet." width={1536} height={1024} />. I think something inspired by Teenage Engineering’s design language would be quite banger.</li>
      </ul>
      <p><strong>Hack the North felt like a great start to being back at Waterloo and making things for funsies.</strong></p>
      <PhotoGallery photos={["crowd", "finale"]} closing />
      <p>Huge shoutout to <a href="https://twitter.com/IKorovinsky" target="_blank" rel="noopener noreferrer">Ian</a> and the entire <a href="https://twitter.com/HackTheNorth" target="_blank" rel="noopener noreferrer">Hack the North organizing team</a>, who pour hours and hours of work into making this magical weekend happen every year!</p>
    </>
  );
}
