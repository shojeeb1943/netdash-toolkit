import type { Faq } from "@/lib/tool-faqs"

export const hosting_businessFaqs: Record<string, Faq[]> = {
  "dedicated-server-cost-calculator": [
    {
      q: "What should I include in a dedicated server's monthly cost?",
      a: "Include the rent, every extra IP address, the control panel and operating system licences, backup storage and any managed support. Leaving out licences is the most common reason the real bill is higher than the quote.",
    },
    {
      q: "How is the setup fee treated?",
      a: "It is a one-time charge, so the calculator adds it to the contract total and spreads it across all months to give an average monthly cost. A long contract makes the same setup fee cost less per month.",
    },
    {
      q: "Does this include bandwidth overage?",
      a: "No. Most dedicated plans include a bandwidth allowance. If you expect to exceed it, add the expected overage to the backup line or the licence line so it appears in the monthly total.",
    },
  ],
  "reseller-hosting-cost-calculator": [
    {
      q: "How is the cost per account calculated?",
      a: "The reseller plan cost and your billing tools are added together and divided by the number of accounts you host. Hosting more accounts on the same plan lowers the cost of each one.",
    },
    {
      q: "Why does the payment fee matter?",
      a: "Processors take a percentage of every payment. On a low priced plan that cut is a noticeable part of your profit, so the calculator removes it from revenue before working out profit and break-even.",
    },
    {
      q: "What is the break-even number of accounts?",
      a: "It is the fewest paying accounts needed so that revenue after payment fees covers the plan and tools. Below that number you lose money each month, above it you profit.",
    },
  ],
  "vps-profit-calculator": [
    {
      q: "What is a node in this calculator?",
      a: "A node is one physical server that hosts many VPS plans. Its monthly cost is shared by every VPS you sell on it, so the number you sell matters as much as the price.",
    },
    {
      q: "Why does the fill rate change profit so much?",
      a: "The node cost is fixed. Once it is covered, each extra VPS sold adds nearly pure profit, so a node at 80 percent full earns far more than the same node at 40 percent.",
    },
    {
      q: "Can I sell more VPS than the node holds?",
      a: "The calculator stops you, because overselling beyond real capacity leads to slow servers and refunds. Enter the number of plans the node can comfortably carry as its capacity.",
    },
  ],
  "server-break-even-calculator": [
    {
      q: "How is server break-even different from hosting break-even?",
      a: "This version is built around one server with a fixed capacity. It tells you how many accounts cover that server and also whether that number is even possible before the server is full.",
    },
    {
      q: "What is the extra cost per account?",
      a: "Costs that grow with each account, such as a per account licence or support allowance. They reduce what each sale contributes toward the fixed server cost.",
    },
    {
      q: "What if the verdict says not reachable?",
      a: "It means even a full server cannot cover its cost at this price. Raise the price, lower the server cost, or choose a plan that fits more accounts.",
    },
  ],
  "hosting-discount-calculator": [
    {
      q: "Why is the total over the term more than the discounted price times the term?",
      a: "Most hosting discounts apply only to the first months. After that the list price returns, so the calculator charges the discounted price for the promo period and the list price for the rest.",
    },
    {
      q: "How do I compare two offers fairly?",
      a: "Use the effective price per month. It divides the full cost over the whole term, which removes the effect of an attractive first year followed by a high renewal.",
    },
    {
      q: "Can the discount be 100 percent?",
      a: "Yes, to model a free period. The calculator caps the discount at 100 percent and the discount period at the length of the term.",
    },
  ],
  "monthly-to-annual-hosting-calculator": [
    {
      q: "How do I model two months free?",
      a: "Charge for 10 months in the months charged field. The tool then shows the yearly price, the saving against paying monthly, and the effective discount.",
    },
    {
      q: "What is the effective monthly price?",
      a: "It is the yearly price divided by 12. It lets you compare a yearly plan with a monthly plan in the same unit.",
    },
    {
      q: "Should I offer a yearly discount?",
      a: "Often yes. A discount improves cash flow and reduces churn because customers pay up front, but check that the yearly price still leaves a margin after payment fees.",
    },
  ],
  "hosting-revenue-calculator": [
    {
      q: "What is average revenue per customer?",
      a: "It is total monthly revenue divided by the number of customers, including add-ons. It shows whether your mix of plans is moving toward higher value customers.",
    },
    {
      q: "What counts as add-on revenue?",
      a: "Anything sold on top of a plan: SSL certificates, backups, domain registrations, dedicated IPs or managed support. Enter the monthly total in one line.",
    },
    {
      q: "Is this profit?",
      a: "No, it is revenue before any costs. Use the profit or profit margin calculators to subtract servers, licences and other expenses.",
    },
  ],
  "hosting-mrr-calculator": [
    {
      q: "What is MRR for a hosting company?",
      a: "Monthly recurring revenue is the predictable monthly income from active plans. One-time fees such as setup or domain registration are normally left out.",
    },
    {
      q: "What is net new MRR?",
      a: "It is new customer revenue plus upgrades, minus downgrades and cancellations. A positive number means the recurring base grew this month.",
    },
    {
      q: "How should yearly plans be counted?",
      a: "Divide the yearly price by 12 and include that amount each month. The ARR calculator on this site shows the yearly view.",
    },
  ],
  "hosting-arr-calculator": [
    {
      q: "How is ARR calculated?",
      a: "Annual recurring revenue is twelve times the monthly billed MRR, plus the value of plans billed yearly. It describes the size of the recurring base over a full year.",
    },
    {
      q: "Why does the yearly plan share matter?",
      a: "A higher share of yearly plans means more cash up front and usually lower churn, because customers are committed for twelve months.",
    },
    {
      q: "Does ARR include one-time income?",
      a: "No. Setup fees, migrations and one-off projects are not recurring, so leave them out to keep the figure honest.",
    },
  ],
  "customer-churn-calculator": [
    {
      q: "How is churn rate calculated?",
      a: "Divide the customers you lost in the period by the customers you had at the start. New customers are left out of the calculation, because they were not there at the start.",
    },
    {
      q: "What is the yearly churn figure?",
      a: "It compounds the monthly rate over twelve months. A 3 percent monthly churn is not 36 percent a year, it is closer to 31 percent, because the base shrinks as customers leave.",
    },
    {
      q: "What is a good churn rate for hosting?",
      a: "Small shared hosting often sees 3 to 5 percent monthly. Managed and business plans usually do better. Compare against your own history before comparing against others.",
    },
  ],
  "hosting-ltv-calculator": [
    {
      q: "How is lifetime value calculated here?",
      a: "Gross profit per customer per month divided by monthly churn. Dividing by churn gives the average number of months a customer stays, so lower churn raises value quickly.",
    },
    {
      q: "Why use gross margin instead of revenue?",
      a: "A customer who pays 10 dollars but costs 4 dollars to serve is worth 6 dollars a month to you. Using margin avoids overstating value.",
    },
    {
      q: "Why does zero churn give an error?",
      a: "At zero churn the formula divides by zero and the lifetime has no end. Use a small realistic churn figure from your own history.",
    },
  ],
  "cac-calculator": [
    {
      q: "What goes into customer acquisition cost?",
      a: "All the money spent winning customers in the period: advertising, affiliate payouts, sales time and onboarding. Divide by the number of new paying customers.",
    },
    {
      q: "What is the payback period?",
      a: "The number of months of gross profit from a customer needed to cover what you spent to win them. Shorter is better, and many businesses aim for under a year.",
    },
    {
      q: "Should free trial users count as customers?",
      a: "Only count customers who paid. Counting trial signups understates your real cost of winning a paying customer.",
    },
  ],
  "hosting-ltv-cac-calculator": [
    {
      q: "What is a good LTV to CAC ratio?",
      a: "Three to one or higher is a common benchmark. Below one you lose money on every customer, and far above five you may be under investing in growth.",
    },
    {
      q: "What does the verdict mean?",
      a: "Healthy means the ratio is at least 3. Thin means each customer is profitable but not by much. Losing money means acquisition costs more than a customer earns.",
    },
    {
      q: "How can I improve the ratio?",
      a: "Raise lifetime value with better retention, higher prices or upsells, or lower the acquisition cost through referrals, organic search and better onboarding.",
    },
  ],
  "hosting-markup-calculator": [
    {
      q: "What is the difference between markup and margin?",
      a: "Markup is profit as a share of cost. Margin is profit as a share of the selling price. A 100 percent markup gives a 50 percent margin, so they are never the same number.",
    },
    {
      q: "How do I price with a markup?",
      a: "Multiply your cost by one plus the markup. A 4 dollar cost with 100 percent markup sells at 8 dollars, leaving 4 dollars profit.",
    },
    {
      q: "Which should I use to set prices?",
      a: "Margin is easier to compare with other costs such as payment fees. Use the reseller pricing calculator when you want to target a margin instead of a markup.",
    },
  ],
  "hosting-profit-margin-calculator": [
    {
      q: "What counts as a direct cost in hosting?",
      a: "Servers, data centre fees, licences, bandwidth and anything that scales with the number of customers. These form the cost of goods sold.",
    },
    {
      q: "What is the difference between gross and net margin?",
      a: "Gross margin only subtracts direct costs. Net margin also subtracts expenses such as staff, marketing and tools, so it shows what the business actually keeps.",
    },
    {
      q: "What margin should a hosting business aim for?",
      a: "Gross margins of 60 to 80 percent are common for small providers. Net margins vary widely with staffing, so track your own trend month to month.",
    },
  ],
  "hosting-business-roi-calculator": [
    {
      q: "How is ROI calculated?",
      a: "Net profit over the period, which is monthly profit times the months minus the initial investment, divided by the investment. It is shown as a percentage.",
    },
    {
      q: "How long until the investment is paid back?",
      a: "The months of profit needed to earn back the initial investment. If monthly profit is zero or negative the investment never pays back.",
    },
    {
      q: "Does this include growth?",
      a: "No. It assumes constant revenue and cost. Run it twice with a cautious and an optimistic monthly revenue to see a range.",
    },
  ],
  "server-roi-calculator": [
    {
      q: "What costs does server ROI include?",
      a: "The purchase price and the monthly colocation cost. Resale value at the end is added back as income. Add power or remote hands to the colocation line if you pay them.",
    },
    {
      q: "What revenue should I enter?",
      a: "The monthly revenue this single server earns from customers. For a shared server, use the share of total hosting revenue it carries.",
    },
    {
      q: "Is buying always cheaper than renting?",
      a: "Not always. Buying needs cash up front and carries hardware risk. Compare the profit here with the dedicated server cost calculator for the same workload.",
    },
  ],
  "server-utilization-calculator": [
    {
      q: "Which resource usually runs out first on a hosting server?",
      a: "On shared hosting it is often RAM or disk, while busy dynamic sites can push CPU. The calculator shows whichever is highest so you know what to upgrade.",
    },
    {
      q: "What utilization is too high?",
      a: "Above 75 percent plan an upgrade and above 90 percent act now. Spikes need headroom, and running a disk near full can break backups and databases.",
    },
    {
      q: "Should I use peak or average usage?",
      a: "Use a busy period average for CPU and RAM and the current figure for disk. Averages over a quiet night hide the load that causes slow sites.",
    },
  ],
  "hosting-occupancy-rate-calculator": [
    {
      q: "What is occupancy rate?",
      a: "The share of your total account capacity that is sold. A server with 70 of 100 slots sold has a 70 percent occupancy rate.",
    },
    {
      q: "Why track unused revenue potential?",
      a: "Empty slots cost the same to run as full ones. The unused revenue figure shows what filling them would add without any new server cost.",
    },
    {
      q: "Is 100 percent occupancy the goal?",
      a: "Not quite. A server at 100 percent has no headroom for growth in existing sites. Many providers aim for 70 to 85 percent before adding a server.",
    },
  ],
  "reseller-pricing-calculator": [
    {
      q: "How does the calculator reach the price?",
      a: "It adds the wholesale cost and your support cost per account, then divides by what is left after your target margin and the payment fee are taken from the price.",
    },
    {
      q: "Why is the price higher than cost plus margin?",
      a: "The payment fee and the margin are both shares of the selling price. Dividing by the remainder is what keeps the margin you chose after fees.",
    },
    {
      q: "What if margin plus fee reach 100 percent?",
      a: "No price can satisfy that, so the tool shows an error. Lower the target margin or the fee.",
    },
  ],
  "vps-pricing-calculator": [
    {
      q: "How is the cost per VPS worked out?",
      a: "The node cost is divided by the number of VPS you plan to put on it, then your per VPS overhead is added. Planning for fewer VPS per node raises the cost of each.",
    },
    {
      q: "What is included in overhead?",
      a: "Per VPS costs such as the OS licence, control panel licence, backups and a support allowance.",
    },
    {
      q: "What is the hourly price for?",
      a: "Some providers bill by the hour. The figure divides the monthly price by 730 hours, the average hours in a month.",
    },
  ],
  "dedicated-server-pricing-calculator": [
    {
      q: "What costs should I add up first?",
      a: "Your cost for the server, the licences you include, expected bandwidth and a support allowance. The calculator totals them and then adds your margin on top.",
    },
    {
      q: "How is the price calculated from the margin?",
      a: "Total cost divided by one minus the margin. A 30 percent margin on 185 dollars of cost gives a price near 264 dollars, because the margin is a share of the price.",
    },
    {
      q: "Should I round the price?",
      a: "Yes, round up to a clean figure. Rounding down can quietly erase the margin, so check the profit line after you round.",
    },
  ],
}
