const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('Missing Supabase keys. Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file.');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inst377_Ye_index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inst377_Ye_about.html'));
});

app.get('/dogs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inst377_Ye_dogs.html'));
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    project: 'Dog Breed Finder'
  });
});

app.get('/api/favorites', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase is not connected yet.' });
  }

  const { data, error } = await supabase
    .from('favorite_dogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/api/favorites', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase is not connected yet.' });
  }

  const { breed, image_url, note } = req.body;

  if (!breed || !image_url) {
    return res.status(400).json({ error: 'Breed and image_url are required.' });
  }

  const newFavorite = {
    breed,
    image_url,
    note: note || ''
  };

  const { data, error } = await supabase
    .from('favorite_dogs')
    .insert(newFavorite)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

app.get('/api/dog/random', async (req, res) => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load a random dog right now.' });
  }
});

app.get('/api/dog/breeds', async (req, res) => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();

    const breedNames = [];

    Object.keys(data.message).forEach((breed) => {
      const subBreeds = data.message[breed];

      if (subBreeds.length === 0) {
        breedNames.push(breed);
      } else {
        subBreeds.forEach((subBreed) => {
          breedNames.push(`${breed}/${subBreed}`);
        });
      }
    });

    res.json({ status: 'success', message: breedNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load the dog breed list.' });
  }
});

app.get('/api/dog/breed-image', async (req, res) => {
  try {
    const breed = req.query.breed;

    if (!breed) {
      return res.status(400).json({ error: 'Breed is required.' });
    }

    const apiUrl = `https://dog.ceo/api/breed/${breed}/images/random`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load an image for that breed.' });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'inst377_Ye_index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Dog Breed Finder is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
