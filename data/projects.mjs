// Edit projects.json; routes, artwork, translations and work pages follow it.
import {readFileSync} from 'node:fs';
import {normalizeProjects} from '../lib/site/project-data.mjs';
export default normalizeProjects(JSON.parse(readFileSync(new URL('./projects.json',import.meta.url),'utf8')));
