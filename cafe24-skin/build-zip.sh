#!/usr/bin/env bash
# 카페24 어드민 → 디자인 → 스킨 → 업로드 용 ZIP을 만든다.
# 사용: cafe24-skin 디렉토리 안에서 ./build-zip.sh

set -euo pipefail

cd "$(dirname "$0")"

VERSION="$(date +%Y%m%d-%H%M)"
OUT="geumbit-skin-${VERSION}.zip"

# 출력은 부모 디렉토리에 생성 (cafe24-skin 안에 두면 다음 빌드에 포함되어버림)
TARGET="../${OUT}"

# 빌드 산출물·숨김파일·스크립트 자체를 제외하고 압축
zip -r "${TARGET}" . \
  -x "*.zip" \
  -x ".*" \
  -x "build-zip.sh" \
  -x "README.md" \
  -x "*.DS_Store"

echo
echo "✓ ${TARGET} 생성 완료"
echo "  카페24 어드민 → 디자인(쇼핑몰) → 스킨 관리 → 업로드 에 올리세요."
