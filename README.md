# 이산재혁 블로그

`https://isanbrandon.github.io/`에 배포되는 개인 블로그입니다.

## 구성

- `kimjy99.github.io`의 Minimal Mistakes 스타일을 참고한 프로필·카테고리·글 목록 레이아웃
- 티스토리의 공개 글 77개와 카테고리 구조
- 제목·본문 검색, 카테고리 필터, 페이지 이동
- 각 글의 정적 URL과 Open Graph 메타데이터
- GitHub Pages 자동 배포

## 로컬 실행

```bash
npm ci
npm run dev
```

## 티스토리 내용 갱신

Windows에서는 다음 명령으로 공개 글, 본문 이미지, 첨부 파일을 다시 가져올 수 있습니다.

```powershell
python scripts/import_tistory.py
```

가져오기가 끝나면 변경 내용을 확인하고 `npm run check`로 검증하세요.

## 배포

`main` 브랜치에 변경 사항을 push하면 `.github/workflows/deploy-pages.yml`이 정적 사이트를 빌드해 GitHub Pages에 배포합니다. 저장소의 **Settings → Pages**에서 Source가 **GitHub Actions**로 설정되어 있어야 합니다.
