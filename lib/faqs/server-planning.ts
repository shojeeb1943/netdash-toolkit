import type { Faq } from "@/lib/tool-faqs"

export const server_planningFaqs: Record<string, Faq[]> = {
  "vps-ram-calculator": [
    {
      q: "How does the VPS RAM calculator estimate required memory?",
      a: "It sums baseline operating system overhead, control panel memory requirements, database buffer pool allocations, and concurrent web worker memory footprints based on your expected traffic. The final recommendation includes an emergency operating buffer to prevent out-of-memory kernel panics.",
    },
    {
      q: "What is the recommended RAM headroom for production workloads?",
      a: "Maintaining at least 20% to 25% free unallocated RAM is recommended for production servers to absorb unexpected traffic surges and background cron tasks. If usage consistently exceeds 80%, the Linux kernel will begin aggressive swapping or invoke the OOM killer.",
    },
    {
      q: "How do PHP worker processes affect total RAM calculations?",
      a: "Each active PHP-FPM or LSAPI worker consumes between 30 MB and 120 MB depending on the CMS and active plugins. Multiplying maximum concurrent workers by average process size provides the memory ceiling dedicated to dynamic web execution.",
    },
    {
      q: "Does this tool transmit my server memory parameters over the network?",
      a: "No. The calculation runs entirely client-side in your web browser using JavaScript math functions. None of your entered traffic figures, daemon choices, or server specs leave your local machine.",
    },
    {
      q: "Which tool should I use next to plan disk and swap configuration?",
      a: "Pair your memory estimation with the Swap Size Calculator to configure an emergency swap partition, and use the Server RAM Allocation Calculator to tune specific daemon limits.",
    },
    {
      q: "What edge cases might require more RAM than this calculator suggests?",
      a: "Heavy background cron jobs, unoptimized database queries creating large temporary tables in memory, and memory-intensive PHP image processing (ImageMagick/GD) can cause temporary memory spikes above standard baseline estimates.",
    },
  ],
  "vps-cpu-calculator": [
    {
      q: "How does the VPS CPU calculator determine the recommended vCPU core count?",
      a: "It calculates required compute capacity by evaluating peak requests per second, dynamic vs static content ratios, database query complexity, and background daemon load. The output matches these compute demands against standard modern virtualized hypervisor cores.",
    },
    {
      q: "What is the difference between shared vCPU and dedicated CPU cores?",
      a: "Shared vCPU plans allow the hypervisor to overcommit physical cores across multiple virtual machines, which can cause CPU steal during noisy-neighbor spikes. Dedicated CPU cores guarantee 100% compute access without throttling or resource contention.",
    },
    {
      q: "How does web server choice impact CPU core requirements?",
      a: "Event-driven web servers like LiteSpeed and Nginx utilize CPU cycles significantly more efficiently than process-forking Apache architectures under high concurrency. Choosing LiteSpeed often allows hosting identical traffic on half the CPU cores.",
    },
    {
      q: "Is my server traffic data stored or sent to an external server?",
      a: "No. All CPU modeling is performed locally in your browser session with zero external API calls or tracking. Your traffic metrics and performance assumptions remain completely private.",
    },
    {
      q: "What should I do if my server experiences sudden high CPU spikes?",
      a: "Check running processes using top or htop, optimize slow database queries, and consider deploying CloudLinux OS with LVE limits to prevent individual tenant scripts from monopolizing CPU cores.",
    },
    {
      q: "What is a safe peak CPU utilization threshold for web servers?",
      a: "Targeting 60% to 70% average CPU utilization during peak traffic hours ensures adequate overhead to absorb sudden traffic bursts without queuing HTTP connections or slowing page render times.",
    },
  ],
  "vps-storage-calculator": [
    {
      q: "What disk space components does this calculator take into account?",
      a: "The calculator accounts for operating system binaries, control panel installations, website media and codebases, database storage, email mailboxes, and temporary file directories. It also includes rolling local backup buffers and log file retention overhead.",
    },
    {
      q: "How much storage overhead should be reserved for system operations?",
      a: "You should maintain at least 15% to 20% free disk space on Linux filesystems to prevent filesystem fragmentation and ensure system services like MySQL and journald can write temporary files and crash dumps.",
    },
    {
      q: "Why do email mailboxes often consume more storage than expected?",
      a: "Email accounts store attachments, sent folders, and spam bins indefinitely unless retention policies are enforced. For servers with many active email users, mailbox storage frequently surpasses website file sizes within 12 months.",
    },
    {
      q: "Are the storage values I enter sent to a remote telemetry server?",
      a: "No. The calculation runs 100% locally inside your web browser. No filesystem sizes, tenant estimates, or storage configurations are logged or transmitted.",
    },
    {
      q: "What tool helps me plan backup retention and remote storage capacity?",
      a: "Use the Backup Retention Calculator and Server Storage Calculator to model offsite backup sizes and incremental snapshot growth across AWS S3 or Wasabi storage targets.",
    },
    {
      q: "How do SSD vs NVMe drives influence storage capacity decisions?",
      a: "While storage capacity is measured identically in gigabytes across both media, NVMe storage provides 4x to 6x higher random IOPS, making it essential for high-write databases even if raw capacity requirements are modest.",
    },
  ],
  "vps-bandwidth-calculator": [
    {
      q: "How does this tool convert monthly pageviews into bandwidth transfer volume?",
      a: "It multiplies your average page weight by estimated monthly pageviews and adds static asset transfer overhead (images, CSS, JS, fonts). It then calculates the total monthly gigabyte transfer and average network throughput in megabits per second (Mbps).",
    },
    {
      q: "What is the relationship between monthly bandwidth and port speed?",
      a: "Monthly bandwidth measures total data transferred over 30 days (in GB or TB), whereas port speed (e.g. 1 Gbps) represents instantaneous network pipe capacity. Peak traffic bursts require sufficient port speed even if total monthly data transfer is well within quota.",
    },
    {
      q: "How can I reduce server bandwidth consumption by 50% or more?",
      a: "Deploying a Content Delivery Network (CDN) like Cloudflare offloads static assets, enabling Brotli compression shrinks text payloads by 20%, and converting images to WebP formats reduces image payload sizes dramatically.",
    },
    {
      q: "Does this bandwidth calculator track or log domain names and traffic figures?",
      a: "No. All calculations are executed on the client side using pure JavaScript math. Your traffic projections and bandwidth figures never leave your device.",
    },
    {
      q: "What happens if my VPS exceeds its monthly bandwidth allocation?",
      a: "Hosting providers typically either bill per-gigabyte overage fees (often $0.01 to $0.05 per GB) or throttle your VPS port speed to 10 Mbps until the billing cycle resets, causing severe site slowdowns.",
    },
    {
      q: "What related tools can assist with network throughput and download speed planning?",
      a: "Use the Bandwidth Calculator in the Calculators category to calculate transfer times for specific large files, or the Backup Bandwidth Calculator to size data transfers for offsite backup schedules.",
    },
  ],
  "server-storage-calculator": [
    {
      q: "What is the purpose of the Server Storage Calculator?",
      a: "This tool models enterprise server disk capacity requirements across OS partitions, database storage, user data directories, log archives, and local staging areas. It helps sysadmins purchase properly sized NVMe/SATA drives before provisioning bare-metal hardware.",
    },
    {
      q: "How does filesystem formatting affect usable storage capacity?",
      a: "Filesystem metadata, inode allocation tables, and reserved root block allowances (typically 5% on ext4) reduce raw disk drive capacity by approximately 7% to 10% after partitioning and formatting.",
    },
    {
      q: "Why is it important to separate database and user home partitions?",
      a: "Placing databases on dedicated fast NVMe partitions isolates database I/O from heavy web file operations and ensures that user account storage exhaustion cannot fill the root filesystem and crash MySQL.",
    },
    {
      q: "Is any server storage data transmitted to LicenBase servers?",
      a: "No. This tool operates entirely offline in your browser. All drive sizes, partition ratios, and storage totals remain strictly within your local environment.",
    },
    {
      q: "What tool should I use if I plan to configure hardware or software RAID?",
      a: "Use the RAID Capacity Calculator to determine usable space, fault tolerance, and write penalties across RAID 0, RAID 1, RAID 5, RAID 6, and RAID 10 configurations.",
    },
    {
      q: "How does annual data growth factor into initial drive provisioning?",
      a: "Production servers typically experience 20% to 35% compound annual data growth. Sizing server storage to maintain at least 40% free space at deployment ensures a 2- to 3-year hardware lifecycle without emergency drive replacements.",
    },
  ],
  "raid-capacity-calculator": [
    {
      q: "How does the RAID Capacity Calculator compute usable storage?",
      a: "It calculates usable space, parity/mirroring overhead, and fault tolerance based on disk count, individual drive capacity, and selected RAID level (0, 1, 5, 6, 10, 50, 60). It also highlights hot-spare drive deductions.",
    },
    {
      q: "Which RAID level is recommended for high-performance database servers?",
      a: "RAID 10 (striped mirrors) is the industry standard for databases because it delivers fast random read/write throughput without the parity write penalty associated with RAID 5 or RAID 6.",
    },
    {
      q: "What is the fault tolerance of RAID 6 compared to RAID 5?",
      a: "RAID 5 uses single parity and can survive exactly 1 drive failure, whereas RAID 6 uses dual parity and can survive up to 2 concurrent drive failures without data loss, significantly reducing risk during rebuild times on large disks.",
    },
    {
      q: "Does this tool transmit RAID hardware specifications over the internet?",
      a: "No. All calculations are handled locally in your browser via JavaScript algorithms. None of your hardware configurations or drive capacities are recorded.",
    },
    {
      q: "What is the write penalty in parity-based RAID arrays?",
      a: "Parity calculations in RAID 5 require 2 reads and 2 writes for every single write operation (4x penalty), while RAID 6 requires 3 reads and 3 writes (6x penalty). RAID 10 requires only 2 writes with zero read overhead.",
    },
    {
      q: "What is the difference between decimal (TB) and binary (TiB) storage in RAID?",
      a: "Hard drive manufacturers quote decimal capacities (1 TB = 1,000,000,000,000 bytes), whereas operating systems format drives in binary tebibytes (1 TiB = 1,099,511,627,776 bytes), resulting in approximately 9% less reported usable capacity.",
    },
  ],
  "swap-size-calculator": [
    {
      q: "How does this tool calculate the optimal Linux swap partition size?",
      a: "It applies Red Hat and Ubuntu kernel memory engineering guidelines, evaluating physical RAM capacity, workload characteristics, and whether system hibernation is required. The output provides the optimal swap file or swap partition size.",
    },
    {
      q: "Why is swap space still necessary on modern servers with abundant RAM?",
      a: "Swap allows the Linux kernel to page out inactive memory pages and unreferenced program segments, freeing valuable physical memory for active disk caching (pagecache) and absorbing momentary memory spikes without invoking the OOM killer.",
    },
    {
      q: "How does vm.swappiness interact with configured swap size?",
      a: "The vm.swappiness kernel parameter (ranging from 0 to 100) controls how aggressively the kernel swaps memory pages to disk. Setting swappiness to 10 on database servers ensures physical RAM is prioritized while preserving swap as an emergency safety net.",
    },
    {
      q: "Are my server memory specs or operating system details uploaded anywhere?",
      a: "No. The calculation is executed purely client-side in your browser. No server parameters or operating configurations are shared.",
    },
    {
      q: "What commands are used to create a swap file on a running Linux server?",
      a: "Execute 'fallocate -l 4G /swapfile', 'chmod 600 /swapfile', 'mkswap /swapfile', and 'swapon /swapfile'. Then add '/swapfile none swap sw 0 0' to /etc/fstab for persistence across reboots.",
    },
    {
      q: "Can placing swap on NVMe SSDs degrade disk longevity?",
      a: "Modern enterprise NVMe SSDs have high write endurance (DWPD ratings). When swappiness is tuned properly, normal swap usage causes negligible SSD wear while delivering 10x faster paging speeds than mechanical drives.",
    },
  ],
  "php-worker-calculator": [
    {
      q: "How does the PHP Worker Calculator determine pm.max_children for PHP-FPM?",
      a: "It subtracts base OS, web server, and database memory allocations from total physical RAM, and divides the remaining available memory by the average memory consumption of a single PHP worker process.",
    },
    {
      q: "What happens if pm.max_children is set too high in PHP-FPM pool configuration?",
      a: "Setting max_children higher than available RAM causes the server to spawn more PHP processes than memory can support during traffic spikes, forcing the operating system into heavy swap thrashing or triggering OOM crashes.",
    },
    {
      q: "How do I measure the average memory consumption of my PHP processes?",
      a: "Run 'ps -ylC php-fpm --sort:rss' or 'ps --no-headers -o rss -C php-fpm | awk \"{ sum+=\\$1 } END { print sum/NR/1024 \\\"MB\\\" }\"' in your server terminal to calculate the exact average RSS memory size per worker.",
    },
    {
      q: "Does this calculator send my PHP configuration or memory data to an API?",
      a: "No. All pool dimensioning calculations occur client-side in your browser without any external network communication.",
    },
    {
      q: "What is the difference between dynamic and ondemand process managers in PHP-FPM?",
      a: "The 'dynamic' manager maintains a pool of warm idle workers ready for immediate requests, minimizing latency. The 'ondemand' manager spawns workers only when requests arrive and terminates them after idle timeouts, saving RAM on low-traffic servers.",
    },
    {
      q: "How does Zend OPcache reduce memory consumption per PHP worker?",
      a: "OPcache stores precompiled PHP script bytecode in shared memory, allowing all worker processes to execute cached scripts without parsing PHP files from disk on every incoming web request.",
    },
  ],
  "mysql-ram-calculator": [
    {
      q: "How does the MySQL RAM Calculator calculate total database memory consumption?",
      a: "It sums global server buffers (such as innodb_buffer_pool_size, key_buffer_size, and query_cache_size) and multiplies per-thread connection buffers (sort_buffer_size, read_buffer_size, join_buffer_size) by the max_connections setting.",
    },
    {
      q: "What percentage of server RAM should be allocated to innodb_buffer_pool_size?",
      a: "On a dedicated database server, 70% to 80% of total RAM should be allocated to InnoDB buffer pool. On a shared web and database VPS, limit buffer pool allocation to 40% to 50% to leave sufficient memory for PHP-FPM workers.",
    },
    {
      q: "Why is setting max_connections excessively high dangerous for MySQL stability?",
      a: "Each concurrent client connection allocates its own private thread memory buffers. If max_connections is set to 500 and a traffic surge occurs, per-thread memory can rapidly exceed physical RAM and crash the MySQL daemon.",
    },
    {
      q: "Is my database configuration or server size sent to any remote server?",
      a: "No. The calculation is performed entirely client-side in your browser. None of your buffer settings, connection limits, or hardware specs are transmitted.",
    },
    {
      q: "What tool helps manage MySQL resource hogging on multi-tenant servers?",
      a: "Deploying CloudLinux OS with MySQL Governor automatically monitors database query load per user and throttles resource-heavy database queries before MySQL performance degrades for other tenants.",
    },
    {
      q: "How can I verify actual MySQL memory usage in a production environment?",
      a: "Log in to MySQL CLI and run 'SHOW GLOBAL STATUS LIKE \"Innodb_buffer_pool_bytes_data\";' or inspect the process resident set size (RSS) via 'top' or 'htop' in the Linux terminal.",
    },
  ],
  "redis-ram-calculator": [
    {
      q: "How does the Redis RAM Calculator estimate memory requirements for object caching?",
      a: "It models database table caching volume, session storage footprint, average key-value size, serialization overhead, and Redis internal pointer data structures to recommend a balanced maxmemory ceiling.",
    },
    {
      q: "What maxmemory-policy should I configure for WordPress and WooCommerce object caching?",
      a: "The 'allkeys-lru' or 'volatile-lru' policy is standard for object caching. When Redis reaches maxmemory capacity, it automatically evicts the least recently used keys, preventing out-of-memory write rejections.",
    },
    {
      q: "Why does Redis memory usage in 'top' appear higher than 'used_memory' in Redis CLI?",
      a: "Memory fragmentation occurs when the jemalloc memory allocator retains freed memory pages for future allocations rather than immediately returning them to the OS kernel. Enabling 'activedefrag yes' in redis.conf reduces fragmentation.",
    },
    {
      q: "Does this tool store or log my Redis caching settings?",
      a: "No. All Redis memory modeling runs locally inside your browser session using JavaScript. No caching parameters or infrastructure data are shared.",
    },
    {
      q: "How does Redis object caching reduce MySQL CPU usage on high-traffic websites?",
      a: "Redis caches compiled database query results in RAM. When identical queries arrive from repeat visitors, Redis serves the response in sub-milliseconds, bypassing MySQL disk I/O and query execution entirely.",
    },
    {
      q: "What is the performance impact of Redis snapshot persistence (RDB / AOF)?",
      a: "When Redis forks a background process to write RDB snapshots to disk, copy-on-write memory usage can double momentary RAM consumption. Setting maxmemory to 60-70% of allocated Redis memory prevents OOM forks.",
    },
  ],
  "server-ram-allocation-calculator": [
    {
      q: "What is the purpose of the Server RAM Allocation Calculator?",
      a: "This tool helps sysadmins partition a server's physical memory across all core subsystems: OS kernel, web server, PHP-FPM pools, database engines, Redis caching, and emergency operating buffers, ensuring zero resource contention.",
    },
    {
      q: "How should memory be prioritized on a shared web hosting server?",
      a: "Allocate 15% for OS and control panel daemons, 40% for the InnoDB database buffer pool, 30% for PHP-FPM worker pools, 5% for Redis caching, and maintain a 10% unallocated safety margin.",
    },
    {
      q: "What is the primary indicator of memory misallocation on Linux servers?",
      a: "Frequent swapping activity reported in 'vmstat 1' (high 'si' and 'so' values) and Out-Of-Memory Killer events logged in 'dmesg -T' indicate that daemon memory ceilings have exceeded physical RAM capacity.",
    },
    {
      q: "Is my server memory allocation profile saved to a database?",
      a: "No. The allocation math executes entirely on the client side in your web browser. No infrastructure specifications or server configurations are stored or uploaded.",
    },
    {
      q: "How does CloudLinux OS enforce memory boundaries between multiple hosted accounts?",
      a: "CloudLinux places each tenant into an isolated LVE container with strict physical memory limits. If a single user script leaks memory, only that user's processes are constrained while core server daemons remain unaffected.",
    },
    {
      q: "What related tools can help fine-tune individual daemon memory parameters?",
      a: "Use the MySQL RAM Calculator to calculate database buffer variables and the PHP Worker Calculator to size your PHP-FPM max_children settings.",
    },
  ],
  "disk-usage-calculator": [
    {
      q: "How does the Disk Usage Calculator project long-term storage consumption?",
      a: "It models initial baseline storage, average daily data ingest rates, log retention windows, and user upload trajectories to project total disk space utilization over 6, 12, 24, and 36-month timeframes.",
    },
    {
      q: "What causes unexpected disk space consumption on Linux hosting servers?",
      a: "Unrotated web server access logs, bloated MySQL binary logs, accumulated core dumps in /tmp, and unpruned local backup archives are the most frequent causes of rapid unexpected storage exhaustion.",
    },
    {
      q: "How can I identify which directories are consuming the most space on Linux?",
      a: "Run 'du -h --max-depth=1 / | sort -hr' in your terminal to inspect top-level directory sizes, or use 'ncdu /' for an interactive disk usage analysis interface.",
    },
    {
      q: "Are my storage growth projections shared or transmitted externally?",
      a: "No. All projection modeling occurs locally within your browser using JavaScript. No storage numbers or system data are transmitted.",
    },
    {
      q: "What is the safety margin for scheduling automated disk expansion?",
      a: "Plan disk expansion or drive upgrades when filesystem capacity consistently reaches 75% to 80% to avoid emergency filesystem read-only locks or database corruption from 100% full disks.",
    },
    {
      q: "What related tool helps track filesystem metadata and file count limits?",
      a: "Use the Inode Usage Calculator to ensure your filesystem will not exhaust available inode slots before physical disk space is depleted.",
    },
  ],
  "inode-usage-calculator": [
    {
      q: "What is an inode and why does inode exhaustion cause disk errors?",
      a: "An inode is a filesystem data structure that stores metadata about a file or directory (ownership, permissions, file size, block pointers). Even if gigabytes of disk space remain free, running out of inodes prevents creating new files or database entries.",
    },
    {
      q: "What types of applications consume inodes most rapidly?",
      a: "Email accounts with thousands of small messages, unpruned PHP session files in /var/lib/php/session, file-based CMS cache plugins, and node_modules folders generate massive numbers of tiny files that consume inodes quickly.",
    },
    {
      q: "How do I check current inode utilization on a Linux server?",
      a: "Run 'df -i' in your terminal to view total, used, and free inode counts across all mounted filesystems. A filesystem at 100% inode capacity will report 'No space left on device' errors.",
    },
    {
      q: "Does this tool upload my inode counts or directory structures?",
      a: "No. The calculation runs 100% locally in your browser. No system parameters, file counts, or server configurations are transmitted.",
    },
    {
      q: "How can I free up millions of exhausted inodes safely?",
      a: "Purge expired PHP session files using tmpwatch or find, clear CMS file cache directories, delete old uncompressed log archives in /var/log, and enforce email mailbox trash auto-pruning policies.",
    },
    {
      q: "Can inode capacity be increased on an existing Linux partition?",
      a: "On ext4 filesystems, the total inode count is fixed at formatting time based on partition size. To increase inodes on ext4 requires reformatting with 'mkfs.ext4 -N', whereas XFS filesystems allocate inodes dynamically as needed.",
    },
  ],
  "backup-rotation-calculator": [
    {
      q: "How does the Backup Rotation Calculator determine required backup storage?",
      a: "It applies the Grandfather-Father-Son (GFS) retention methodology, calculating total storage required for daily incremental snapshots, weekly full backups, monthly archives, and annual disaster recovery cold storage.",
    },
    {
      q: "What is the storage difference between full backups and incremental snapshots?",
      a: "Full backups copy 100% of data on every run, requiring massive storage. Incremental backup engines like JetBackup copy only changed binary blocks, reducing secondary backup storage requirements by up to 80%.",
    },
    {
      q: "What is the recommended retention policy for web hosting backups?",
      a: "A standard robust retention schedule keeps 7 daily snapshots, 4 weekly backups, and 3 monthly archives. This balances historical disaster recovery coverage with predictable offsite cloud storage expenses.",
    },
    {
      q: "Are my backup retention schedules or storage numbers stored remotely?",
      a: "No. The retention model runs entirely client-side in your web browser. None of your backup configurations or capacity forecasts leave your computer.",
    },
    {
      q: "Which backup software is recommended for cPanel and Linux servers?",
      a: "JetBackup 5 is the premier backup solution, offering block-level incremental backups, client self-service restores, and direct streaming to Wasabi or AWS S3 without loading local VPS disk space.",
    },
    {
      q: "How does data deduplication impact total backup storage consumption?",
      a: "Deduplication eliminates duplicate files across multiple hosting accounts (e.g. shared WordPress core files), reducing overall backup repository size by an additional 25% to 40%.",
    },
  ],
  "backup-bandwidth-calculator": [
    {
      q: "How does the Backup Bandwidth Calculator determine required transfer speed?",
      a: "It divides your daily backup data volume (full or incremental delta) by your allowed backup maintenance time window (e.g. 4 hours at night) to calculate the required upload throughput in Mbps.",
    },
    {
      q: "Why is it important to complete backups during off-peak hours?",
      a: "Generating backups creates disk read I/O load and consumes network upload bandwidth. Running backups during peak traffic hours can increase website response latency and cause database lock delays.",
    },
    {
      q: "How does network port speed limit backup window completion times?",
      a: "A 100 Mbps server uplink can transfer a maximum of ~45 GB per hour under ideal conditions, whereas a 1 Gbps uplink can transfer ~450 GB per hour. Sizing your backup window ensures data transfers complete before morning traffic surges.",
    },
    {
      q: "Is any backup transfer metric or server capacity data sent to an API?",
      a: "No. All backup bandwidth math runs client-side inside your browser without any external requests. Your data transfer calculations remain completely private.",
    },
    {
      q: "What is the best way to accelerate backup uploads to remote cloud storage?",
      a: "Use multi-threaded parallel transfers in JetBackup, enable zstd backup compression, and select a cloud storage datacenter region with low network latency to your source VPS.",
    },
    {
      q: "What related tool helps estimate overall monthly VPS bandwidth limits?",
      a: "Use the VPS Bandwidth Calculator to ensure your automated offsite backup transfers do not exceed your hosting provider's monthly network data transfer quota.",
    },
  ],
}
