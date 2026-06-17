# Prompts behind this story

A reconstruction of the conversation that produced this piece.

1. Shared a raw scraped dataset of Gachibowli hotel prices (Hyderabad, rooms above Rupees 3,000 per night) across seven seasonal snapshots, with working notes toward a pricing elasticity model.

2. Asked for a good-looking HTML report with all the insights, dialled up for the "wow factor" on price elasticity.

3. Asked to rewrite the whole thing as a narrative **data story**: Gladwell-style prose, NYT-style integrated visuals, tooltips, popups, interactions, and an explicit section on the process used to gather the data.

4. Asked to add it to the `datastories` repo, following the existing one-folder-per-story structure (`index.html`, `README.md`, `story.json`, `prompt.md`, `data/`).

## How the data was gathered

There was no special data feed and no insider access. The numbers were collected the same way a guest's would be, with a **browser agent** opening a hotel booking site and looking.

1. **Searched like a real traveller.** Area set to Gachibowli, one room, two adults, one night, sorted price low to high, filtered to rooms above Rupees 3,000.
2. **Seven snapshots across seasons.** The same search repeated for seven check-in dates, holding everything constant so price was the only thing free to move:

   ```
   Jun 18, Jul 15, Aug 14, Sep 15, Oct 14, Dec 24 (2026), Jan 14 (2027)
   ```

3. **Recorded the honest fields.** Name, star rating, property type, listed price, struck-through MRP, discount percentage, guest rating, review count, and page rank (a rough demand proxy).
4. **Tracked the same hotels over time.** Matching hotels across snapshots produced the price journeys that drive every chart in the story.

Source data lives in `data/hotel_prices.csv` (tidy long format, one row per hotel per snapshot).

## Caveat carried into the story

These are *asking* prices, not *bookings*. A high rate proves a hotel's confidence, not that the rooms sold. The next experiment worth running is to pair this with even one month of occupancy data.
