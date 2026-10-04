import type { Faq } from "@/lib/tool-faqs"

export const text_toolsFaqs: Record<string, Faq[]> = {
  "text-case-converter": [
    {
      q: "Which naming conventions are supported by the Text Case Converter?",
      a: "The converter transforms text across camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, Title Case, sentence case, dot.case, and path/case notation with a single click.",
    },
    {
      q: "How does the tool handle acronyms and existing camelCase boundaries?",
      a: "It intelligently detects case transitions (such as lowercase to uppercase) and preserves acronym sequences like HTTPServerError or XMLParser, breaking them into distinct tokens before reformatting.",
    },
    {
      q: "Does Title Case follow standard AP or Chicago style guide rules?",
      a: "The default Title Case capitalizes the initial letter of every token. For strict grammatical rules that keep minor articles and prepositions in lowercase, review the converted string before publishing.",
    },
    {
      q: "Is my text data transmitted to any external server during case conversion?",
      a: "No. All text parsing, tokenization, and string concatenation execute entirely within your browser runtime using client-side JavaScript. No text is logged or sent across the network.",
    },
    {
      q: "How does the converter handle numbers, symbols, and special punctuation?",
      a: "Numbers are preserved alongside alphanumeric tokens. Punctuation characters such as hyphens, underscores, dots, and slashes are used as delimiters and converted to the target case structure.",
    },
    {
      q: "What tool should I use if I need to clean up messy formatting before case conversion?",
      a: "Use the Whitespace Cleaner to strip zero-width characters and collapse inconsistent indentation before transforming case patterns, or use the URL Slug Generator for URL-friendly slugs.",
    },
  ],
  "line-sorter": [
    {
      q: "How does natural alphanumeric sorting differ from standard alphabetical sorting?",
      a: "Natural sorting evaluates embedded numerical sequences as whole numbers rather than sequential ASCII characters. For example, item2 correctly precedes item10, whereas standard ASCII sorting puts item10 first.",
    },
    {
      q: "How does the Line Sorter handle lines that do not contain numbers when numerical sort is selected?",
      a: "Lines containing valid numbers are sorted first based on their extracted numeric value, while non-numeric lines are grouped together in their original relative sequence.",
    },
    {
      q: "How does the random line shuffling algorithm ensure fair randomization?",
      a: "Line shuffling uses the Fisher-Yates shuffle algorithm powered by the browser's cryptographically secure window.crypto.getRandomValues() method to ensure completely unbiased permutation.",
    },
    {
      q: "Can I perform case-insensitive line sorting?",
      a: "Yes. Enabling case-insensitive sorting normalizes character values during comparison, ensuring uppercase and lowercase words are ordered together without ASCII case bias.",
    },
    {
      q: "Is my list content uploaded or processed on remote servers?",
      a: "No. The sorting engine operates 100% client-side in memory. Large lists containing thousands of lines are sorted locally without sending any data over the internet.",
    },
    {
      q: "What is the recommended next step if my sorted list contains redundant entries?",
      a: "Pass your sorted output into the Duplicate Line Remover to quickly eliminate repeated entries or extract unique values with frequency counts.",
    },
  ],
  "duplicate-line-remover": [
    {
      q: "Which occurrence of a duplicate line is preserved in the output?",
      a: "The first occurrence of each unique line is retained at its original position, preserving the initial structural order of your list while stripping subsequent duplicates.",
    },
    {
      q: "Can I view duplicate counts or isolate only the repeated lines?",
      a: "Yes. Switch the output mode to view unique lines, duplicate-only lines, or append an occurrence counter next to each line to analyze data frequency.",
    },
    {
      q: "How does case sensitivity affect duplicate line detection?",
      a: "Enabling case-insensitive matching treats variations like 'Admin' and 'admin' as duplicates. The retained entry keeps the exact casing of the first encountered instance.",
    },
    {
      q: "Does the duplicate line remover support whitespace trimming?",
      a: "Yes. You can enable automatic trimming to ignore leading and trailing spaces when identifying duplicate entries while keeping the original content clean.",
    },
    {
      q: "Is there a file size or line count limitation for client-side deduplication?",
      a: "Because processing happens directly in browser memory, lists up to several tens of thousands of lines process instantly. Very large datasets exceeding 100MB should be processed via command-line utilities.",
    },
    {
      q: "What tool should I use to inspect differences between two deduplicated lists?",
      a: "Use the Text Diff tool to perform side-by-side line comparisons and spot additions or deletions across datasets.",
    },
  ],
  "whitespace-cleaner": [
    {
      q: "What types of invisible characters does the Whitespace Cleaner remove?",
      a: "The tool identifies and removes zero-width spaces (U+200B), zero-width non-joiners, non-breaking spaces (U+00A0), byte order marks (BOM), and mixed carriage return line endings.",
    },
    {
      q: "Why is stripping non-breaking and zero-width spaces critical for code and configuration files?",
      a: "Invisible characters copied from documentation, chat applications, or web articles can break YAML parsers, bash shell scripts, SQL queries, and password fields with hard-to-debug syntax errors.",
    },
    {
      q: "Can the cleaner collapse multiple consecutive spaces and empty blank lines?",
      a: "Yes. You can selectively collapse multiple spaces into single spaces, normalize tabs to spaces, remove trailing whitespace from every line, and eliminate excess blank lines.",
    },
    {
      q: "Will cleaning whitespace alter formatted code indentation or markdown tables?",
      a: "You have granular control over which transformations to apply. If preserving indentation or tabular layout is necessary, disable space collapsing and enable only trailing whitespace and invisible character removal.",
    },
    {
      q: "Is my text data stored or sent to any remote server?",
      a: "No. All regular expression parsing and string sanitization execute locally in your web browser. No clipboard or input content is transmitted to external servers.",
    },
    {
      q: "What tool should I use if I need to convert delimited data after cleaning whitespace?",
      a: "Use the TSV to CSV or CSV to JSON converter to structure your clean, tabbed, or comma-separated tabular data into structured machine-readable formats.",
    },
  ],
  "tsv-to-csv": [
    {
      q: "How does the TSV to CSV converter handle spreadsheet clipboard data?",
      a: "When you copy cell ranges from Excel, Google Sheets, or LibreOffice Calc, the clipboard formats columns with tab characters. This tool parses the tab delimiters and converts them into standard comma-separated values.",
    },
    {
      q: "How does the converter handle commas, line breaks, and quotation marks within cell data?",
      a: "In accordance with RFC 4180 standards, any cell containing commas, newline characters, or double quotes is automatically wrapped in quotes, and internal quotes are escaped with double quotes.",
    },
    {
      q: "What is CSV injection and how does the Formula Guard protect exported files?",
      a: "Spreadsheet software executes cells starting with =, +, -, or @ as formulas. The Formula Guard prepends a single quote to neutralize executable formulas and prevent spreadsheet formula injection attacks.",
    },
    {
      q: "Can I customize the output delimiter to semicolons or pipes?",
      a: "Yes. You can switch the target delimiter from standard commas to semicolons, pipes, or tabs to match regional European CSV standards or specific database import requirements.",
    },
    {
      q: "Is any tabular data sent across the network during conversion?",
      a: "No. The conversion executes entirely in client-side JavaScript. Proprietary financial records, server inventories, and user tables remain strictly confidential on your local machine.",
    },
    {
      q: "What tool should I use if I want to transform my CSV into structured web payloads?",
      a: "Use the CSV to JSON Converter to turn tabular records into JSON arrays suitable for API testing, database seeding, or frontend state.",
    },
  ],
  "text-diff": [
    {
      q: "How does the Text Diff tool calculate differences between two text blocks?",
      a: "The tool uses the Myers longest common subsequence (LCS) diff algorithm to identify exact line additions, deletions, and unchanged segments between original and modified text inputs.",
    },
    {
      q: "Can I configure the diff engine to ignore minor casing or whitespace variations?",
      a: "Yes. You can toggle ignore-case to treat character casing as identical and ignore-whitespace to bypass differences caused by trailing spaces or indentation changes.",
    },
    {
      q: "What is the difference between side-by-side and unified diff views?",
      a: "Side-by-side view displays the original and modified texts in parallel columns with synchronized scrolling, while unified view presents a consolidated vertical timeline similar to git diff output.",
    },
    {
      q: "What is the input size limit for running diff comparisons in the browser?",
      a: "The browser diff engine efficiently handles inputs up to 3,000 lines on each side. For multi-gigabyte log archives, command-line diff or git diff is recommended.",
    },
    {
      q: "Are confidential configuration files or code snippets uploaded during comparison?",
      a: "No. All text parsing, line tokenization, and visual diff highlighting occur entirely inside your browser's local sandbox without any network transmission.",
    },
    {
      q: "What tool should I use if I need to compare structured JSON files instead of raw text?",
      a: "Use the JSON Diff tool, which compares semantic key-value pairs, nested objects, and arrays regardless of formatting or property order.",
    },
  ],
  "json-diff": [
    {
      q: "How does the JSON Diff tool evaluate semantic differences between JSON payloads?",
      a: "The tool parses both JSON strings into AST objects and compares structural keys and values hierarchically, highlighting additions, removals, and value mutations with exact JSONPath pointers.",
    },
    {
      q: "Does key ordering in JSON objects cause false difference alerts?",
      a: "No. JSON object keys are order-independent according to the JSON specification. The diff engine normalizes object keys prior to comparison, so identical payloads with different key orders match perfectly.",
    },
    {
      q: "How does the tool compare nested JSON arrays and primitive elements?",
      a: "Arrays are compared by element index. If an item is prepended or shifted, the tool highlights the positional differences and updated child values across the array structure.",
    },
    {
      q: "What happens if one of the input payloads has a JSON syntax error?",
      a: "The integrated JSON validator pinpoints the exact line number, column, and character position of the syntax error before attempting structural comparison.",
    },
    {
      q: "Is my JSON payload logged or sent to an external server?",
      a: "No. JSON parsing, validation, and object tree comparison are executed 100% client-side in your local browser sandbox. API tokens and confidential database dumps remain secure.",
    },
    {
      q: "What tool should I use if I need to reformat or minify my JSON payload after diffing?",
      a: "Use the JSON Formatter & Validator to clean, indent, sort keys, or compress your JSON structure for production deployment.",
    },
  ],
}
