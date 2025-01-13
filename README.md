# Time Turner Chrome Extension

A Chrome extension that combines traditional time-keeping wisdom with modern biorhythm analysis.

## Features

- Zodiac and TCM time analysis
- Personal biorhythm tracking
- Traditional time unit conversions
- Customizable interface
- User authentication and profile management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. Development:
```bash
npm run dev
```

4. Build:
```bash
npm run build
```

## Authentication

This project uses Supabase for authentication and user management. The following features are implemented:

- Email/password authentication
- User profiles with birth date, time, and location
- Secure data storage with Row Level Security
- Profile management and updates

## Database Schema

### Profiles Table
```sql
profiles (
  id uuid references auth.users primary key,
  username text unique,
  avatar_url text,
  birth_date text,
  birth_time text,
  birth_place text,
  updated_at timestamp with time zone
)
```

## Development

1. Install the Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Link to your Supabase project:
```bash
supabase link --project-ref your_project_ref
```

3. Push database migrations:
```bash
supabase db push
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
