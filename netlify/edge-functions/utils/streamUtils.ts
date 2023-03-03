import {StreamGuestInfo} from './StreamGuestInfo.ts';

const GUEST_FIELDS = [
  'Date',
  'Name',
  'Guest Title',
  'Stream Title',
  'Stream Description',
  'Twitter Username',
  'Twitch Handle',
  'GitHub Handle',
  'YouTube Channel',
  'Website',
  'Polywork URL',
] as const;

export async function getStreamSchedule({
  apiKey,
  baseId,
}: {
  apiKey: string;
  baseId: string;
}): Promise<StreamGuestInfo[]> {
  // Only get guests on the stream schedule from the day before and on
  const yesteday = new Date();
  yesteday.setDate(yesteday.getDate() - 1);

  const startDate = yesteday.toISOString();
  const filter = `&filterByFormula=IS_AFTER({Date}, '${startDate}')`;
  const sorter = `&sortField=Date&sortDirection=asc`;

  // Generates querystring key value pairs that look like this, Name&fields[]=Guest%20Title&fields[]=Stream%20Title
  const fields = GUEST_FIELDS.map(encodeURIComponent).join('&fields[]=');

  // Uses the Airtable API's filterByFormula (see https://support.airtable.com/docs/how-to-sort-filter-or-retrieve-ordered-records-in-the-api)
  const streamGuestInfoQueryUrl = `https://api.airtable.com/v0/${baseId}/Stream%20Guests?${filter}${sorter}&fields[]=${fields}`;

  const response = await fetch(streamGuestInfoQueryUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  interface GuestRecord {
    createdTime: string;
    fields: Record<typeof GUEST_FIELDS[number], string>;
  }

  const {records} = (await response.json()) as {records: GuestRecord[]};
  // Can't use satifies. Functions bundler doesn't support it yet
  const schedule: StreamGuestInfo[] = records.map(({fields}) => {
    const {
      Date: date,
      Name: name,
      'Guest Title': title,
      'Stream Title': streamTitle,
      'Stream Description': streamDescription,
      'Twitter Username': twitter,
      'Twitch Handle': twitch,
      'GitHub Handle': github,
      'YouTube Channel': youtube,
      Website: website,
      'Polywork URL': polywork,
    } = fields;

    return {
      date,
      name,
      title: title ?? '',
      streamTitle,
      streamDescription,
      twitter,
      twitch,
      github,
      youtube,
      website,
      polywork,
    };
  });

  return schedule;
}

export async function getLatestGuest({apiKey, baseId}: {apiKey: string; baseId: string}) {
  const schedule = await getStreamSchedule({apiKey, baseId});

  return schedule[0];
}
