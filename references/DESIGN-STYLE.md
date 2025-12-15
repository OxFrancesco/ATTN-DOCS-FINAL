Based on the additional pages in the Brand Guidelines, here is the comprehensive set of **UI Rules**, covering Web Color Themes, Typography, Grid Systems, and Layout Principles.

### 1. Web Color Guidelines (Light vs. Dark UI)
[cite_start]The system distinguishes between **Dark UI** (Public websites, marketing) and **Light UI** (Dashboards, productivity tools)[cite: 484].

#### Dark UI (Immersive & Bold)
* [cite_start]**Background:** `#0A0A0A` (Deep black for primary backdrop) [cite: 491]
* [cite_start]**Surface (Cards/Modals):** `#1A1A1A` [cite: 491]
* [cite_start]**Text Primary:** `#FFFFFF` (Headings and body) [cite: 491]
* [cite_start]**Text Secondary:** `#CCCCCC` (Labels, descriptions, metadata) [cite: 491]
* [cite_start]**Borders/Lines:** `#3B3B3B` (Soft dividers) [cite: 491]
* [cite_start]**Accent:** `#ED0C32` (CTAs, links, indicators) [cite: 491]

#### Light UI (Clear & Editorial)
* [cite_start]**Surface:** `#F0F1F2` (Cards, modules, panels) [cite: 491]
* [cite_start]**Text Primary:** `#0A0A0A` (Default body and heading) [cite: 491]
* [cite_start]**Text Secondary:** `#5F6368` (Subheadings, meta info) [cite: 491]
* [cite_start]**Borders/Lines:** `#DFE0E1` (Unobtrusive structure) [cite: 491]
* [cite_start]**Accent:** `#ED0C32` (Stands out boldly; use sparingly) [cite: 491]

---

### 2. Typography in UI
[cite_start]Typography in the interface prioritizes hierarchy and readability over decoration ("UI Over Chrome")[cite: 579].

#### Font Assignments
* [cite_start]**Headings (H1-H5):** *Söhne* [cite: 550, 574]
* [cite_start]**Body & UI Labels:** *Rubik* [cite: 550, 574]
    * [cite_start]**Note:** Use uppercase Rubik for subheadings to maintain structure[cite: 510].

#### Color Roles by Theme
| Type Element | Dark UI Color | Light UI Color |
| :--- | :--- | :--- |
| **H1 / H2** | `#FFFFFF` | `#0A0A0A` |
| **H3 / H4 / H5** | `#CCCCCC` | `#0A0A0A` |
| **Body Text** | `#CCCCCC` | `#1A1A1A` |
| **Metadata** | `#CCCCCC`* | `#5F6368` |

[cite_start]*(Note: While some tables suggest darker values for metadata, the web guidelines prioritize #CCCCCC for secondary text in Dark UI to ensure contrast [cite: 491, 550]).*

#### Scaling Principles
* [cite_start]**Responsiveness:** Use REM-based units for responsive scaling[cite: 587].
* [cite_start]**Line Height:** Maintain a line height of **1.3–1.7** depending on context (1.4–1.6 suggested for body text)[cite: 550, 588].
* [cite_start]**Line Width:** Cap line width at **60–75 characters** for optimal readability[cite: 590].

---

### 3. Layout Grid Framework
A responsive grid ensures consistency across mediums.

* **Desktop:** 12-column grid | [cite_start]**32px** margins [cite: 814, 816]
* **Tablet:** 12-column grid | [cite_start]**24px** margins [cite: 814, 817]
* **Mobile:** 4-column grid | [cite_start]**16px** margins [cite: 815, 823]
* [cite_start]**Gutters:** **20px** [cite: 824]

[cite_start]**Usage Rule:** Elements should align to the grid, breaking it only when intention and clarity are preserved[cite: 819, 820].

---

### 4. Application Logic: Dashboards vs. Campaigns
[cite_start]The guidelines differentiate between "Marketing/Brand" surfaces and "Product/Tool" surfaces to balance storytelling with utility[cite: 955].

| Feature | Campaign Sites / Brand Pages | Exchanges / Dashboards / Tools |
| :--- | :--- | :--- |
| **Layout** | [cite_start]Asymmetry preferred [cite: 955] | [cite_start]Symmetry allowed where needed [cite: 931] |
| **Shadows** | [cite_start]Encouraged for storytelling [cite: 955] | [cite_start]**Optional or suppressed** [cite: 955] |
| **Vector** | [cite_start]One large instance per layout [cite: 955] | [cite_start]Multiple small functional instances permitted [cite: 955] |
| **Containers** | [cite_start]Avoid (use whitespace) [cite: 955] | [cite_start]Allowed with generous padding [cite: 926, 955] |
| **Color Accent** | [cite_start]Sparse and deliberate [cite: 955] | [cite_start]Functional use is acceptable [cite: 955] |

[cite_start]**Key Principle for Tools:** In data-heavy contexts (like exchanges), card layouts are allowed to clarify structure, provided they avoid visual overload[cite: 926].