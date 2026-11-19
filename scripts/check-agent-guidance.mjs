import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const repoRoot = resolve(dirname(scriptPath), '..')

// Each published package that ships consumer agent guidance. `shipsAgentsMd`
// records packages that still publish their contributor-scoped AGENTS.md
// beside the guide; @pathableai/styles does so for existing consumers (see
// docs/styles/intent.md, "Known gaps").
export const guides = {
  react: {
    packageDir: 'packages/react',
    skillName: 'pathable-react',
    references: ['server-and-client.md', 'styling-and-theming.md'],
    shipsAgentsMd: false,
  },
  styles: {
    packageDir: 'packages/styles',
    skillName: 'pathable-styles',
    references: ['css.md', 'scss-and-uswds.md'],
    shipsAgentsMd: true,
  },
}

function skillPathFor(guide) {
  return `agent-guidance/${guide.skillName}/SKILL.md`
}

function guidanceFilesFor(guide) {
  return [
    skillPathFor(guide),
    ...guide.references.map(
      (reference) =>
        `agent-guidance/${guide.skillName}/references/${reference}`,
    ),
  ]
}

export function parseFrontmatter(
  markdown,
  expectedName = guides.react.skillName,
) {
  const normalizedMarkdown = markdown.replace(/\r\n?/gu, '\n')
  const match = normalizedMarkdown.match(/^---\n([\s\S]*?)\n---\n/u)
  assert.ok(match, 'SKILL.md must start with YAML frontmatter')

  const fields = Object.fromEntries(
    match[1].split('\n').map((line) => {
      const separator = line.indexOf(':')
      assert.ok(separator > 0, `Invalid frontmatter line: ${line}`)
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
    }),
  )

  assert.equal(fields.name, expectedName, 'Unexpected skill name')
  assert.ok(fields.description, 'Skill description must not be empty')
  assert.deepEqual(
    Object.keys(fields).sort(),
    ['description', 'name'],
    'SKILL.md frontmatter may contain only name and description',
  )

  return fields
}

function relativeMarkdownLinks(markdown) {
  const links = []
  const pattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/gu

  for (const match of markdown.matchAll(pattern)) {
    const target = match[1].trim().replace(/^<|>$/gu, '').split('#', 1)[0]
    if (
      target === '' ||
      target.startsWith('#') ||
      /^[a-z][a-z\d+.-]*:/iu.test(target)
    ) {
      continue
    }
    links.push(target)
  }

  return links
}

async function assertReadable(path, message) {
  try {
    await readFile(path)
  } catch (error) {
    assert.fail(`${message}: ${error.message}`)
  }
}

export async function validateAgentGuidance(packageRoot, guide = guides.react) {
  const skillRelativePath = skillPathFor(guide)
  const guidanceFiles = guidanceFilesFor(guide)
  const manifest = JSON.parse(
    await readFile(resolve(packageRoot, 'package.json'), 'utf8'),
  )
  assert.ok(
    manifest.files?.includes('agent-guidance'),
    'Package manifest must publish agent-guidance',
  )
  if (!guide.shipsAgentsMd) {
    assert.ok(
      !manifest.files?.includes('AGENTS.md'),
      'Consumer guidance must not use the contributor-scoped AGENTS.md name',
    )
  }

  const readme = await readFile(resolve(packageRoot, 'README.md'), 'utf8')
  assert.ok(
    readme.includes(skillRelativePath),
    `README.md must point consumers to ${skillRelativePath}`,
  )

  const skillPath = resolve(packageRoot, skillRelativePath)
  const skill = await readFile(skillPath, 'utf8')
  parseFrontmatter(skill, guide.skillName)
  const skillStats = await stat(skillPath)
  assert.ok(
    skillStats.size < 8 * 1024,
    `SKILL.md must stay below 8 KiB; received ${skillStats.size} bytes`,
  )

  for (const guidanceFile of guidanceFiles) {
    const sourcePath = resolve(packageRoot, guidanceFile)
    const markdown = await readFile(sourcePath, 'utf8')

    for (const target of relativeMarkdownLinks(markdown)) {
      const resolvedTarget = resolve(dirname(sourcePath), target)
      const packageRelativePath = relative(packageRoot, resolvedTarget)
      assert.ok(
        packageRelativePath !== '..' &&
          !packageRelativePath.startsWith(`..${sep}`),
        `${guidanceFile} link escapes the package: ${target}`,
      )
      await assertReadable(
        resolvedTarget,
        `${guidanceFile} contains a broken relative link to ${target}`,
      )
    }
  }

  return { files: guidanceFiles.length, skillBytes: skillStats.size }
}

async function main() {
  for (const guide of Object.values(guides)) {
    const packageRoot = resolve(repoRoot, guide.packageDir)
    const result = await validateAgentGuidance(packageRoot, guide)
    console.log(
      `[agent-guidance] ${guide.skillName}: validated ${result.files} files; SKILL.md is ${result.skillBytes} bytes`,
    )
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(`[agent-guidance] ${error.message}`)
    process.exitCode = 1
  })
}
