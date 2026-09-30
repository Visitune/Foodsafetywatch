import express from 'express';
import { REGULATORY_SOURCES, DIAGNOSTIC_PROFILES, PRICING_PLANS } from '../src/data/sourcesData.js';
import { REGULATORY_DOMAINS, OFFICIAL_REGULATORY_TEXTS, INGESTION_PIPELINES } from '../src/data/regulatoryEngineData.js';

const app = express();
app.use(express.json());

app.get('/api/sources', (req, res) => {
  res.json({ total: REGULATORY_SOURCES.length, sources: REGULATORY_SOURCES });
});

app.get('/api/alerts', (req, res) => {
  res.json({ count: 0, alerts: [] });
});

app.get('/api/diagnostic-profiles', (req, res) => {
  res.json(DIAGNOSTIC_PROFILES);
});

app.get('/api/regulatory/texts', (req, res) => {
  res.json({ total: OFFICIAL_REGULATORY_TEXTS.length, texts: OFFICIAL_REGULATORY_TEXTS });
});

app.get('/api/regulatory/domains', (req, res) => {
  res.json(REGULATORY_DOMAINS);
});

app.get('/api/regulatory/pipelines', (req, res) => {
  res.json(INGESTION_PIPELINES);
});

app.get('/api/plans', (req, res) => {
  res.json(PRICING_PLANS);
});

export default app;
