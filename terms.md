# 이용약관

휴먼 계정도 개인정보만 삭제

# 비활성화 계정

사용자 개인 정보 및 게시글 등은 남아 있지만 사용자 마이페이지에 정보가 나타나지 않는 상태

following, follower

mute: client 단에서 보여주지 않는 것
hide, mute - 나에게 보여주지 않는것

block: 차단 server 단에서 보여주지 않는 것

archive

## 회원 상태

### 정상

isPrivate === false &&
isSleeping === false &&
blocking\_\_\_Time === null &&
sleepingTime === null &&
creationTime !== null

### 비공개

조건: isPrivate === true

### 휴먼

조건: isSleeping === true || sleepingTime 존재

### 정지

조건: blocking\_\_\_Time 존재

### 탈퇴

조건: creationTime === null || NOT_FOUND

blockingTime 이 존재할 수 있다.

정지된 경우 정지된 기간 동안 탈퇴하면 개인정보만 삭제되고 사용자 식별 정보(oauth_bbaton)는 남겨 놓는다.

이외에는 해당 레코드를 DELETE 삭제한다.
