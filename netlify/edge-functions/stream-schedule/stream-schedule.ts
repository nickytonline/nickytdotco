import {Context} from 'https://edge.netlify.com';
import type {StreamGuestInfo} from './StreamGuestInfo.ts';
import {getScheduleMarkup} from './markupUtils.ts';

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_STREAM_GUEST_BASE_ID = Deno.env.get('AIRTABLE_STREAM_GUEST_BASE_ID');
const GUEST_FIELDS = [
  'Date',
  'Name',
  'Guest Title',
  'Stream Title',
  'Twitter Username',
  'Twitch Handle',
  'GitHub Handle',
  'YouTube Channel',
  'Website',
  'Polywork URL',
] as const;

async function getStreamSchedule(): Promise<StreamGuestInfo[]> {
  // Only get guests on the stream schedule from the day before and on
  const yesteday = new Date();
  yesteday.setDate(yesteday.getDate() - 1);

  const startDate = yesteday.toISOString();
  const filter = `&filterByFormula=IS_AFTER({Date}, '${startDate}')`;
  const sorter = `&sortField=Date&sortDirection=asc`;

  // Generates querystring key value pairs that look like this, Name&fields[]=Guest%20Title&fields[]=Stream%20Title
  const fields = GUEST_FIELDS.map(encodeURIComponent).join('&fields[]=');

  // Uses the Airtable API's filterByFormula (see https://support.airtable.com/docs/how-to-sort-filter-or-retrieve-ordered-records-in-the-api)
  const streamGuestInfoQueryUrl = `https://api.airtable.com/v0/${AIRTABLE_STREAM_GUEST_BASE_ID}/Stream%20Guests?${filter}${sorter}&fields[]=${fields}`;

  const response = await fetch(streamGuestInfoQueryUrl, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
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

export default async (request: Request, context: Context) => {
  // Locale is the first language in the Accept-Language header or 'en-US' if not present
  const locale =
    request.headers.get('Accept-Language')?.split(',')[0] ||
    request.headers.get('Accept-Language') ||
    'en-US';
  const {timezone = ''} = context.geo;

  const schedule = await getStreamSchedule();
  const scheduleMarkup = getScheduleMarkup({schedule, locale, timezone});

  const response = await context.next();

  // Cache the response for 24 hours
  response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  response.headers.set('x-timezone', timezone);
  response.headers.set('Vary', 'Accept-Language, x-timezone');

  const text = await response.text();

  return new Response(text.replace('replace-with-schedule', scheduleMarkup), response);
};

export const config = {
  cache: 'manual',
  path: '/pages/stream-schedule/',
};
