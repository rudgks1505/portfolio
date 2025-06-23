'use client';

import Link from 'next/link';
import styles from "./page.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Scrollbar, Navigation } from 'swiper/modules'
import Woori from '../detail/woori';
import Halasan from '../detail/hallasan';
import Baro from '../detail/baro';
import Other from '../detail/other';
import Mil from '../detail/mil';
import { useRef, useState, useEffect } from 'react';

export default function Page() {

    const [detail_n, detail_n_f] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = () => {
    if (!swiperRef.current) return;
    setActiveIndex(swiperRef.current.realIndex);
    setIsEnd(swiperRef.current.isEnd);
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) {
      swiper.on('slideChange', handleSlideChange);
      // 초기 상태도 반영
      setIsEnd(swiper.isEnd);
      setActiveIndex(swiper.realIndex);
    }
  }, []);

    return (
        <>
            {detail_n == 1 &&
                <div className={styles.compo_wrap}>
                    <div className={styles.compo_bak} onClick={() => { detail_n_f(0) }}></div>
                    <Woori></Woori>
                </div>
            }
            {detail_n == 2 &&
                <div className={styles.compo_wrap}>
                    <div className={styles.compo_bak} onClick={() => { detail_n_f(0) }}></div>
                    <Halasan></Halasan>
                </div>
            }
            {detail_n == 3 &&
                <div className={styles.compo_wrap}>
                    <div className={styles.compo_bak} onClick={() => { detail_n_f(0) }}></div>
                    <Baro></Baro>
                </div>
            }
            {detail_n == 4 &&
                <div className={styles.compo_wrap}>
                    <div className={styles.compo_bak} onClick={() => { detail_n_f(0) }}></div>
                    <Other></Other>
                </div>
            }
            {detail_n == 5 &&
                <div className={styles.compo_wrap}>
                    <div className={styles.compo_bak} onClick={() => { detail_n_f(0) }}></div>
                    <Mil></Mil>
                </div>
            }



            <div className={styles.con}>
                <div>
                    <p>PORTFOLIO</p>
                    <div className={styles.con_btn_div}>
                        <button onClick={() => swiperRef.current?.slidePrev()} 
                        style={{
                            opacity: activeIndex === 0 ? 0.4 : 1,
                            pointerEvents: activeIndex === 0 ? 'none' : 'auto'
                        }}>이전</button>
                        <button onClick={() => swiperRef.current?.slideNext()}
                        style={{
                            opacity: isEnd ? 0.4 : 1,
                            pointerEvents: isEnd  ? 'none' : 'auto'
                        }}>다음</button>
                    </div>
                </div>

                <Swiper
                    spaceBetween={50}
                    slidesPerView="auto"
                    className={styles.swiper}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    modules={[Scrollbar, Navigation]}
                    scrollbar={{ draggable: true }}
                >
                    <SwiperSlide className={styles.swiperslide}>
                        <Link href="#" onClick={() => { detail_n_f(5) }}>Ai 밀리의서재</Link>
                        <ul>
                            <li>사용자 인증 및 권한 관리</li>
                            <li>네비게이션 및 클라이언트 구조</li>
                            <li>AI 기반 소설 생성 기능</li>
                            <li>메인 슬라이더 UI 구성</li>
                            <li>도서 상세 페이지</li>
                            <li>관리자 기능</li>
                        </ul>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperslide}>
                        <p>2024.03 - 2025.04</p>
                        <Link href="#" onClick={() => { detail_n_f(3) }}>바로컴퍼니</Link>
                        <ul>
                            <li>그누보드, PHP, jQuery, MySQL을 활용한<br />웹사이트 커스터마이징</li>
                            <li>기본 쇼핑몰 기능은 그대로 유지하면서,<br/>사용자가 구매 버튼을 클릭하면 해당 내역이<br/>게시글로 자동 등록.</li>
                            <li>장바구니에서 구매 버튼 클릭 시,<br/>주문 정보가 자동으로 게시글로 등록되도록 처리</li>
                            <li>게시글 등록 기반으로 주문 조회 기능 구현</li>
                            <li>카테고리에 따라 프론트엔드에서 아이템을 출력하고,<br/>백엔드에서는 필터링된 데이터 제공</li>
                        </ul>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperslide}>
                        <p>2025.02 - 2025.03</p>
                        <Link href="#" onClick={() => { detail_n_f(1) }}>우리동네학원</Link>
                        <ul>
                            <li>그누보드, PHP, jQuery, MySQL, KakaoMap api<br />을 활용한 웹사이트 커스터마이징</li>
                            <li>과목 및 지역(상위/하위) 필터 기능 구현<br />선택값에 따라 게시글 태그 동적 변경 및<br />KakaoMap 위치 갱신</li>
                            <li>과목 및 지역(상위/하위) 선택 시,<br />SQL 조건 분기 및 태그 조합을 통해 관련 게시글을<br />필터링하여 JSON으로 응답</li>
                            <li>클라이언트 요청에 따라 하위 지역 지도 연동은<br />제외하고 유지보수 효율성 고려하여 설계</li>
                            <li>카카오맵 마커에 게시글 제목 표시 기능 구현</li>
                            <li>관리자 주소 입력 시 실시간으로 카카오맵 연동<br />가능 여부를 확인할 수 있는 UI 구현</li>
                            <li>관리자가 지정한 회원 아이디에 한해 특정 게시물<br />내용 작성 기능 구현</li>
                            <li>관리자가 지정한 회원 글 작성 요청 시 사용자 아이디를 검증하고, 지정된 회원에 대해서만 게시글 작성</li>
                        </ul>
                    </SwiperSlide>
                    <SwiperSlide className={styles.swiperslide}>
                        <p>2024.12 - 2025.01</p>
                        <Link href="#" onClick={() => { detail_n_f(2) }}>한라산소주 (이벤트)</Link>
                        <ul>
                            <li>그누보드, PHP, jQuery, MySQL을 활용한<br />웹사이트 커스터마이징</li>
                            <li>게시판 뷰를 인스타그램 스타일로 변경하고,<br />뷰 및 리스트에 무한스크롤 기능 추가</li>
                            <li>메인 페이지의 수질검사 탭 클릭 시,<br />업체가 업로드한 이미지로 동적으로 변경되도록 구현</li>
                            <li>메뉴 슬라이더를 관리자 입력값에 따라<br />순서 및 링크가 조작되도록 구성</li>
                            <li>메인 상단의 프로필 영역을 관리자가<br />직접 작성 및 수정할 수 있도록 개발</li>
                            <li>메인 사진들을 관리자 페이지에서 순서 조작 가능하<br />도록 설정, 각 행별 콘텐츠 순서도 조절 가능하게 작업</li>
                            <li>공지사항 게시판 글 헤더 구현</li>
                            <li>19세 이상 확인 팝업 구현 및<br />세션스토리지로 재확인 방지 처리</li>
                        </ul>
                    </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                        <Link href="#" onClick={() => { detail_n_f(4) }}>기존 사이트에 제가 작성한 코드<br/>일부만 적용한 사례입니다.</Link>
                        <ul>
                            <li>메인페이지 영상기능 추가</li>
                            <li>달력,남은시간 기능 추가</li>
                        </ul>
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
}
