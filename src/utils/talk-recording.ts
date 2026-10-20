export type TalkRecordingNote = "coming-soon" | "not-recorded";

type TalkRecordingInput = {
  hasVideo: boolean;
  isUpcoming: boolean;
  videoComingSoon?: boolean;
};

/**
 * Note shown in place of a player once a talk is no longer upcoming.
 * A pending recording is not the same as a talk that was not recorded.
 */
export function talkRecordingNote(
  input: TalkRecordingInput
): TalkRecordingNote | undefined {
  if (input.hasVideo || input.isUpcoming) {
    return undefined;
  }

  return input.videoComingSoon ? "coming-soon" : "not-recorded";
}

export function talkRecordingNoteText(note: TalkRecordingNote): string {
  return note === "coming-soon"
    ? "Video coming soon."
    : "This talk was not recorded.";
}

/** Cover art stands in for the player while a talk is upcoming or awaiting video. */
export function showTalkHeroImage(
  input: TalkRecordingInput & { hasCover: boolean }
): boolean {
  return (
    !input.hasVideo &&
    input.hasCover &&
    (input.isUpcoming || input.videoComingSoon === true)
  );
}
