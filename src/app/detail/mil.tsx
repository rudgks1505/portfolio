'use client';

import styles from "./page.module.css";
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className={styles.con}>
        <Link href="#">GPT 밀리의 서재</Link>
        <ul className={styles.con_ul}>
          <span>프로젝트 링크</span>
          <li><Link href="#" target="_blank">GPT 밀리의 서재</Link></li>
          <span>프로젝트 개요</span>
          <li>
            본 프로젝트는 인공지능이 직접 생성한 소설 콘텐츠를 기반으로<br />
            사용자에게 새로운 독서 및 상호작용 경험을 제공하는 웹 서비스입니다. <br />
            AI가 생성한 방대한 데이터를 효율적으로 관리하고 사용자에게 반응형 UI/UX를 제공하고자 기획되었습니다.
          </li>
          <span>기술 스택</span>
          <li className={styles.div_nopadding}>
            <p>프론트엔드 : HTML5, CSS3, JavaScript, Next.js, TypeScript, Redux Toolkit, Typescript, SWR, Fetch API, Swiper Slider, zod</p>
            <p>백엔드 : PostgreSQL, Supabase (PostgreSQL, Auth/인증, Storage)</p>
            <p>API : GPT AI API, Kakao Maps API</p>
          </li>
          <span>담당업무</span>
          <li>
            프론트엔드(UI 구현), 백엔드(PHP+SQL 처리), 프론트-백엔드 연동(API 처리) 전체를 1인 개발로 수행했습니다.
          </li>
          <span>주요기능</span>
          <li>
            사용자 인증 및 권한 관리
            <div>
              <p>
                - Supabase Auth 기반 회원가입, 로그인, 비밀번호 재설정<br />
                - JWT 기반 인증으로 클라이언트-서버 세션 관리<br />
                - 로그인 상태 판별 및 관리자 권한 체크<br />
                - 자동 로그아웃 및 로그아웃 기능 구현<br />
                - Redux로 권한 상태 관리 및 UI 반영<br />
                - 로그인 상태에 따라 조건부 UI 렌더링
              </p>
            </div>
          </li>

          <li>
            네비게이션 및 클라이언트 구조
            <div>
              <p>
                - 클라이언트 전용 Nav 컴포넌트를 use client로 분리<br />
                - 서버 컴포넌트 레이아웃에서 클라이언트 컴포넌트 포함<br />
                - 로그인/로그아웃 및 관리자 메뉴 조건부 출력
              </p>
            </div>
          </li>

          <li>
            AI 기반 소설 생성 기능
            <div>
              <p>
                - GPT-3.5-turbo를 활용한 소설 제목, 작가, 챕터 요약 자동 생성<br />
                - 챕터별 1,000자 이상의 상세 본문 생성 및 DB 저장<br />
                - (설계) DALL·E API로 커버 이미지 생성 후 Supabase Storage에 업로드
              </p>
            </div>
          </li>

          <li>
            메인 슬라이더 UI 구성
            <div>
              <p>
                - mainvisual 테이블에서 슬라이더용 도서 데이터 조회<br />
                - Swiper로 자동 전환되는 메인 비주얼 구현<br />
                - 슬라이드 이동 시 책 링크와 이미지 동적 반영<br />
                - 배경 색상과 커버 이미지 동적으로 렌더링
              </p>
            </div>
          </li>

          <li>
            도서 상세 페이지
            <div>
              <p>
                - /api/detail에 book_id 전달하여 상세 데이터 조회<br />
                - 책 표지, 제목, 요약, 출간일 등 메타 정보 출력<br />
                - 챕터 요약을 Swiper 슬라이드로 구성
              </p>
            </div>
          </li>

          <li>
            관리자 기능
            <div>
              <p>
                - 회원 전체 조회(GET), 특정 필드 수정(PATCH) API 구현<br />
                - 이메일 기반 회원 조회 API(POST)<br />
                - 관리자 페이지에서 권한 수정 등 관리 기능 제공
              </p>
            </div>
          </li>
        </ul>
      </div >
    </>
  )
}