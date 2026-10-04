import type { Faq } from "@/lib/tool-faqs"

export const seo_webFaqs: Record<string, Faq[]> = {
  "word-counter": [
    {
      q: "How does the word counter decide what a word is?",
      a: "A word is a run of letters or digits, optionally joined by hyphens or apostrophes. So well-known and don't each count as one word, and numbers count too.",
    },
    {
      q: "How are reading and speaking times worked out?",
      a: "Reading time assumes 238 words per minute, the average for adult silent reading. Speaking time assumes 150 words per minute, a comfortable pace for a talk or voice over.",
    },
    {
      q: "Is my text sent anywhere?",
      a: "No. The counts are calculated in your browser while you type, so drafts and confidential documents stay on your device.",
    },
  ],
  "character-counter": [
    {
      q: "Why are characters and bytes different?",
      a: "A character is a visible symbol, a byte is a unit of storage. Plain English letters take one byte in UTF-8, but accented letters, symbols and emoji take two to four.",
    },
    {
      q: "Which limits does it compare against?",
      a: "Meta title and description lengths used by search engines, the X post length, a single SMS part and an Instagram caption. Each shows characters left or over.",
    },
    {
      q: "Do emoji count as one character?",
      a: "The counter counts what you see, so one emoji is one character even though it uses several bytes. Some platforms count them differently, so leave a margin.",
    },
  ],
  "reading-time-calculator": [
    {
      q: "What reading speed should I use?",
      a: "238 words per minute is the average for adults reading non-fiction silently. Use 200 for technical writing and 260 or more for light content.",
    },
    {
      q: "How are images counted?",
      a: "Each image adds 12 seconds, the figure used by some publishing platforms, since readers pause to look at a picture.",
    },
    {
      q: "Where do I use the 'min read' label?",
      a: "Many blogs show it under the title. The calculator rounds to the nearest minute and never shows less than one.",
    },
  ],
  "keyword-density-calculator": [
    {
      q: "What is keyword density?",
      a: "The number of times a word or phrase appears divided by the total words, shown as a percentage. It is a way to spot over use, not a target to hit.",
    },
    {
      q: "Does Google use a keyword density target?",
      a: "No. Search engines look at meaning and usefulness. Density mainly helps you notice a term you repeat unnaturally, which can read as keyword stuffing.",
    },
    {
      q: "Which words are ignored?",
      a: "Common words such as the, of and and are skipped, and phrases cannot start or end with one. You can also set a minimum word length.",
    },
  ],
  "heading-structure-analyzer": [
    {
      q: "Why should a page have one h1?",
      a: "The h1 names the page. One clear h1 helps search engines and screen reader users understand the topic. Several are allowed in HTML5 but less clear.",
    },
    {
      q: "What is a skipped heading level?",
      a: "Jumping from h2 straight to h4 leaves a gap in the outline. Screen reader users navigate by headings, so a gap suggests missing content.",
    },
    {
      q: "Does the tool fetch my page?",
      a: "No. You paste the HTML and it is parsed in your browser, so nothing is requested from your site and any scripts in the markup are not run.",
    },
  ],
  "internal-link-calculator": [
    {
      q: "What counts as an internal link?",
      a: "A link whose address points to your own domain or one of its subdomains, including relative links such as /about. Mail, phone and in-page links are skipped.",
    },
    {
      q: "Why look at anchor text?",
      a: "Descriptive anchor text tells search engines what the target page is about. A page linked mostly with 'click here' loses that signal.",
    },
    {
      q: "How many internal links should a page have?",
      a: "There is no fixed number. Link where it helps a reader, and make sure important pages are linked from several others so they are easy to find.",
    },
  ],
  "image-alt-text-generator": [
    {
      q: "How does it write alt text?",
      a: "It cleans up the file name, replacing hyphens and underscores with spaces, and capitalises the first letter. Descriptive names give good drafts, generic ones are flagged.",
    },
    {
      q: "What makes good alt text?",
      a: "A short description of what the image shows and why it is there, usually under 125 characters. Skip phrases like image of, since screen readers already announce an image.",
    },
    {
      q: "When should alt be empty?",
      a: "For purely decorative images, use alt with an empty value so screen readers skip them. Missing alt is different: it makes some readers announce the file name.",
    },
  ],
  "url-parser": [
    {
      q: "What are the parts of a URL?",
      a: "The protocol, optional username, host, optional port, path, query string after a question mark, and a fragment after a hash. The parser lists each one.",
    },
    {
      q: "Why is the port shown as default?",
      a: "When a URL has no port, the browser uses the protocol's standard: 443 for https and 80 for http. A port only appears if it is written in the URL.",
    },
    {
      q: "Does it handle encoded characters?",
      a: "Yes. Parameters are decoded for display, so a value written as %20 is shown with a space.",
    },
  ],
  "url-builder": [
    {
      q: "Why build the query string with a tool?",
      a: "Spaces, ampersands and other characters in values must be percent encoded. The builder encodes each value so the final link is valid.",
    },
    {
      q: "Can I use the same key twice?",
      a: "Yes. Add the key on several lines and each is kept, which is how many APIs and filters expect lists, such as tag=a&tag=b.",
    },
    {
      q: "What does removing existing parameters do?",
      a: "If the base address already has a query string, the option clears it first so only your list remains.",
    },
  ],
  "url-slug-generator": [
    {
      q: "What is a URL slug?",
      a: "The readable last part of a page address, such as install-cpanel-on-a-vps. Short, lowercase slugs with hyphens are easier to read, share and rank.",
    },
    {
      q: "Hyphens or underscores?",
      a: "Use hyphens. Search engines treat a hyphen as a word separator, so cpanel-vps reads as two words, while underscores can join them into one.",
    },
    {
      q: "How does the length limit work?",
      a: "The slug is cut to the limit, then trimmed back to the last whole word if that does not lose too much, so it never ends in half a word.",
    },
  ],
  "url-length-checker": [
    {
      q: "How long can a URL be?",
      a: "Browsers and servers vary, but about 2,000 characters is a safe maximum. Beyond that some systems truncate or reject the address.",
    },
    {
      q: "What length is best for SEO?",
      a: "Shorter is better for people. Search results show only the first part of a URL, so keep the meaningful words early and avoid long strings of parameters.",
    },
    {
      q: "Why does the tool mention path depth?",
      a: "Deeply nested folders make addresses long and hard to share. Flat structures with descriptive slugs are usually easier to manage.",
    },
  ],
  "canonical-url-generator": [
    {
      q: "What does a canonical URL do?",
      a: "It tells search engines which version of a page is the main one when the same content is reachable at several addresses, so ranking signals are combined.",
    },
    {
      q: "Which parameters are treated as tracking?",
      a: "UTM tags and common click identifiers such as fbclid and gclid. Parameters that change the content, such as an id, are kept unless you remove all.",
    },
    {
      q: "Should the canonical match the live page?",
      a: "Yes. It should be the address you actually serve and redirect to. Choose https, www and slash settings that match your site, then use that exact tag.",
    },
  ],
  "redirect-url-builder": [
    {
      q: "When should I use a 301 instead of a 302?",
      a: "Use 301 when a page has moved for good, so search engines transfer its ranking to the new address. Use 302 only for a short temporary move.",
    },
    {
      q: "What are 307 and 308?",
      a: "They work like 302 and 301 but force the browser to repeat the same request method, so a POST stays a POST. Most page moves use 301.",
    },
    {
      q: "Why does the tool refuse some characters?",
      a: "Spaces, quotes, braces and semicolons can break a server configuration or inject extra rules, so the tool rejects them instead of producing something unsafe.",
    },
  ],
  "utm-campaign-generator": [
    {
      q: "How is this different from the UTM Builder?",
      a: "The builder makes one link at a time. This tool takes one campaign and a list of source and medium pairs, and produces a tagged link for each channel.",
    },
    {
      q: "How should I name sources and mediums?",
      a: "Keep names lowercase and consistent, for example email, social or cpc. Analytics treats Email and email as different values.",
    },
    {
      q: "Do UTM tags affect SEO?",
      a: "Not directly, but tagged URLs create duplicate addresses. A canonical tag on the page keeps search engines pointing at the clean URL.",
    },
  ],
  "twitter-card-generator": [
    {
      q: "Which card type should I use?",
      a: "summary_large_image shows a wide picture above the text and gets the most attention. summary shows a small square image beside the text.",
    },
    {
      q: "Do I need Twitter tags if I have Open Graph tags?",
      a: "X falls back to Open Graph tags for missing fields, but twitter:card is needed to choose the layout, so add at least that one.",
    },
    {
      q: "How big should the image be?",
      a: "Use a 2:1 image around 1200 by 600 pixels for large cards, under 5 MB, in JPG, PNG or WebP format.",
    },
  ],
  "open-graph-preview": [
    {
      q: "What is Open Graph?",
      a: "A set of meta tags that decide the title, description and image shown when a page is shared on Facebook, LinkedIn, Slack and many other apps.",
    },
    {
      q: "Why is no image loaded in the preview?",
      a: "Loading it would send a request to your image host from this page. The preview checks the text and tells you whether an image is set, keeping the tool fully offline.",
    },
    {
      q: "What lengths are recommended?",
      a: "Titles up to about 60 characters and descriptions up to about 155 stay readable on most platforms. Longer text is usually cut off with an ellipsis.",
    },
  ],
  "twitter-card-preview": [
    {
      q: "How does a Twitter card get its text?",
      a: "From twitter:title and twitter:description, or from the Open Graph tags when those are missing. This preview uses the values you type.",
    },
    {
      q: "What are the length limits?",
      a: "Titles over about 70 characters and descriptions over about 200 characters are shortened by the app. Putting key words first avoids losing them.",
    },
    {
      q: "How do I test the real card?",
      a: "Post the link in a private account or use the platform's own card validator. Apps cache cards, so a change can take a while to appear.",
    },
  ],
  "meta-tag-generator": [
    {
      q: "Which meta tags matter most for SEO?",
      a: "The title and meta description shape your search result, the robots tag controls indexing, and the canonical link names the preferred address.",
    },
    {
      q: "Is the keywords tag useful?",
      a: "Search engines ignore it, so it is optional here. Leave it empty unless another system you use reads it.",
    },
    {
      q: "What does noindex do?",
      a: "It asks search engines not to show the page in results. Use it for thank you pages, internal search results and other pages with no search value.",
    },
  ],
  "html-sitemap-generator": [
    {
      q: "What is an HTML sitemap for?",
      a: "It is a page of links for visitors and a clear path for crawlers to every important page. An XML sitemap is only for search engines.",
    },
    {
      q: "What if I leave out a title?",
      a: "The tool builds one from the last part of the address, turning hyphens into spaces. Descriptive slugs give good titles, but writing your own is better.",
    },
    {
      q: "Does grouping help?",
      a: "On larger sites it does. Pages are grouped under their first folder, such as blog or products, so visitors can scan the structure.",
    },
  ],
  "web-manifest-generator": [
    {
      q: "What does a web app manifest do?",
      a: "It tells the browser the name, icons, colours and start page of your site so it can be installed like an app and look right when launched.",
    },
    {
      q: "Which icons are required?",
      a: "Chrome expects at least a 192 by 192 and a 512 by 512 pixel icon for installation. The tool warns if either is missing.",
    },
    {
      q: "How do I link the manifest?",
      a: "Save the output as manifest.webmanifest and add a link with rel manifest in the head of each page.",
    },
  ],
  "security-txt-generator": [
    {
      q: "What is security.txt?",
      a: "A small text file at /.well-known/security.txt that tells security researchers who to contact and how to report a vulnerability responsibly.",
    },
    {
      q: "Why is Expires required?",
      a: "RFC 9116 requires it so out of date files do not mislead anyone. Set a date under a year away and renew it before it passes.",
    },
    {
      q: "Which contact formats are valid?",
      a: "A mailto address, an https page such as a form, or a tel number. Plain text emails without mailto are not accepted.",
    },
  ],
}
