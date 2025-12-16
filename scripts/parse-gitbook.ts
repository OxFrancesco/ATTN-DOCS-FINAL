import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface Section {
  title: string;
  content: string;
  slug: string;
}

// Map section titles to file slugs
const sectionMap: Record<string, string> = {
  "INTRODUCTION": "index",
  "GETTING STARTED": "getting-started",
  "TOKEN SALE FORMATS": "token-sales",
  "ACCESS & STAKING": "access-staking",
  "COMMUNITY INTELLIGENCE": "community-intelligence",
  "PARTICIPANT PROTECTION": "participant-protection",
  "FOR PROJECTS": "for-projects",
  "TOKEN & ECONOMY": "token-economy",
  "RESOURCES": "resources",
};

// Map slugs to frontmatter titles
const titleMap: Record<string, string> = {
  index: "Introduction",
  "getting-started": "Getting Started",
  "token-sales": "Token Sale Formats",
  "access-staking": "Access & Staking",
  "community-intelligence": "Community Intelligence",
  "participant-protection": "Participant Protection",
  "for-projects": "For Projects",
  "token-economy": "Token & Economy",
  resources: "Resources",
};

// Map slugs to descriptions
const descriptionMap: Record<string, string> = {
  index: "Welcome to AttentionPad - The next-generation multi-chain launchpad.",
  "getting-started": "Learn how to create your account, complete KYC, and participate in sales.",
  "token-sales": "Explore different token sale formats available on AttentionPad.",
  "access-staking": "Learn about staking $ATTN and accessing token sales.",
  "community-intelligence": "Understand how community intelligence powers project evaluation.",
  "participant-protection": "Learn about the protection mechanisms in place for participants.",
  "for-projects": "Everything projects need to know about launching on AttentionPad.",
  "token-economy": "Learn about $ATTN token utility, distribution, and economics.",
  resources: "Useful links, audits, legal documents, and resources.",
};

function parseMarkdown(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split("\n");
  
  let currentSection: Section | null = null;
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a top-level heading (# **SECTION NAME**)
    const topLevelMatch = line.match(/^#\s+\*\*(.+?)\*\*$/);
    
    if (topLevelMatch) {
      // Save previous section if exists
      if (currentSection) {
        currentSection.content = currentContent.join("\n").trim();
        sections.push(currentSection);
      }
      
      // Start new section
      const sectionTitle = topLevelMatch[1].trim();
      const slug = sectionMap[sectionTitle] || sectionTitle.toLowerCase().replace(/\s+/g, "-");
      
      currentSection = {
        title: sectionTitle,
        content: "",
        slug,
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Don't forget the last section
  if (currentSection) {
    currentSection.content = currentContent.join("\n").trim();
    sections.push(currentSection);
  }
  
  return sections;
}

function generateFrontmatter(slug: string): string {
  const title = titleMap[slug] || slug;
  const description = descriptionMap[slug] || `${title} documentation for AttentionPad.`;
  
  return `---
title: ${title}
description: ${description}
---`;
}

function cleanContent(content: string): string {
  // Remove excessive blank lines (more than 2 consecutive)
  let cleaned = content.replace(/\n{3,}/g, "\n\n");
  
  // Clean up any markdown formatting issues
  // Fix escaped characters in markdown links
  cleaned = cleaned.replace(/\\!/g, "!");
  
  // Ensure proper spacing around headings
  cleaned = cleaned.replace(/(\n)(#{1,6}\s+\*\*)/g, "\n\n$2");
  
  return cleaned.trim();
}

function generateMDX(section: Section): string {
  const frontmatter = generateFrontmatter(section.slug);
  const content = cleanContent(section.content);
  
  return `${frontmatter}\n\n${content}\n`;
}

function updateMetaJson(sections: Section[]): void {
  const metaPath = join(process.cwd(), "content", "docs", "meta.json");
  const pages = sections.map((s) => s.slug).filter((slug) => slug !== "index");
  
  // Insert index at the beginning
  pages.unshift("index");
  
  const meta = {
    pages,
  };
  
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
}

function main() {
  const inputPath = join(process.cwd(), "references", "20251209 - Gitbook draft.md");
  const outputDir = join(process.cwd(), "content", "docs");
  
  console.log("Reading Gitbook draft...");
  const content = readFileSync(inputPath, "utf-8");
  
  console.log("Parsing sections...");
  const sections = parseMarkdown(content);
  
  console.log(`Found ${sections.length} sections:`);
  sections.forEach((section) => {
    console.log(`  - ${section.title} -> ${section.slug}.mdx`);
  });
  
  console.log("\nGenerating MDX files...");
  sections.forEach((section) => {
    const mdxContent = generateMDX(section);
    const outputPath = join(outputDir, `${section.slug}.mdx`);
    writeFileSync(outputPath, mdxContent, "utf-8");
    console.log(`  ✓ Created ${section.slug}.mdx`);
  });
  
  console.log("\nUpdating meta.json...");
  updateMetaJson(sections);
  console.log("  ✓ Updated meta.json");
  
  console.log("\n✅ Done! All sections have been converted to MDX files.");
}

main();

