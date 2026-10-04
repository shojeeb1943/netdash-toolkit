import type { Faq } from "@/lib/tool-faqs"

export const file_toolsFaqs: Record<string, Faq[]> = {
  "csv-viewer": [
    {
      q: "What features does the CSV Viewer provide for spreadsheet inspection?",
      a: "It parses CSV and TSV files into an interactive data grid with column sorting, live keyword search, pagination controls, column resizing, and row count metrics.",
    },
    {
      q: "Can I open large CSV files directly in my browser?",
      a: "Yes. Because the file is parsed in local browser memory without uploading to a server, it can display datasets of tens of thousands of rows smoothly.",
    },
    {
      q: "How does the viewer handle special characters and international accents?",
      a: "It uses UTF-8 decoding and adheres to RFC 4180 standards, ensuring accents, emojis, and commas within quoted text cells render accurately.",
    },
    {
      q: "Is my uploaded CSV spreadsheet sent to any external server?",
      a: "No. The file is read directly from your local disk using the browser FileReader API. None of your data is transmitted or stored.",
    },
    {
      q: "What related tool converts CSV spreadsheets into JSON format?",
      a: "Use the CSV to JSON tool in the DevTools category to convert tabular spreadsheets into structured JSON arrays for API use.",
    },
    {
      q: "Can I filter table rows by specific column values?",
      a: "Yes. The real-time search filter scans across all table columns or targeted fields to isolate matching data rows instantly.",
    },
  ],
  "image-metadata-viewer": [
    {
      q: "What metadata does the Image Metadata Viewer extract from images?",
      a: "It extracts EXIF, IPTC, and XMP metadata from JPEG, PNG, WebP, and TIFF images: camera model, lens specs, shutter speed, ISO, aperture, capture date/time, GPS coordinates, and embedded color profiles.",
    },
    {
      q: "Why is stripping GPS location metadata important for user privacy?",
      a: "Smartphone cameras automatically embed precise GPS latitude and longitude coordinates into photo EXIF data. Inspecting metadata allows you to verify that privacy data is stripped before publishing images publicly.",
    },
    {
      q: "Does this tool display GPS coordinates on an interactive map?",
      a: "Yes. If the image contains valid GPS tags, the tool extracts the geographic coordinates and provides links to view the exact photo capture location on Google Maps.",
    },
    {
      q: "Are my uploaded photos or private images sent to LicenBase servers?",
      a: "No. The EXIF parser reads binary header bytes directly inside your web browser using JavaScript. No images or metadata leave your computer.",
    },
    {
      q: "What related tool helps convert images into inline Base64 data strings?",
      a: "Use the Image to Base64 tool to encode graphics into inline Data URIs for web stylesheets and emails.",
    },
    {
      q: "Why do images downloaded from social media often lack EXIF metadata?",
      a: "Major social platforms (Facebook, Instagram, Twitter) automatically strip EXIF metadata during upload to protect user privacy and reduce image file sizes.",
    },
  ],
  "image-to-base64": [
    {
      q: "What does the Image to Base64 Converter create?",
      a: "It converts local image files (PNG, JPEG, WebP, SVG, GIF, ICO) into Base64 Data URI strings ('data:image/png;base64,...') and provides ready-to-use HTML 'img' and CSS background-image code snippets.",
    },
    {
      q: "When is it advantageous to embed images as Base64 Data URIs?",
      a: "Embedding tiny icons, logos, or loading spinners directly inside HTML or CSS eliminates separate HTTP network requests, accelerating initial page rendering.",
    },
    {
      q: "Why should large images (over 50 KB) not be converted to Base64 in HTML?",
      a: "Base64 encoding increases file size by ~33% and cannot be cached independently by browser CDNs, which can bloat HTML payload sizes on large images.",
    },
    {
      q: "Are my image files uploaded or stored on any server?",
      a: "No. The file is read and encoded locally in your browser memory using the FileReader API. Your images remain 100% private.",
    },
    {
      q: "What related tool decodes Base64 Data URIs back into downloadable files?",
      a: "Use the Data URI to File tool to convert Base64 strings back into original binary image files.",
    },
    {
      q: "How do Base64 images function inside HTML email signatures?",
      a: "While supported in web browsers, some desktop email clients (like Outlook) block Base64 image rendering, so hosting images on an external HTTPS server is recommended for email signatures.",
    },
  ],
  "data-uri-to-file": [
    {
      q: "How does the Data URI to File Converter work?",
      a: "It decodes Base64 Data URI strings ('data:image/png;base64,...'), extracts the MIME type and binary byte payload, displays a live visual preview, and allows you to download the original file with 1 click.",
    },
    {
      q: "What file types can be reconstructed from Data URIs?",
      a: "It supports all media types including PNG, JPEG, SVG, WebP, GIF, PDF, audio files, and web fonts encoded as Data URIs.",
    },
    {
      q: "How does the tool determine the correct file extension?",
      a: "It inspects the declared MIME header (e.g. 'image/svg+xml') in the Data URI prefix and automatically assigns the matching file extension (.svg) upon download.",
    },
    {
      q: "Is my Data URI payload or decoded file sent to external servers?",
      a: "No. Binary conversion and Blob download generation execute entirely client-side in your web browser. No files or strings leave your device.",
    },
    {
      q: "What related tool converts local image files into Base64 Data URIs?",
      a: "Use the Image to Base64 tool to encode images and graphics into Data URI strings.",
    },
    {
      q: "What is the maximum Data URI size this tool can decode?",
      a: "It can decode Data URIs up to hundreds of megabytes directly in browser memory without server upload restrictions.",
    },
  ],
  "favicon-generator": [
    {
      q: "What icon sizes and formats does the Favicon Generator produce?",
      a: "It transforms any uploaded logo into complete favicon packages: standard 16x16 and 32x32 favicon.ico, 180x180 Apple Touch Icon, and 192x192 / 512x512 Android PWA manifest icons, plus HTML link tags.",
    },
    {
      q: "Why are multiple favicon dimensions necessary for modern websites?",
      a: "Different platforms require specific icon dimensions: desktop browser tabs use 16x16 and 32x32, iOS bookmarks require 180x180 Apple Touch Icons, and Android home screens require 192x192 and 512x512 PWA icons.",
    },
    {
      q: "Can I download all generated favicon assets in a single ZIP bundle?",
      a: "Yes. The tool packages all generated ICO and PNG icons along with a pre-configured 'site.webmanifest' and HTML code snippets in a 1-click ZIP download.",
    },
    {
      q: "Is my logo or brand graphic uploaded to LicenBase servers?",
      a: "No. All image resizing, canvas drawing, and ICO compilation execute locally in your web browser using HTML5 Canvas. Your brand graphics remain completely private.",
    },
    {
      q: "What related tool helps build the complete Web App Manifest for PWAs?",
      a: "Use the Web Manifest Generator in the SEO category to configure theme colors, app names, and icon paths for mobile devices.",
    },
    {
      q: "Where should the generated favicon.ico file be placed on a web server?",
      a: "Place 'favicon.ico' in your domain's root document directory ('/public_html/favicon.ico') so legacy browsers and web crawlers can discover it automatically without HTML tags.",
    },
  ],
}
