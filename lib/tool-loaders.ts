import type { ComponentType } from "react"

// kept out of tool-registry: a server module reaching "use client" targets through import()
// thunks makes next hoist all 48 tools into every route's client entry
export type ToolLoader = () => Promise<{ default: ComponentType }>

export const toolLoaders: Record<string, ToolLoader> = {
  "subnet-calculator": () =>
    import("@/components/tools/subnet-calculator").then((m) => ({ default: m.SubnetCalculator })),
  "vlsm-planner": () =>
    import("@/components/tools/vlsm-planner").then((m) => ({ default: m.VLSMPlanner })),
  "mtu-calculator": () =>
    import("@/components/tools/mtu-calculator").then((m) => ({ default: m.MTUCalculator })),
  "bandwidth-calculator": () =>
    import("@/components/tools/bandwidth-calculator").then((m) => ({
      default: m.BandwidthCalculator,
    })),
  "cable-calculator": () =>
    import("@/components/tools/cable-calculator").then((m) => ({ default: m.CableCalculator })),
  "ip-converter": () =>
    import("@/components/tools/ip-converter").then((m) => ({ default: m.IPConverter })),
  "ip-enumerator": () =>
    import("@/components/tools/ip-enumerator").then((m) => ({ default: m.IPEnumerator })),
  "ipv6-tools": () =>
    import("@/components/tools/ipv6-tools").then((m) => ({ default: m.IPv6Tools })),
  "conflict-checker": () =>
    import("@/components/tools/conflict-checker").then((m) => ({ default: m.ConflictChecker })),
  "vlan-manager": () =>
    import("@/components/tools/vlan-manager").then((m) => ({ default: m.VLANManager })),
  "routing-tools": () =>
    import("@/components/tools/routing-tools").then((m) => ({ default: m.RoutingTools })),
  "acl-generator": () =>
    import("@/components/tools/acl-generator").then((m) => ({ default: m.ACLGenerator })),
  "wireless-tools": () =>
    import("@/components/tools/wireless-tools").then((m) => ({ default: m.WirelessTools })),
  "network-tester": () =>
    import("@/components/tools/network-tester").then((m) => ({ default: m.NetworkTester })),
  "dns-tools": () => import("@/components/tools/dns-tools").then((m) => ({ default: m.DNSTools })),
  "ping-traceroute": () =>
    import("@/components/tools/ping-traceroute").then((m) => ({ default: m.PingTraceroute })),
  "port-scanner": () =>
    import("@/components/tools/port-scanner").then((m) => ({ default: m.PortScanner })),
  "ssl-checker": () =>
    import("@/components/tools/ssl-checker").then((m) => ({ default: m.SSLChecker })),
  "whois-lookup": () =>
    import("@/components/tools/whois-lookup").then((m) => ({ default: m.WhoisLookup })),
  "email-diagnostics": () =>
    import("@/components/tools/email-diagnostics").then((m) => ({ default: m.EmailDiagnostics })),
  "random-generator": () =>
    import("@/components/tools/random-generator").then((m) => ({ default: m.RandomGenerator })),
  "wifi-qr": () =>
    import("@/components/tools/wifi-qr-generator").then((m) => ({ default: m.WifiQRGenerator })),
  "reference-hub": () =>
    import("@/components/tools/reference-hub").then((m) => ({ default: m.ReferenceHub })),
  "oui-lookup": () =>
    import("@/components/tools/oui-lookup").then((m) => ({ default: m.OUILookup })),
  "http-headers": () =>
    import("@/components/tools/http-headers").then((m) => ({ default: m.HTTPHeaders })),
  "security-headers": () =>
    import("@/components/tools/security-headers").then((m) => ({ default: m.SecurityHeaders })),
  "redirect-checker": () =>
    import("@/components/tools/redirect-checker").then((m) => ({ default: m.RedirectChecker })),
  "user-agent-parser": () =>
    import("@/components/tools/user-agent-parser").then((m) => ({ default: m.UserAgentParser })),
  "hash-generator": () =>
    import("@/components/tools/hash-generator").then((m) => ({ default: m.HashGenerator })),
  "password-generator": () =>
    import("@/components/tools/password-generator").then((m) => ({
      default: m.PasswordGenerator,
    })),
  "base64-encoder": () =>
    import("@/components/tools/base64-encoder").then((m) => ({ default: m.Base64Encoder })),
  "url-encoder": () =>
    import("@/components/tools/url-encoder").then((m) => ({ default: m.URLEncoder })),
  "json-formatter": () =>
    import("@/components/tools/json-formatter").then((m) => ({ default: m.JSONFormatter })),
  "jwt-decoder": () =>
    import("@/components/tools/jwt-decoder").then((m) => ({ default: m.JWTDecoder })),
  "timestamp-converter": () =>
    import("@/components/tools/timestamp-converter").then((m) => ({
      default: m.TimestampConverter,
    })),
  "cron-parser": () =>
    import("@/components/tools/cron-parser").then((m) => ({ default: m.CronParser })),
  "regex-tester": () =>
    import("@/components/tools/regex-tester").then((m) => ({ default: m.RegexTester })),
  "color-converter": () =>
    import("@/components/tools/color-converter").then((m) => ({ default: m.ColorConverter })),
  "lorem-generator": () =>
    import("@/components/tools/lorem-generator").then((m) => ({ default: m.LoremGenerator })),
  "data-unit-converter": () =>
    import("@/components/tools/data-unit-converter").then((m) => ({
      default: m.DataUnitConverter,
    })),
  "uptime-calculator": () =>
    import("@/components/tools/uptime-calculator").then((m) => ({ default: m.UptimeCalculator })),
  "network-calculator": () =>
    import("@/components/tools/network-calculator").then((m) => ({
      default: m.NetworkCalculator,
    })),
  "mac-formatter": () =>
    import("@/components/tools/mac-formatter").then((m) => ({ default: m.MACFormatter })),
  "subnet-mask-converter": () =>
    import("@/components/tools/subnet-mask-converter").then((m) => ({
      default: m.SubnetMaskConverter,
    })),
  "port-reference": () =>
    import("@/components/tools/port-reference").then((m) => ({ default: m.PortReference })),
  "cidr-reference": () =>
    import("@/components/tools/cidr-reference").then((m) => ({ default: m.CIDRReference })),
  "protocol-reference": () =>
    import("@/components/tools/protocol-reference").then((m) => ({
      default: m.ProtocolReference,
    })),
  "ipv6-reference": () =>
    import("@/components/tools/ipv6-reference").then((m) => ({ default: m.IPv6Reference })),
  "hosting-cost-calculator": () =>
    import("@/components/tools/hosting-cost-calculator").then((m) => ({
      default: m.HostingCostCalculator,
    })),
  "vps-cost-calculator": () =>
    import("@/components/tools/vps-cost-calculator").then((m) => ({
      default: m.VpsCostCalculator,
    })),
  "hosting-profit-calculator": () =>
    import("@/components/tools/hosting-profit-calculator").then((m) => ({
      default: m.HostingProfitCalculator,
    })),
  "hosting-break-even-calculator": () =>
    import("@/components/tools/hosting-break-even-calculator").then((m) => ({
      default: m.HostingBreakEvenCalculator,
    })),
  "server-capacity-calculator": () =>
    import("@/components/tools/server-capacity-calculator").then((m) => ({
      default: m.ServerCapacityCalculator,
    })),
  "backup-storage-calculator": () =>
    import("@/components/tools/backup-storage-calculator").then((m) => ({
      default: m.BackupStorageCalculator,
    })),
  "backup-retention-calculator": () =>
    import("@/components/tools/backup-retention-calculator").then((m) => ({
      default: m.BackupRetentionCalculator,
    })),
  "migration-time-calculator": () =>
    import("@/components/tools/migration-time-calculator").then((m) => ({
      default: m.MigrationTimeCalculator,
    })),
  "bandwidth-cost-calculator": () =>
    import("@/components/tools/bandwidth-cost-calculator").then((m) => ({
      default: m.BandwidthCostCalculator,
    })),
  "hosting-package-pricing-calculator": () =>
    import("@/components/tools/hosting-package-pricing-calculator").then((m) => ({
      default: m.HostingPackagePricingCalculator,
    })),
  "cpanel-license-calculator": () =>
    import("@/components/tools/cpanel-license-calculator").then((m) => ({
      default: m.CpanelLicenseCalculator,
    })),
  "cloudlinux-license-calculator": () =>
    import("@/components/tools/cloudlinux-license-calculator").then((m) => ({
      default: m.CloudlinuxLicenseCalculator,
    })),
  "litespeed-license-calculator": () =>
    import("@/components/tools/litespeed-license-calculator").then((m) => ({
      default: m.LitespeedLicenseCalculator,
    })),
  "whmcs-license-calculator": () =>
    import("@/components/tools/whmcs-license-calculator").then((m) => ({
      default: m.WhmcsLicenseCalculator,
    })),
  "jetbackup-license-calculator": () =>
    import("@/components/tools/jetbackup-license-calculator").then((m) => ({
      default: m.JetbackupLicenseCalculator,
    })),
  "softaculous-license-calculator": () =>
    import("@/components/tools/softaculous-license-calculator").then((m) => ({
      default: m.SoftaculousLicenseCalculator,
    })),
  "virtualizor-license-calculator": () =>
    import("@/components/tools/virtualizor-license-calculator").then((m) => ({
      default: m.VirtualizorLicenseCalculator,
    })),
  "server-license-stack-calculator": () =>
    import("@/components/tools/server-license-stack-calculator").then((m) => ({
      default: m.ServerLicenseStackCalculator,
    })),
  "domain-availability-checker": () =>
    import("@/components/tools/domain-availability-checker").then((m) => ({
      default: m.DomainAvailabilityChecker,
    })),
  "domain-age-calculator": () =>
    import("@/components/tools/domain-age-calculator").then((m) => ({
      default: m.DomainAgeCalculator,
    })),
  "domain-expiry-calculator": () =>
    import("@/components/tools/domain-expiry-calculator").then((m) => ({
      default: m.DomainExpiryCalculator,
    })),
  "domain-name-generator": () =>
    import("@/components/tools/domain-name-generator").then((m) => ({
      default: m.DomainNameGenerator,
    })),
  "domain-cost-calculator": () =>
    import("@/components/tools/domain-cost-calculator").then((m) => ({
      default: m.DomainCostCalculator,
    })),
  "domain-transfer-checklist": () =>
    import("@/components/tools/domain-transfer-checklist").then((m) => ({
      default: m.DomainTransferChecklist,
    })),
  "chmod-calculator": () =>
    import("@/components/tools/chmod-calculator").then((m) => ({ default: m.ChmodCalculator })),
  "chown-generator": () =>
    import("@/components/tools/chown-generator").then((m) => ({ default: m.ChownGenerator })),
  "umask-calculator": () =>
    import("@/components/tools/umask-calculator").then((m) => ({ default: m.UmaskCalculator })),
  "scp-generator": () =>
    import("@/components/tools/scp-generator").then((m) => ({ default: m.ScpGenerator })),
  "rsync-generator": () =>
    import("@/components/tools/rsync-generator").then((m) => ({ default: m.RsyncGenerator })),
  "nginx-config-generator": () =>
    import("@/components/tools/nginx-config-generator").then((m) => ({
      default: m.NginxConfigGenerator,
    })),
  "apache-virtualhost-generator": () =>
    import("@/components/tools/apache-virtualhost-generator").then((m) => ({
      default: m.ApacheVirtualhostGenerator,
    })),
  "htaccess-generator": () =>
    import("@/components/tools/htaccess-generator").then((m) => ({ default: m.HtaccessGenerator })),
  "utm-builder": () =>
    import("@/components/tools/utm-builder").then((m) => ({ default: m.UtmBuilder })),
  "meta-title-checker": () =>
    import("@/components/tools/meta-title-checker").then((m) => ({ default: m.MetaTitleChecker })),
  "meta-description-checker": () =>
    import("@/components/tools/meta-description-checker").then((m) => ({
      default: m.MetaDescriptionChecker,
    })),
  "serp-preview": () =>
    import("@/components/tools/serp-preview").then((m) => ({ default: m.SerpPreview })),
  "robots-txt-generator": () =>
    import("@/components/tools/robots-txt-generator").then((m) => ({
      default: m.RobotsTxtGenerator,
    })),
  "sitemap-generator": () =>
    import("@/components/tools/sitemap-generator").then((m) => ({ default: m.SitemapGenerator })),
  "schema-generator": () =>
    import("@/components/tools/schema-generator").then((m) => ({ default: m.SchemaGenerator })),
  "open-graph-generator": () =>
    import("@/components/tools/open-graph-generator").then((m) => ({
      default: m.OpenGraphGenerator,
    })),
  "yaml-formatter": () =>
    import("@/components/tools/yaml-formatter").then((m) => ({ default: m.YamlFormatter })),
  "xml-formatter": () =>
    import("@/components/tools/xml-formatter").then((m) => ({ default: m.XmlFormatter })),
  "sql-formatter": () =>
    import("@/components/tools/sql-formatter").then((m) => ({ default: m.SqlFormatter })),
  "json-to-yaml": () =>
    import("@/components/tools/json-to-yaml").then((m) => ({ default: m.JsonToYaml })),
  "yaml-to-json": () =>
    import("@/components/tools/yaml-to-json").then((m) => ({ default: m.YamlToJson })),
  "json-to-typescript": () =>
    import("@/components/tools/json-to-typescript").then((m) => ({ default: m.JsonToTypescript })),
  "csv-to-json": () =>
    import("@/components/tools/csv-to-json").then((m) => ({ default: m.CsvToJson })),
  "json-to-csv": () =>
    import("@/components/tools/json-to-csv").then((m) => ({ default: m.JsonToCsv })),
  "password-entropy-calculator": () =>
    import("@/components/tools/password-entropy-calculator").then((m) => ({
      default: m.PasswordEntropyCalculator,
    })),
  "sri-hash-generator": () =>
    import("@/components/tools/sri-hash-generator").then((m) => ({ default: m.SriHashGenerator })),
  "dedicated-server-cost-calculator": () =>
    import("@/components/tools/dedicated-server-cost-calculator").then((m) => ({
      default: m.DedicatedServerCostCalculator,
    })),
  "reseller-hosting-cost-calculator": () =>
    import("@/components/tools/reseller-hosting-cost-calculator").then((m) => ({
      default: m.ResellerHostingCostCalculator,
    })),
  "vps-profit-calculator": () =>
    import("@/components/tools/vps-profit-calculator").then((m) => ({
      default: m.VpsProfitCalculator,
    })),
  "server-break-even-calculator": () =>
    import("@/components/tools/server-break-even-calculator").then((m) => ({
      default: m.ServerBreakEvenCalculator,
    })),
  "hosting-discount-calculator": () =>
    import("@/components/tools/hosting-discount-calculator").then((m) => ({
      default: m.HostingDiscountCalculator,
    })),
  "monthly-to-annual-hosting-calculator": () =>
    import("@/components/tools/monthly-to-annual-hosting-calculator").then((m) => ({
      default: m.MonthlyToAnnualHostingCalculator,
    })),
  "hosting-revenue-calculator": () =>
    import("@/components/tools/hosting-revenue-calculator").then((m) => ({
      default: m.HostingRevenueCalculator,
    })),
  "hosting-mrr-calculator": () =>
    import("@/components/tools/hosting-mrr-calculator").then((m) => ({
      default: m.HostingMrrCalculator,
    })),
  "hosting-arr-calculator": () =>
    import("@/components/tools/hosting-arr-calculator").then((m) => ({
      default: m.HostingArrCalculator,
    })),
  "customer-churn-calculator": () =>
    import("@/components/tools/customer-churn-calculator").then((m) => ({
      default: m.CustomerChurnCalculator,
    })),
  "hosting-ltv-calculator": () =>
    import("@/components/tools/hosting-ltv-calculator").then((m) => ({
      default: m.HostingLtvCalculator,
    })),
  "cac-calculator": () =>
    import("@/components/tools/cac-calculator").then((m) => ({ default: m.CacCalculator })),
  "hosting-ltv-cac-calculator": () =>
    import("@/components/tools/hosting-ltv-cac-calculator").then((m) => ({
      default: m.HostingLtvCacCalculator,
    })),
  "hosting-markup-calculator": () =>
    import("@/components/tools/hosting-markup-calculator").then((m) => ({
      default: m.HostingMarkupCalculator,
    })),
  "hosting-profit-margin-calculator": () =>
    import("@/components/tools/hosting-profit-margin-calculator").then((m) => ({
      default: m.HostingProfitMarginCalculator,
    })),
  "hosting-business-roi-calculator": () =>
    import("@/components/tools/hosting-business-roi-calculator").then((m) => ({
      default: m.HostingBusinessRoiCalculator,
    })),
  "server-roi-calculator": () =>
    import("@/components/tools/server-roi-calculator").then((m) => ({
      default: m.ServerRoiCalculator,
    })),
  "server-utilization-calculator": () =>
    import("@/components/tools/server-utilization-calculator").then((m) => ({
      default: m.ServerUtilizationCalculator,
    })),
  "hosting-occupancy-rate-calculator": () =>
    import("@/components/tools/hosting-occupancy-rate-calculator").then((m) => ({
      default: m.HostingOccupancyRateCalculator,
    })),
  "reseller-pricing-calculator": () =>
    import("@/components/tools/reseller-pricing-calculator").then((m) => ({
      default: m.ResellerPricingCalculator,
    })),
  "vps-pricing-calculator": () =>
    import("@/components/tools/vps-pricing-calculator").then((m) => ({
      default: m.VpsPricingCalculator,
    })),
  "dedicated-server-pricing-calculator": () =>
    import("@/components/tools/dedicated-server-pricing-calculator").then((m) => ({
      default: m.DedicatedServerPricingCalculator,
    })),
  "vps-ram-calculator": () =>
    import("@/components/tools/vps-ram-calculator").then((m) => ({ default: m.VpsRamCalculator })),
  "vps-cpu-calculator": () =>
    import("@/components/tools/vps-cpu-calculator").then((m) => ({ default: m.VpsCpuCalculator })),
  "vps-storage-calculator": () =>
    import("@/components/tools/vps-storage-calculator").then((m) => ({
      default: m.VpsStorageCalculator,
    })),
  "vps-bandwidth-calculator": () =>
    import("@/components/tools/vps-bandwidth-calculator").then((m) => ({
      default: m.VpsBandwidthCalculator,
    })),
  "server-storage-calculator": () =>
    import("@/components/tools/server-storage-calculator").then((m) => ({
      default: m.ServerStorageCalculator,
    })),
  "raid-capacity-calculator": () =>
    import("@/components/tools/raid-capacity-calculator").then((m) => ({
      default: m.RaidCapacityCalculator,
    })),
  "swap-size-calculator": () =>
    import("@/components/tools/swap-size-calculator").then((m) => ({
      default: m.SwapSizeCalculator,
    })),
  "php-worker-calculator": () =>
    import("@/components/tools/php-worker-calculator").then((m) => ({
      default: m.PhpWorkerCalculator,
    })),
  "mysql-ram-calculator": () =>
    import("@/components/tools/mysql-ram-calculator").then((m) => ({
      default: m.MysqlRamCalculator,
    })),
  "redis-ram-calculator": () =>
    import("@/components/tools/redis-ram-calculator").then((m) => ({
      default: m.RedisRamCalculator,
    })),
  "server-ram-allocation-calculator": () =>
    import("@/components/tools/server-ram-allocation-calculator").then((m) => ({
      default: m.ServerRamAllocationCalculator,
    })),
  "disk-usage-calculator": () =>
    import("@/components/tools/disk-usage-calculator").then((m) => ({
      default: m.DiskUsageCalculator,
    })),
  "inode-usage-calculator": () =>
    import("@/components/tools/inode-usage-calculator").then((m) => ({
      default: m.InodeUsageCalculator,
    })),
  "backup-rotation-calculator": () =>
    import("@/components/tools/backup-rotation-calculator").then((m) => ({
      default: m.BackupRotationCalculator,
    })),
  "backup-bandwidth-calculator": () =>
    import("@/components/tools/backup-bandwidth-calculator").then((m) => ({
      default: m.BackupBandwidthCalculator,
    })),
  "plesk-license-calculator": () =>
    import("@/components/tools/plesk-license-calculator").then((m) => ({
      default: m.PleskLicenseCalculator,
    })),
  "imunify360-license-calculator": () =>
    import("@/components/tools/imunify360-license-calculator").then((m) => ({
      default: m.Imunify360LicenseCalculator,
    })),
  "sitepad-license-calculator": () =>
    import("@/components/tools/sitepad-license-calculator").then((m) => ({
      default: m.SitepadLicenseCalculator,
    })),
  "whmreseller-license-calculator": () =>
    import("@/components/tools/whmreseller-license-calculator").then((m) => ({
      default: m.WhmresellerLicenseCalculator,
    })),
  "domain-renewal-cost-calculator": () =>
    import("@/components/tools/domain-renewal-cost-calculator").then((m) => ({
      default: m.DomainRenewalCostCalculator,
    })),
  "domain-profit-calculator": () =>
    import("@/components/tools/domain-profit-calculator").then((m) => ({
      default: m.DomainProfitCalculator,
    })),
  "domain-portfolio-value-calculator": () =>
    import("@/components/tools/domain-portfolio-value-calculator").then((m) => ({
      default: m.DomainPortfolioValueCalculator,
    })),
  "domain-length-checker": () =>
    import("@/components/tools/domain-length-checker").then((m) => ({
      default: m.DomainLengthChecker,
    })),
  "domain-combinations-generator": () =>
    import("@/components/tools/domain-combinations-generator").then((m) => ({
      default: m.DomainCombinationsGenerator,
    })),
  "domain-extension-explorer": () =>
    import("@/components/tools/domain-extension-explorer").then((m) => ({
      default: m.DomainExtensionExplorer,
    })),
  "word-counter": () =>
    import("@/components/tools/word-counter").then((m) => ({ default: m.WordCounter })),
  "character-counter": () =>
    import("@/components/tools/character-counter").then((m) => ({ default: m.CharacterCounter })),
  "reading-time-calculator": () =>
    import("@/components/tools/reading-time-calculator").then((m) => ({
      default: m.ReadingTimeCalculator,
    })),
  "keyword-density-calculator": () =>
    import("@/components/tools/keyword-density-calculator").then((m) => ({
      default: m.KeywordDensityCalculator,
    })),
  "heading-structure-analyzer": () =>
    import("@/components/tools/heading-structure-analyzer").then((m) => ({
      default: m.HeadingStructureAnalyzer,
    })),
  "internal-link-calculator": () =>
    import("@/components/tools/internal-link-calculator").then((m) => ({
      default: m.InternalLinkCalculator,
    })),
  "image-alt-text-generator": () =>
    import("@/components/tools/image-alt-text-generator").then((m) => ({
      default: m.ImageAltTextGenerator,
    })),
  "url-parser": () =>
    import("@/components/tools/url-parser").then((m) => ({ default: m.UrlParser })),
  "url-builder": () =>
    import("@/components/tools/url-builder").then((m) => ({ default: m.UrlBuilder })),
  "url-slug-generator": () =>
    import("@/components/tools/url-slug-generator").then((m) => ({ default: m.UrlSlugGenerator })),
  "url-length-checker": () =>
    import("@/components/tools/url-length-checker").then((m) => ({ default: m.UrlLengthChecker })),
  "canonical-url-generator": () =>
    import("@/components/tools/canonical-url-generator").then((m) => ({
      default: m.CanonicalUrlGenerator,
    })),
  "redirect-url-builder": () =>
    import("@/components/tools/redirect-url-builder").then((m) => ({
      default: m.RedirectUrlBuilder,
    })),
  "utm-campaign-generator": () =>
    import("@/components/tools/utm-campaign-generator").then((m) => ({
      default: m.UtmCampaignGenerator,
    })),
  "twitter-card-generator": () =>
    import("@/components/tools/twitter-card-generator").then((m) => ({
      default: m.TwitterCardGenerator,
    })),
  "open-graph-preview": () =>
    import("@/components/tools/open-graph-preview").then((m) => ({ default: m.OpenGraphPreview })),
  "twitter-card-preview": () =>
    import("@/components/tools/twitter-card-preview").then((m) => ({
      default: m.TwitterCardPreview,
    })),
  "meta-tag-generator": () =>
    import("@/components/tools/meta-tag-generator").then((m) => ({ default: m.MetaTagGenerator })),
  "html-sitemap-generator": () =>
    import("@/components/tools/html-sitemap-generator").then((m) => ({
      default: m.HtmlSitemapGenerator,
    })),
  "web-manifest-generator": () =>
    import("@/components/tools/web-manifest-generator").then((m) => ({
      default: m.WebManifestGenerator,
    })),
  "security-txt-generator": () =>
    import("@/components/tools/security-txt-generator").then((m) => ({
      default: m.SecurityTxtGenerator,
    })),
  "email-subject-line-analyzer": () =>
    import("@/components/tools/email-subject-line-analyzer").then((m) => ({
      default: m.EmailSubjectLineAnalyzer,
    })),
  "email-address-validator": () =>
    import("@/components/tools/email-address-validator").then((m) => ({
      default: m.EmailAddressValidator,
    })),
  "email-address-normalizer": () =>
    import("@/components/tools/email-address-normalizer").then((m) => ({
      default: m.EmailAddressNormalizer,
    })),
  "email-domain-extractor": () =>
    import("@/components/tools/email-domain-extractor").then((m) => ({
      default: m.EmailDomainExtractor,
    })),
  "email-username-generator": () =>
    import("@/components/tools/email-username-generator").then((m) => ({
      default: m.EmailUsernameGenerator,
    })),
  "email-signature-generator": () =>
    import("@/components/tools/email-signature-generator").then((m) => ({
      default: m.EmailSignatureGenerator,
    })),
  "html-email-signature-generator": () =>
    import("@/components/tools/html-email-signature-generator").then((m) => ({
      default: m.HtmlEmailSignatureGenerator,
    })),
  "email-header-date-converter": () =>
    import("@/components/tools/email-header-date-converter").then((m) => ({
      default: m.EmailHeaderDateConverter,
    })),
  "email-attachment-size-calculator": () =>
    import("@/components/tools/email-attachment-size-calculator").then((m) => ({
      default: m.EmailAttachmentSizeCalculator,
    })),
  "email-size-calculator": () =>
    import("@/components/tools/email-size-calculator").then((m) => ({
      default: m.EmailSizeCalculator,
    })),
  "smtp-port-reference": () =>
    import("@/components/tools/smtp-port-reference").then((m) => ({
      default: m.SmtpPortReference,
    })),
  "email-mime-type-reference": () =>
    import("@/components/tools/email-mime-type-reference").then((m) => ({
      default: m.EmailMimeTypeReference,
    })),
  "tar-command-generator": () =>
    import("@/components/tools/tar-command-generator").then((m) => ({
      default: m.TarCommandGenerator,
    })),
  "find-command-generator": () =>
    import("@/components/tools/find-command-generator").then((m) => ({
      default: m.FindCommandGenerator,
    })),
  "grep-command-generator": () =>
    import("@/components/tools/grep-command-generator").then((m) => ({
      default: m.GrepCommandGenerator,
    })),
  "sed-command-generator": () =>
    import("@/components/tools/sed-command-generator").then((m) => ({
      default: m.SedCommandGenerator,
    })),
  "awk-command-generator": () =>
    import("@/components/tools/awk-command-generator").then((m) => ({
      default: m.AwkCommandGenerator,
    })),
  "curl-command-generator": () =>
    import("@/components/tools/curl-command-generator").then((m) => ({
      default: m.CurlCommandGenerator,
    })),
  "wget-command-generator": () =>
    import("@/components/tools/wget-command-generator").then((m) => ({
      default: m.WgetCommandGenerator,
    })),
  "systemd-service-generator": () =>
    import("@/components/tools/systemd-service-generator").then((m) => ({
      default: m.SystemdServiceGenerator,
    })),
  "systemd-timer-generator": () =>
    import("@/components/tools/systemd-timer-generator").then((m) => ({
      default: m.SystemdTimerGenerator,
    })),
  "php-fpm-config-generator": () =>
    import("@/components/tools/php-fpm-config-generator").then((m) => ({
      default: m.PhpFpmConfigGenerator,
    })),
  "linux-path-analyzer": () =>
    import("@/components/tools/linux-path-analyzer").then((m) => ({
      default: m.LinuxPathAnalyzer,
    })),
  "linux-path-normalizer": () =>
    import("@/components/tools/linux-path-normalizer").then((m) => ({
      default: m.LinuxPathNormalizer,
    })),
}

export function loadTool(slug: string): Promise<{ default: ComponentType }> {
  const loader = toolLoaders[slug]
  if (!loader) throw new Error(`No loader registered for tool "${slug}"`)
  return loader()
}
