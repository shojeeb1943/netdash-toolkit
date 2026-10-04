import type { Faq } from "@/lib/tool-faqs"

export const linux_commandsFaqs: Record<string, Faq[]> = {
  "tar-command-generator": [
    {
      q: "What do the letters in tar -czf mean?",
      a: "c creates an archive, z compresses it with gzip and f says the next word is the file name. Use x instead of c to extract and t to list.",
    },
    {
      q: "Which compression should I pick?",
      a: "gzip is fastest and universal. xz compresses smallest but is slow. zstd is a good middle ground and needs a recent tar. bzip2 sits between gzip and xz.",
    },
    {
      q: "What does the base folder option do?",
      a: "It adds -C so tar changes into that folder first. The archive then holds short relative paths such as public_html instead of the full absolute path.",
    },
  ],
  "find-command-generator": [
    {
      q: "How does the days filter work?",
      a: "+30 means modified more than 30 days ago, -7 means within the last 7 days and 3 means exactly 3 days. Days are whole 24 hour blocks.",
    },
    {
      q: "Is the delete option safe?",
      a: "It works, but deleted files cannot be recovered. The tool adds a reminder to run the same command with -print first and read the list before deleting.",
    },
    {
      q: "Why is the name pattern quoted?",
      a: "Without quotes the shell expands the star before find sees it, which gives wrong results or an error. The generator quotes patterns for you.",
    },
  ],
  "grep-command-generator": [
    {
      q: "What is the difference between -E, -F and -P?",
      a: "-E uses extended regular expressions, -F searches plain text with no special characters, and -P uses Perl style patterns where your grep supports it.",
    },
    {
      q: "How do I search only certain files?",
      a: "Fill the include field with a pattern such as *.log. The command adds --include so grep skips other file types when searching folders.",
    },
    {
      q: "Why does the command include a double dash?",
      a: "It marks the end of options, so a pattern that starts with a hyphen is treated as text, not as an option.",
    },
  ],
  "sed-command-generator": [
    {
      q: "How does sed replace text?",
      a: "The s command looks like s/old/new/g. The g at the end replaces every match on a line, and without it only the first match on each line changes.",
    },
    {
      q: "What does plain text mode do?",
      a: "It escapes characters with special meaning in regular expressions, such as dots and brackets, so a domain name matches exactly as typed.",
    },
    {
      q: "Is in place editing risky?",
      a: "It rewrites the file. The backup suffix keeps a copy under the original name plus that suffix, so a mistake can be undone.",
    },
  ],
  "awk-command-generator": [
    {
      q: "What is a field in awk?",
      a: "Awk splits each line into fields by whitespace or by the separator you set. $1 is the first field, $2 the second, and $0 is the whole line.",
    },
    {
      q: "How do I add up a column?",
      a: "Choose the add up task and the column. The command keeps a running total for every matching line and prints it once at the end.",
    },
    {
      q: "What does the filter do?",
      a: "It limits the work to lines where a column meets your test, such as column 9 equal to 404 in a web server access log.",
    },
  ],
  "curl-command-generator": [
    {
      q: "Does this tool send the request?",
      a: "No. It only writes the command text. You copy it and run it yourself, so the URL and any credentials never leave this page.",
    },
    {
      q: "What does the JSON option do?",
      a: "It checks that the body is valid JSON and adds a Content-Type header for you if you did not give one.",
    },
    {
      q: "Is the skip certificate option safe?",
      a: "It turns off HTTPS certificate checks, which removes protection against interception. Use it only on a test system you trust, and the tool adds a warning comment.",
    },
  ],
  "wget-command-generator": [
    {
      q: "How do I resume an interrupted download?",
      a: "Use the resume option, which adds -c. Wget continues from where the partial file stopped if the server supports ranges.",
    },
    {
      q: "What does the mirror option do?",
      a: "It adds options to copy a site for offline reading: follow links, fetch page requisites such as images, convert links and stay below the starting folder.",
    },
    {
      q: "How does the rate limit work?",
      a: "A value like 500k or 2m caps the download speed so a large transfer does not use all the bandwidth of a shared server.",
    },
  ],
  "systemd-service-generator": [
    {
      q: "Where does the unit file go?",
      a: "Save it as /etc/systemd/system/name.service, then run systemctl daemon-reload and enable it. The output includes the exact commands.",
    },
    {
      q: "What does Restart=on-failure mean?",
      a: "systemd restarts the service when it exits with an error or is killed by a signal, but leaves it stopped when it exits cleanly.",
    },
    {
      q: "What do the hardening options do?",
      a: "NoNewPrivileges stops the process gaining extra rights, ProtectSystem makes system folders read only and PrivateTmp gives the service its own temp folder.",
    },
  ],
  "systemd-timer-generator": [
    {
      q: "Why use a timer instead of cron?",
      a: "Timers log to the journal, can catch up after downtime with Persistent, can add a random delay and show their next run time with systemctl list-timers.",
    },
    {
      q: "How do I write an OnCalendar value?",
      a: "Words like daily or weekly work, as do forms such as Mon *-*-* 02:00:00. Test any value with systemd-analyze calendar before relying on it.",
    },
    {
      q: "What does Persistent do?",
      a: "If the machine was off at the scheduled time, systemd runs the job once at the next start instead of skipping it.",
    },
  ],
  "php-fpm-config-generator": [
    {
      q: "Which process manager mode should I pick?",
      a: "dynamic scales between a minimum and maximum, ondemand starts workers only when needed, and static keeps a fixed number. dynamic suits most sites.",
    },
    {
      q: "What is the rule for the spare server values?",
      a: "For dynamic mode the numbers must satisfy min spare no more than start servers, no more than max spare, no more than max children. The tool checks this.",
    },
    {
      q: "Why set open_basedir?",
      a: "It limits which folders PHP can read, so a compromised site cannot browse other accounts on the same server.",
    },
  ],
  "linux-path-analyzer": [
    {
      q: "What is the maximum length of a path?",
      a: "Linux allows up to 4096 bytes for a whole path and 255 bytes for each file or folder name. Going past either causes errors.",
    },
    {
      q: "Why does a leading tilde cause trouble?",
      a: "The shell expands ~ to your home directory, but programs and quoted strings do not, so a path that works at the prompt can fail in a script.",
    },
    {
      q: "What does the location line mean?",
      a: "A hint about what lives under that part of the filesystem, such as /var/log for logs or /etc for configuration.",
    },
  ],
  "linux-path-normalizer": [
    {
      q: "What does normalising a path do?",
      a: "It collapses repeated slashes and removes . segments, and resolves .. by dropping the folder before it, so /a/b/../c becomes /a/c.",
    },
    {
      q: "What happens with ../ at the start of a path?",
      a: "On a relative path the leading .. is kept, since it still means the parent folder. On an absolute path it cannot go above the root and is flagged.",
    },
    {
      q: "Does this follow symbolic links?",
      a: "No. It only rewrites the text. Real resolution with realpath needs the filesystem, because a link can point anywhere.",
    },
  ],
}
