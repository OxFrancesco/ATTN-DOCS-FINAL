import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";

// Types for our content structure
interface Page {
  title: string;
  slug: string;
  content: string;
}

interface Section {
  title: string;
  slug: string;
  pages: Page[];
}

// Configuration maps
const sectionSlugMap: Record<string, string> = {
  "INTRODUCTION": "introduction",
  "GETTING STARTED": "getting-started",
  "TOKEN SALE FORMATS": "token-sales",
  "ACCESS & STAKING": "access-staking",
  "COMMUNITY INTELLIGENCE": "community-intelligence",
  "PARTICIPANT PROTECTION": "participant-protection",
  "FOR PROJECTS": "for-projects",
  "TOKEN & ECONOMY": "token-economy",
  "RESOURCES": "resources",
};

const sectionTitleMap: Record<string, string> = {
  "introduction": "Introduction",
  "getting-started": "Getting Started",
  "token-sales": "Token Sale Formats",
  "access-staking": "Access & Staking",
  "community-intelligence": "Community Intelligence",
  "participant-protection": "Participant Protection",
  "for-projects": "For Projects",
  "token-economy": "Token & Economy",
  "resources": "Resources",
};

function parseMarkdown(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split("\n");

  // State tracking
  let currentSection: Section | null = null;
  let currentPage: Page | null = null;
  let currentContent: string[] = [];

  // Helper to save current page
  const saveCurrentPage = () => {
    if (currentPage && currentSection) {
      currentPage.content = currentContent.join("\n").trim();

      // Handle Index Page Logic
      if (currentPage.slug === "index") {
        if (currentPage.content.length === 0) {
          // Skip empty index pages (avoids "Introduction" -> "Introduction" duplication)
          currentPage = null;
          currentContent = [];
          return;
        } else {
          // Rename non-empty index pages to "Overview"
          currentPage.title = "Overview";
        }
      }

      // Add if valid
      if (currentPage.content || currentPage.title) {
        currentSection.pages.push(currentPage);
      }
      currentContent = [];
      currentPage = null;
    }
  };

  const saveCurrentSection = () => {
    saveCurrentPage();
    if (currentSection) {
      sections.push(currentSection);
      currentSection = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Level 1: New Section / Directory (# **TITLE**)
    // Matches "# **TITLE**" or "# TITLE"
    const l1Match = line.match(/^#\s+(?:\*\*)?(.+?)(?:\*\*)?$/);

    // Level 2: New Page / File (## **TITLE**)
    // Matches "## **TITLE**" or "## TITLE"
    const l2Match = line.match(/^##\s+(?:\*\*)?(.+?)(?:\*\*)?$/);

    if (l1Match) {
      saveCurrentSection();
      const title = l1Match[1].trim();
      const slug = sectionSlugMap[title] || title.toLowerCase().replace(/\s+/g, "-");

      currentSection = {
        title,
        slug,
        pages: []
      };

      // Start the 'index' page for this section immediately to capture H1 content
      currentPage = {
        title: sectionTitleMap[slug] || title, // Use mapped title for nice display
        slug: "index",
        content: ""
      };

    } else if (l2Match) {
      const title = l2Match[1].trim();

      // Special logic for Roadmap: Merge "Q1-Q4" headers into the previous page
      const isRoadmapEx = /^Q[1-4]/.test(title);

      if (isRoadmapEx && currentPage) {
        // Append as a subsection instead of a new page
        // Convert H2 to H2 (MDX supports H2) but since we are merging, it's effectively a section in the page.
        currentContent.push(`\n## ${title}\n`);
      } else {
        saveCurrentPage();

        let slug = title.toLowerCase()
          .replace(/[^\w\s-]/g, "") // Remove special chars
          .replace(/\s+/g, "-"); // Spaces to dashes

        if (slug === "") slug = "page";

        currentPage = {
          title,
          slug,
          content: ""
        };
      }
    } else {
      // Content handling
      if (currentPage) {
        currentContent.push(line);
      } else if (currentSection && !currentPage) {
        // Should not happen if we init index page on H1
        // But just in case
        currentPage = {
          title: "Overview",
          slug: "index",
          content: ""
        };
        currentContent.push(line);
      }
    }
  }

  saveCurrentSection();
  return sections;
}

function generateFrontmatter(title: string, description: string): string {
  return `---
title: ${title}
description: "${description}"
---`;
}

function cleanContent(content: string): string {
  // Fix images: ![Chart][image1] -> ![Chart](/images/image1.png) if we had them.
  // For now, just keep text clean.
  return content
    .replace(/\n{3,}/g, "\n\n")
    // Fix checklist rendering
    .replace(/\[x\]/g, "[x]")
    .replace(/\[ \]/g, "[ ]")
    .trim();
}

function updateRootMeta(sections: Section[], outputDir: string) {
  const meta = {
    pages: sections.map(s => s.slug)
  };
  writeFileSync(join(outputDir, "meta.json"), JSON.stringify(meta, null, 2));
}

function updateFolderMeta(section: Section, sectionDir: string) {
  const meta = {
    pages: section.pages.map(p => p.slug)
  };
  writeFileSync(join(sectionDir, "meta.json"), JSON.stringify(meta, null, 2));
}

function main() {
  const inputPath = join(process.cwd(), "references", "20251209 - Gitbook draft.md");
  const outputDir = join(process.cwd(), "content", "docs");

  console.log(`Reading from ${inputPath}`);
  const content = readFileSync(inputPath, "utf-8");
  const sections = parseMarkdown(content);

  // Clean output dir first (safety: ensure we only delete known docs structure if needed, 
  // but for now, let's just overwrite/add. Actually better to clean to remove old flat files)
  // BE CAREFUL: Don't delete metadata if not regenerated.
  // We are regenerating all metadata, so aggressive clean is fine for content/docs sub-items.
  // But let's just overwrite for safety against deleting user custom stuff.

  console.log(`Parsed ${sections.length} sections.`);

  for (const section of sections) {
    const sectionDir = join(outputDir, section.slug);
    if (!existsSync(sectionDir)) {
      mkdirSync(sectionDir, { recursive: true });
    }

    // Generate pages
    for (const page of section.pages) {
      const filePath = join(sectionDir, `${page.slug}.mdx`);
      const fileContent = `${generateFrontmatter(page.title, "")}\n\n${cleanContent(page.content)}`;
      writeFileSync(filePath, fileContent);
      console.log(`  Wrote ${section.slug}/${page.slug}.mdx`);
    }

    // Generate folder meta
    updateFolderMeta(section, sectionDir);
  }

  // Generate root meta
  updateRootMeta(sections, outputDir);

  console.log("Done! Migration complete.");
}

main();

