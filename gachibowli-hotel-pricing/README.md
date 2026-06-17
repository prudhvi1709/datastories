# The Hotel That Doubled Its Price and Nobody Blinked

A narrative data story on hotel price elasticity in Gachibowli, Hyderabad. Built from seven months of asking-price snapshots, it explains why some hotels can charge whatever they like while others survive only on deep discounts, and why the discount tag is the most honest number on the page.

**Live story:** open `index.html` in a browser (or via GitHub Pages).

## What is inside

| File | Description |
|---|---|
| `index.html` | The full interactive data story. Self-contained: charts, tooltips, hotel-detail popups, a live pricing simulator, and an animated cross-price flow diagram. Only external dependency is Chart.js via CDN. |
| `data/hotel_prices.csv` | The underlying dataset in tidy long format: one row per hotel per snapshot. |
| `README.md` | This file. |

## The story in one line

Three hotels on one street answer the same question, "if I raise my price, who walks away?", in three completely different ways. That single question, price elasticity, explains the entire market.

## Key findings

- **The inelastic giant.** The 5-star Hyatt swings its rate by 125 percent from June to its September peak while its 4.1 guest rating never moves. Its guests cannot easily walk away, so it charges what it likes.
- **The elastic volume-chaser.** Treebo properties list near Rupees 18,000 and sell around Rupees 7,000, a discount of 62 to 64 percent held night after night. They compete on cheapness because yield was never theirs to chase.
- **Discount depth as a confidence read.** A hotel at zero percent off knows you will pay. A hotel at 64 percent off is afraid you will not. You can rank the whole market by elasticity using only the discount field.
- **Cross-price substitution.** When the Hyatt and Sheraton vault past Rupees 30,000 in the festive crush, priced-out demand flows downhill to budget hotels like Treebo and Bloom. Rivals become, briefly, business partners.
- **Tightening supply.** Available rooms above Rupees 3,000 fall from 348 in June to 252 in January, a quarter of the market gone. Fewer rooms is a clean early signal that pricing power is shifting.

## How the data was collected

There was no special data feed and no insider access. The numbers were gathered the same way a guest's would be: by opening a hotel booking site and looking.

1. **A browser agent searched like a real traveller.** It ran the exact search a guest would: area Gachibowli, one room, two adults, one night, sorted price low to high, filtered to rooms above Rupees 3,000.
2. **Seven snapshots across the seasons.** The same search was repeated for seven check-in dates (Jun 18, Jul 15, Aug 14, Sep 15, Oct 14, Dec 24, Jan 14) holding everything constant so price was the only thing free to move.
3. **The honest fields were recorded.** Name, star rating, property type, listed price, struck-through MRP, discount percentage, guest rating, review count, and page rank (a rough demand proxy).
4. **The same hotels were tracked over time.** Matching hotels across snapshots produced the price journeys that drive every chart in the story.

## Caveat

These are *asking* prices, not *bookings*. A high rate proves a hotel's confidence, not that the rooms sold. The story is robust as a read on pricing behaviour; pairing it with even one month of occupancy data would turn it into a read on demand itself. That is the experiment worth running next.

## Data dictionary

| Column | Meaning |
|---|---|
| `hotel_name` | Property name as listed |
| `property_type` | Hotel, Serviced Apartment, or Homestay |
| `star_rating` | Official star rating where shown |
| `check_in_date` | Snapshot date (1-night stay) |
| `season` | Demand regime for that date |
| `listed_price_inr` | Price shown per night, Rupees |
| `mrp_inr` | Struck-through reference price, Rupees (blank if none shown) |
| `discount_pct` | Percent off MRP |
| `guest_rating` | Guest score out of 5 |
| `reviews` | Number of guest reviews |
| `elasticity_band` | Inelastic, Testing sensitivity, or Elastic (assigned from discount behaviour) |

## Scope

- **Area:** Gachibowli, Hyderabad
- **Filter:** Rooms above Rupees 3,000 per night
- **Window:** June 2026 to January 2027
- **Search:** 1 room, 2 adults, 1 night, sorted price low to high
