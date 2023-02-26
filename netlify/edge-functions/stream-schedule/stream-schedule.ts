import {Context} from 'https://edge.netlify.com';

interface StreamGuestInfo {
  date: string;
  streamTitle: string;
  name: string;
  title: string;
}

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_STREAM_GUEST_BASE_ID = Deno.env.get('AIRTABLE_STREAM_GUEST_BASE_ID');

function getScheduleMarkup({
  schedule,
  locale,
  timezone,
}: {
  schedule: StreamGuestInfo[];
  locale: string;
  timezone: string;
}) {
  const scheduleMarkup = schedule
    .map(({date, streamTitle, name, title}) => {
      const guestDate = new Date(date).toLocaleString(locale, {
        timeZone: timezone,
        dateStyle: 'full',
        timeStyle: 'long',
      });

      return `
    <li class="post-list__item">
    <h2>${streamTitle}</h2>
    <time datetime="${date}">${guestDate}</time>
      <div>
        <div>${name}</div>
        <div>${title}</div>
      </div>
    </li>
  `;
    })
    .join('');

  return `<ol class="[ post-list__items ] [ sf-flow ] [ pad-top-300 ]">${scheduleMarkup}</ol>`;
}

async function getStreamSchedule(): Promise<StreamGuestInfo[]> {
  // Only get guests on the stream schedule from the day before and on
  const yesteday = new Date();
  yesteday.setDate(yesteday.getDate() - 1);

  const startDate = yesteday.toISOString();
  const filter = `&filterByFormula=IS_AFTER({Date}, '${startDate}')`;
  const sorter = `&sortField=Date&sortDirection=asc`;

  // Generates querystring key value pairs that look like this, Name&fields[]=Guest%20Title&fields[]=Stream%20Title
  const fields = ['Date', 'Name', 'Guest Title', 'Stream Title']
    .map(encodeURIComponent)
    .join('&fields[]=');

  // Uses the Airtable API's filterByFormula (see https://support.airtable.com/docs/how-to-sort-filter-or-retrieve-ordered-records-in-the-api)
  const streamGuestInfoQueryUrl = `https://api.airtable.com/v0/${AIRTABLE_STREAM_GUEST_BASE_ID}/Stream%20Guests?${filter}${sorter}&fields[]=${fields}`;

  const response = await fetch(streamGuestInfoQueryUrl, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  type FieldKeys = 'Date' | 'Name' | 'Guest Title' | 'Stream Title';

  interface GuestRecord {
    createdTime: string;
    fields: Record<FieldKeys, string>;
  }

  const {records} = (await response.json()) as {records: GuestRecord[]};
  // Can't use satifies. Functions bundler doesn't support it yet
  const schedule: StreamGuestInfo[] = records.map(({fields}) => {
    const {
      Date: date,
      Name: name,
      'Guest Title': title,
      'Stream Title': streamTitle,
    } = fields;

    return {
      date,
      name,
      title,
      streamTitle,
    };
  });

  return schedule;
}

export default async (request: Request, context: Context) => {
  const locale =
    request.headers.get('Accept-Language')?.split(',')[0] ||
    request.headers.get('Accept-Language') ||
    'en-US';
  const {timezone} = context.geo;

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
