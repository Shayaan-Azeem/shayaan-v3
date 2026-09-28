import Image from "next/image";
import styles from "./murph-e.module.css";

const PHOTOS = {
  initialDesign: ["16-initial-design.webp", 1199, 1600, "Initial whiteboard sketch of Murph-E’s arcade cabinet and controls."],
  finale: ["15-team-finale.webp", 1600, 1066, "The Murph-E team beside the arcade at Hack the North."],
  team: ["14-team-group.webp", 1600, 1200, "The Murph-E team with the finished arcade cabinet."],
  facetime: ["13-htn-facetime.webp", 1600, 1062, "Thursday night’s FaceTime call."],
  planning: ["01-planning-notes.webp", 666, 316, "The planning doc: a whimsical arcade machine."],
  grinding: ["03-angle-grinding.webp", 900, 1600, "Making room for the CRT."],
  painting: ["04-spray-painting.webp", 1200, 1600, "Spray painting the cardboard shell."],
  assembly: ["05-assembling-cardboard-shell.webp", 1200, 1600, "Fitting the shell around the frame."],
  controller: ["06-custom-controller.webp", 1151, 1536, "The custom joystick and button assembly."],
  badge: ["07-badge-controller-app.webp", 1200, 1600, "Player identity and controls on the badge."],
  playing: ["08-playing-with-badge.webp", 1200, 1600, "Playing on the CRT with a badge connected."],
  crowd: ["10-people-around-murphe.webp", 1200, 1600, "People gathering around Murph-E at Hack the North."],
} as const;

export default function PhotoGallery({ photos, eager = false, overlap = false, closing = false }: { photos: (keyof typeof PHOTOS)[]; eager?: boolean; overlap?: boolean; closing?: boolean }) {
  return (
    <div className={`${styles.gallery} ${closing ? styles.closingCollage : overlap ? styles.planningCollage : photos.length === 1 ? styles.singlePhoto : photos.length === 3 ? styles.threePhotos : ""}`}>
      {photos.map((key) => {
        const [file, width, height, caption] = PHOTOS[key];
        return (
          <figure key={key} style={{ maxWidth: 560 * width / height + 16 }}>
            <Image className={key === "facetime" ? styles.unframed : undefined} src={`/murph-e/photos/${file}`} alt={caption} width={width} height={height}
              sizes={closing ? "(max-width: 600px) calc(67vw - 54px), (max-width: 728px) 67vw, 448px" : photos.length === 1 || overlap ? "(max-width: 600px) calc(100vw - 80px), (max-width: 728px) calc(100vw - 40px), 672px" : photos.length === 3 ? "(max-width: 480px) calc((100vw - 100px) / 3), (max-width: 600px) calc((100vw - 112px) / 3), (max-width: 728px) calc((100vw - 72px) / 3), 214px" : "(max-width: 480px) calc(100vw - 80px), (max-width: 600px) calc((100vw - 96px) / 2), (max-width: 728px) calc((100vw - 56px) / 2), 328px"}
              loading={eager ? "eager" : "lazy"} />
          </figure>
        );
      })}
    </div>
  );
}
