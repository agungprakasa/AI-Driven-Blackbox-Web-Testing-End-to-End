#!/usr/bin/env python3
"""Parse curl commands ke test case Playwright.

Membaca file berisi curl commands dan menghasilkan test spec TypeScript.

Usage:
    python scripts/parse-curl.py input/curl/endpoints.txt
    python scripts/parse-curl.py input/curl/endpoints.txt --output tests/api/auto-generated.spec.ts
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent


def parse_curl(curl_cmd: str) -> dict:
    """Parse satu curl command ke dict."""
    result = {
        "method": "GET",
        "url": "",
        "headers": {},
        "body": None,
        "description": "",
    }

    # Extract method
    method_match = re.search(r'-X\s+(\w+)', curl_cmd)
    if method_match:
        result["method"] = method_match.group(1).upper()
    elif '-d ' in curl_cmd or '--data' in curl_cmd:
        result["method"] = "POST"

    # Extract URL (skip -X METHOD and other flags before URL)
    url_match = re.search(r"https?://[^'\"\s]+", curl_cmd)
    if url_match:
        result["url"] = url_match.group(0)
    else:
        # Try URL without protocol
        url_match = re.search(r"curl\s+['\"]?(/[^\s'\"-]+)", curl_cmd)
        if url_match:
            result["url"] = url_match.group(1)

    # Extract headers
    header_pattern = re.findall(r"-H\s+['\"]([^'\"]+)['\"]", curl_cmd)
    for h in header_pattern:
        if ':' in h:
            key, value = h.split(':', 1)
            result["headers"][key.strip()] = value.strip()

    # Extract body (everything after -d or --data to end of line)
    body_match = re.search(r"-d\s+(.+)$", curl_cmd, re.MULTILINE)
    if not body_match:
        body_match = re.search(r"--data\s+(.+)$", curl_cmd, re.MULTILINE)
    if body_match:
        raw = body_match.group(1).strip()
        # Remove surrounding quotes if present
        if (raw.startswith("'") and raw.endswith("'")) or (raw.startswith('"') and raw.endswith('"')):
            raw = raw[1:-1]
        result["body"] = raw

    # Extract description (comment before curl)
    return result


def parse_file(filepath: Path) -> list[dict]:
    """Parse file berisi multiple curl commands."""
    text = filepath.read_text(encoding="utf-8")
    commands = []

    # Split by empty line or comment marker
    blocks = re.split(r'\n\s*\n|#\s*', text)

    current_desc = ""
    for block in blocks:
        block = block.strip()
        if not block:
            continue

        if 'curl' in block.lower():
            parsed = parse_curl(block)
            if parsed["url"]:
                if current_desc:
                    parsed["description"] = current_desc
                commands.append(parsed)
            current_desc = ""
        else:
            current_desc = block

    return commands


def generate_test_spec(commands: list[dict], output_path: Path):
    """Generate Playwright test spec dari parsed curl commands."""
    lines = [
        "import { test, expect } from '@playwright/test';",
        "",
        "const BASE_URL = process.env.API_BASE_URL || 'https://api.example.com/v1';",
        "const AUTH_TOKEN = process.env.BEARER_TOKEN || '';",
        "",
        "function getHeaders() {",
        "  return {",
        "    'Content-Type': 'application/json',",
        "    ...(AUTH_TOKEN ? { 'Authorization': `Bearer ${AUTH_TOKEN}` } : {}),",
        "  };",
        "}",
        "",
        "test.describe('API Auto-Generated Tests', () => {",
        "",
    ]

    for i, cmd in enumerate(commands, 1):
        method = cmd["method"]
        url = cmd["url"]
        desc = cmd.get("description", f"Endpoint {method} {url}")

        # Generate test name from URL
        url_parts = url.rstrip('/').split('/')
        test_name = f"{method} {'/'.join(url_parts[-2:])}" if len(url_parts) >= 2 else f"{method} {url}"

        lines.append("  test('%d. %s', async ({ request }) => {" % (i, test_name))
        lines.append("    const response = await request.%s('%s', {" % (method.lower(), url))
        lines.append("      headers: getHeaders(),")

        if cmd["body"]:
            lines.append("      data: %s," % cmd['body'])

        lines.append("    });")
        lines.append("")
        lines.append("    expect(response.status()).toBeLessThan(500);")
        lines.append("    const body = await response.json();")
        lines.append("    console.log('Status:', response.status());")
        lines.append("    console.log('Response:', JSON.stringify(body).substring(0, 200));")
        lines.append("  });")
        lines.append("")

    lines.append("});")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text('\n'.join(lines), encoding='utf-8')
    print(f"Test spec dibuat: {output_path}")
    print(f"Total endpoint: {len(commands)}")


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python scripts/parse-curl.py <curl-file> [--output <spec-file>]")
        return 1

    input_file = Path(sys.argv[1])
    output_file = None

    if '--output' in sys.argv:
        idx = sys.argv.index('--output')
        if idx + 1 < len(sys.argv):
            output_file = Path(sys.argv[idx + 1])

    if not input_file.exists():
        print(f"File tidak ditemukan: {input_file}")
        return 1

    commands = parse_file(input_file)
    if not commands:
        print("Tidak ada curl command ditemukan")
        return 1

    print(f"Ditemukan {len(commands)} endpoint:")
    for i, cmd in enumerate(commands, 1):
        print(f"  {i}. {cmd['method']} {cmd['url']}")

    if not output_file:
        output_file = ROOT / "tests" / "api" / "auto-generated.spec.ts"

    generate_test_spec(commands, output_file)
    return 0


if __name__ == "__main__":
    sys.exit(main())
