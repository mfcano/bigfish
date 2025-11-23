# Big Fish 🐟

**Big Fish** is a comprehensive guild management dashboard. It provides a centralized hub for tracking gear, managing MVP spawns, organizing events, and coordinating guild activities.

Currently hosted here: https://big-fish-9dbec.web.app/

## Purpose

- **Track Gear Storage**: Monitor borrowed guild equipment with borrowers, dates, and fee payment status
- **Hunt MVPs**: Keep tabs on MVP spawn timers and locations
- **Organize Events**: Schedule and manage guild activities like War of Emperium (WoE), dungeon runs, etc
- **Vote on Decisions**: Run polls for guild matters like loot distribution, target dungeons, and strategies
- **Monitor Guild Resources**: Track the guild bank's Zeny and inventory

## Features

### 🎒 Gear Storage Tracker

- View all active equipment loans
- Track borrowers and loan dates
- Monitor fee payment status (AD/EDP mats, Premium Cards, etc.)
- Enforce borrowing rules for active members vs. contributors

### 👾 MVP Tracker

- Real-time status for 30+ major MVPs
- Spawn locations and coordinates
- Respawn window calculations based on variance
- Quick "Report Kill" to start respawn timers
- Direct links to RateMyServer mob database

### 📅 Events & Scheduling

- Upcoming guild events calendar
- Role-based sign-up system (Tanks, DPS, Support)
- Role fulfillment tracking
- Event countdowns and reminders

### 🗳️ Guild Polls

- Vote on important decisions
- Visual poll results with percentage bars
- Track total votes per poll

### 🎨 Multiple Themes

- **Light Mode**: Modern, clean interface for Mesi and Mao
- **Dark Mode**: Eye-friendly for late-night grinding
- **Cute Mode**: For the girlies
- **Mesi Mode**: High contrast theme designed to burn into your brain
- **Ragnarok 2005**: Nostalgic RMS forum-style theme that recreates the classic forum aesthetic

### ⏰ Time Tracking

- Server time (GMT) display
- Local time synchronization
- Perfect for coordinating international guild members

## Technology Stack

- **Frontend Framework**: React.js with Vite
- **Styling**: Tailwind CSS (utility-first styling)
- **Icons**: Font Awesome 6
- **Storage**: LocalStorage for theme/tab persistence
- **External Data**: RateMyServer MVP sprites and database links
- **Backend**: FastAPI (Python)

## Getting Started

### Backend

The backend server can be started using the provided script:

```bash
python start_dev.py
```

This will start the FastAPI server on `http://localhost:8000`.

### Frontend

The frontend is now a React.js application. To run it:

```bash
cd client
npm install
npm run dev
```

The React app will be available at `http://localhost:5173` and will connect to the backend API at `http://localhost:8000`.

## Usage

### Navigation

- **Home**: Dashboard overview with quick stats
- **Gear Storage**: Manage equipment loans
- **MVP Tracker**: Monitor boss spawns
- **Events**: View and sign up for guild activities

### Theme Switching

Click the palette icon in the navigation bar to switch between:

- Light Mode
- Dark Mode
- Cute Mode
- Mesi Mode
- Ragnarok 2005 (retro theme)

## Data & Customization

The app uses mock data for demonstration. To adapt:

1. **Edit MVP Data**: Update the `mvpDatabase` object in `index.html` (lines 884-944)
2. **Modify Gear Loans**: Update the `gearLoans` array (lines 877-882)
3. **Update Events**: Edit the `events` array (lines 955-982)
4. **Customize Polls**: Modify the `polls` array (lines 983-1003)

## MVP Database

The app includes spawn data for 30+ MVPs including:

- Amon Ra, Atroce, Baphomet, Beelzebub
- Dark Lord, Doppelganger, Drake, Eddga
- Fallen Bishop, Garm, Golden Thief Bug
- Kiel D-01, Lady Tanee, Maya, Mistress
- Moonlight Flower, Osiris, Pharaoh, Phreeoni
- Valkyrie Randgris, Vesper, White Lady
- And many more...

Each MVP includes:

- Spawn map(s)
- Respawn delay and variance
- Coordinates (when applicable)
- Multiple spawn locations for roaming MVPs

## Contributing

This is a guild management tool. Feel free to:

- Customize themes and styling
- Add new features (skill calculators, DPS meters, etc.)
- Integrate with Discord bots or APIs

## Credits

- **MVP Data**: Based on RateMyServer database
- **Sprites**: RateMyServer mob sprites
- **Design Inspiration**: Classic RO forums and modern guild dashboards

## License

Open source

---

**© 2025 Big Fish Guild. All Shenanigans Reserved.**

_Powered by nostalgia and late-night bg sessions_ 🏰
