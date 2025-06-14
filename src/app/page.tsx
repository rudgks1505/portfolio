import styles from "./page.module.css";
import Mainvisual from './mainvisual/mainvisual';

export default function Home() {
  return (
    <>
      <div className={styles.profile_con}>
        <ul>
          <li><b>이름</b><span>송경한 (97년생)</span></li>
          <li><b>학력</b><span>고려사이버대학교 소프트웨어공학과 재학 (2학년)</span></li>
          <li><b>경력</b><span>아이티나인 | 23.06.12 ~ 25.08.12</span></li>
          <li><b>자격증</b><span>SQLD, 웹디자인기능사, GTQ1급, 1종 보통 운전면허</span></li>
          <li style={{marginTop:"30px"}}><b>사용기술</b>
            <ul>
              <li>
                <b>프론트엔드</b> HTML5, CSS3, JavaScript, jQuery, Next.js, Redux Toolkit,<br/>
                Typescript, SWR, AJAX, Axios, Fetch API, Swiper Slider, zod
              </li>
              <li><b>백엔드</b> PHP, REST API, MySQL, PostgreSQL, Supabase</li>
              <li><b>API</b> GPT AI API, Kakao Maps API</li>
              <li><b>CMS</b> 그누보드</li>
            </ul>
          </li>
        </ul>
      </div>
      <Mainvisual></Mainvisual>
    </>
  );
}
