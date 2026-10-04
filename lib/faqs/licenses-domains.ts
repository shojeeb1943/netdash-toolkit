import type { Faq } from "@/lib/tool-faqs"

export const licenses_domainsFaqs: Record<string, Faq[]> = {
  "plesk-license-calculator": [
    {
      q: "How is the Plesk licence cost worked out?",
      a: "Your Plesk price per server per month is multiplied by the number of servers. A discount for paying yearly is applied to the annual total, and the monthly cost is shared across the accounts on each server.",
    },
    {
      q: "Does this tool know the price of Plesk?",
      a: "No. Plesk prices vary by licence type, term and provider, so you enter the price you actually pay. That keeps the result accurate for your own quote.",
    },
    {
      q: "What affects the Plesk licence price?",
      a: "The edition (Web Admin, Web Pro or Web Host), the number of domains allowed and whether add-ons are included. Enter the total you pay for the edition you chose.",
    },
  ],
  "imunify360-license-calculator": [
    {
      q: "How is the Imunify360 licence cost worked out?",
      a: "Your Imunify360 price per server per month is multiplied by the number of servers. A discount for paying yearly is applied to the annual total, and the monthly cost is shared across the accounts on each server.",
    },
    {
      q: "Does this tool know the price of Imunify360?",
      a: "No. Imunify360 prices vary by licence type, term and provider, so you enter the price you actually pay. That keeps the result accurate for your own quote.",
    },
    {
      q: "Is Imunify360 priced per server or per user?",
      a: "Both models exist. Some plans cover a whole server, others limit the number of users. Enter the price per server and adjust the server count to match what you buy.",
    },
  ],
  "sitepad-license-calculator": [
    {
      q: "How is the SitePad licence cost worked out?",
      a: "Your SitePad price per server per month is multiplied by the number of servers. A discount for paying yearly is applied to the annual total, and the monthly cost is shared across the accounts on each server.",
    },
    {
      q: "Does this tool know the price of SitePad?",
      a: "No. SitePad prices vary by licence type, term and provider, so you enter the price you actually pay. That keeps the result accurate for your own quote.",
    },
    {
      q: "Why would a host add SitePad?",
      a: "SitePad is a website builder that hosting customers can use without extra software. The cost per account shows how much the builder adds to each plan.",
    },
  ],
  "whmreseller-license-calculator": [
    {
      q: "How is the WHMReseller licence cost worked out?",
      a: "Your WHMReseller price per server per month is multiplied by the number of servers. A discount for paying yearly is applied to the annual total, and the monthly cost is shared across the accounts on each server.",
    },
    {
      q: "Does this tool know the price of WHMReseller?",
      a: "No. WHMReseller prices vary by licence type, term and provider, so you enter the price you actually pay. That keeps the result accurate for your own quote.",
    },
    {
      q: "What does a WHMReseller licence do?",
      a: "It adds reseller management features to WHM. Divide the cost across the reseller accounts you expect to host to see what each one costs you.",
    },
  ],
  "domain-renewal-cost-calculator": [
    {
      q: "Why do renewal prices matter more than registration prices?",
      a: "Registration is a one-time first-year price that is often discounted. Renewal is what you pay every year after, so it dominates the cost of holding a name.",
    },
    {
      q: "How should I set the yearly increase?",
      a: "Use the rise your registrar has applied in recent years, often 3 to 10 percent. Registries can raise wholesale prices, and registrars usually pass that on.",
    },
    {
      q: "Does this include WHOIS privacy?",
      a: "No. Privacy is often free now, but if you pay for it add the yearly fee to the renewal price.",
    },
  ],
  "domain-profit-calculator": [
    {
      q: "What costs should I include when flipping a domain?",
      a: "The purchase price, each renewal while you hold it, and the fee taken by the marketplace or broker when it sells. The calculator subtracts all three from your sale price.",
    },
    {
      q: "Why is the first renewal not counted?",
      a: "The purchase already covers the first year. Only years after the first add renewal costs, so holding for three years adds two renewals.",
    },
    {
      q: "Is this a prediction?",
      a: "No. It only does the arithmetic on the prices you enter. Whether a domain actually sells at that price is the uncertain part.",
    },
  ],
  "domain-portfolio-value-calculator": [
    {
      q: "What is the sell-through rate?",
      a: "The share of your domains that sell in a year. Most portfolios sell only a few percent, so use a cautious figure and treat a high result with suspicion.",
    },
    {
      q: "Is this an appraisal of my domains?",
      a: "No. Appraisals estimate what one name is worth. This models a whole portfolio: what it costs to keep and what you might earn if sales follow the rate you enter.",
    },
    {
      q: "What does a negative net mean?",
      a: "At these numbers the portfolio costs more to renew than it earns. Drop names that are unlikely to sell, or raise your asking prices.",
    },
  ],
  "domain-length-checker": [
    {
      q: "How long can a domain name be?",
      a: "Each label between dots can be up to 63 characters and the full name up to 253. In practice, short names are far easier to type, say aloud and remember.",
    },
    {
      q: "What is a good length for a brand domain?",
      a: "Under about 15 characters for the name part. Very short names are valuable but usually taken, so most brands settle between 6 and 14.",
    },
    {
      q: "Why does the checker mention hyphens and digits?",
      a: "Hyphens are easy to forget when typing a name from memory, and digits get confused with words when read out. Neither is forbidden, but both cost you some direct traffic.",
    },
  ],
  "domain-combinations-generator": [
    {
      q: "How do I use the three word lists?",
      a: "Put prefixes in the first list, core words in the second and optional endings in the third. Every word from each list is combined with every word from the others.",
    },
    {
      q: "Why is the number of results so large?",
      a: "Combinations multiply: three words times three words times two extensions already gives 18 names. The tool shows up to 400 so the page stays usable.",
    },
    {
      q: "Does this tell me which names are free?",
      a: "No. Copy your favourites into the Domain Availability Checker to see which are registered.",
    },
  ],
  "domain-extension-explorer": [
    {
      q: "What is the difference between classic, new and country extensions?",
      a: "Classic generic extensions such as .com and .org date from the early internet. New generics such as .dev or .cloud were added from 2013. Country codes belong to a nation or territory.",
    },
    {
      q: "Which extension is best for a business?",
      a: ".com is still the most trusted and easiest to remember. If it is taken, a focused new generic or a well known country code can work, but check that customers will not mistype it.",
    },
    {
      q: "Do country codes have residency rules?",
      a: "Some do. Extensions such as .ca and .eu require a local presence, while .io, .co and .ai are open to everyone. Check the registry rules before you buy.",
    },
  ],
}
