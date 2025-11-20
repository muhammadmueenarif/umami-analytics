/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const routesManifestPath = path.resolve(__dirname, '../.next/routes-manifest.json');
const originalPath = path.resolve(__dirname, '../.next/routes-manifest-orig.json');

// Ensure .next directory exists
const nextDir = path.dirname(routesManifestPath);
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}

// Check if original file exists, if not, try to use the current one
let originalManifest;
try {
  if (fs.existsSync(originalPath)) {
    originalManifest = require(originalPath);
  } else if (fs.existsSync(routesManifestPath)) {
    // If original doesn't exist, use the current one
    originalManifest = require(routesManifestPath);
    console.log('Using existing routes-manifest.json as original');
  } else {
    // If neither exists, create a default one
    console.log('No routes manifest found, creating default');
    originalManifest = {
      basePath: process.env.BASE_PATH || '',
      headers: [],
      rewrites: [],
    };
    fs.writeFileSync(routesManifestPath, JSON.stringify(originalManifest, null, 2));
    console.log('Default routes manifest created');
    process.exit(0);
  }
} catch (error) {
  console.error('Error reading routes manifest:', error.message);
  // Create a default manifest if reading fails
  originalManifest = {
    basePath: process.env.BASE_PATH || '',
    headers: [],
    rewrites: [],
  };
  fs.writeFileSync(routesManifestPath, JSON.stringify(originalManifest, null, 2));
  console.log('Created default routes manifest due to error');
  process.exit(0);
}

const basePath = originalManifest.basePath || '';

const API_PATH = basePath + '/api/:path*';
const TRACKER_SCRIPT = basePath + '/script.js';

const collectApiEndpoint = process.env.COLLECT_API_ENDPOINT;
const trackerScriptName = process.env.TRACKER_SCRIPT_NAME;

const headers = [];
const rewrites = [];

// Ensure headers and rewrites arrays exist
if (!originalManifest.headers) {
  originalManifest.headers = [];
}
if (!originalManifest.rewrites) {
  originalManifest.rewrites = [];
}

if (collectApiEndpoint && originalManifest.headers.length > 0) {
  const apiRoute = originalManifest.headers.find(route => route.source === API_PATH);
  if (apiRoute && apiRoute.regex) {
    const routeRegex = new RegExp(apiRoute.regex);

    const normalizedSource = basePath + collectApiEndpoint;

    rewrites.push({
      source: normalizedSource,
      destination: basePath + '/api/send',
    });

    if (!routeRegex.test(normalizedSource)) {
      headers.push({
        source: normalizedSource,
        headers: apiRoute.headers,
      });
    }
  }
}

if (trackerScriptName && originalManifest.headers.length > 0) {
  const trackerRoute = originalManifest.headers.find(route => route.source === TRACKER_SCRIPT);

  if (trackerRoute) {
    const names = trackerScriptName?.split(',').map(name => name.trim());

    if (names) {
      names.forEach(name => {
        const normalizedSource = `${basePath}/${name.replace(/^\/+/, '')}`;

        rewrites.push({
          source: normalizedSource,
          destination: TRACKER_SCRIPT,
        });

        headers.push({
          source: normalizedSource,
          headers: trackerRoute.headers,
        });
      });
    }
  }
}

const routesManifest = { ...originalManifest };

if (rewrites.length !== 0 || headers.length !== 0) {
  try {
    const { buildCustomRoute } = require('next/dist/lib/build-custom-route');

    const builtHeaders = headers.map(header => buildCustomRoute('header', header));
    const builtRewrites = rewrites.map(rewrite => buildCustomRoute('rewrite', rewrite));

    routesManifest.headers = [...originalManifest.headers, ...builtHeaders];
    routesManifest.rewrites = [...builtRewrites, ...originalManifest.rewrites];

    console.log('Using updated Next.js routes manifest');
  } catch (error) {
    console.warn('Could not build custom routes, using original manifest:', error.message);
    // If buildCustomRoute is not available, just use the original manifest
  }
} else {
  console.log('Using original Next.js routes manifest');
}

fs.writeFileSync(routesManifestPath, JSON.stringify(routesManifest, null, 2));
console.log('Routes manifest written successfully');
