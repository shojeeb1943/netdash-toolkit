import type { Faq } from "@/lib/tool-faqs"

export const linux_commandsFaqs: Record<string, Faq[]> = {
  "chmod-calculator": [
    {
      q: "How does the Chmod Calculator convert permissions between symbolic and octal notation?",
      a: "It maps read (4), write (2), and execute (1) bit values across Owner, Group, and Public scopes to generate standard 3-digit octal codes (e.g. 755 or 644) and symbolic strings (e.g. -rwxr-xr-x) in real time.",
    },
    {
      q: "What is the recommended permission setting for web files and directories?",
      a: "Directories should typically be set to 755 (drwxr-xr-x) so web servers can enter and read folders, while files should be set to 644 (-rw-r--r--) so scripts cannot be overwritten by unauthorized system users.",
    },
    {
      q: "What are special permissions: SUID, SGID, and the Sticky Bit?",
      a: "SUID (4000) executes binaries with owner privileges. SGID (2000) preserves group ownership on new files in a directory. The Sticky Bit (1000, e.g. chmod 1777 /tmp) prevents users from deleting files owned by others in shared directories.",
    },
    {
      q: "Does this tool transmit my file paths or permission settings over the internet?",
      a: "No. The calculation runs 100% locally in your web browser using JavaScript logic. None of your entered file paths, permissions, or system details leave your machine.",
    },
    {
      q: "What related tool helps calculate default file creation permissions?",
      a: "Use the Umask Calculator to determine how default system umask values restrict initial permissions when creating new files and folders.",
    },
    {
      q: "Why is setting 777 permissions dangerous on a web hosting server?",
      a: "Setting 777 permissions grants full write and execute access to every system user, allowing compromised neighbouring scripts or unauthorized uploaders to modify or inject malicious code into your website.",
    },
  ],
  "chown-generator": [
    {
      q: "What command syntax does the Chown Generator produce?",
      a: "It generates standard POSIX 'chown' commands to change user and group ownership on Linux files and directories, supporting recursive (-R) flag modifications, symbolic link handling, and reference file matching.",
    },
    {
      q: "What is the difference between chown and chgrp in Linux?",
      a: "'chown' can modify both the user owner and group owner simultaneously (e.g. chown www-data:www-data /var/www), whereas 'chgrp' changes only the group ownership.",
    },
    {
      q: "How does web server ownership affect CMS file uploads?",
      a: "Web applications (WordPress, Laravel) require write access to upload directories. Setting ownership to the web server user (e.g. nobody, www-data, or the cPanel user under suPHP/CageFS) resolves upload permission denied errors.",
    },
    {
      q: "Are my server usernames or directory paths logged remotely?",
      a: "No. The command builder runs entirely client-side in your browser. None of your Linux usernames, group names, or filesystem paths are stored or transmitted.",
    },
    {
      q: "What related tool helps calculate file read, write, and execute permissions?",
      a: "Use the Chmod Calculator to generate exact octal or symbolic permission modes before applying ownership changes.",
    },
    {
      q: "Why should you use caution when running 'chown -R' on root directories?",
      a: "Running recursive chown commands on system directories like /var, /usr, or /etc can break critical setuid binaries (like sudo) and system daemon authentication, potentially locking you out of the server.",
    },
  ],
  "umask-calculator": [
    {
      q: "What is a umask and how does this calculator compute resulting permissions?",
      a: "A umask (user file-creation mode mask) subtracts permission bits from base defaults (666 for files, 777 for directories) when creating new items. This tool calculates the final effective permissions resulting from any 3-digit or 4-digit octal umask.",
    },
    {
      q: "What is the standard default umask on Linux servers?",
      a: "A umask of 022 is the standard Linux default, resulting in 755 (rwxr-xr-x) for new directories and 644 (rw-r--r--) for new files. Secure multi-tenant hosting environments often use 027 or 077.",
    },
    {
      q: "What permissions result from a umask of 077?",
      a: "A umask of 077 strips all permissions from group and public users, creating directories with 700 (drwx------) and files with 600 (-rw-------), ensuring only the file owner can read or write data.",
    },
    {
      q: "Is my umask configuration shared or sent to any API?",
      a: "No. All umask binary and octal calculations execute locally in your web browser session. No configuration data is uploaded.",
    },
    {
      q: "Where is the global default umask configured in Linux?",
      a: "Global default umasks are configured in '/etc/profile', '/etc/bashrc', or '/etc/login.defs', and can be overridden per user in '~/.bashrc'.",
    },
    {
      q: "What related tool helps verify file permission masks?",
      a: "Use the Chmod Calculator to calculate explicit octal permission numbers and symbolic representation strings.",
    },
  ],
  "scp-generator": [
    {
      q: "What command syntax does the SCP Generator construct?",
      a: "It builds complete 'scp' (Secure Copy Protocol) terminal commands for transferring files and directories between local computers and remote Linux servers over encrypted SSH tunnels, configuring custom ports, key pairs, and recursive flags.",
    },
    {
      q: "What is the difference between SCP and Rsync for file transfers?",
      a: "SCP copies files sequentially in a linear stream. Rsync uses a delta-transfer algorithm to copy only changed binary blocks, supports resuming interrupted transfers, and preserves timestamps and hard links.",
    },
    {
      q: "How do I specify a non-standard SSH port in an SCP command?",
      a: "Use the uppercase '-P' flag followed by the port number (e.g. 'scp -P 2222 localfile.tar.gz user@remote:/path/'). Note that ssh uses lowercase '-p' while scp uses uppercase '-P'.",
    },
    {
      q: "Are my SSH connection parameters or server IPs recorded remotely?",
      a: "No. All command generation happens locally in your web browser using JavaScript. No IP addresses, usernames, or file paths are stored or transmitted.",
    },
    {
      q: "What related tool helps build multi-file synchronization and backup commands?",
      a: "Use the Rsync Generator to build resilient synchronization commands with progress meters, exclusions, and delta-transfer optimizations.",
    },
    {
      q: "How can I authenticate SCP transfers without typing a password?",
      a: "Specify a private SSH key using the '-i' flag (e.g. 'scp -i ~/.ssh/id_ed25519 file.txt user@ip:/path') after copying your public key to the remote server's authorized_keys file.",
    },
  ],
  "rsync-generator": [
    {
      q: "What options and flags does the Rsync Generator configure?",
      a: "It generates optimized 'rsync' commands supporting archive mode (-a), verbose logging (-v), compression (-z), progress meters (-P), permission preservation, bandwidth limits (--bwlimit), file exclusions, and custom SSH port tunneling.",
    },
    {
      q: "What is the critical significance of the trailing slash on source directories in rsync?",
      a: "A trailing slash on the source directory ('rsync -av /src/ /dest') copies only the contents inside /src into /dest. Omitting the trailing slash ('rsync -av /src /dest') creates a subdirectory named /src inside /dest.",
    },
    {
      q: "How does the '--delete' flag operate in rsync backups?",
      a: "The '--delete' flag removes files from the destination directory that no longer exist in the source directory, keeping destination backup mirrors 100% synchronized with source filesystems.",
    },
    {
      q: "Are my directory structures or remote server IPs logged externally?",
      a: "No. The command builder runs purely on the client side in your browser session. None of your filesystem paths or server addresses are shared.",
    },
    {
      q: "How can I test an rsync command safely before making real file changes?",
      a: "Include the dry-run flag ('--dry-run' or '-n') in your rsync command to simulate file transfers and deletions without modifying any actual files on disk.",
    },
    {
      q: "What related tool helps plan the network bandwidth required for large rsync transfers?",
      a: "Use the Backup Bandwidth Calculator and Migration Time Calculator to estimate transfer completion times across different network uplink speeds.",
    },
  ],
  "nginx-config-generator": [
    {
      q: "What configuration blocks does the Nginx Config Generator create?",
      a: "It generates production-ready Nginx 'server' configuration files supporting HTTP to HTTPS redirection, SSL/TLS certificate paths, HTTP/2 and HTTP/3 QUIC, PHP-FPM fastcgi sockets, security headers, Gzip/Brotli compression, and static asset caching.",
    },
    {
      q: "How does this generator configure PHP-FPM socket connections?",
      a: "It outputs optimized 'location ~ \\.php$' blocks pointing to your local Unix domain socket (e.g. 'fastcgi_pass unix:/run/php/php8.2-fpm.sock;') with recommended fastcgi_params buffers.",
    },
    {
      q: "What security response headers are included by default?",
      a: "Generated configurations include X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), X-XSS-Protection, Referrer-Policy, and Content-Security-Policy scaffolding to achieve A+ security scores.",
    },
    {
      q: "Is my domain name or server configuration sent to remote servers?",
      a: "No. The generator runs 100% locally in your web browser. No domain names, SSL certificate paths, or server profiles leave your machine.",
    },
    {
      q: "Where should the generated configuration file be placed on an Ubuntu/Debian server?",
      a: "Save the file in '/etc/nginx/sites-available/yourdomain.conf', create a symlink into '/etc/nginx/sites-enabled/', and verify syntax with 'nginx -t' before running 'systemctl reload nginx'.",
    },
    {
      q: "What related tool helps build Apache virtual host configuration files?",
      a: "Use the Apache VirtualHost Generator to construct matching Apache configuration files for cPanel and Debian/RHEL web servers.",
    },
  ],
  "apache-virtualhost-generator": [
    {
      q: "What parameters does the Apache VirtualHost Generator construct?",
      a: "It builds complete Apache ''VirtualHost *:80'' and ''VirtualHost *:443'' configuration files, setting ServerName, ServerAlias, DocumentRoot, SSLEngine directives, PHP-FPM proxy handlers, and mod_rewrite rules.",
    },
    {
      q: "How does this generator proxy PHP execution to PHP-FPM via mod_proxy_fcgi?",
      a: "It adds a 'FilesMatch \\.php$' block with 'SetHandler \"proxy:unix:/run/php/php-fpm.sock|fcgi://localhost/\"' to decouple dynamic PHP execution from Apache worker processes.",
    },
    {
      q: "Where are custom Apache virtual host files stored in RHEL/AlmaLinux vs Ubuntu?",
      a: "On RHEL/AlmaLinux/cPanel, files are stored in '/etc/httpd/conf.d/'. On Ubuntu/Debian, files are placed in '/etc/apache2/sites-available/' and enabled with 'a2ensite yourdomain.conf'.",
    },
    {
      q: "Does this tool upload my server domain names or document roots?",
      a: "No. All template rendering occurs client-side in your browser using JavaScript. No configuration parameters are sent to external servers.",
    },
    {
      q: "How do I test Apache configuration syntax before reloading the service?",
      a: "Execute 'apachectl configtest' or 'httpd -t' in your terminal. If the output returns 'Syntax OK', reload the service with 'systemctl reload httpd' or 'systemctl reload apache2'.",
    },
    {
      q: "What tool helps generate directory-level .htaccess rewrite rules?",
      a: "Use the .htaccess Generator to build URL rewrite directives, HTTPS redirects, and hotlink protection rules for individual website folders.",
    },
  ],
  "htaccess-generator": [
    {
      q: "What rules and directives does the .htaccess Generator build?",
      a: "It constructs Apache mod_rewrite directives for forced HTTPS redirects, www to non-www normalization, custom 404/500 error pages, directory browsing disablement (Options -Indexes), image hotlink protection, and browser caching (mod_expires).",
    },
    {
      q: "Why is .htaccess configuration supported on LiteSpeed Web Server?",
      a: "LiteSpeed Web Server includes native drop-in support for Apache .htaccess files, reading and applying rewrite rules in real time without requiring server reboots.",
    },
    {
      q: "How does hotlink protection in .htaccess prevent bandwidth theft?",
      a: "It checks the HTTP Referer header on image requests. If the request originates from an unauthorized third-party domain, the rewrite rule returns a 403 Forbidden error or serves a placeholder warning image.",
    },
    {
      q: "Are my website URLs or redirect rules logged or stored remotely?",
      a: "No. The entire generator executes locally in your browser session using JavaScript. None of your URL structures or rule sets are transmitted.",
    },
    {
      q: "What is the performance benefit of moving .htaccess rules into main server configs?",
      a: "On high-traffic Apache servers, moving static rules into the main httpd.conf and disabling 'AllowOverride' eliminates disk filesystem lookups on every incoming request, boosting response times.",
    },
    {
      q: "What related tool helps build Nginx rewrite and redirection rules?",
      a: "Use the Nginx Config Generator to generate matching rewrite and server configuration directives for Nginx web servers.",
    },
  ],
  "tar-command-generator": [
    {
      q: "What operations does the Tar Command Generator support?",
      a: "It constructs standard Linux 'tar' terminal commands for creating archives (-c), extracting archives (-x), listing archive contents (-t), preserving permissions (-p), and applying compression algorithms (gzip -z, bzip2 -j, xz -J, zstd --zstd).",
    },
    {
      q: "Which compression algorithm offers the best balance of speed and ratio?",
      a: "Zstandard (zstd) offers the best modern balance, compressing up to 5x faster than gzip with higher compression density. Gzip remains the most universally compatible across all Linux distributions.",
    },
    {
      q: "How do I exclude specific folders (e.g. node_modules or cache) when creating a tarball?",
      a: "Use the '--exclude' flag before the source directory path (e.g. 'tar --exclude=\"node_modules\" --exclude=\".git\" -czvf backup.tar.gz /var/www/site/').",
    },
    {
      q: "Does this tool store my filenames or archive paths?",
      a: "No. The command builder runs 100% locally in your web browser. No filenames, directory paths, or archive options are uploaded.",
    },
    {
      q: "What is the difference between relative and absolute paths in tar archives?",
      a: "Tar strips leading slashes by default ('removing leading / from member names') to prevent archives from accidentally overwriting system files in the root filesystem upon extraction.",
    },
    {
      q: "What related tool helps schedule automated daily backup archives?",
      a: "Use the Systemd Timer Generator to create automated recurring cron timers that execute backup archiving scripts on a schedule.",
    },
  ],
  "find-command-generator": [
    {
      q: "What search criteria does the Find Command Generator support?",
      a: "It constructs powerful Linux 'find' commands filtering by filename/pattern (-name, -iname), file type (-type f/d), file size (-size +100M), modification age (-mtime -7), owner permissions (-perm 0777), and automated execution actions (-exec, -delete).",
    },
    {
      q: "How can I find and delete files older than 30 days safely?",
      a: "Run 'find /path/to/logs -type f -name \"*.log\" -mtime +30 -exec rm -f {} \\;' or test the query first without '-exec' to verify matching files before deletion.",
    },
    {
      q: "What is the difference between -mtime, -atime, and -ctime in the find command?",
      a: "'-mtime' checks file content modification time, '-atime' checks last file access/read time, and '-ctime' checks inode metadata change time (permissions, ownership).",
    },
    {
      q: "Are my directory names or search queries sent to any server?",
      a: "No. All command generation logic runs locally in your browser session using JavaScript. No search patterns or filesystem details are transmitted.",
    },
    {
      q: "How can I search for world-writable files that represent security risks?",
      a: "Configure the permission filter to search for '-perm -0002' or '-perm 0777' across public web directories to identify insecure files that unauthorized users can overwrite.",
    },
    {
      q: "What related tool helps search for text patterns inside discovered files?",
      a: "Use the Grep Command Generator to build recursive regex search commands for scanning file contents.",
    },
  ],
  "grep-command-generator": [
    {
      q: "What features and flags does the Grep Command Generator configure?",
      a: "It builds regular expression search commands supporting case insensitivity (-i), recursive directory scanning (-r/-R), line numbering (-n), inverted matching (-v), counting matches (-c), binary file exclusion, and PCRE regex engine mode (-P).",
    },
    {
      q: "What is the difference between grep, egrep, and fgrep in Linux?",
      a: "'grep' uses Basic Regular Expressions (BRE), 'egrep' (grep -E) uses Extended Regular Expressions with modern grouping symbols (+, ?, |), and 'fgrep' (grep -F) searches for fixed literal strings without regex parsing for maximum speed.",
    },
    {
      q: "How can I search for malicious PHP eval or base64_decode functions across website files?",
      a: "Run 'grep -rnE \"(eval|base64_decode|gzinflate|shell_exec)\" /var/www/html/' to recursively scan all script files for common webshell signatures.",
    },
    {
      q: "Is any search regex or code snippet logged or shared externally?",
      a: "No. All command generation executes purely client-side in your web browser. No search queries or code patterns leave your machine.",
    },
    {
      q: "How can I display surrounding context lines around matching search results?",
      a: "Use the '-C 3' flag to display 3 lines of context before and after each match, or use '-B' for leading lines and '-A' for trailing lines.",
    },
    {
      q: "What related tool helps streamline stream editing and string replacement in files?",
      a: "Use the Sed Command Generator to build automated search-and-replace command pipelines across discovered matching files.",
    },
  ],
  "sed-command-generator": [
    {
      q: "What operations does the Sed Command Generator construct?",
      a: "It builds Linux Stream Editor ('sed') commands for global search-and-replace (s/find/replace/g), in-place file modification (-i), line deletion (d), line insertion (i/a), regex capture group back-references, and delimiter customization.",
    },
    {
      q: "Why is changing delimiters helpful when modifying URLs or file paths with sed?",
      a: "When replacing text containing forward slashes (e.g. URLs or file paths), using alternate delimiters like '#' or '|' (e.g. 'sed -i \"s#http://#https://#g\" file.txt') eliminates the need to escape every slash.",
    },
    {
      q: "How does in-place editing with backup (-i.bak) protect against mistakes?",
      a: "Running 'sed -i.bak \"s/old/new/g\" config.php' saves the original unmodified file as 'config.php.bak' before writing changes, allowing instant recovery if regex syntax produces unintended edits.",
    },
    {
      q: "Are my search-and-replace strings or filenames stored remotely?",
      a: "No. The command builder runs 100% locally in your browser. None of your replacement text, code snippets, or filenames are transmitted.",
    },
    {
      q: "How can I delete empty lines or comment lines from configuration files using sed?",
      a: "Run 'sed -i '/^$/d' file.conf' to remove all blank lines, or 'sed -i '/^[[:space:]]*#/d' file.conf' to remove all lines starting with comment hashtags.",
    },
    {
      q: "What related tool helps parse column-based data and log reports?",
      a: "Use the Awk Command Generator to construct column extraction and structured text aggregation scripts.",
    },
  ],
  "awk-command-generator": [
    {
      q: "What data extraction workflows does the Awk Command Generator build?",
      a: "It generates pattern-scanning and text-processing 'awk' scripts for column slicing ($1, $2, $NF), field delimiter customization (-F), conditional filtering, numeric summation (END {print sum}), and structured log aggregation.",
    },
    {
      q: "How can I use awk to find top attacking IP addresses in Apache/Nginx access logs?",
      a: "Run 'awk \"{print \\$1}\" /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10' to extract the client IP column ($1) and count the top 10 most frequent visitor IPs.",
    },
    {
      q: "How do BEGIN and END blocks function in awk scripts?",
      a: "The 'BEGIN' block executes once before processing any input lines (ideal for printing report headers). The 'END' block executes once after all input lines are consumed (ideal for computing totals and averages).",
    },
    {
      q: "Is my log parsing logic or server data uploaded to any API?",
      a: "No. All awk command generation runs client-side inside your browser session. None of your scripts or field patterns are shared.",
    },
    {
      q: "How can I use custom field delimiters like commas or colons in awk?",
      a: "Pass the '-F' flag with your desired delimiter (e.g. 'awk -F \":\" \"{print \\$1, \\$6}\" /etc/passwd' to extract usernames and home directories from the Linux password database).",
    },
    {
      q: "What related tool helps perform simple regex find-and-replace on text streams?",
      a: "Use the Sed Command Generator to build fast stream replacement pipelines across structured text files.",
    },
  ],
  "curl-command-generator": [
    {
      q: "What HTTP options and flags does the Curl Command Generator configure?",
      a: "It constructs versatile 'curl' commands supporting HTTP methods (GET, POST, PUT, DELETE), custom request headers (-H), JSON payload transmission (-d), Bearer token authentication, basic auth (-u), SSL certificate bypass (-k), and response timing metrics (-w).",
    },
    {
      q: "How do I measure server response latency and DNS lookup time using curl?",
      a: "Use curl write-out variables: 'curl -w \"@curl-format.txt\" -o /dev/null -s https://example.com' to display exact time elapsed for DNS resolution (time_namelookup), TCP connect (time_connect), TLS handshake (time_appconnect), and TTFB (time_starttransfer).",
    },
    {
      q: "How does curl follow HTTP redirects automatically?",
      a: "Include the '-L' (or '--location') flag to instruct curl to automatically follow 301 and 302 HTTP redirection chains until reaching the final destination.",
    },
    {
      q: "Are my API endpoints, bearer tokens, or payloads logged externally?",
      a: "No. The command builder runs 100% locally in your web browser. No API URLs, authentication keys, or JSON request bodies are stored or uploaded.",
    },
    {
      q: "What is the difference between curl and wget for terminal downloads?",
      a: "Curl is a multi-protocol data transfer tool engineered for REST APIs and granular HTTP header control. Wget is designed for recursive website downloads, background mirroring, and automated retry resumes.",
    },
    {
      q: "What related tool helps inspect live HTTP response headers from a web server?",
      a: "Use the HTTP Headers tool in the HTTP category to inspect server response headers, caching directives, and security grades.",
    },
  ],
  "wget-command-generator": [
    {
      q: "What download workflows does the Wget Command Generator configure?",
      a: "It generates robust 'wget' commands supporting recursive website mirroring (-m), background downloading (-b), download resuming (-c), user-agent spoofing, rate limiting (--limit-rate), directory depth filtering, and SSL verification bypass.",
    },
    {
      q: "How can I resume a broken or interrupted file download with wget?",
      a: "Use the '-c' (or '--continue') flag: 'wget -c https://example.com/large-backup.tar.gz'. Wget checks the existing local file size and sends HTTP Range headers to resume downloading from the exact point of interruption.",
    },
    {
      q: "How do I mirror an entire website for offline viewing using wget?",
      a: "Run 'wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https://example.com/' to download all HTML, CSS, images, and rewrite internal links for offline local browsing.",
    },
    {
      q: "Are my target download URLs or credentials saved on remote servers?",
      a: "No. The command builder executes purely client-side in your browser. None of your URLs, rate limits, or command parameters leave your machine.",
    },
    {
      q: "How do I prevent wget from saturating server network bandwidth during large downloads?",
      a: "Add the '--limit-rate=10m' flag to cap download throughput at 10 megabytes per second, preserving bandwidth for live website visitors.",
    },
    {
      q: "What related tool helps build API requests and JSON payload transfers?",
      a: "Use the Curl Command Generator to construct granular HTTP requests with headers, cookies, and authentication payloads.",
    },
  ],
  "systemd-service-generator": [
    {
      q: "What sections and directives does the Systemd Service Generator create?",
      a: "It generates complete Linux systemd unit files (.service) comprising [Unit] descriptions and dependencies, [Service] execution commands (ExecStart), working directories, process types (simple, forking, notify), restart policies (always, on-failure), user sandboxing, and [Install] target runlevels.",
    },
    {
      q: "What is the recommended restart policy for production background daemons?",
      a: "Setting 'Restart=always' with 'RestartSec=5s' ensures that if a Node.js, Python, or Go daemon crashes or runs out of memory, systemd automatically restarts the process after 5 seconds.",
    },
    {
      q: "How does systemd user sandboxing enhance server security?",
      a: "Specifying an unprivileged user (e.g. 'User=appuser') along with 'NoNewPrivileges=true' and 'ProtectSystem=strict' prevents compromised background daemons from escalating privileges or modifying system files.",
    },
    {
      q: "Is my service configuration or command path sent to external servers?",
      a: "No. The generator runs 100% locally in your web browser session using JavaScript. No application paths, usernames, or daemon configurations are transmitted.",
    },
    {
      q: "Where should the generated service file be saved on a Linux server?",
      a: "Save the file to '/etc/systemd/system/myapp.service', reload the systemd daemon with 'systemctl daemon-reload', and enable the service on boot with 'systemctl enable --now myapp.service'.",
    },
    {
      q: "What related tool helps schedule recurring cron jobs using native systemd timers?",
      a: "Use the Systemd Timer Generator to create matching .timer unit files for scheduled recurring tasks.",
    },
  ],
  "systemd-timer-generator": [
    {
      q: "How do systemd timers replace traditional cron jobs on Linux?",
      a: "Systemd timers (.timer unit files) trigger corresponding .service units based on calendar events (OnCalendar) or monotonic uptime intervals (OnBootSec, OnUnitActiveSec), offering unified journald logging, missed execution catch-up (Persistent=true), and millisecond precision.",
    },
    {
      q: "What does the 'Persistent=true' directive do in a systemd timer?",
      a: "If the server was powered off or rebooting when a scheduled timer event was supposed to execute, 'Persistent=true' ensures the service runs immediately once the server boots back up.",
    },
    {
      q: "What is the calendar syntax format for daily and hourly systemd timers?",
      a: "Use 'OnCalendar=*-*-* 03:00:00' for daily execution at 3:00 AM UTC, 'OnCalendar=hourly' for hourly runs, or 'OnCalendar=Mon..Fri *-*-* 09:00:00' for weekday mornings.",
    },
    {
      q: "Are my scheduled timer parameters or script paths logged externally?",
      a: "No. All timer generation logic runs client-side in your web browser. No schedule parameters or application names leave your computer.",
    },
    {
      q: "How do I view all active systemd timers on a Linux server?",
      a: "Run 'systemctl list-timers' in your terminal to view all active timers, next trigger times, remaining countdowns, and last execution timestamps.",
    },
    {
      q: "What tool helps generate the accompanying background service unit file?",
      a: "Use the Systemd Service Generator to create the matching .service unit file that executes the actual backup or maintenance script triggered by the timer.",
    },
  ],
  "php-fpm-config-generator": [
    {
      q: "What configuration parameters does the PHP-FPM Config Generator tune?",
      a: "It generates customized PHP-FPM pool configuration files (.conf), configuring process managers (static, dynamic, ondemand), worker ceilings (pm.max_children, pm.start_servers), memory ceilings, slow query logging, and chroot environments.",
    },
    {
      q: "How do I choose between dynamic and ondemand process management?",
      a: "'dynamic' keeps warm worker processes running to respond instantly to high-traffic websites. 'ondemand' spawns workers only upon incoming HTTP requests and shuts them down after idle timeouts, conserving RAM on multi-tenant servers.",
    },
    {
      q: "How does pm.max_requests prevent PHP memory leak accumulation?",
      a: "Setting 'pm.max_requests = 500' instructs PHP-FPM to automatically recycle each worker process after it has served 500 web requests, freeing any memory retained by buggy PHP scripts or extensions.",
    },
    {
      q: "Is my PHP configuration or server size shared with LicenBase?",
      a: "No. The configuration generator executes entirely on the client side in your web browser. All pool settings and memory numbers remain strictly private.",
    },
    {
      q: "Where are PHP-FPM pool files located in cPanel vs standard Linux?",
      a: "On cPanel/WHM with EasyApache 4, pools are managed in '/var/cpanel/userdata/'. On standard Ubuntu/Debian, pool files reside in '/etc/php/8.x/fpm/pool.d/www.conf'.",
    },
    {
      q: "What related tool helps calculate the exact pm.max_children value for your RAM?",
      a: "Use the PHP Worker Calculator in the Server Planning category to size your max_children setting based on available physical memory and average process size.",
    },
  ],
  "linux-path-analyzer": [
    {
      q: "What insights does the Linux Path Analyzer provide for file paths?",
      a: "It breaks down Linux filesystem paths into root anchor, parent directory hierarchy, basename, filename without extension, file extension, path depth count, and identifies special characters or spaces that require shell escaping.",
    },
    {
      q: "Why is proper shell escaping important in bash scripts?",
      a: "Filesystem paths containing spaces, parenthesis, or special characters (e.g. '$', '&', ';') can be misinterpreted as command separators in bash scripts. Escaping or wrapping paths in double quotes prevents script execution errors.",
    },
    {
      q: "Does this tool identify whether a path is absolute or relative?",
      a: "Yes. Paths starting with '/' are classified as absolute (rooted), while paths starting with '.', '~', or direct folder names are identified as relative paths.",
    },
    {
      q: "Are my analyzed file paths or directory names uploaded to a server?",
      a: "No. All path analysis occurs locally in your browser using JavaScript string parsing algorithms. No file paths or folder names leave your device.",
    },
    {
      q: "What related tool helps clean redundant slashes and relative dot segments from paths?",
      a: "Use the Linux Path Normalizer to resolve '.' and '..' relative segments and output clean canonical POSIX paths.",
    },
    {
      q: "What is the maximum path length supported in Linux (PATH_MAX)?",
      a: "Linux POSIX systems define 'PATH_MAX' as 4096 bytes for a full path and 'NAME_MAX' as 255 bytes for an individual filename or directory name.",
    },
  ],
  "linux-path-normalizer": [
    {
      q: "How does the Linux Path Normalizer standardize filesystem paths?",
      a: "It strips duplicate consecutive slashes (//), resolves current directory dots (./), computes parent directory transversals (../), expands home directory tildes (~), and removes trailing slashes to return a clean canonical POSIX path.",
    },
    {
      q: "How does path normalization prevent path traversal security vulnerabilities?",
      a: "Web applications that accept user-supplied filenames can be attacked via directory traversal ('../../etc/passwd'). Normalizing paths and verifying that the canonical path stays within the intended document root prevents unauthorized file access.",
    },
    {
      q: "What is the difference between path normalization and symlink resolution (realpath)?",
      a: "Path normalization evaluates string dot-segments mathematically without touching the disk filesystem. 'realpath' queries the active filesystem to resolve symbolic links into physical inode targets.",
    },
    {
      q: "Is any path string or system directory logged externally?",
      a: "No. The normalizer operates 100% locally within your web browser. None of your entered paths or filesystem structures are recorded.",
    },
    {
      q: "What related tool breaks down path components into parent and extension segments?",
      a: "Use the Linux Path Analyzer to inspect directory depth, base filenames, and shell escaping requirements.",
    },
    {
      q: "How do trailing slashes alter path semantics in command-line tools?",
      a: "Tools like rsync and tar interpret paths with trailing slashes as directory contents, whereas omitting the trailing slash refers to the directory container itself.",
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
