import assert from 'node:assert/strict'
import test from 'node:test'
import { guides, parseFrontmatter } from './check-agent-guidance.mjs'

test('accepts CRLF skill frontmatter', () => {
  const frontmatter = [
    '---',
    'name: pathable-react',
    'description: Use PathAble React.',
    '---',
    '',
    '# PathAble React',
    '',
  ].join('\r\n')

  assert.deepEqual(parseFrontmatter(frontmatter), {
    name: 'pathable-react',
    description: 'Use PathAble React.',
  })
})

test('validates a named skill against its expected name', () => {
  const frontmatter = [
    '---',
    'name: pathable-styles',
    'description: Use PathAble styles.',
    '---',
    '',
  ].join('\n')

  assert.equal(
    parseFrontmatter(frontmatter, guides.styles.skillName).name,
    'pathable-styles',
  )
  assert.throws(
    () => parseFrontmatter(frontmatter, guides.react.skillName),
    /Unexpected skill name/u,
  )
})
