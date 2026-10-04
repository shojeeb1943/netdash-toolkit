import type { Faq } from "@/lib/tool-faqs"

export const text_toolsFaqs: Record<string, Faq[]> = {
  "text-case-converter": [
    {
      q: "Which cases are for programming?",
      a: "camelCase and PascalCase for variables and classes, snake_case and CONSTANT_CASE for Python and environment variables, kebab-case for CSS and URLs, and dot.case for config keys.",
    },
    {
      q: "How does it split words in camelCase input?",
      a: "It breaks at changes from a lowercase letter or digit to a capital, and keeps acronyms together, so HTTPServerError becomes HTTP Server Error before conversion.",
    },
    {
      q: "Does title case follow style guides?",
      a: "No. It capitalises the first letter of every word. Style guides that keep small words like of and the lowercase need a manual pass afterwards.",
    },
  ],
  "line-sorter": [
    {
      q: "What is natural number sorting?",
      a: "It compares digit runs as numbers, so item2 comes before item10. Plain alphabetical sorting would put item10 first because the character 1 sorts before 2.",
    },
    {
      q: "How are lines without numbers handled in number order?",
      a: "They are placed after the lines that do contain a number, in their original order.",
    },
    {
      q: "Is the shuffle truly random?",
      a: "It uses your browser's secure random generator with an unbiased method, and the Generate again button gives a new order.",
    },
  ],
  "duplicate-line-remover": [
    {
      q: "Which copy of a duplicate is kept?",
      a: "The first one, in its original position, so the order of your list is preserved.",
    },
    {
      q: "How can I find which lines repeat?",
      a: "Choose the repeated lines mode, and tick the count option to see how many times each appears.",
    },
    {
      q: "Does ignoring case change my output?",
      a: "Matching ignores case, but the line that is kept is written exactly as it first appeared.",
    },
  ],
  "whitespace-cleaner": [
    {
      q: "What are zero-width characters?",
      a: "Invisible characters used for text direction or joining. They often sneak in when copying from web pages and can break URLs, commands and string comparisons.",
    },
    {
      q: "Why replace non-breaking spaces?",
      a: "They look like spaces but are different characters, so searches, code and passwords containing them behave unexpectedly.",
    },
    {
      q: "Will it change the meaning of my text?",
      a: "Only spacing is touched. Collapsing repeated spaces does flatten alignment, so leave that option off for tables or code.",
    },
  ],
  "tsv-to-csv": [
    {
      q: "How do I get TSV from a spreadsheet?",
      a: "Select cells in Excel, Google Sheets or LibreOffice, copy them and paste here. Copied cells are separated by tabs.",
    },
    {
      q: "What does the formula guard do?",
      a: "A cell starting with =, +, - or @ can run as a formula when the CSV is opened in a spreadsheet. The guard adds a leading apostrophe so it stays plain text.",
    },
    {
      q: "What happens to commas and quotes in cells?",
      a: "Cells containing the delimiter, quotes or line breaks are wrapped in quotes, and quotes inside are doubled, as the CSV standard requires.",
    },
  ],
  "text-diff": [
    {
      q: "How does the comparison work?",
      a: "It finds the longest run of lines the two texts share, then marks everything else as removed from the first or added in the second.",
    },
    {
      q: "Can I ignore small differences?",
      a: "Yes. Ignore case treats Hello and hello as the same, and ignore spacing treats repeated spaces and indentation changes as equal.",
    },
    {
      q: "Is there a size limit?",
      a: "Each side can have up to 3000 lines, so the comparison stays fast in a browser. Compare larger files with a command line diff.",
    },
  ],
  "json-diff": [
    {
      q: "What does the JSON diff show?",
      a: "Each difference with its path, such as $.limits.ram. Plus marks a value added, minus a value removed and a tilde a value that changed.",
    },
    {
      q: "Does key order matter?",
      a: "No. Objects are compared by key, so the same data in a different order is reported as identical.",
    },
    {
      q: "How are arrays compared?",
      a: "By position: item 0 against item 0 and so on. An inserted item therefore shifts the ones after it, which shows as changes.",
    },
  ],
}
