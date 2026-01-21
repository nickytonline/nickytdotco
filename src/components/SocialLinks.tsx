import {
  GithubIcon,
  LinkedinIcon,
  YoutubeIcon,
  TwitchIcon,
  InstagramIcon,
  TwitterIcon,
  Music2,
  Globe,
} from "lucide-react";

// Custom Mastodon icon component
const MastodonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
  </svg>
);

const DevToIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 448 512"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z" />
  </svg>
);

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "YouTube",
    url: "https://youtube.com/@nickytonline",
    icon: YoutubeIcon,
    description: "Subscribe for tech content and tutorials",
  },
  {
    name: "GitHub",
    url: "https://github.com/nickytonline",
    icon: GithubIcon,
    description: "Check out my open source projects",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/nickytonline",
    icon: TwitterIcon,
    description: "Follow me on X",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/nickytonline",
    icon: LinkedinIcon,
    description:
      "Connect with me professionally. Please add a message if I don't know you.",
  },
  {
    name: "Dev.to",
    url: "https://dev.to/nickytonline",
    icon: DevToIcon,
    description: "Read my technical articles and blog posts",
  },
  {
    name: "Twitch",
    url: "https://twitch.tv/nickytonline",
    icon: TwitchIcon,
    description: "Watch me code live",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@nickytonline",
    icon: Music2,
    description: "Follow me for a mix of tech and personal content",
  },
  {
    name: "Bluesky",
    url: "https://bsky.app/profile/nickyt.online",
    icon: Globe,
    description: "Follow me on Bluesky",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/nickytonline",
    icon: InstagramIcon,
    description: "Follow me for a mix of tech and personal content.",
  },
  {
    name: "Mastodon",
    url: "https://hachyderm.io/@nickytonline",
    icon: MastodonIcon,
    description: "Find me on the Fediverse",
  },
];

const SocialLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-6 rounded-lg transition-all duration-200 focus:outline-none"
          >
            <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-secondary group-hover:bg-pink-600 group-focus:bg-pink-600 dark:group-hover:bg-pink-500 dark:group-focus:bg-pink-500 transition-colors duration-200">
              <Icon className="w-6 h-6 text-secondary-foreground group-hover:text-white group-focus:text-white transition-colors duration-200" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground">
                {social.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {social.description}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
