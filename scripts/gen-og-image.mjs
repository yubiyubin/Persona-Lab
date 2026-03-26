/**
 * OG 이미지 생성 스크립트
 * Playwright로 SVG + 배경을 렌더링해서 public/og.png 로 저장
 * 실행: node scripts/gen-og-image.mjs
 */

import { chromium } from "playwright";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const svgContent = readFileSync(join(root, "public/chemifit.svg"), "utf-8");
const svgBase64 = Buffer.from(svgContent).toString("base64");

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .glow1 {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%);
    top: -100px; right: -100px;
  }
  .glow2 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(44,251,255,0.12) 0%, transparent 70%);
    bottom: -150px; left: -50px;
  }
  img {
    width: 700px;
    height: auto;
    position: relative;
    z-index: 1;
  }
</style>
</head>
<body>
  <div class="glow1"></div>
  <div class="glow2"></div>
  <img src="data:image/svg+xml;base64,${svgBase64}" />
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: join(root, "public/og.png"), type: "png" });
await browser.close();

console.log("✅ public/og.png 생성 완료");
