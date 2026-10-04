import type { Faq } from "@/lib/tool-faqs"

export const server_planningFaqs: Record<string, Faq[]> = {
  "vps-ram-calculator": [
    {
      q: "How do I find the memory a site really uses?",
      a: "Check the resident memory of its PHP workers during a busy period with a tool such as top or ps. An average WordPress site often uses 40 to 80 MB per active process.",
    },
    {
      q: "Why add headroom?",
      a: "Traffic spikes, backups and cron jobs all use memory at once. Twenty to thirty percent spare keeps the server out of swap, which makes everything slow.",
    },
    {
      q: "Does the plan size round up?",
      a: "Yes. VPS plans come in standard sizes such as 2, 4, 8 and 16 GB, so the calculator shows the exact need and the smallest standard plan that covers it.",
    },
  ],
  "vps-cpu-calculator": [
    {
      q: "What is CPU time per request?",
      a: "The processor time one dynamic request takes, not the page load time a visitor sees. A cached page costs a few milliseconds, an uncached WordPress page often 80 to 300.",
    },
    {
      q: "Why not target 100 percent CPU?",
      a: "At full load every extra request queues and response times climb sharply. Planning for about 70 percent leaves room for bursts.",
    },
    {
      q: "Do static files count?",
      a: "Not in this calculation. Images, CSS and JavaScript served by the web server use very little CPU, so enter only dynamic requests such as PHP pages.",
    },
  ],
  "vps-storage-calculator": [
    {
      q: "Should local backups be counted?",
      a: "Yes if they live on the same disk. Each kept copy multiplies the live data, which is why backups are often the largest consumer of space.",
    },
    {
      q: "Why does the result include 20 percent free space?",
      a: "Filesystems slow down and can fail when nearly full, and upgrades or restores need working room. The extra space avoids emergencies.",
    },
    {
      q: "How should I choose the growth rate?",
      a: "Compare disk use today with six or twelve months ago. If you have no history, 20 to 40 percent a year is a reasonable starting guess for a growing hosting server.",
    },
  ],
  "vps-bandwidth-calculator": [
    {
      q: "How is monthly bandwidth estimated?",
      a: "Visitors times pages per visit times page weight. Page weight includes images and scripts, so use the transferred size from your browser's network panel.",
    },
    {
      q: "What is the peak hour speed for?",
      a: "Port speed limits how fast data leaves the server. If the peak figure approaches your port speed, pages will slow even when monthly transfer is well inside the allowance.",
    },
    {
      q: "Does a CDN change the answer?",
      a: "Yes. A CDN serves most images and scripts itself, so enter only the traffic that still reaches your server.",
    },
  ],
  "server-storage-calculator": [
    {
      q: "What is the alarm threshold?",
      a: "A usage level, commonly 80 to 85 percent, at which you want to act. Planning to the alarm level gives time to order and migrate before the disk is critical.",
    },
    {
      q: "How do I measure monthly growth?",
      a: "Subtract last month's used space from this month's. Averaging several months smooths out one-off events such as a large migration.",
    },
    {
      q: "What if growth is zero?",
      a: "The tool reports that the disk is not growing. Check again after a month, since a flat figure is rare on an active hosting server.",
    },
  ],
  "raid-capacity-calculator": [
    {
      q: "How much space does RAID 5 lose?",
      a: "One drive's worth. With four 4 TB drives you get 12 TB usable out of 16 TB raw. RAID 6 loses two drives and survives two failures.",
    },
    {
      q: "Is RAID a backup?",
      a: "No. RAID keeps a server running through a drive failure, but deleted files, corruption and ransomware are copied to every drive. Keep separate backups.",
    },
    {
      q: "Why does RAID 10 need an even number of drives?",
      a: "RAID 10 stripes across mirrored pairs, so drives must come in twos. It gives half the raw capacity but fast rebuilds and good write speed.",
    },
  ],
  "swap-size-calculator": [
    {
      q: "Does a server need swap at all?",
      a: "A small swap area is still useful. It lets the kernel move rarely used pages out of RAM and avoids sudden out of memory kills during a short spike.",
    },
    {
      q: "How much swap does hibernation need?",
      a: "Enough to hold the whole contents of RAM, plus a margin. The calculator uses RAM plus its square root, a common distribution guideline.",
    },
    {
      q: "What does swappiness do?",
      a: "It sets how eagerly Linux uses swap. A low value such as 10 keeps data in RAM longer and suits servers with plenty of memory.",
    },
  ],
  "php-worker-calculator": [
    {
      q: "How do I measure memory per PHP worker?",
      a: "Look at the resident memory of several php-fpm processes under normal load and take the average. Plugin heavy sites often use 80 MB or more per worker.",
    },
    {
      q: "What does pm.max_children control?",
      a: "The most PHP requests that can run at once. Too low and visitors queue, too high and the server runs out of memory and starts swapping.",
    },
    {
      q: "How are traffic and RAM combined?",
      a: "The suggestion is the traffic need doubled, kept between a CPU based floor and the number of workers your RAM can hold. If traffic needs more than RAM allows, the tool says so.",
    },
  ],
  "mysql-ram-calculator": [
    {
      q: "What is the InnoDB buffer pool?",
      a: "The memory MySQL uses to cache table data and indexes. It is usually the largest part of a database server's memory and the main setting to size.",
    },
    {
      q: "Why is there a worst case and a typical case?",
      a: "Every allowed connection could use its buffers at once, which is the worst case. In practice only a share is busy, which gives the typical figure.",
    },
    {
      q: "How much RAM should MySQL take on a shared server?",
      a: "On a server that also runs PHP and a web server, a third to a half of RAM is a common upper limit. A dedicated database server can use 70 percent or more.",
    },
  ],
  "redis-ram-calculator": [
    {
      q: "Why is Redis memory more than keys times value size?",
      a: "Each key carries internal overhead, and the allocator wastes some space to fragmentation. The calculator adds both so the result matches what the server reports.",
    },
    {
      q: "What is the fragmentation factor?",
      a: "The ratio of memory the operating system gave Redis to the memory its data needs. Values from 1.1 to 1.5 are normal. Check mem_fragmentation_ratio in INFO.",
    },
    {
      q: "Do replicas share memory?",
      a: "No. Each replica holds a full copy, so total memory across servers is the single instance figure times the number of copies.",
    },
  ],
  "server-ram-allocation-calculator": [
    {
      q: "What split suits a typical hosting server?",
      a: "Roughly 10 percent for the system, 30 to 40 percent for the database, around 40 percent for PHP and the web server, and the rest for cache.",
    },
    {
      q: "What happens if the shares add up to over 100 percent?",
      a: "The calculator warns you, because the server would be asked for more memory than it has and would swap or kill processes.",
    },
    {
      q: "Should I leave memory unallocated?",
      a: "A little. Unallocated memory is used by the filesystem cache, which speeds up reads of files and database tables.",
    },
  ],
  "disk-usage-calculator": [
    {
      q: "Where do I get these numbers?",
      a: "Run du -sh on the main directories, such as the home folders, the mail store, the database directory, the log folder and the backup folder.",
    },
    {
      q: "Why show the backup share?",
      a: "Local backups often grow to be the largest item without anyone noticing. A high share is a sign to move older copies to remote storage.",
    },
    {
      q: "What happens when the parts exceed the disk size?",
      a: "The calculator reports it as an error, because that combination is impossible. Check for double counting, such as backups inside a site folder.",
    },
  ],
  "inode-usage-calculator": [
    {
      q: "What is an inode?",
      a: "A record the filesystem keeps for every file and folder. When inodes run out you cannot create files even if there is free disk space.",
    },
    {
      q: "How many inodes does a filesystem have?",
      a: "ext4 sets the number when the filesystem is created, by default one inode per 16 KB of space. Run df -i to see the real total.",
    },
    {
      q: "Why set a per-account limit?",
      a: "One account with millions of tiny cache or session files can exhaust the inodes for everyone. A limit of 80 percent shared fairly stops that.",
    },
  ],
  "backup-rotation-calculator": [
    {
      q: "What is grandfather-father-son rotation?",
      a: "A scheme that keeps daily, weekly and monthly copies, with yearly copies added for archives. Recent backups are frequent, older ones are spaced out.",
    },
    {
      q: "How does deduplication change the numbers?",
      a: "Backup tools that dedupe or compress store far less than the raw size. The savings field lets you apply a realistic figure from your tool's reports.",
    },
    {
      q: "How is this different from the backup retention calculator?",
      a: "This one adds yearly archives and a compression or dedup saving, and lists the furthest restore point.",
    },
  ],
  "backup-bandwidth-calculator": [
    {
      q: "How is the speed needed calculated?",
      a: "The amount of data in megabits divided by the seconds in your backup window. If your link is slower than that, the backup will not finish in time.",
    },
    {
      q: "Why include efficiency?",
      a: "Real transfers rarely reach the advertised link speed because of protocol overhead and other traffic. Seventy to eighty percent is a realistic planning figure.",
    },
    {
      q: "When does only incremental fit?",
      a: "When a full copy would take longer than the window but the daily change is small. Then take full backups on a weekend and incrementals on weekdays.",
    },
  ],
}
