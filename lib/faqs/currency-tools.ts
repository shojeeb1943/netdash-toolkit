import type { Faq } from "@/lib/tool-faqs"

export const currency_toolsFaqs: Record<string, Faq[]> = {
  "hosting-price-currency-converter": [
    {
      q: "How often are the hosting currency exchange rates updated?",
      a: "Exchange rates are retrieved from Exchange Rate API and refreshed periodically every six hours in your local browser cache. The rates reflect current international mid-market wholesale currency valuations.",
    },
    {
      q: "Why might my hosting invoice differ from the converted amount?",
      a: "The conversion shows indicative mid-market rates. Actual hosting invoices may vary due to your payment gateway processing fees, bank foreign transaction surcharges, and local VAT or sales tax additions.",
    },
    {
      q: "Can I convert hosting fees into South Asian currencies like BDT and INR?",
      a: "Yes. The converter supports Bangladeshi Taka (BDT), Indian Rupee (INR), Pakistani Rupee (PKR), Euro (EUR), British Pound (GBP), and more than 160 world currencies against standard USD server pricing.",
    },
  ],
  "license-price-currency-converter": [
    {
      q: "How does the software license currency converter calculate totals?",
      a: "The tool multiplies standard LicenBase wholesale license tier pricing by your chosen billing period, then converts the USD total into your chosen local currency using live mid-market exchange rates.",
    },
    {
      q: "Are the converted license prices fixed or subject to currency fluctuations?",
      a: "LicenBase prices are anchored in USD. Converted amounts in local currencies like BDT, EUR, GBP, or INR adjust with daily foreign exchange rates, so check the rate before renewing long-term plans.",
    },
    {
      q: "Does the license currency conversion include tax or gateway fees?",
      a: "No. The calculation represents the base software license price in the selected currency. Credit card processing fees, PayPal conversion surcharges, or local taxes are not included in the estimate.",
    },
  ],
}
