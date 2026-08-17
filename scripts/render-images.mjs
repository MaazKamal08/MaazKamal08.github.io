import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function shoot(htmlPath, outPath, width, height, photoSrc) {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width, height } });
  let html = readFileSync(htmlPath, "utf8");
  if (photoSrc) {
    const dataUri = `data:image/jpeg;base64,${readFileSync(photoSrc).toString("base64")}`;
    html = html.replace("PHOTO_SRC", dataUri);
  }
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log("wrote", outPath);
}

await shoot(path.join(root, "scripts/render-og.html"), path.join(root, "public/og-image.png"), 1200, 630, path.join(root, "public/maaz-profile.jpg"));
await shoot(path.join(root, "scripts/render-icon.html"), path.join(root, "public/icon-512.png"), 512, 512, null);
