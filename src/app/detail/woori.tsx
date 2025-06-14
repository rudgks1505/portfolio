'use client';

import styles from "./page.module.css";
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <>
      <div className={styles.con}>
        <Link href="#">우리동네학원</Link>
        <ul className={styles.con_ul}>
          <span>프로젝트 링크</span>
          <li><Link href="http://weschool.1945.co.kr/index.php" target="_blank">우리동네학원pc</Link></li>
          <li><Link href="http://weschool.1945.co.kr/m/index.php" target="_blank">우리동네학원m</Link></li>

          <span>프로젝트 개요</span>
          <li>
            그누보드를 기반으로 학원 정보 등록 게시판을 커스터마이징하고,
            PHP, jQuery, MySQL, Swiper.js을 활용하여 Kakao Maps API와 연동하였습니다.
          </li>

          <span>담당업무</span>
          <li>
            기본 그누보드 기반으로, 프론트엔드(UI 구현), 백엔드(PHP+SQL 처리), 프론트-백엔드 연동(API 처리) 전체를 1인 개발로 수행했습니다.
          </li>

          <span>주요 기능</span>
          <li>
            그누보드 기본 게시판을 활용하여 학원정보, 주소, 분류정보 등을 입력할 수 있도록 필드 구성<br />
            <div>
              <span className={styles.con_ul_marker}></span>
              클라이언트 요구에 따라 대분류(과목) 선택 시 중분류(상위 지역), 소분류(하위 지역)가 순차적으로 표시되도록 구현하였습니다.<br />
              이를 위해 대분류, 중분류, 소분류는 모두 필수 입력 항목으로 지정하였습니다.<br />

              또한 Kakao Maps API에서 정확한 좌표를 얻기 위해 도로명 주소와 건물번호 입력을 필수화하였으며,  <br />
              게시글 작성 시 주소가 불완전할 경우 지도가 표시되지 않는 문제를 방지하기 위해 `blur` 이벤트로 실시간 검증을 수행했으며,<br />
              입력값이 올바르지 않을 경우 텍스트 메시지와 색상 변경을 통해 사용자에게 오류 여부를 직관적으로 안내하도록 구현했습니다.<br />

              예를 들어 `경남 창원시 마산합포구` 대신 `경남 마산합포구`처럼 정확하지 않으면 뷰페이지에서 에러가 발생하기 때문에,<br />
              주소 입력을 직접 타이핑 방식이 아닌, 정의해둔 데이터 바탕으로 select 요소로 선택하도록 설계했습니다.<br />
              또한 각 단계에서 입력값이 사전 정의된 지역 데이터와 일치하는지 확인한 뒤, 최종적으로 Kakao Maps API로 검사하였습니다.

              <pre><code>
                {
                  `
$(document).on("change", \`.region1_select\`, function(event){
    $('.region2_select').empty();
    for (let i = 0; i < korea[$(this).val()].length; i++) {
        $('.region2_select').append(\`<option value='\${korea[$(this).val()][i]}'>\${korea[$(this).val()][i]}</option>\`);
    };
});

const target_check_f = (inp,inp_s)=>{

if(!korea[inp]){
  false_f();
  return false;
};
if($.inArray(inp_s,korea[inp]) == -1){
  false_f();
  return false;			
};	
geo_f();
};

$('#wr_4').blur((event)=>{
  inp_ss = event.target.value;
  target_check_f(inp,inp_s);		
});

const geo_f = ()=>{
  let geocoder = new kakao.maps.services.Geocoder();	

  geocoder.addressSearch(\`\${inp_s} \${inp_ss}\`, function(result, status) {
    if (status === kakao.maps.services.Status.OK && result.length > 0) {
      let roadAddr = result[0].road_address ? result[0].road_address.main_building_no : null;//건물번호 없어도 가기에 건물번호 여부 확인.
      if(!roadAddr){
        $('.address_check_span').css('color','red');
        $('.address_check_span').text('도로명+건물번호 확인해주세요');					
      }else{
        true_f();					
      };
    }else{
      false_f();
    };
  });		
};
    `}
              </code></pre>
            </div>
          </li>
          {/* 22 */}

          <li>
            분류클릭 정보에 따른 리스트 api요청 <br />
            <div>
              <span className={styles.con_ul_marker}></span>
              상위지역, 하위지역 조합에 따라 200개 이상의 지역이 나올 수 있기에,<br />
              클릭할 때마다 페이지 전체를 새로고침하는 방식은 성능 저하가 우려되었습니다.<br />
              리스트 API로 비동기 요청하여 교체하는 구조로 구현했습니다.<br />
              첫 대분류 클릭 시 지도는 전국을 기준으로 출력되며,<br />
              이후 탭값에 따라 어떤 데이터를 서버에 요청할지 분기되도록 처리했습니다.<br />
              서버는 PHP에서 조건에 따라 SQL을 실행해 JSON 형식으로 리스트 HTML을 반환합니다.
              <pre>
                <code>
                  {`\`\`
const header_get = (event, cate1) => {
  cate1_str = cate1;

  if (get_click === 0) {
    $('.cate_con').stop().slideDown(400, () => {
      map_resize_f();
    });
    get_click = 1;
  } else if (get_click === 1 && event.target.parentElement.classList.contains('on')) {
    $('.cate_con').stop().slideUp(400);
    get_click = 0;
    $(event.target.parentElement).removeClass('on');

    $.get("/res/include/con1_ajax.php", (res) => {
      const get_data = JSON.parse(res);
      for (let i = 0; i < 9; i++) {
        $('.con1_ul > li').eq(i).replaceWith(get_data['html_arr'][i]);
      }
    });
  }

  if (get_click === 1) {
    $('#Menu > li').filter('.on').removeClass('on');
    if (event) {
      $(event.target.parentElement).addClass('on');
    } else {
      $('#Menu li').each(function () {
        if ($(this).children().text() === cate1_str) {
          $(this).addClass('on');
        }
      });
    }

    $.get("/res/include/con1_ajax.php", {
      cate1: cate1_str,
      cate2: cate2_str,
      cate3: cate3_str
    }, (res) => {
      const get_data = JSON.parse(res);
      for (let i = 0; i < 9; i++) {
        $('.con1_ul > li').eq(i).replaceWith(get_data['html_arr'][i]);
      }
    });
  }
};

//게시글 작성 시 "공지" 체크박스를 선택하면, 해당 게시물은 목록에서 가장 먼저 출력되도록 처리됩니다.
<td>
<input type="checkbox" name="wr_19" id="wr_19" itemname="공지" value="1" <?=$write["wr_19"] == 1 ? "checked" : ""?>'/>
</td>

// PHP (con1_ajax.php)

if(\$_GET['cate1'] != '' && \$_GET['cate2'] == '전국'){
	\$result = sql_query(\"SELECT * FROM \\\`g4_write_10_1_1_1\\\` where wr_1 = '\{\$_GET['cate1']\}' and wr_is_comment = 0 order by wr_19 DESC, wr_7 asc limit 9\");
}else if(\$_GET['cate2'] != '전국' && \$_GET['cate3'] == ''){
	\$result = sql_query(\"SELECT * FROM \\\`g4_write_10_1_1_1\\\` where wr_1 = '\{\$_GET['cate1']\}' and wr_2 = '\{\$_GET['cate2']\}' and wr_is_comment = 0 order by wr_19 DESC,  wr_7 asc limit 9\");
}else if(\$_GET['cate3']){
	\$result = sql_query(\"SELECT * FROM \\\`g4_write_10_1_1_1\\\` where wr_1 = '\{\$_GET['cate1']\}' and wr_2 = '\{\$_GET['cate2']\}' and wr_3 = '\{\$_GET['cate3']\}' and wr_is_comment = 0 order by wr_19 DESC, wr_7 asc limit 9\");
};

if(\$_GET['cate1'] == '') 
	\$result = sql_query(\"SELECT * FROM \\\`g4_write_10_1_1_1\\\` where wr_is_comment = 0 order by wr_19 DESC, wr_id desc limit 9\");


// 중분류 탭 페이지
$(function () {
  const keys = Object.keys(korea);
  for (let i = 0; i < 3; i++) {
    $('.cate_table').append('<tr></tr>');
    for (let j = 6 * i; j < 6 * (i + 1); j++) {
      $('.cate_table tr').eq(i).append(\`<td><button onclick="cate_get(event,'\${keys[j]}');">\${keys[j]}</button></td>\`);
    }
  }
  $('.cate_table tr td').each(function () {
    if ($(this).children().text() === cate2_str) $(this).addClass('on');
  });
});

const cate_get = (event, cate2) => {
  cate2_str = cate2;
  cate3_str = '';
  map_resize_f();

  $('.cate_table td').filter('.on').removeClass('on');
  $(event.target.parentElement).addClass('on');
  set_arr(event.target.innerText);

  $.get("/res/include/con1_ajax.php", { cate1: cate1_str, cate2: cate2 }, (res) => {
    const get_data = JSON.parse(res);
    for (let i = 0; i < 9; i++) {
      $('.con1_ul > li').eq(i).replaceWith(get_data['html_arr'][i]);
    }
  });
};

const set_arr = (data, data2) => {
  $('.cate_ul').empty();
  $('.cate_ul').append(\`<li class='on'><button>전체</button></li>\`);
  if (data !== '세종') {
    for (let i = 0; i < korea[data].length; i++) {
      $('.cate_ul').append(\`<li><button>\${korea[data][i]}</button></li>\`);
    }
  }
  if (data2 === 'no_target') {
    $('.cate_ul li').each(function () {
      if ($(this).children().text() === cate3_str) $(this).addClass('on');
    });
  }
  korea_f();
};

const korea_f = () => {
  $(document).off('click');

  for (let i = 0; i < $('.cate_ul > li').length; i++) {
    $(document).on('click', \`.cate_ul > li:nth-of-type(\${i + 1}) > button\`, function (event) {
      $('.cate_ul > li').removeClass('on');
      \`.cate_ul > li:nth-of-type(\${i + 1})\`.addClass('on');

      cate3_str = (i === 0) ? '' : event.target.innerText;

      $.get("/res/include/con1_ajax.php", {
        cate1: cate1_str,
        cate2: cate2_str,
        cate3: cate3_str
      }, (res) => {
        const get_data = JSON.parse(res);
        for (let i = 0; i < 9; i++) {
          $('.con1_ul > li').eq(i).replaceWith(get_data['html_arr'][i]);
        }
      });
    });
  }
};
\`\``}
                </code>
              </pre>
            </div>
          </li>
          {/* 33 */}
          <li>
            분류클릭 정보에 따른 카카오맵변경 <br />
            <div>
              <span className={styles.con_ul_marker}></span>
              중분류(예: 전국, 부산, 강원 등)는 지도에서 상위 지역으로 간주되므로,<br />
              디자인한 가로세로 비율과 시각적으로 보기 좋은 구성을 고려해 중심 좌표와 확대 수준을 조정해야 했습니다.<br />
              또한 소분류(하위 지역)까지 Kakao Maps의 map.setLevel, maps.LatLng을 모두 설정하는 경우, 200개가 넘는 지역을 일일이 대응해야 하고,<br />
              클라이언트로부터 지속적으로 지도 위치 조정 요청이 들어올 가능성이 있어 유지보수가 매우 어려워질 수 있다고 판단했습니다.<br />
              따라서 지도 위치 지정은 중분류까지만 설정하는 것으로 제한하였습니다.
              <pre><code>{`
const map_resize_f = () => {
  let newCenter;

  if (cate2_str === '전국') {
    newCenter = new kakao.maps.LatLng(35.4154, 127.8735);
    map.setLevel(13);
  }

  if (cate2_str === '서울') {
    newCenter = new kakao.maps.LatLng(37.5665, 126.9780);
    map.setLevel(9);
  }

  // ...생략

  map.relayout();
  map.setCenter(newCenter);
  lat_get_f();
};

const lat_get_f = () => {
  position_lat = [];
  position_long = [];

  $.get("/res/include/kakao_map_ajax.php", { cate: \`\${cate1_str}\`, region: \`\${cate2_str}\` }, (res) => {
    const get_data = JSON.parse(res);
    let geocoder = new kakao.maps.services.Geocoder();

    if (get_data['region_s'].length !== 0) {
      for (let i = 0; i < get_data['region_s'].length; i++) {
        geocoder.addressSearch(\`\${get_data['region_s'][i]} \${get_data['region_ss'][i]}\`, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            title_arr[i] = get_data['title_arr'][i];
            position_lat[i] = result[0].y;
            position_long[i] = result[0].x;
            map_maker_f();
          } else {
            console.log('위도,경도 좌표 에러');
          }
        });
      }
    } else {
      map_maker_f();
    }
  });
};

const map_maker_f = () => {
  let markerPosition;

  if (markers.length > 0) {

    // 단순히 배열을 비우는 것만으로는 기존 마커가 지워지지 않기 때문에
    // setMap(null)로 지도에서 먼저 제거한 후 배열을 초기화함

    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
      info_window_arr[i].setMap(null);
    }
    markers = [];
    info_window_arr = [];
  }

  const close_arr = [];

  for (let i = 0; i < position_lat.length; i++) {
    markerPosition = new kakao.maps.LatLng(position_lat[i], position_long[i]);

    const imageSrc = "/res/images/kakao_map/mark.png";
    const imageSize = new kakao.maps.Size(27, 27);
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    marker.setMap(map);
    markers.push(marker);
    close_arr.push(1);

    const info_window = new kakao.maps.CustomOverlay({
      position: markerPosition,
      content: \`<h1 style='font-size:15px;background:#fff;padding:5px;border:1px solid #000;'>\${title_arr[i]}</h1>\`,
      yAnchor: 1.8,
    });

    info_window.setMap(map);
    info_window_arr.push(info_window);

    kakao.maps.event.addListener(markers[i], 'click', () => {
      if (close_arr[i] === 0) {
        info_window_arr[i].setMap(map);
        close_arr[i] = 1;
      } else {
        info_window_arr[i].setMap(null);
        close_arr[i] = 0;
      }
    });
  }
};

// PHP (kakao_map_ajax.php)
if ($_GET['region'] == '전국') {
  $result = sql_query("SELECT wr_3, wr_4, wr_7 FROM \`g4_write_10_1_1_1\` WHERE wr_1 = '{\$_GET['cate']}' LIMIT 9");
} else {
  $result = sql_query("SELECT wr_3, wr_4, wr_7 FROM \`g4_write_10_1_1_1\` WHERE wr_1 = '{\$_GET['cate']}' AND wr_2 = '{\$_GET['region']}' LIMIT 9");
}
`}</code></pre>


            </div>
          </li>

          {/* 44 */}
          <li>
            모바일 디자인 고려<br />
            <div>
              <span className={styles.con_ul_marker}></span>
              반응형이 아닌 적응형 방식을 사용하는 회사였기 때문에 큰 문제는 없었지만,<br />
              PC와는 구조적으로 다른 모바일 디자인 이슈를 해결해야 했습니다.<br />

              PC 환경에서는 중분류와 소분류가 서로 다른 레이아웃에 위치하여 충돌이 없었지만,<br />
              모바일에서는 하나의 레이아웃 내에서 중분류 클릭 시 소분류를 동적으로 교체해야 했습니다.<br />
              또한 소분류 항목이 10개 이상일 경우 한 화면에 모두 담기 어려워지므로,<br />
              이를 해결하기 위해 Swiper 슬라이더를 활용한 수평 스크롤 방식으로 대응하였습니다.

              <pre><code>{`
const set_arr = (data) => {
  swiper_mainvisual_cate.removeAllSlides();

  for(let i = 0; i < Math.floor(korea[data].length / 10) + 1; i++){	
    swiper_mainvisual_cate.appendSlide("<div class='swiper-slide'><ul class='cate_ul'></ul></div>");

    //0,9,19,...배열끝인덱스
    let j_start = i == 0 ? 0 : i == 1 ? 9 : (10 * i) - 1;
    let j_end = i == Math.floor(korea[data].length / 10) ? (10 * i) + (korea[data].length % 10) : i == 0 ? 9 : (10 * i) + 9;

    for(let j = j_start; j < j_end; j++){
      if(j == 0){
        $('.cate_ul').eq(0).append(\`<li class='on'><button>전체</button></li>\`);
        $('.cate_ul').eq(0).append(\`<li><button>\${korea[data][0]}</button></li>\`);
      }else{
        $('.cate_ul').eq(i).append(\`<li><button>\${korea[data][j]}</button></li>\`);
      };
    };		
  };
  korea_f();
};
`}</code></pre>

              모바일에서는 사용자가 페이지 하단 정보를 확인하기 위해 화면을 스크롤할 때,<br />
              지도가 의도치 않게 드래그되는 현상이 발생할 수 있습니다.<br />
              이를 방지하기 위해 .map_dark 요소를 통해 지도 드래그를 막고,<br />
              사용자가 지도 상호작용을 원하는 경우에만 활성화할 수 있도록 별도 버튼을 구성했습니다.

              <pre><code>{`
$('.view_drag').click(()=>{
		if(view_drag_click == 0){
			view_drag_click = 1;
			$('.map_dark').css('display','none');
			map.setDraggable(true);
			$('.map_dark').off("touchstart click");
		}else{
			view_drag_click = 0;
			map.setDraggable(false);
			$('.map_dark').css('display','block');
			map_touch_f();
		};
});
`}</code></pre>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
