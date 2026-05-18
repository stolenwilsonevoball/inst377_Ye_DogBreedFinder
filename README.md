# Dog Breed Finder

## Project description

Dog Breed Finder is a simple web application that lets users browse random dog images, search for dog images by breed, and save favorite dogs with notes. The project uses a Node.js backend, a Supabase database, and the external Dog CEO API.

The main goal of the app is to give users an easy way to explore dog breeds while also meeting the INST377 final project requirements for frontend fetch calls, backend API endpoints, external API use, database reads/writes, and deployment.

## Target browsers

This project is designed for current desktop browsers:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari

The app also uses responsive CSS, so it should work on mobile browsers, but the main target is desktop use.

## Pages

- **Home Page:** introduces the app and project features.
- **About Page:** explains the app, users, browser targets, and technology.
- **Dog Finder Page:** lets users browse dogs, choose breeds, save favorites, view a chart, and use the image carousel.

## Frontend libraries used

- **Chart.js:** used to display a bar chart of saved dogs by breed.
- **Swiper.js:** used to display saved dogs in a carousel.

## Developer Manual

The full developer manual is included below and also saved here:

`docs/inst377_Ye_Developer_Manual.md`

---

# Developer Manual

This document is for future developers taking over the Dog Breed Finder project.

## Project structure

```text
inst377_Ye_DogBreedFinder/
├── README.md
├── package.json
├── vercel.json
├── inst377_Ye_server.js
├── public/
│   ├── inst377_Ye_index.html
│   ├── inst377_Ye_about.html
│   ├── inst377_Ye_dogs.html
│   ├── inst377_Ye_styles.css
│   ├── inst377_Ye_main.js
│   └── inst377_Ye_dogs.js
└── docs/
    ├── inst377_Ye_Developer_Manual.md
    └── inst377_Ye_supabase_setup.sql
```

## How to install the application

1. Clone the GitHub repository.
2. Open the project folder in VS Code.
3. Run this command in the terminal:

```bash
npm install
```

4. Create a `.env` file in the main project folder.
5. Copy the values from `inst377_Ye_env_template.txt` into `.env` and replace them with your real Supabase values:

```bash
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase setup

1. Create a Supabase project.
2. Open the SQL Editor in Supabase.
3. Run the SQL in `docs/inst377_Ye_supabase_setup.sql`.
4. Copy your project URL and anon key into the `.env` file.

The table used by this project is called `favorite_dogs`.

## How to run the app locally

Use this command:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

For development with automatic restarts, use:

```bash
npm run dev
```

## How to run tests

No automated tests are included yet. For now, use manual testing:

1. Open the Home page and check that the backend status appears in the footer.
2. Open the Dog Finder page.
3. Click Random Dog.
4. Choose a breed and click Get Breed Image.
5. Add a note and click Save Favorite.
6. Confirm that the saved dog appears in the carousel and chart.
7. Confirm that the new row appears in Supabase.

## Server API endpoints

### GET `/api/health`

Checks whether the backend is running.

Example response:

```json
{
  "status": "running",
  "project": "Dog Breed Finder"
}
```

### GET `/api/favorites`

Retrieves saved favorite dogs from the Supabase `favorite_dogs` table.

Example response:

```json
[
  {
    "id": 1,
    "breed": "retriever golden",
    "image_url": "https://images.dog.ceo/example.jpg",
    "note": "friendly looking dog",
    "created_at": "2026-05-17T12:00:00.000Z"
  }
]
```

### POST `/api/favorites`

Writes a new favorite dog to Supabase.

Request body:

```json
{
  "breed": "retriever golden",
  "image_url": "https://images.dog.ceo/example.jpg",
  "note": "friendly looking dog"
}
```

### GET `/api/dog/random`

Gets one random dog image from the external Dog CEO API.

### GET `/api/dog/breeds`

Gets all dog breeds from the external Dog CEO API and formats the breed list for the frontend dropdown.

### GET `/api/dog/breed-image?breed=hound/afghan`

Gets one random image for a specific breed or sub-breed from the external Dog CEO API.

## Deployment to Vercel

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Add these environment variables in Vercel Project Settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy the project.
5. Open the Vercel URL and test the Dog Finder page.

## Known bugs

- There is no user login, so all saved dogs are shared publicly.
- There is no delete button for saved favorites.
- Notes are short plain text only.
- The chart can get crowded if many different breeds are saved.

## Roadmap for future development

- Add user accounts so each user can have their own saved dogs.
- Add delete and edit buttons for saved favorites.
- Add search filters for saved breeds.
- Add more detailed breed information if another API is added.
- Add automated tests for the API routes.
