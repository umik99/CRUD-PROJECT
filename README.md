


# KULOG - 일본 여행지 맛집 추천, 리뷰 게시판 (CRUD SERVICE) #

<br>

<img width="800" alt="dns 서버 배포 완료" src="https://github.com/user-attachments/assets/3ea5ee62-f9c9-43c6-a9d0-1df1dfa9830f" />
<img width="800" alt="DNS 서버 배포 - 메인페이지" src="https://github.com/user-attachments/assets/9352bce6-327f-4ebe-8ea0-15d2f462c556" />



![ERD](https://github.com/user-attachments/assets/89c47696-811d-47b5-9180-8bc59d89a37e)


<br>

### 주요기능 ###
- 지역 카테고리 (훗카이도, 관동, 간사이, 규슈) 별 따로 게시판 기능 구현
- 사진 슬라이드, 미리보기 
- 게시글, 댓글 , 저장 (사진파일 업로드)
- 마이페이지 (기본정보 수정, 프로필사진 변경, 회원탈퇴 기능, 내가 작성한 글 보기)
- 회원가입, 로그인 (Google, Kakao 소셜 로그인 포함)
- 북마크 기능 (추가, 조회, 삭제)
- 특정 유저의 게시글 목록 보기
- 1:1 DM 구현 (REST 방식의 채팅창)
- 구글 지도 API로 위치 확인

<br>

## 1. 기본 게시판 기능 (CRUD) ##

<br>

<img width="800" alt="게시글 목록 - 아코디언" src="https://github.com/user-attachments/assets/855b86c5-0a03-447e-814f-cfb36a4eb3c1" />

<br>

- 각 카테고리별 게시판을 따로 board 엔티티에 적용하여 카테고라이징했습니다. 
- 게시글 작성,조회, 수정, 삭제 요청을 통한 기본 CRUD 게시판 기능을 구현했고, 추가적으로 이미지 파일과 Google Maps 위치 정보까지 저장하도록 했습니다.
- board 엔티티와 매핑된 comment 엔티티를 통해 댓글 기능을 구현하였으며, pagination을 통해 read 페이지에서 많은 댓글을 읽어들일 수 있도록 했습니다.
- 댓글 기능 또한 작성 및 삭제가 가능하며, 로그인 상태가 아닐 시 "익명" 사용자로 등록 가능합니다.
- 업로드한 사진파일은 board List 조회 시 아코디언 형식으로 미리보기가 가능하며, 게시글 조회 시에는 슬라이드 형식으로 넘기며 볼 수 있도록 구현했습니다.
- 게시글 목록에서 작성자는 프로필 사진과 닉네임으로 설정되며, 로그인이 된 상태에서는 1:1 채팅이 가능하도록 하였습니다. 해당 유저가 작성한 게시글 목록은 익명 상태에서도 조회할 수 있으며, 1:1 채팅 메뉴 아래의 버튼으로 선택 가능합니다.


## 2. 인증 처리 (로그인, 로그아웃 ) ##

<br>

<img width="800" alt="회원가입" src="https://github.com/user-attachments/assets/8045511b-ccd7-4bf5-a150-d15bd56f4793" />

<br>

<img width="800" alt="로그인 페이지" src="https://github.com/user-attachments/assets/dd42c7b2-af20-4ccb-8de7-c5cac8f85722" />


<br>

- Session 로그인을 바탕으로 Spring Security Context에 등록하는 방식으로 로그인 설정을 구현했습니다.
- User 엔티티를 설정하여 인코딩된 password를 통한 인증 완료 시 세션에 userDTO 를 저장하고, 이를 통해 프론트엔드에서는 유저 로그인 상태 유지 기능을 담당하도록 했습니다.
- 소셜 로그인의 경우도 마찬가지로 Oauth 인증 절차를 거친 후 Security Context에 등록하여 spring 세션에 저장하도록 했습니다.

<br>

## 3. 유저 관련 정보 ##

<br>

<img width="800" alt="마이페이지" src="https://github.com/user-attachments/assets/fedc98d2-09a7-4cec-b3a6-35c5d5dd8a47" />

<br>

<img width="800" alt="프로필사진 변경" src="https://github.com/user-attachments/assets/26576f7a-b459-4626-af17-28320e53c9d8" />

<br>

- 마이페이지에서 비밀번호 및 닉네임 수정이 가능하며, 프로필 사진 설정도 구현했습니다. (기본 프로필 사진 O)
- 설정된 프로필 이미지는 게시글, 댓글, 1:1채팅 등에서 표시됩니다.
- 마이페이지에서 내가 작성한 게시글 목록을 조회 가능합니다.
- 회원 탈퇴 시에는 db에서 바로 삭제처리 하는것이 아닌, isDeleted 속성을 통해 탈퇴한 사용자로 표시되도록 했습니다.

<br>

## 4. 좋아요 및 북마크(저장) 기능 구현 ##

<br>
<img width="800" alt="게시글 읽기" src="https://github.com/user-attachments/assets/c326db9c-f482-4a71-815d-180194503524" />
<br>
<img width="800" alt ="북마크" src ="https://github.com/user-attachments/assets/1f2abba5-b920-4644-88ed-f960048d58e3" />
<br>

- 로그인 완료 시 게시글에 좋아요를 누를 수 있으며, 중복 방지를 위해 같은 게시글에는 한 번만 좋아요를 누를 수 있도록 처리했습니다. 
- boardLikes Entity를 따로 생성하여 각 게시글에 대해 좋아요를 누른 User 를 다대일 관계로 단방향 매핑하여 구현했습니다.
- 북마크의 경우 좋아요 기능과 마찬가지로 작동하며, 따로 bookmark 페이지에서 pagination을 통해 북마크한 글들을 조회가 가능하도록 구현했습니다. 

<br>

## 5. 조회수 및 댓글, 좋아요 관련 기능 ##

<br>

- 세션을 기반으로 로그인을 구현했기 떄문에, 조회수는 Session 별로 증가하도록 했습니다. 
- 댓글과 좋아요 수는 엔티티 매핑을 기반으로 카운트하여 게시판 조회 시 좋아요, 댓글 수가 표시되도록 했습니다.
- 메인 페이지에서는 최근 작성된 게시글과 댓글이 달린 게시글을 따로 조회하여 표시하도록 했습니다.

<br>

## 6. 1:1 쪽지 기능 ##

<br>

<img width="800" alt="채팅창" src="https://github.com/user-attachments/assets/bcc29d56-5dce-479f-98a0-34e57eabc923"/>

<br>

<img width="800" alt="채팅창" src="https://github.com/user-attachments/assets/a68d7de9-6b9e-4edf-b6ed-f8fcdc39ce96"/>

<br>



- REST 방식을 활용하여 1:1 채팅이 가능하도록 구현했습니다. 
- 대화창에서는 상대방을 선택하여 메시지를 보낼 수 있도록 했으며, 메시지를 보낸 시각이 분 단위로 업데이트 됩니다.
- 읽음 / 안읽음을 표시하여 내가 보낸 메시지의 읽음 여부를 확인할 수 있습니다.
- 탈퇴한 사용자의 경우 메시지 기록은 그대로 표시되지만, 더이상 메시지를 주고받을 수 없도록 설정했습니다.


<br>



