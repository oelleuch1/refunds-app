import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const vitestBin = join(root, 'node_modules', 'vitest', 'dist', 'cli.js')
const args = process.argv.slice(2)

function isNodeVersionSupported() {
  const [major, minor] = process.versions.node.split('.').map(Number)
  if (major >= 24) return true
  if (major >= 22 && minor >= 12) return true
  if (major === 20 && minor >= 19) return true
  return false
}

function resolveNvmNode() {
  const nvmrcPath = join(root, '.nvmrc')
  if (!existsSync(nvmrcPath)) return null

  const version = readFileSync(nvmrcPath, 'utf8').trim()
  const candidates = [
    join(homedir(), '.nvm/versions/node', `v${version}`, 'bin', 'node'),
    join(homedir(), '.nvm/versions/node', version, 'bin', 'node'),
  ]

  return candidates.find((path) => existsSync(path)) ?? null
}

let node = process.execPath

if (!isNodeVersionSupported()) {
  const nvmNode = resolveNvmNode()
  if (nvmNode) {
    console.warn(
      `Node ${process.version} is too old for Vitest; using ${nvmNode} (see .nvmrc).`,
    )
    node = nvmNode
  } else {
    console.error(
      `Node ${process.version} is too old. Vitest requires Node ^20.19.0 or >=22.12.0.`,
    )
    console.error('Install a supported version, or run: nvm use')
    process.exit(1)
  }
}

const result = spawnSync(node, [vitestBin, ...args], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})

process.exit(result.status ?? 1)
