import type { Faq } from "@/lib/tool-faqs"

export const emailFaqs: Record<string, Faq[]> = {
  "email-subject-line-analyzer": [
    {
      q: "How long should an email subject line be?",
      a: "Aim for under 40 characters. Phones show about 30 to 40, desktop clients 60 to 70. Put the important words first so a cut off still makes sense.",
    },
    {
      q: "Which words trigger spam filters?",
      a: "Filters weigh many signals, but pushy phrases such as free, urgent, act now and guarantee, plus all capitals and repeated exclamation marks, are the usual causes.",
    },
    {
      q: "Does the tool predict my open rate?",
      a: "No. It checks style and length against common advice. Real open rates depend on your list, sender name and timing, so test two subjects on a small group first.",
    },
  ],
  "email-address-validator": [
    {
      q: "Does a valid format mean the mailbox exists?",
      a: "No. The tool checks that the address is built correctly. Only sending a message, or a confirmation link, shows whether the mailbox is real.",
    },
    {
      q: "What does CHECK mean in the results?",
      a: "The address is valid in form but its domain looks like a misspelling of a popular provider, such as gmial.com. It is worth asking the owner to confirm it.",
    },
    {
      q: "Are quoted or unusual addresses accepted?",
      a: "The checker uses a practical rule set and rejects rare forms like quoted names with spaces. Those are valid in theory but almost never used and often cause trouble.",
    },
  ],
  "email-address-normalizer": [
    {
      q: "Why remove dots in Gmail addresses?",
      a: "Gmail ignores dots in the name part, so jane.doe and janedoe are one mailbox. Removing them finds duplicates a plain text match would miss.",
    },
    {
      q: "What is a plus tag?",
      a: "Text after a plus sign, as in jane+news@gmail.com, is delivered to the same mailbox on many providers. Removing it reveals the real address.",
    },
    {
      q: "Is lowercasing safe?",
      a: "The name part is technically case sensitive, but almost no provider treats it that way. Keep the option on unless you know your system does.",
    },
  ],
  "email-domain-extractor": [
    {
      q: "What text can I paste in?",
      a: "Anything: an exported contact list, a log, a web page or a mailing list. The tool finds the addresses itself and ignores the rest.",
    },
    {
      q: "Why count domains?",
      a: "Counts show which companies or providers dominate a list, which is useful for segmenting a campaign or spotting free mail versus business addresses.",
    },
    {
      q: "Are addresses stored or sent?",
      a: "No. Extraction runs in your browser, so contact lists stay on your device.",
    },
  ],
  "email-username-generator": [
    {
      q: "Which pattern do most companies use?",
      a: "first.last is the most common, followed by first and flast. Pick one convention for the whole company so addresses are easy to guess.",
    },
    {
      q: "How are accents and symbols handled?",
      a: "Accented letters are converted to plain ones and everything except letters and digits is removed, so Jos\u00e9 O'Brien becomes jose and obrien.",
    },
    {
      q: "What about two people with the same name?",
      a: "Add a number or a middle initial for the second person, and keep the first person's address unchanged.",
    },
  ],
  "email-signature-generator": [
    {
      q: "Why use a plain text signature?",
      a: "It displays the same everywhere, is accepted by every client, and does not add images that trigger spam checks or get blocked.",
    },
    {
      q: "What is the double dash for?",
      a: "The line with two dashes and a space is the traditional separator between a message and its signature, which many clients recognise and can hide when replying.",
    },
    {
      q: "How long should a signature be?",
      a: "Four to six lines is plenty: name, role and company, one way to call, one way to email and your website.",
    },
  ],
  "html-email-signature-generator": [
    {
      q: "Why does the signature use tables?",
      a: "Many email clients, especially Outlook, ignore modern layout like flexbox. Tables with inline styles are the layout that renders consistently.",
    },
    {
      q: "How do I install it?",
      a: "Copy the HTML and paste it into your client's signature editor in HTML mode, or use the client's option to insert HTML. Some clients need the code saved as a file.",
    },
    {
      q: "Is the logo embedded?",
      a: "No. The logo is linked from the https address you give, so host it somewhere reliable. Many clients ask before showing remote images.",
    },
  ],
  "email-header-date-converter": [
    {
      q: "What format is the Date header?",
      a: "RFC 5322 defines it as a weekday, day, month, year, time and a numeric offset, for example Tue, 14 Oct 2025 10:15:00 +0200.",
    },
    {
      q: "Why does the offset matter?",
      a: "The offset shows the sender's local time. The same instant has different clock times in different places, so convert to UTC to compare messages.",
    },
    {
      q: "Can I paste a Unix timestamp?",
      a: "Yes. Nine to eleven digits are read as seconds and twelve or thirteen digits as milliseconds. The tool then shows the Date header form.",
    },
  ],
  "email-attachment-size-calculator": [
    {
      q: "Why is a 20 MB file too big for a 25 MB limit?",
      a: "Attachments are encoded as text with base64 before sending, which makes them about a third larger. The provider checks the encoded size, not the original.",
    },
    {
      q: "What are common limits?",
      a: "Gmail allows 25 MB, many business servers 10 to 20 MB. Check your own provider, since administrators can set lower limits.",
    },
    {
      q: "What can I do when files are too large?",
      a: "Share a download link from cloud storage, compress the files into one archive, or send them in separate messages.",
    },
  ],
  "email-size-calculator": [
    {
      q: "What is Gmail clipping?",
      a: "Gmail cuts off the displayed HTML of messages above about 102 KB and shows a link to view the rest. Anything important at the bottom, including unsubscribe links, can be hidden.",
    },
    {
      q: "How is the estimate calculated?",
      a: "The HTML body is increased slightly for encoding. Inline images and attachments grow by about 37 percent as they are base64 encoded with line breaks.",
    },
    {
      q: "How can I make a newsletter lighter?",
      a: "Trim unused markup and inline styles, compress images, and link to hosted images instead of embedding them.",
    },
  ],
  "smtp-port-reference": [
    {
      q: "Which SMTP port should I use to send mail?",
      a: "Port 587 with STARTTLS or port 465 with implicit TLS for sending from a mail client or application. Port 25 is for server to server delivery.",
    },
    {
      q: "Why is port 25 often blocked?",
      a: "Spammers used it from infected machines, so many ISPs and cloud providers block outbound connections on it. Use a submission port with authentication instead.",
    },
    {
      q: "What is port 2525?",
      a: "An unofficial alternative that some email services open so customers can send when 25 and 587 are blocked. It behaves like 587.",
    },
  ],
  "email-mime-type-reference": [
    {
      q: "What is a MIME type?",
      a: "A label such as application/pdf that tells the receiving program what kind of data an attachment contains and how to open it.",
    },
    {
      q: "Where is the MIME type used in an email?",
      a: "In the Content-Type header of each message part, next to the file name in Content-Disposition. Mail libraries normally set it for you.",
    },
    {
      q: "What if I do not know the type?",
      a: "Use application/octet-stream. It marks the data as generic binary, and the recipient's client decides what to do with it.",
    },
  ],
}
