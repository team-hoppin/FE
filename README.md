프론트엔드 저장소

## CodeRabbit 한국어 설정 확인

CodeRabbit의 한국어 설정이 잘 적용되는지 확인하려면, 리뷰 포인트가 거의 없는 작은 PR을 하나 만든 뒤 아래 순서대로 확인합니다.

1. `README.md`에 빈 줄 1개 추가처럼 영향 없는 변경을 만든다.
2. 커밋 메시지는 `chore: test coderabbit korean response`를 사용한다.
3. PR 제목은 `chore: CodeRabbit 한국어 설정 확인`으로 작성한다.
4. PR 본문에는 아래 내용을 넣는다.

```md
CodeRabbit 한국어 설정 적용 여부 확인용 PR입니다.
실제 기능 변경은 없고, 봇 응답 언어만 점검합니다.
```

5. PR 댓글에 아래 명령을 순서대로 남긴다.

```text
@coderabbitai configuration
@coderabbitai full review
@coderabbitai 지금 적용된 설정 기준으로 한국어로만 짧게 답변해줘. 현재 리뷰 언어 설정도 함께 알려줘.
```

확인 포인트:

- `configuration` 응답에 `language: ko-KR`와 `tone_instructions`가 보이는지 확인
- 이후 답변과 리뷰 문장이 한국어로 나오는지 확인

기존 PR의 영어 리뷰는 자동으로 한국어로 바뀌지 않을 수 있으므로, 새 PR을 만들거나 기존 PR에 새 커밋을 추가한 뒤 확인합니다.
