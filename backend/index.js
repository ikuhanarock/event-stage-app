
require('dotenv').config();

const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');
const { Storage } = require('@google-cloud/storage');

const app = express();
const port = process.env.PORT || 8080;

// --- Environment Variable Validation ---
if (!process.env.GCLOUD_PROJECT || !process.env.GCS_BUCKET_NAME) {
  console.error('FATAL ERROR: GCLOUD_PROJECT and GCS_BUCKET_NAME environment variables are required.');
  process.exit(1);
}

// --- Vertex AI and Cloud Storage Configuration ---
const project = process.env.GCLOUD_PROJECT;
const location = 'us-central1';
const storage = new Storage({ projectId: project });
const vertexAI = new VertexAI({ project: project, location: location });

const bucketName = process.env.GCS_BUCKET_NAME;

// --- Dummy Data ---
const dummyStages = [
  { id: 'main-stage', name: 'Main Stage', description: 'The main stage features the keynote speech by the CEO, followed by a deep dive into our new product line. Later, a panel of industry experts will discuss the future of technology.' },
  { id: 'dev-lounge', name: 'Developer Lounge', description: 'A series of technical deep dives and coding workshops. We will cover everything from our new API endpoints to advanced debugging techniques. Bring your laptop!' },
  { id: 'creator-zone', name: 'Creator Zone', description: 'Meet your favorite content creators. They will be sharing their tips and tricks for building an audience and creating engaging content. There will be live demos and Q&A sessions.' },
];

// --- Helper Functions (PoC Mocks) ---

/**
 * Calls Gemini to summarize text.
 * @param {string} text The text to summarize.
 * @returns {Promise<string>} The summarized text.
 */
async function getSummaryFromGemini(text) {
  console.log(`Summarizing text with Gemini: "${text.substring(0, 30)}..."`);
  const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
  const prompt = `Summarize the following event description in under 200 characters: ${text}`;
  const resp = await generativeModel.generateContent(prompt);
  const summary = resp.response.candidates[0].content.parts[0].text;
  return summary;
}

/**
 * Calls Imagen to generate a video.
 * @param {string} textPrompt The prompt for video generation.
 * @returns {Promise<Buffer>} A buffer containing the video data.
 */
async function createVideoWithImagen(textPrompt) {
  console.log(`Generating video with Imagen for prompt: "${textPrompt.substring(0, 50)}..."`);
  // This is a placeholder for the actual Imagen API which is not publicly available.
  // In a real scenario, you would use the Vertex AI client library.
  // For this PoC, we will continue to return a placeholder.
  console.log('[MOCK] Imagen Video API is not available in this PoC, returning placeholder.');
  return Promise.resolve(Buffer.from('fake-video-data'));
}

/**
 * Saves a file to GCS and returns its public URL.
 * @param {Buffer} buffer The file data.
 * @param {string} destination The destination path in the bucket.
 * @returns {Promise<string>} The public URL of the file.
 */
async function saveToGCSAndGetPublicUrl(buffer, destination) {
  console.log(`Saving to GCS at: ${destination}`);
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destination);
  await file.save(buffer, {
    metadata: { contentType: 'video/mp4' },
  });
  await file.makePublic();
  return file.publicUrl();
}


// --- API Endpoint ---

app.get('/api/stages', async (req, res) => {
  console.log('Received request for /api/stages');
  try {
    const processedStages = await Promise.all(dummyStages.map(async (stage) => {
      // 1. Get summary from Gemini
      const summary = await getSummaryFromGemini(stage.description);

      // 2. Generate video from Imagen based on the summary
      // In a real app, you'd use the buffer from createVideoWithImagen
      const videoBuffer = await createVideoWithImagen(summary); 

      // 3. Save video to GCS and get URL
      const destination = `videos/${stage.id}-${Date.now()}.mp4`;
      const videoUrl = await saveToGCSAndGetPublicUrl(videoBuffer, destination);

      return {
        name: stage.name,
        summary: summary,
        videoUrl: videoUrl,
      };
    }));

    res.json(processedStages);
  } catch (error) {
    console.error('Error processing stages:', error);
    res.status(500).send('Error processing stage data.');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
