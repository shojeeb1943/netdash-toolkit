import type { Faq } from "@/lib/tool-faqs"

export const currency_toolsFaqs: Record<string, Faq[]> = {
  "hosting-price-currency-converter": [
    {
      q: "How does the Hosting Price Currency Converter calculate converted plan rates?",
      a: "It fetches live international foreign exchange benchmark rates to convert hosting plan prices across USD, EUR, GBP, CAD, AUD, INR, and other major currencies with zero spread distortion.",
    },
    {
      q: "Why is currency localization essential for international hosting sales?",
      a: "Displaying hosting plan prices in a customer's local currency increases checkout conversion rates by up to 25% by eliminating exchange rate uncertainty and international bank conversion confusion.",
    },
    {
      q: "Does this tool account for payment processor foreign exchange spreads?",
      a: "The converter outputs clean mid-market benchmark rates. Payment gateways (Stripe, PayPal) typically add a 1.5% to 3.0% conversion spread when settling international payments into your primary bank account.",
    },
    {
      q: "Are my entered hosting plan prices or currency selections tracked?",
      a: "No. The tool fetches public currency exchange rates and executes all conversion math locally in your browser. No plan details or user inputs are stored or transmitted.",
    },
    {
      q: "What related tool converts software license prices across currencies?",
      a: "Use the License Price Currency Converter to calculate wholesale cPanel, CloudLinux, LiteSpeed, and WHMCS software license costs in your local currency.",
    },
    {
      q: "How can web hosts protect profit margins against exchange rate volatility?",
      a: "Hosts operating internationally should peg base plan pricing to USD or EUR in WHMCS and configure automated daily currency exchange rate synchronization to adjust local currency prices dynamically.",
    },
  ],
  "license-price-currency-converter": [
    {
      q: "What is the purpose of the License Price Currency Converter?",
      a: "This tool converts software license pricing (cPanel, LiteSpeed, CloudLinux, Imunify360, WHMCS) between USD, EUR, GBP, CAD, AUD, INR, BDT, and other global currencies using real-time foreign exchange benchmark rates.",
    },
    {
      q: "How does wholesale licensing via LicenBase compare across global currencies?",
      a: "Because LicenBase licenses are priced at wholesale base rates (e.g. $4.00/mo for cPanel VPS), international sysadmins save up to 70% on server licensing regardless of their local billing currency.",
    },
    {
      q: "How frequently are exchange rates updated in this tool?",
      a: "Exchange rates are retrieved from open financial benchmark data feeds upon page load, ensuring all currency comparisons reflect current international currency market valuations.",
    },
    {
      q: "Is my licensing budget or currency calculation data uploaded to remote servers?",
      a: "No. All currency conversions are computed locally in your browser. None of your license selections, pricing figures, or financial models are recorded.",
    },
    {
      q: "What tool helps calculate the total monthly license stack cost for a server?",
      a: "Use the Server License Stack Calculator in the Licensing category to model complete multi-software license bundles for your production servers.",
    },
    {
      q: "How do international payment fees impact software license expenses?",
      a: "International credit card payments and cross-border bank transfers can incur 2-3% foreign transaction fees. Using local gateway settlement in WHMCS minimizes payment overhead.",
    },
  ],
}
