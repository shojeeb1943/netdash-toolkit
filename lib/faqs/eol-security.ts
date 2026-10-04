import type { Faq } from "@/lib/tool-faqs"

export const eol_securityFaqs: Record<string, Faq[]> = {
  "cve-search": [
    {
      q: "What database does the CVE Search tool query?",
      a: "It queries official National Vulnerability Database (NVD) and MITRE Common Vulnerabilities and Exposures (CVE) records to retrieve vulnerability descriptions, CVSS severity scores, affected software versions, and official patch advisories.",
    },
    {
      q: "What is a CVSS score and how do I interpret the severity rating?",
      a: "The Common Vulnerability Scoring System (CVSS v3.1) rates vulnerabilities from 0.0 to 10.0: Low (0.1-3.9), Medium (4.0-6.9), High (7.0-8.9), and Critical (9.0-10.0). Critical vulnerabilities typically allow remote code execution without authentication.",
    },
    {
      q: "Can I search by software package name as well as CVE identifier?",
      a: "Yes. You can enter specific CVE IDs (e.g. 'CVE-2024-6387') or search by software package and version (e.g. 'OpenSSH 9.6p1' or 'cPanel') to identify known security vulnerabilities.",
    },
    {
      q: "Is my search query logged or shared with external security agencies?",
      a: "No. Search queries query public vulnerability APIs in real time for diagnostic evaluation only. We do not store or track user searches.",
    },
    {
      q: "What security software automatically patches known CVEs on cPanel servers?",
      a: "Imunify360 provides proactive defense and automated kernel/PHP patching that neutralizes active CVE exploits before official software vendor patches are applied.",
    },
    {
      q: "What is the difference between a zero-day vulnerability and a published CVE?",
      a: "A zero-day vulnerability is an unpatched flaw actively exploited in the wild before public disclosure. A published CVE is a formally cataloged vulnerability with an assigned identifier and vendor remediation steps.",
    },
  ],
  "pwned-password-checker": [
    {
      q: "How does the Pwned Password Checker verify breached credentials securely?",
      a: "It uses k-anonymity mathematical models: it computes the SHA-1 hash of the password locally in your browser, sends only the first 5 characters of the hash to the HaveIBeenPwned API, and matches the remaining hash suffix locally.",
    },
    {
      q: "Does my real password ever leave my web browser?",
      a: "No, never. Your plaintext password is never sent over the network. The remote API only receives a 5-character hash prefix shared by thousands of unrelated passwords, ensuring complete mathematical privacy.",
    },
    {
      q: "What should I do if my password appears in the breach database?",
      a: "Immediately change that password on all websites where it was used, enable two-factor authentication (2FA), and generate a unique high-entropy passphrase using a password manager.",
    },
    {
      q: "Is my password search recorded or added to any list?",
      a: "No. All hashing occurs in local memory and the search results are discarded immediately. No queries or hashes are saved.",
    },
    {
      q: "What related tool helps create unbreachable master passwords?",
      a: "Use the Passphrase Generator to create long, memorable Diceware passphrases and the Secret Generator for high-entropy alphanumeric strings.",
    },
    {
      q: "Why is credential stuffing dangerous for users who reuse passwords?",
      a: "When a single website suffers a database breach, automated cybercrime bots test the leaked email and password combinations across thousands of other services (cPanel, banking, email, WHMCS).",
    },
  ],
  "php-eol-checker": [
    {
      q: "What lifecycle milestones does the PHP EOL Checker track?",
      a: "It tracks official PHP release dates, Active Support end dates (bug fixes + security patches), and End of Life (EOL) security support deadlines across all PHP versions (PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4).",
    },
    {
      q: "What is the standard support lifecycle duration for a PHP version?",
      a: "Each PHP branch receives 2 years of Active Support from release date, followed by 1 additional year of Critical Security Fixes only, for a total official lifecycle of 3 years.",
    },
    {
      q: "What are the security risks of running an EOL PHP version in production?",
      a: "Once a PHP version reaches EOL, the PHP development team no longer releases security patches. Any newly discovered vulnerabilities remain unpatched, exposing websites to remote code execution and SQL injection.",
    },
    {
      q: "Does this tool store or log my PHP version searches?",
      a: "No. All PHP lifecycle dates are evaluated locally from verified release databases in your browser session without tracking.",
    },
    {
      q: "How does CloudLinux Hardened PHP protect legacy EOL PHP versions?",
      a: "CloudLinux Hardened PHP backports modern security patches to legacy PHP versions (PHP 5.6 through 7.4), allowing web hosts to support legacy client scripts safely without vulnerability risks.",
    },
    {
      q: "What are the current EOL dates for PHP 8.1, 8.2, and 8.3?",
      a: "PHP 8.1 reached EOL in November 2024. PHP 8.2 security support ends in December 2025. PHP 8.3 security support extends through November 2026.",
    },
  ],
  "mysql-eol-checker": [
    {
      q: "What lifecycle phases does the MySQL EOL Checker report?",
      a: "It tracks Premier Support, Extended Support, and Sustaining Support end dates for major Oracle MySQL releases (MySQL 5.7, 8.0, 8.4 LTS, 9.x Innovation).",
    },
    {
      q: "What is the new MySQL Long Term Support (LTS) release model?",
      a: "Starting with MySQL 8.4, Oracle adopted an LTS model where LTS versions receive 5 years of Premier Support and 3 years of Extended Support (8 years total), while Innovation releases provide short-term feature previews.",
    },
    {
      q: "When did MySQL 5.7 reach official End of Life?",
      a: "MySQL 5.7 reached official End of Life in October 2023. Servers still running MySQL 5.7 should upgrade to MySQL 8.0 or MariaDB 10.11 LTS immediately.",
    },
    {
      q: "Does this tool store my database version queries?",
      a: "No. All database lifecycle checks execute locally inside your browser session using verified Oracle lifecycle timelines.",
    },
    {
      q: "What related tool tracks MariaDB open-source database lifecycles?",
      a: "Use the MariaDB EOL Checker to inspect support timelines for MariaDB 10.5, 10.6, 10.11, and 11.4 LTS database engines.",
    },
    {
      q: "What are the support deadlines for MySQL 8.0 and MySQL 8.4 LTS?",
      a: "MySQL 8.0 Premier Support ends in April 2026. MySQL 8.4 LTS is supported with premier updates through April 2029 (Extended Support to 2032).",
    },
  ],
  "mariadb-eol-checker": [
    {
      q: "What lifecycle milestones does the MariaDB EOL Checker track?",
      a: "It tracks General Availability (GA) release dates and End of Life (EOL) maintenance support deadlines across MariaDB Short-Term and Long-Term Support (LTS) releases.",
    },
    {
      q: "What is the difference between MariaDB LTS and Short-Term releases?",
      a: "MariaDB LTS releases (such as 10.6, 10.11, 11.4) receive 5 full years of guaranteed security and bugfix maintenance, whereas Short-Term rolling releases are maintained for only 1 year.",
    },
    {
      q: "Why is MariaDB preferred as a default database engine on cPanel and Linux?",
      a: "MariaDB provides full drop-in compatibility with MySQL, enhanced query optimization, advanced storage engines (Aria, ColumnStore), and transparent open-source governance.",
    },
    {
      q: "Is my MariaDB database version query logged or tracked?",
      a: "No. The lookup queries local release metadata in your browser without external API transmission.",
    },
    {
      q: "What are the official EOL dates for MariaDB 10.5, 10.6, and 10.11 LTS?",
      a: "MariaDB 10.5 reaches EOL in June 2025. MariaDB 10.6 LTS is supported through July 2026. MariaDB 10.11 LTS is supported through February 2028.",
    },
    {
      q: "What tool helps optimize database memory allocation for MariaDB?",
      a: "Use the MySQL RAM Calculator in the Server Planning category to tune innodb_buffer_pool_size and per-thread memory limits for your database engine.",
    },
  ],
  "almalinux-eol-checker": [
    {
      q: "What lifecycle milestones does the AlmaLinux EOL Checker display?",
      a: "It displays official General Availability release dates, Full Support end dates, and End of Life (EOL) Maintenance Support deadlines for AlmaLinux 8, AlmaLinux 9, and AlmaLinux 10.",
    },
    {
      q: "Why is AlmaLinux the leading operating system choice for cPanel and hosting servers?",
      a: "AlmaLinux provides 1:1 binary compatibility with Red Hat Enterprise Linux (RHEL), an open-source community-governed foundation, zero licensing fees, and guaranteed enterprise maintenance through at least 2032.",
    },
    {
      q: "What is the difference between Full Support and Maintenance Support in AlmaLinux?",
      a: "Full Support includes new feature additions, hardware enablement, and bug fixes. Maintenance Support focuses strictly on critical security patches (CVEs) and severe bug fixes.",
    },
    {
      q: "Is my server version query tracked or sent to telemetry servers?",
      a: "No. All lifecycle dates are evaluated locally from verified release databases in your browser session without tracking.",
    },
    {
      q: "What are the EOL dates for AlmaLinux 8 and AlmaLinux 9?",
      a: "AlmaLinux 8 active support concludes in May 2029. AlmaLinux 9 maintenance support extends through May 2032, providing long-term operational stability for web hosting fleets.",
    },
    {
      q: "What related tools check end-of-life dates for other enterprise Linux distributions?",
      a: "Use the Ubuntu EOL Checker and Debian EOL Checker to compare support lifecycles across major Linux server operating systems.",
    },
  ],
  "ubuntu-eol-checker": [
    {
      q: "What lifecycle information does the Ubuntu EOL Checker track?",
      a: "It tracks Standard Security Maintenance end dates, Expanded Security Maintenance (ESM/Ubuntu Pro) timelines, and End of Life dates for Ubuntu LTS (Long Term Support) and interim releases.",
    },
    {
      q: "What is the standard support duration for Ubuntu LTS server releases?",
      a: "Ubuntu LTS releases receive 5 years of standard security maintenance, which can be extended to 10 or 12 years with an Ubuntu Pro subscription (ESM).",
    },
    {
      q: "Why should production web hosting servers avoid interim (non-LTS) Ubuntu releases?",
      a: "Interim releases (e.g. 23.10, 24.10) receive only 9 months of support, requiring frequent operating system upgrades that risk downtime on production hosting nodes.",
    },
    {
      q: "Does this tool store or log my Ubuntu version queries?",
      a: "No. The lifecycle lookup executes entirely in your browser using local release data feeds. No server data is transmitted.",
    },
    {
      q: "What are the standard EOL dates for Ubuntu 20.04 LTS, 22.04 LTS, and 24.04 LTS?",
      a: "Ubuntu 20.04 LTS standard support ended in April 2025 (ESM to 2030). Ubuntu 22.04 LTS is supported through April 2027 (ESM to 2032). Ubuntu 24.04 LTS is supported through April 2029 (ESM to 2036).",
    },
    {
      q: "What tool helps check RHEL-compatible distribution lifecycles?",
      a: "Use the AlmaLinux EOL Checker to inspect support timelines for enterprise RHEL-compatible hosting servers.",
    },
  ],
  "debian-eol-checker": [
    {
      q: "What lifecycle milestones does the Debian EOL Checker report?",
      a: "It tracks Debian standard security support windows, Long Term Support (LTS) extension phases, and Extended LTS (ELTS) timelines across major Debian releases (Debian 10 Buster, 11 Bullseye, 12 Bookworm, 13 Trixie).",
    },
    {
      q: "How long is a Debian stable release supported by the official security team?",
      a: "Debian receives approximately 3 years of standard security support from the core Debian Security Team, followed by an additional 2 years of community LTS support, totaling 5 years of security updates.",
    },
    {
      q: "Why is Debian widely deployed for standalone DNS and mail servers?",
      a: "Debian's conservative release philosophy, rigorous package vetting, minimal base memory footprint, and rock-solid stability make it a preferred platform for dedicated network services.",
    },
    {
      q: "Is my Debian version search tracked or saved remotely?",
      a: "No. All Debian lifecycle dates are queried locally in your browser. None of your operating system selections or queries are recorded.",
    },
    {
      q: "What are the support deadlines for Debian 11 Bullseye and Debian 12 Bookworm?",
      a: "Debian 11 Bullseye LTS support runs through June 2026. Debian 12 Bookworm standard and LTS support extends through June 2028.",
    },
    {
      q: "What related tools check lifecycle dates for Ubuntu and AlmaLinux?",
      a: "Use the Ubuntu EOL Checker and AlmaLinux EOL Checker to compare enterprise Linux support lifespans across your infrastructure.",
    },
  ],
}
