import {Context} from 'https://edge.netlify.com';

interface StreamGuestInfo {
  date: string;
  streamTitle: string;
  name: string;
  title: string | undefined;
  twitter: string | undefined;
  youtube: string | undefined;
  twitch: string | undefined;
  github: string | undefined;
  website: string | undefined;
}

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
const AIRTABLE_STREAM_GUEST_BASE_ID = Deno.env.get('AIRTABLE_STREAM_GUEST_BASE_ID');

function buildWebsiteLink({name, website}: {name: string; website: string | undefined}) {
  if (!website) {
    return '';
  }

  return `
  <li>
    <a href="${website}" title="${name}'s Website">
      <span class="visually-hidden">${name}'s Website</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
    </a>
  </li>
  `;
}

function buildTwitterLink({name, twitter}: {name: string; twitter: string | undefined}) {
  if (!twitter) {
    return '';
  }

  const sanitizedTwitterUrl = twitter
    .replace(/https:\/\/(www\.)?twitter\.com\//, '')
    .replace('@', '');

  return `
  <li><a href="https://twitter.com/${sanitizedTwitterUrl}" title="${name}'s Twitter Profile"><span class="visually-hidden">${name}'s Twitter Profile</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a></li>
  `;
}

function buildTwitchLink({name, twitch}: {name: string; twitch: string | undefined}) {
  if (!twitch) {
    return '';
  }

  const sanitizedTwitchUrl = twitch
    .replace(/https:\/\/(www\.)?twitch\.tv\//, '')
    .replace('@', '');

  return `
  <li><a href="https://twitch.tv/${sanitizedTwitchUrl}" title="${name}'s Twitch Profile"><span class="visually-hidden">${name}'s Twitch Profile</span> <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg></a></li>
  `;
}

function buildYoutubeLink({name, youtube}: {name: string; youtube: string | undefined}) {
  if (!youtube) {
    return '';
  }

  const sanitizedYoutubeUrl = youtube.replace(/https:\/\/(www\.)?youtube\.com\//, '');

  return `
  <li><a href="https://youtube.com/${sanitizedYoutubeUrl}" title="${name}'s YouTube channel"><span class="visually-hidden">${name}'s YouTube channel</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
  </a>
  </li>
  `;
}

function buildGithubLink({name, github}: {name: string; github: string | undefined}) {
  if (!github) {
    return '';
  }

  const sanitizedGithubUrl = github.replace(/https:\/\/(www\.)?github\.com\//, '');

  return `
    <li><a href="https://github.com/${sanitizedGithubUrl}" title="${name}'s GitHub profile"><span class="visually-hidden">${name}'s GitHub profile</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      </a>
    </li>`;
}

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
    .map(
      ({date, streamTitle, name, title, twitter, website, twitch, youtube, github}) => {
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
        <nav class="nav" aria-label="Links for live stream guest ${name}">
          <ul>
          ${buildWebsiteLink({name, website})}
          ${buildGithubLink({name, github})}
          ${buildTwitterLink({name, twitter})}
          ${buildTwitchLink({name, twitch})}
          ${buildYoutubeLink({name, youtube})}
          </ul>
        </nav>
      </div>
    </li>
  `;
      }
    )
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
  const fields = [
    'Date',
    'Name',
    'Guest Title',
    'Stream Title',
    'Twitter Username',
    'Twitch Handle',
    'GitHub Handle',
    'YouTube Channel',
    'Website',
  ]
    .map(encodeURIComponent)
    .join('&fields[]=');

  // Uses the Airtable API's filterByFormula (see https://support.airtable.com/docs/how-to-sort-filter-or-retrieve-ordered-records-in-the-api)
  const streamGuestInfoQueryUrl = `https://api.airtable.com/v0/${AIRTABLE_STREAM_GUEST_BASE_ID}/Stream%20Guests?${filter}${sorter}&fields[]=${fields}`;

  const response = await fetch(streamGuestInfoQueryUrl, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  type FieldKeys =
    | 'Date'
    | 'Name'
    | 'Guest Title'
    | 'Stream Title'
    | 'Twitter Username'
    | 'Twitch Handle'
    | 'GitHub Handle'
    | 'YouTube Channel'
    | 'Website';

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
      'Twitter Username': twitter,
      'Twitch Handle': twitch,
      'GitHub Handle': github,
      'YouTube Channel': youtube,
      Website: website,
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
