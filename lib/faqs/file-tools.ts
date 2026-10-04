import type { Faq } from "@/lib/tool-faqs"

export const file_toolsFaqs: Record<string, Faq[]> = {
  "csv-viewer": [
    {
      q: "Is my CSV file uploaded?",
      a: "No. The file is read by your browser with the File API and shown on this page. Nothing is sent to a server, so private exports stay private.",
    },
    {
      q: "How does it know the delimiter?",
      a: "It counts commas, semicolons, tabs and pipes in the first line, ignoring any inside quotes, and picks the most common. You can also choose one by hand.",
    },
    {
      q: "How large a file can it open?",
      a: "Up to 10 MB, and the table shows the first 500 matching rows to stay fast. Use the search box to narrow down a large file.",
    },
  ],
  "image-metadata-viewer": [
    {
      q: "What is EXIF data?",
      a: "Information a camera or phone stores inside a photo: the device, the time it was taken, the orientation and sometimes the GPS position.",
    },
    {
      q: "Can a photo reveal my location?",
      a: "Yes. If location was on when the photo was taken, the GPS coordinates may be in the file. The viewer warns you when GPS data is present.",
    },
    {
      q: "How do I remove the metadata?",
      a: "Use the clean copy button. It redraws the image on a canvas and saves it again, which drops EXIF data. JPEG copies are re-compressed, so keep the original too.",
    },
  ],
  "image-to-base64": [
    {
      q: "When should I inline an image as Base64?",
      a: "For tiny images such as small icons, where saving a request outweighs the larger size. For photos and big images use a normal file.",
    },
    {
      q: "Why is the Base64 text larger?",
      a: "Base64 stores three bytes in four characters, so the text is about a third larger than the file. It also cannot be cached separately from the page.",
    },
    {
      q: "Is the image sent to a server?",
      a: "No. Your browser encodes it locally with the FileReader API, so the image never leaves your device.",
    },
  ],
  "data-uri-to-file": [
    {
      q: "What is a data URI?",
      a: "A way to put a file's bytes directly in a link, in the form data:type;base64,encoded-data. It is common for small images and fonts in CSS.",
    },
    {
      q: "Is it safe to decode an untrusted data URI?",
      a: "Yes. The tool only decodes it and offers a download. HTML and SVG content is shown as text, never run, and only common image types are previewed.",
    },
    {
      q: "Which extension does the download get?",
      a: "One chosen from the media type, such as png for image/png. Rename the file if you need a different extension.",
    },
  ],
  "favicon-generator": [
    {
      q: "Which favicon sizes does a site need?",
      a: "32 and 16 pixels for browser tabs, 180 for iPhone home screens, and 192 and 512 for Android and installable web apps. This tool makes all of them.",
    },
    {
      q: "Can I use an emoji?",
      a: "Yes, one or two characters including emoji. Emoji are drawn with your device's emoji font, so they look the way they do on your own screen.",
    },
    {
      q: "Where do I put the files?",
      a: "Upload them to the root folder of your site, then add the link tags from the generated code to the head of your pages.",
    },
  ],
}
