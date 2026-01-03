import profileImage from "../assets/angelbaez-headshot.webp";
import type { UiKey } from "@/i18n/ui";

const userData = [
  {
    userName: "Angel Baez",
    userDesc: "Software engineer and entrepreneur",
    userPic: profileImage,
    userPicDark: profileImage,
  },
];

const links: Array<{
  labelKey: UiKey;
  ariaKey: UiKey;
  url: string;
  icon: string;
}> = [
  {
    labelKey: "links.run.label",
    ariaKey: "links.run.aria",
    url: "/run",
    icon: "simple-icons:strava",
  },
  {
    labelKey: "links.prepain.label",
    ariaKey: "links.prepain.aria",
    url: "https://prepain.mx/angel/",
    icon: "simple-icons:rss",
  },
  {
    labelKey: "links.linkedin.label",
    ariaKey: "links.linkedin.aria",
    url: "https://www.linkedin.com/in/angelromerobaez",
    icon: "simple-icons:linkedin",
  },
  {
    labelKey: "links.github.label",
    ariaKey: "links.github.aria",
    url: "https://github.com/baezor/",
    icon: "simple-icons:github",
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/angelromerobaez",
    icon: "simple-icons:linkedin",
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/baezor/",
    icon: "simple-icons:facebook",
  },
  {
    label: "GitHub",
    url: "https://github.com/baezor/",
    icon: "simple-icons:github",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/baez0r/",
    icon: "simple-icons:instagram",
  },
  {
    label: "Strava",
    url: "https://www.strava.com/athletes/22649377",
    icon: "simple-icons:strava",
  },
  {
    label: "X / Twitter",
    url: "https://x.com/baezor/",
    icon: "simple-icons:x",
  },
  {
    label: "RSS Feed",
    url: "/rss.xml",
    icon: "simple-icons:rss",
  },
];

export { userData, links, socialLinks };
