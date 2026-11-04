# Academic Website

Personal academic homepage on GitHub Pages — plain static files, no build step.
個人學術網站,純靜態檔案,不需要任何建置步驟。

- 內容 Content → `data/profile.yml`, `data/publications.yml`, `data/experience.yml`
- 檔案 Files (照片、CV、論文縮圖 photo / CV / thumbnails) → `assets/`
- 你**不需要**修改任何 HTML / CSS / JS。 You never need to edit HTML/CSS/JS.

> 目前所有資料都是標示為 `[PLACEHOLDER]` 的範例內容,請換成你自己的。
> All current data is clearly marked `[PLACEHOLDER]` sample content — replace it with your own.

---

## 中文:如何更新內容

### 一、最簡單的方式(直接在 GitHub 網頁上改)
1. 打開 repo 裡的 `data/` 資料夾,點要改的檔案(例如 `publications.yml`)。
2. 點右上角鉛筆圖示 ✏️ 編輯。
3. 改完後按 **Commit changes**,提交到 `main` 分支。
4. 約 1–2 分鐘後 GitHub Actions 會自動部署,重新整理網站即可看到更新。
   (可在 repo 的 **Actions** 分頁看進度;若顯示紅色 ✗,通常是 YAML 格式錯誤,點進去會顯示哪一行。)

### 二、上傳照片 / CV / 論文縮圖
1. 在 GitHub 打開 `assets/`(或 `assets/img/`)→ **Add file → Upload files**。
2. 在 yml 中寫上路徑,例如:
   - 大頭照:`profile.yml` 的 `photo: "assets/img/me.jpg"`
   - CV:`profile.yml` 的 `links:` 底下 `cv: "assets/cv.pdf"`
   - 論文縮圖:`publications.yml` 某篇的 `image: "assets/img/paper1.png"`
3. 路徑大小寫要完全一致(`Me.JPG` ≠ `me.jpg`)。

### 三、YAML 格式小提醒
- 縮排**只能用空白**,不能用 Tab;同一層要對齊。
- 清單項目以 `- ` 開頭。
- 文字含有 `:`、`#`、`[`、`*` 開頭等符號時,用雙引號包起來:`title: "A: B"`。
- 想隱藏某個連結:刪掉那一行,或留空 `""`。
- 文字中可用 `**粗體**`、`*斜體*`、`[連結文字](https://...)`(適用於 bio、論文標題、經歷說明)。

### 四、範例

**`data/profile.yml`**(節錄)
```yaml
name: "王小明"
name_alt: "Hsiao-Ming Wang"
title: "Ph.D. Student"
affiliation:
  name: "某某大學 資訊工程學系"
  url: "https://example.edu"
photo: "assets/img/me.jpg"
bio: |
  我是 **某某大學** 的博士生,指導教授為 [某某教授](https://example.edu)。

  第二段文字……
links:
  email: "me@example.com"
  scholar: "https://scholar.google.com/citations?user=XXXX"
  github: "https://github.com/xxxx"
  linkedin: ""          # 留空就不會顯示
  cv: "assets/cv.pdf"
author_names:            # 論文作者中要被標示(粗體+底線)的名字,所有拼法都列上
  - "Hsiao-Ming Wang"
  - "H.-M. Wang"
```

**`data/publications.yml`**(新增一篇:複製一整塊,貼在最上面再修改)
```yaml
- title: "論文標題"
  authors: ["Hsiao-Ming Wang*", "Coauthor*", "Advisor"]   # * = 同等貢獻
  venue: "CVPR 2027"
  year: 2027
  note: "Oral"            # 選填:Oral / Spotlight / Best Paper…
  selected: true          # 選填:出現在「Selected」篩選中
  image: "assets/img/paper.png"   # 選填
  links:                  # 選填,名稱可自訂
    pdf: "https://..."
    code: "https://github.com/..."
    project: "https://..."
```

**`data/experience.yml`**(由新到舊排列)
```yaml
education:
  - title: "Ph.D. in Computer Science"
    org: "某某大學"
    url: "https://example.edu"
    location: "台北, 台灣"
    start: "2024"
    end: "Present"        # 或留空 = 至今
    details:
      - "指導教授:[某某教授](https://example.edu)"
work:
  - title: "Research Intern"
    org: "Example Company"
    start: "Jun 2025"
    end: "Sep 2025"
    logo: "assets/img/company.png"   # 選填
```

### 五、在自己電腦預覽(選用)
直接點兩下 `index.html` **無法**載入資料(瀏覽器安全限制)。請在專案資料夾執行:
```bash
python3 -m http.server 8000
```
然後打開 <http://localhost:8000>。

---

## English: How to update content

1. **Edit on GitHub**: open a file in `data/`, click the ✏️ pencil, edit, then **Commit changes** to `main`.
   GitHub Actions validates the YAML and redeploys in about 1–2 minutes. A red ✗ in the **Actions** tab
   usually means a YAML syntax error; the log shows the file and line.
2. **Add files** (photo, CV, thumbnails, logos): upload to `assets/` or `assets/img/`, then reference the
   path in YAML, e.g. `photo: "assets/img/me.jpg"`, `cv: "assets/cv.pdf"`. Paths are case-sensitive.
3. **YAML tips**: spaces only (no tabs); list items start with `- `; quote text containing `:` or `#`;
   delete a line or set it to `""` to hide a link. Inline `**bold**`, `*italic*` and `[text](url)` work in
   bio, titles, venues and experience details.
4. **Publications** are grouped by `year` (newest first). Names listed in `profile.yml → author_names`
   are highlighted; append `*` to an author for equal contribution. If some entries have `selected: true`,
   a *Selected / All* toggle appears.
5. **Experience** entries render as a timeline; list them newest first. Empty `end` or `Present` marks
   the current position.
6. **Local preview** (optional): `python3 -m http.server 8000` and open <http://localhost:8000>
   (opening `index.html` directly from disk will not load the data).

See the comments at the top of each `data/*.yml` file for every available field.

---

## One-time setup (部署設定,只需做一次)

1. Repo **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
   (設定 → Pages → Source 選 **GitHub Actions**。)
2. Push / merge to `main`. The workflow in `.github/workflows/pages.yml` deploys to
   `https://<username>.github.io`.

## Project structure

```
index.html            page skeleton (semantic HTML)
css/style.css         styles, light/dark theme
js/main.js            loads data/*.yml and renders the page
vendor/js-yaml.min.js YAML parser (MIT, vendored — no CDN needed)
data/*.yml            ← your content
assets/               ← your files (photo, CV, images)
```

Light/dark mode follows the visitor's system setting by default and remembers a manual choice.
