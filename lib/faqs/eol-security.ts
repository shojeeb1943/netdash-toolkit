import type { Faq } from "@/lib/tool-faqs"

export const eol_securityFaqs: Record<string, Faq[]> = {
  "php-eol-checker": [
    {
      q: "How long does each PHP release cycle receive active support?",
      a: "PHP versions typically receive active bug fixes for two years from their initial release, followed by two additional years of critical security fixes before reaching end of life.",
    },
    {
      q: "What risks are associated with running an end of life PHP version?",
      a: "Running an unsupported PHP version exposes your server to unpatched vulnerabilities, performance bottlenecks, and compatibility issues with modern content management systems and frameworks.",
    },
    {
      q: "Where does the PHP lifecycle and release data come from?",
      a: "Lifecycle and release schedules are retrieved in real time from the endoflife.date API, which tracks official PHP Group announcements and release branches.",
    },
  ],
  "mysql-eol-checker": [
    {
      q: "What is the difference between MySQL Premier and Extended Support?",
      a: "MySQL Premier Support provides complete bug and security updates for five years, followed by three years of Extended Support covering critical security fixes and operational support.",
    },
    {
      q: "How often does Oracle release MySQL Innovation and LTS versions?",
      a: "Oracle releases MySQL LTS versions every two years with long term support, alongside frequent Innovation releases for rapid feature adoption.",
    },
    {
      q: "Can I query lifecycle dates for older MySQL releases like 5.7?",
      a: "Yes. The tool tracks all historical and modern MySQL cycles including 5.7, 8.0, 8.4 LTS, and newer releases.",
    },
  ],
  "mariadb-eol-checker": [
    {
      q: "How long are MariaDB Community server LTS releases supported?",
      a: "MariaDB Foundation maintains designated Long Term Support (LTS) releases for five years, while short term innovation releases receive updates for one year.",
    },
    {
      q: "Is MariaDB a drop-in replacement for MySQL across all versions?",
      a: "MariaDB started as a fork of MySQL, but modern releases have added unique storage engines and syntax while maintaining high protocol compatibility.",
    },
    {
      q: "How can I check if my MariaDB release is still receiving security patches?",
      a: "Select your version branch in the tool above to see whether it is actively maintained, in security-only mode, or past its official maintenance window.",
    },
  ],
  "almalinux-eol-checker": [
    {
      q: "What is the relationship between AlmaLinux and Red Hat Enterprise Linux?",
      a: "AlmaLinux is an open source enterprise Linux distribution engineered to be 1:1 binary compatible with Red Hat Enterprise Linux (RHEL), following its 10 year release lifecycle.",
    },
    {
      q: "How long is AlmaLinux 8 and AlmaLinux 9 supported?",
      a: "AlmaLinux releases receive active support and security updates for 10 full years from release date, matching upstream enterprise stability standards.",
    },
    {
      q: "Does AlmaLinux charge for extended security updates?",
      a: "No. AlmaLinux is completely free and community-governed by the AlmaLinux OS Foundation with no licensing or subscription fees.",
    },
  ],
  "ubuntu-eol-checker": [
    {
      q: "What is the support timeframe for Ubuntu LTS releases?",
      a: "Ubuntu LTS (Long Term Support) releases receive 5 years of standard public updates from Canonical, expandable up to 10 or 12 years with Expanded Security Maintenance (ESM).",
    },
    {
      q: "How long are interim non-LTS Ubuntu releases supported?",
      a: "Interim releases published every six months in April and October receive 9 months of active maintenance before users must upgrade.",
    },
    {
      q: "How do I know if my server requires an Ubuntu distribution upgrade?",
      a: "Check your release version against the lifecycle table above. If the status indicates End of Life, you should immediately plan an in-place upgrade.",
    },
  ],
  "debian-eol-checker": [
    {
      q: "How long does the Debian Security Team maintain a stable release?",
      a: "Debian releases receive approximately three years of primary security support, followed by two additional years of Debian LTS and subsequent Extended LTS support.",
    },
    {
      q: "What is the difference between Debian Stable, Testing, and Unstable?",
      a: "Stable is the rigorously tested production release, Testing contains packages queued for the next release, and Unstable (Sid) is the active development branch.",
    },
    {
      q: "Does this tool track Debian Extended LTS (ELTS) timelines?",
      a: "Yes. The checker displays initial release dates, official security team support, and extended community support milestones.",
    },
  ],
  "cve-search": [
    {
      q: "What is the National Vulnerability Database (NVD)?",
      a: "The NVD is the United States government repository of standards-based vulnerability management data managed by the National Institute of Standards and Technology (NIST).",
    },
    {
      q: "How are Common Vulnerability Scoring System (CVSS) scores calculated?",
      a: "CVSS scores range from 0.0 to 10.0 based on exploitability metrics like attack vector, complexity, required privileges, and impact on confidentiality, integrity, and availability.",
    },
    {
      q: "Why are NVD search results cached in the browser?",
      a: "NIST enforces public API rate limits (approximately 5 requests per 30 seconds). Client side caching prevents temporary throttling while delivering instantaneous results.",
    },
  ],
  "pwned-password-checker": [
    {
      q: "Is it safe to check my password with this tool?",
      a: "Yes. Your password never leaves your browser. The tool computes a SHA-1 hash locally and sends only the first 5 characters to the Have I Been Pwned API using k-anonymity.",
    },
    {
      q: "What is k-anonymity mathematical privacy?",
      a: "K-anonymity ensures that the remote API only sees a 5-character prefix matching hundreds of possible hashes, making it mathematically impossible for anyone to determine your actual password.",
    },
    {
      q: "What should I do if my password is found in data breaches?",
      a: "You should immediately change that password anywhere it is used, create a unique high-entropy passphrase, and enable multi-factor authentication on all accounts.",
    },
  ],
}
