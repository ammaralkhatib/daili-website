# Third-party scripts

Copied verbatim, minified and unmodified, from the npm tarballs (`npm pack`).
They are files in this repo, not dependencies: `package.json` stays empty.
Only the home page loads them.

| File | Package | Version | Licence |
|---|---|---|---|
| `gsap.min.js` | [gsap](https://www.npmjs.com/package/gsap) (`dist/`) | 3.15.0 | GSAP Standard "No Charge" License — https://gsap.com/standard-license |
| `ScrollTrigger.min.js` | [gsap](https://www.npmjs.com/package/gsap) (`dist/`) | 3.15.0 | GSAP Standard "No Charge" License — https://gsap.com/standard-license |
| `lenis.min.js` | [lenis](https://www.npmjs.com/package/lenis) (`dist/`) | 1.3.26 | MIT (text below) |

To update: `npm pack gsap@<v> lenis@<v>` in a temp folder, copy the same three
files out of `package/dist/`, and change the versions above.

## Lenis — MIT License

Copyright (c) 2024 darkroom.engineering

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
