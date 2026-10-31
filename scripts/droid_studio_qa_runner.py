#!/usr/bin/env python3
"""Evidence-based static inspection gates for DroidUI.

This script does not claim to measure runtime FPS, prove TLS/security settings, or
replace device testing. Missing evidence is reported as FAIL or SKIP, never PASS.
Exit status is non-zero whenever a required repository gate fails.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app"
RESULTS: list[tuple[str, str, str]] = []


def record(name: str, status: str, details: str = "") -> None:
    RESULTS.append((name, status, details))
    suffix = f" — {details}" if details else ""
    print(f"[{status}] {name}{suffix}")


def read_json(path: Path) -> dict[str, Any] | None:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(value, dict):
            raise ValueError("top-level JSON value must be an object")
        return value
    except Exception as exc:
        record(f"Parse {path.relative_to(ROOT)}", "FAIL", str(exc))
        return None


def node_metrics(root: dict[str, Any]) -> tuple[int, int]:
    count = 0
    max_depth = 0
    seen: set[int] = set()

    def visit(node: Any, depth: int) -> None:
        nonlocal count, max_depth
        if not isinstance(node, dict):
            raise ValueError("each node must be an object")
        identity = id(node)
        if identity in seen:
            raise ValueError("cyclic node tree")
        seen.add(identity)
        count += 1
        max_depth = max(max_depth, depth)
        children = node.get("children", [])
        if not isinstance(children, list):
            raise ValueError("node children must be an array")
        for child in children:
            visit(child, depth + 1)
        seen.remove(identity)

    visit(root, 1)
    return count, max_depth


def audit_sample() -> None:
    sample = {
        "id": "root", "type": "Container",
        "children": [
            {"id": "title", "type": "Text", "props": {"text": "Sample"}},
            {"id": "cta", "type": "Button", "props": {"label": "Continue"},
             "accessibility": {"accessibilityLabel": "Continue", "accessibilityRole": "button"}},
        ],
    }
    try:
        count, depth = node_metrics(sample)
        record("QA fixture node/depth budget", "PASS" if count <= 150 and depth <= 6 else "FAIL",
               f"nodes={count}, depth={depth}")
        issues: list[str] = []

        def visit(node: dict[str, Any]) -> None:
            if node.get("type") in {"Button", "Switch", "Slider", "Checkbox"}:
                acc = node.get("accessibility") or {}
                label = acc.get("accessibilityLabel") or (node.get("props") or {}).get("label")
                if not label:
                    issues.append(f"{node.get('id', 'unknown')}: missing accessibility label")
                if not acc.get("accessibilityRole"):
                    issues.append(f"{node.get('id', 'unknown')}: missing accessibility role")
            for child in node.get("children", []):
                visit(child)

        visit(sample)
        record("QA fixture accessibility", "PASS" if not issues else "FAIL",
               "sample interactive controls checked" if not issues else "; ".join(issues))
    except Exception as exc:
        record("QA fixture validation", "FAIL", str(exc))


def main() -> int:
    print("=" * 72)
    print("DROIDUI — REPOSITORY INSPECTION GATES")
    print(f"Repository root: {ROOT}")
    print("=" * 72)

    package = read_json(APP / "package.json")
    expo_config = read_json(APP / "app.json")

    record("App directory exists", "PASS" if APP.is_dir() else "FAIL", str(APP))
    record("Committed npm lockfile", "PASS" if (APP / "package-lock.json").is_file()
           else "FAIL", "app/package-lock.json is required for reproducible npm ci installs")
    record("TypeScript config", "PASS" if (APP / "tsconfig.json").is_file()
           else "FAIL", "app/tsconfig.json must exist for the type-check gate")
    record("Inspection workflow", "PASS" if (ROOT / ".github/workflows/inspection-gates.yml").is_file()
           else "FAIL", ".github/workflows/inspection-gates.yml is required")

    if package:
        version = package.get("version")
        valid_version = isinstance(version, str) and bool(re.fullmatch(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?", version))
        record("App package version is SemVer", "PASS" if valid_version else "FAIL", str(version))
        dependencies = {**package.get("dependencies", {}), **package.get("devDependencies", {})}
        record("Expo dependency declared", "PASS" if "expo" in dependencies else "FAIL")
        record("Image picker dependency declared", "PASS" if "expo-image-picker" in dependencies else "FAIL",
               "required by AssetPickerStudio")
        record("Type-check script declared", "PASS" if package.get("scripts", {}).get("typecheck") else "FAIL")

    if expo_config:
        expo = expo_config.get("expo", {})
        config_version = expo.get("version")
        package_version = package.get("version") if package else None
        record("Expo/package versions match", "PASS" if config_version == package_version else "FAIL",
               f"app.json={config_version!r}, package.json={package_version!r}")
        configured_assets = [
            ("icon", expo.get("icon")),
            ("splash image", (expo.get("splash") or {}).get("image")),
            ("Android adaptive icon", ((expo.get("android") or {}).get("adaptiveIcon") or {}).get("foregroundImage")),
        ]
        for label, relative in configured_assets:
            if not relative:
                record(
                    f"Configured {label}",
                    "SKIP",
                    "No asset path configured; optional in app.json",
                )
                continue

            asset_path = (APP / relative).resolve()
            in_app = asset_path.is_relative_to(APP.resolve())
            exists = in_app and asset_path.is_file()

            record(
                f"Configured {label}",
                "PASS" if exists else "FAIL",
                str(asset_path.relative_to(ROOT.resolve()))
                if asset_path.is_relative_to(ROOT.resolve())
                else "path escapes app directory",
            )

    storage_path = APP / "src/storage/projectStorage.ts"
    if storage_path.is_file():
        source_text = storage_path.read_text(encoding="utf-8")
        invalid_marker = re.search(
            r"^\\s*#\\s+Update index list\\s*$",
            source_text,
            re.MULTILINE,
        )
        record(
            "Project storage TypeScript syntax sentinel",
            "FAIL" if invalid_marker else "PASS",
            "invalid Python-style comment found"
            if invalid_marker
            else "no known invalid comment marker",
        )

    android_gradle = APP / "android/app/build.gradle"
    android_gradle_kts = APP / "android/app/build.gradle.kts"
    manifest = APP / "android/app/src/main/AndroidManifest.xml"
    if not (android_gradle.is_file() or android_gradle_kts.is_file()):
        record("Native Android security settings", "SKIP",
               "native android project not checked in; runtime/device checks are separate")
    else:
        gradle_path = android_gradle if android_gradle.is_file() else android_gradle_kts
        gradle_text = gradle_path.read_text(encoding="utf-8")
        record("Release minification configured",
               "PASS" if re.search(r"minifyEnabled\s*(?:=\s*)?true", gradle_text) else "FAIL",
               str(gradle_path.relative_to(ROOT)))
        if manifest.is_file():
            manifest_text = manifest.read_text(encoding="utf-8")
            record("Manifest cleartext traffic explicitly disabled",
                   "PASS" if re.search(r'usesCleartextTraffic\s*=\s*"false"', manifest_text) else "FAIL",
                   str(manifest.relative_to(ROOT)))
        else:
            record("Android manifest available for inspection", "FAIL", str(manifest.relative_to(ROOT)))

    audit_sample()

    failed = sum(1 for _, status, _ in RESULTS if status == "FAIL")
    passed = sum(1 for _, status, _ in RESULTS if status == "PASS")
    skipped = sum(1 for _, status, _ in RESULTS if status == "SKIP")
    print("\n" + "=" * 72)
    print(f"INSPECTION SUMMARY: {passed} PASS / {failed} FAIL / {skipped} SKIP")
    if failed:
        print("RESULT: BLOCKED — resolve failed required gates before merge/release.")
    else:
        print("RESULT: STATIC GATES PASSED — this is not a substitute for device/runtime tests.")
    print("=" * 72)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
