import { describe, expect, it } from 'vitest';
import {
  WIKI_TITLES, cropFromFaceBox, headRect, heuristicCrop, imageInfoUrl, isFreeLicense, pageImagesUrl, parseImageInfo,
  parsePageImages, portraitRect, stripHtml,
} from '../src/core/wiki';
import { ROSTER } from '../src/data/roster';

describe('wikipedia photo lookup', () => {
  it('has a Wikipedia title for every fighter', () => {
    for (const c of ROSTER) expect(WIKI_TITLES[c.id], c.id).toBeTruthy();
  });

  it('builds a CORS-enabled, free-licence-only page image query', () => {
    const u = new URL(pageImagesUrl('en.wikipedia.org', ['Benjamin Netanyahu', "Gideon Sa'ar"]));
    expect(u.searchParams.get('origin')).toBe('*');
    expect(u.searchParams.get('pilicense')).toBe('free');
    expect(u.searchParams.get('titles')).toBe("Benjamin Netanyahu|Gideon Sa'ar");
    const i = new URL(imageInfoUrl('en.wikipedia.org', ['A b.jpg']));
    expect(i.searchParams.get('titles')).toBe('File:A b.jpg');
  });

  it('maps requested titles through normalisation and redirects', () => {
    const json = {
      query: {
        normalized: [{ from: 'hili Tropper', to: 'Hili Tropper' }],
        redirects: [{ from: 'Hili Tropper', to: 'Chili Tropper' }],
        pages: [
          { title: 'Chili Tropper', pageimage: 'Tropper.jpg', thumbnail: { source: 'https://upload.wikimedia.org/x/640px-Tropper.jpg', width: 640, height: 800 } },
          { title: 'Benjamin Netanyahu', pageimage: 'Bibi 2023.jpg', thumbnail: { source: 'https://upload.wikimedia.org/y.jpg', width: 500, height: 600 } },
          { title: 'Nobody', missing: true },
        ],
      },
    };
    const r = parsePageImages(json, ['hili Tropper', 'Benjamin Netanyahu', 'Nobody']);
    expect(r['hili Tropper'].file).toBe('Tropper.jpg');
    expect(r['Benjamin Netanyahu'].thumb).toContain('y.jpg');
    expect(r.Nobody).toBeUndefined();
  });

  it('extracts licence and author from extmetadata', () => {
    const json = {
      query: {
        pages: [
          {
            title: 'File:Bibi 2023.jpg',
            imageinfo: [{
              descriptionurl: 'https://commons.wikimedia.org/wiki/File:Bibi_2023.jpg',
              extmetadata: { LicenseShortName: { value: 'CC BY-SA 4.0' }, Artist: { value: '<a href="/u/x">Kobi&nbsp;Gideon</a> / GPO' }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' } },
            }],
          },
        ],
      },
    };
    const r = parseImageInfo(json);
    expect(r['Bibi_2023.jpg']).toEqual({ license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', artist: 'Kobi Gideon / GPO', descUrl: 'https://commons.wikimedia.org/wiki/File:Bibi_2023.jpg' });
  });

  it('accepts only free licences', () => {
    for (const ok of ['CC BY-SA 3.0', 'CC BY 2.0', 'CC0', 'Public domain', 'PD-Israel', 'Attribution', 'GFDL']) expect(isFreeLicense(ok), ok).toBe(true);
    for (const bad of ['', 'CC BY-NC 2.0', 'CC BY-ND 4.0', 'Fair use', 'Non-free media']) expect(isFreeLicense(bad), bad).toBe(false);
  });

  it('strips HTML from credits', () => {
    expect(stripHtml('<span>Photo by <b>A &amp; B</b></span>')).toBe('Photo by A & B');
  });
});

describe('face crop geometry', () => {
  it('expands a detector box to a head crop that includes hair and chin', () => {
    const c = cropFromFaceBox({ xCenter: 0.5, yCenter: 0.4, width: 0.2, height: 0.25 }, 800, 1000);
    expect(c.cx).toBeCloseTo(0.5);
    expect(c.cy).toBeLessThan(0.4);
    expect(c.h).toBeGreaterThan(0.25 * 1.8);
    const r = headRect(c, 800, 1000);
    expect(r.w / r.h).toBeCloseTo(0.8);
    // The face box must sit inside the head rectangle.
    expect(r.y).toBeLessThan((0.4 - 0.125) * 1000);
    expect(r.y + r.h).toBeGreaterThan((0.4 + 0.125) * 1000);
  });

  it('guesses sensible crops for portrait and landscape photos', () => {
    for (const [w, h] of [[600, 800], [1200, 700], [500, 500]]) {
      const c = heuristicCrop(w, h);
      expect(c.cx).toBe(0.5);
      expect(c.h).toBeGreaterThan(0.3);
      expect(c.h).toBeLessThanOrEqual(0.7);
      const p = portraitRect(c, w, h);
      expect(p.s).toBeGreaterThan(0);
    }
  });
});
