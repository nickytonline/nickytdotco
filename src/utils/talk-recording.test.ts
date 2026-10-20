import { describe, expect, it } from "vitest";
import {
  showTalkHeroImage,
  talkRecordingNote,
  talkRecordingNoteText,
} from "./talk-recording";

describe("talkRecordingNote", () => {
  it("hides the note while a video is available", () => {
    expect(
      talkRecordingNote({
        hasVideo: true,
        isUpcoming: false,
        videoComingSoon: true,
      })
    ).toBeUndefined();
  });

  it("hides the note for an upcoming talk", () => {
    expect(
      talkRecordingNote({
        hasVideo: false,
        isUpcoming: true,
        videoComingSoon: true,
      })
    ).toBeUndefined();
  });

  it("says the video is coming soon when a recording is still pending", () => {
    const note = talkRecordingNote({
      hasVideo: false,
      isUpcoming: false,
      videoComingSoon: true,
    });

    expect(note).toBe("coming-soon");
    expect(talkRecordingNoteText("coming-soon")).toBe("Video coming soon.");
  });

  it("says a past talk without a pending recording was not recorded", () => {
    const note = talkRecordingNote({
      hasVideo: false,
      isUpcoming: false,
    });

    expect(note).toBe("not-recorded");
    expect(talkRecordingNoteText("not-recorded")).toBe(
      "This talk was not recorded."
    );
  });
});

describe("showTalkHeroImage", () => {
  it("shows the cover while the recording is pending", () => {
    expect(
      showTalkHeroImage({
        hasVideo: false,
        isUpcoming: false,
        videoComingSoon: true,
        hasCover: true,
      })
    ).toBe(true);
  });

  it("hides the cover once a video is available", () => {
    expect(
      showTalkHeroImage({
        hasVideo: true,
        isUpcoming: false,
        videoComingSoon: true,
        hasCover: true,
      })
    ).toBe(false);
  });
});
