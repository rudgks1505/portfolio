'use client';

import styles from "./page.module.css";
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className={styles.con}>
        <Link href="#">한라산소주모바일(이벤트)</Link>
        <ul className={styles.con_ul}>
          <span>프로젝트 링크</span>
          <li><Link href="http://www.hallasanlive.co.kr/m/index.php" target="_blank">한라산소주모바일(이벤트)</Link></li>
          <span>프로젝트 개요</span>
          <li>
            그누보드를 기반으로 각 게시판을 용도에 맞게 커스터마이징하였으며, PHP와 jQuery, Swiper.js를 활용해 무한 스크롤 기능을 구현하고,<br />
            특정 게시판에 입력한 날짜를 바탕으로 메인 화면에서 Date Picker 또는 화살표 클릭 시 이미지가 변경되도록 개발했습니다.<br />
            또한 세션 스토리지를 이용해 사용자 상태를 관리하고, 특정 게시판에 입력한 값에 따라 상단 프로필 정보가 동적으로 변경되도록 구현하였습니다.
          </li>
          <span>담당업무</span>
          <li>
            기본 그누보드 기반으로, 프론트엔드(UI 구현), 백엔드(PHP+SQL 처리), 프론트-백엔드 연동(API 처리) 전체를 1인 개발로 수행했습니다.
          </li>

          <span>주요 기능</span>
          <li>
            페이지 진입 전 사용자가 Yes/No 버튼으로 19세 이상 여부를 선택하는 간단한 연령 확인 기능을 구현, 선택 값은 세션 스토리지를 활용하여 유지되도록 처리
            <div>
              <span className={styles.con_ul_marker}></span>
              모달 뒷 배경 어둡게 처리 및 스크롤 비활성화, 세션 스토리지를 확인해 모달 노출 여부를 제어하는 기능 구현,<br />
              관리자가 바로 로그인페이지로 접속하는경우 대비해 예외처리
              <pre><code>
                {
                  `
<script>
function setScreenSize() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", \`\${vh}px\`); //"--vh"라는 속성으로 정의해준다.
};

setScreenSize();
let confirm_ad = sessionStorage.getItem('confirm_ad');

if (confirm_ad != 1){
  $('.confirm_con').css('display','flex');
  $('#menu_cover_area').css({'height':'calc(calc(var(--vh, 1vh)* 100) - 61px)','overflow':'hidden'});
};

$('.confirm_yes').click(()=>{
  $('.confirm_con').fadeOut(500);
  $('#menu_cover_area').css({'height':'auto','overflow':'visible'});
  sessionStorage.setItem('confirm_ad', 1);
});

$('.confirm_no').click(()=>{
    alert('만 19세 미만은 사이트 이용이 불가능합니다.');
});
</script>

<?if(basename($_SERVER["PHP_SELF"]) == 'login.php'){?>
<script>
	$('.confirm_con').css('display','none');
</script>
<?}?>
    `
                }
              </code></pre>
            </div>
          </li>
          {/* 22 */}

          <li>
            게시판에 업로드된 날짜별 이미지와 날짜값을 기반으로, 메인 페이지에서 날짜 선택 시 해당 이미지로 동적으로 변경되는 기능 구현
            <div>
              <span className={styles.con_ul_marker}></span>
              게시판에서 월 값이 한 자리일 경우 0을 붙이느냐 여부에 따라 예상치 못한 오류가 발생하여,<br />
              이를 방지하기 위해 한 자리 월에는 앞에 0을 자동으로 추가하는 처리를 적용함
              <pre><code>
                {
                  `
$('#wr_2').on('focusout',()=>{
    if ($('#wr_2').val() < 10 && $('#wr_2').val().length < 2) {
    $('#wr_2').val('0' + $('#wr_2').val());
    }
});
                                `
                }
              </code></pre>
              이번 달을 기준으로 이미지와 텍스트를 출력하며, 텍스트 클릭 시 Date Picker가 열리도록 구현
              <br />
              Date Picker에서 날짜를 선택하면, 해당 월에 맞춰 이미지와 텍스트가 변경되도록 처리
              <br />
              좌우 화살표 클릭 시 텍스트 월을 기준으로 전월 또는 다음 월로 이동하며, 이미지와 텍스트도 함께 변경
              <br />
              Date Picker를 통해 비정상적인 연도를 입력한 경우, 화살표 클릭 시 자동으로 정상 범위의 월로 복원되도록 예외 처리
              <pre><code>
                {
                  `
PHP (water_ajax.php)
$water_sql = sql_fetch("select * from g4_write_14_1_1_1 where wr_1 = '{$_POST['w_y']}' and wr_2 = '{$_POST['w_m']}'");
$water_img_sql = sql_fetch(
"SELECT *
FROM (
    SELECT * 
    FROM g4_board_file 
    WHERE bo_table = '14_1_1_1'
) AS subquery
WHERE wr_id = '{$water_sql['wr_id']}'"
);

//water.php
$('.w_y').text(year.toString().slice(2, 4));

if (month < 10){
  $('.w_m').text('0'+month.toString());
}else{
  $('.w_m').text(month.toString());		
}

water_f();

$('.waterHead').click(()=>{
  if (waterClick==0){
    $('.waterItem').addClass('on')
    waterClick = 1;
  }else{
    $('.waterItem').removeClass('on')
    waterClick = 0;	
  }
});

$('.w_c').on('focusout', function() {
  setTimeout(() => {
    w_c = $('.w_c').val();
    $('.w_y').text(w_c.split('-')[0].slice(2, 4));  
    $('.w_m').text(w_c.split('-')[1]);
    water_f();
  }, "500");
});

function water_f(){

  if (!$('.w_y').text()){
    $('.w_y').text(year.toString().slice(2, 4));
  }

  $.ajax({
    url: "/m/include/water_ajax.php",
    method : "POST",
    data:{
      w_y : $('.w_y').text(),
      w_m : $('.w_m').text(),
    },
    success: function(data) {
      let w_data = JSON.parse(data);
      $('.water_img').attr('src',\`\${imgSrc}\${w_data}\`);

      if(w_data == null){
        $('.water_img').css('display','none');
        $('.no_img').css('display','block');
      }else{
        $('.water_img').css('display','block');
        $('.no_img').css('display','none');							
      }			
    },
  });		
}

function water_r_f(){
  let r_m = parseInt($('.w_m').text());	
  let r_y = parseInt($('.w_y').text());

  if (r_y >= 40){
    r_y = 0;
  }

  if (r_m == 12){
    r_y += 1;
    r_m = 1;
  }else{
    r_m += 1;
  };

  if (r_m < 10){
    $('.w_m').text('0'+r_m);
  }else{
    $('.w_m').text(r_m);
  }

  if (r_y < 10){
    $('.w_y').text('0'+r_y);
  }else{
    $('.w_y').text(r_y);
  }

  water_f();	
};
                                `
                }
              </code></pre>
            </div>
          </li>
          {/* 33 */}
          <li>
            특정 게시물의 우선순위 지정 및 고정 출력 처리
            <div>
              <span className={styles.con_ul_marker}></span>
              고정출력 체크박스를 선택하면 출력 순서 입력란이 자동으로 활성화되고, 체크 해제 시 입력이 비활성화되도록 처리
              <br />
              입력란은 비어 있을 경우 자동으로 기본값을 입력하도록 focusout 이벤트를 활용해 예외 처리도 함께 적용

              <pre><code>
                {
                  `
<th scope="row" ><label for="wr_1">고정출력</label></th>
<td>
    <input type="checkbox" id="wr_1" name=wr_1 value="1" <?=$write["wr_1"] == 1 ? "checked" : ""?> style='width:20px;height:20px;'/>
</td>

<th scope="row" ><label for="wr_2">출력 순서</label></th>
<td>
<input class='ed' type='number' style="width:99%" name=wr_2 id="wr_2" itemname="출력 순서" value="<?=$write["wr_2"]?>" 
<?=$write["wr_1"] == 1 ? "" : "disabled"?>>
</td>

<script>
	$('#wr_1').change(()=>{
		if ($('#wr_1').is(':checked')){
			$('#wr_2').prop("disabled", false);
			$('#wr_2').val(1);

			$('#wr_2').focusout(()=>{
				if ($('#wr_2').val() == ''){
					$('#wr_2').val(1);
				}
			})
		}else{
			$('#wr_2').prop("disabled", true);
			$('#wr_2').val('');
		}
	})
</script>

                                `
                }
              </code></pre>
            </div>
          </li>
          {/* 44*/}
          <li>
            고정 출력 게시물 속하는 행 순서 조절
            <div>
              <span className={styles.con_ul_marker}></span>
              메인 페이지에 고정 출력되는 5개의 게시판별 게시물이 속하는 행에 대해,<br />
              CSS Flex의 order 속성을 활용하여 관리자 설정에 따라 행의 순서를 조절할 수 있도록 구현
            </div>
          </li>


          {/* 55*/}
          <li>
            뷰페이지에서의 무한스크롤
            <div>
              <span className={styles.con_ul_marker}></span>
              뷰 페이지는 100vh로 설정하여 화면 전체를 차지하도록 구성하였으며, Swiper 슬라이더는 세로 방향으로 작동합니다.
              <br />
              사용자가 특정 위치에 도달하면 다음 아이템을 자동 로드하며, setTimeout,세션스토리지을 활용해 중복 로드 방지 기능을 구현하였습니다.
              <br />
              Swiper가 정상적으로 작동하려면 슬라이더 전체 높이가 100vh를 초과해야 하므로, 각 슬라이더의 최소 높이는 50vh로 설정하였습니다.
              <br />
              또한 SQL 쿼리를 통해 현재 페이지가 마지막 페이지인지 또는 마지막 직전 페이지인지 판별한 뒤, 슬라이더 작동을 보장하기 위해 빈 슬라이더 아이템을 추가합니다.

              <pre><code>
                {
                  `
<?
$infini_date = str_replace('-','.',substr($view['wr_datetime'],0,10));
$bo_table = $_GET['bo_table'];
$sql_first_row = "select * from g4_write_{$bo_table} ORDER BY wr_id + 0 ASC LIMIT 1;";	
$first_row = sql_fetch($sql_first_row);
$sql_second_row = "select * from g4_write_{$bo_table} ORDER BY wr_id + 0 ASC LIMIT 1,2;";
$second_row = sql_fetch($sql_second_row);
?>


<script>
	let swiper_mainvisual;
	let params = new URLSearchParams(window.location.search);
	let url = new URL(window.location.href);
	let wr_id = params.get('wr_id');
	let bo_table = params.get('bo_table');
	let set_confirm = 0;
	let up = 0;
	let blank = 0;
	let monitor_height = 0;

	if ($(window).height() < 1250){
		monitor_height = 1250;
	}else{
		monitor_height = $(window).height();
	};
	
	sessionStorage.setItem('cool_down',0);
	sessionStorage.setItem('before_load',0);

	swiper_f();
	view_ajax();

	$(window).on("popstate", function (event) {
		window.location.href = "/";
	});

	function swiper_f(){
		swiper_mainvisual = new Swiper('.swiper-mainvisual-container1', {
						a11y: true,
						spaceBetween: 0,
						centeredSlides: false,
						autoplay: false,
						direction: 'vertical',
						effect:'slide',
						speed: 500,
						slidesPerView:'auto',
						observer:true,
						simulateTouch: true,
						touchRatio:1,
						on:{
							transitionEnd:function(){
								const rect = $('.swiper-slide:last-child')[0].getBoundingClientRect();
								const rect_first = $('.swiper-slide:first-child')[0].getBoundingClientRect();
								let rect_active_id =  $('.swiper-slide-active .rect_active_id').text();

								set_confirm = 1;
								params.set('wr_id', rect_active_id);
								url.search = params.toString();
								window.history.pushState({}, '', url);	
						
								if (rect.top >= 0 && rect.bottom <= monitor_height) {
									if ( sessionStorage.getItem('cool_down') != 1){
										  up = 0;
										  view_ajax();
									};
								};
								if (rect_first.top >= 0) {
									if ( sessionStorage.getItem('cool_down') != 1){
										  up = 1;
										  view_ajax();									
									};
								};
							},
						},		
					});
	};

	function blank_f(el){
		if ( el == <?=$first_row['wr_id']?> && blank == 0){
			blank = 1;
			swiper_mainvisual.appendSlide("<div class='swiper-slide blank'></div>");											
		};
		if ( el == <?=$second_row['wr_id']?> && blank == 0){
			blank = 1;
			swiper_mainvisual.appendSlide("<div class='swiper-slide blank'></div>");										
		};
	};

	
	function view_ajax(){

		if (set_confirm == 0){
			wr_id = params.get('wr_id');
		}else{
			if (up == 0){
				wr_id = $('.swiper-slide:last-child .rect_active_id').text();
			}else{
				wr_id = $('.swiper-slide:first-child .rect_active_id').text();	
			}
		};

		$('.ajax_loading').css('display','flex');

		$.ajax({
			url: "/m/skin/board/infini_photo_white/view_ajax.php",
			method : "POST",
			data:{
				up : up,
				wr_id : wr_id,
				bo_table : bo_table,
			},
			success: function(data) {

				if (up == 0){
					for (let i = 0; i <JSON.parse(data)['view_html_arr'].length; i++) {
						swiper_mainvisual.appendSlide(JSON.parse(data)['view_html_arr'][i]);
					};
					if (set_confirm != 0 && JSON.parse(data)['view_html_arr'].length != 0) {
						$('.swiper-slide .rect_active_id').each(function () {	
							if ($(this).text() == wr_id) {			
								setTimeout(() => {
										let slide_cal = $('.swiper-slide').length - $(this).closest('.swiper-slide').nextAll().length - 1;						
										swiper_mainvisual.slideTo(slide_cal, 0);
								}, 0);
							};
							blank_f($(this).text());
						});	
					};
					blank_f(params.get('wr_id'));

				}else{
					for (let i = 0; i <JSON.parse(data)['view_html_arr'].length; i++) {
						swiper_mainvisual.prependSlide(JSON.parse(data)['view_html_arr'][i]);
					};
					$('.swiper-slide .rect_active_id').each(function () {	
						if ($(this).text() == wr_id) {
							setTimeout(() => {							
									swiper_mainvisual.slideTo($(this).closest('.swiper-slide').prevAll().length, 0);
							}, 0);
						};			
					});		
				};

				sessionStorage.setItem('cool_down',1);
				setTimeout(() => {
				  sessionStorage.setItem('cool_down',0);
				}, "1000");

				$('.nBtn3').each(function () {
					let token = $(this).attr('href').replace('TOKEN!','<?=$token?>');
					$(this).attr('href',token);
				});
				
				if(JSON.parse(data)['view_html_arr'].length == 0){
					$('.ajax_loading').fadeOut();
				}else{
					$('.viewBox > img').on('load', function () {
						setTimeout(() => {						
							$('.ajax_loading').fadeOut();
						}, "100");
					});						
				};

				
			},
			error: function(xhr, status, error) {
			},
		});
	};

</script>
    `
                }
              </code></pre>
            </div>
          </li>

          {/* 44*/}
          <li>
            뷰페이지에서의 삭제 및 수정
            <div>
              <span className={styles.con_ul_marker}></span>
              기본 그누보드 게시판의 뷰 페이지에서 수정 및 삭제 기능은 URL 파라미터를 기반으로 동작합니다.
              <br />
              이에 따라 백엔드에서는 각 게시물에 wr_id 태그를 부여하고, 프론트엔드에서는 해당 값을 URL에 포함시켜 수정 및 삭제 요청에 활용합니다.
              <br />
              또한 삭제 요청 시에는 임시 구분용으로 !TOKEN이라는 문자열을 백엔드에서 추가하고,
              <br />
              프론트엔드에서는 이를 감지한 후 실제 PHP에서 사용하는 토큰 정보로 치환하여 요청을 처리합니다.

              <pre><code>
                {
                  `
$bo_table = $_POST['bo_table'];
$json_arr = [];
$view_html = '';
$view_html_arr= [];
$wr_id = $_POST['wr_id'];
$sql_admin = "select * from g4_board_file where bo_table = '10_1_1_1'";	
$admin_profile = sql_fetch($sql_admin);
$up = $_POST['up'];

if($up == 0){
  $result = sql_query("SELECT *
  FROM g4_write_{$bo_table}
  WHERE wr_id < '{$wr_id}'
  ORDER BY wr_id DESC
  LIMIT 10;");
}else{
  $result = sql_query("SELECT *
  FROM g4_write_{$bo_table}
  WHERE wr_id > '{$wr_id}'
  ORDER BY wr_id ASC
  LIMIT 10;");
};

for ($i=0; $row = sql_fetch_array($result); $i++){

  $view[$i] = get_view($row, $board, $board_skin_path, 255);
  $infini_date = str_replace('-','.',substr($view[$i]['wr_datetime'],0,10));

  //생략-----
  
  $view_html = ""
  . "<div class='swiper-slide'>"
  . "    <div id='writeContents'>"
  . "        <div class='viewBox'>"
  . "        {$view[$i]['file'][0]['view']}"
  . "            <div>"
  . "                <div class='view_rbox'>"
  . "                    <div>"
  . "                        {$view[$i]['content']}"
  . "                    </div>"
  . "                    <p class='view_rbox_hit'>{$infini_date}<span class='rect_active_id'>{$view[$i]['wr_id']}</span></p>"
  . "                </div>"
  . "               <div class='link_buttons' >"
  . "	                <a href='./delete.php?bo_table={$bo_table}&wr_id={$view[$i]['wr_id']}&token=TOKEN!&page=' class='nBtn nBtn3' onclick='return confirm(\`삭제하시겠습니까?\`)'>삭제하기</a>"
  . "				          <a href='./write.php?w=u&amp;bo_table={$bo_table}&amp;wr_id={$view[$i]['wr_id']}&amp;page=' class='nBtn nBtn2'>수정하기</a>"
  . "				          <a href='./write.php?bo_table={$bo_table}' class='nBtn nBtn2'>글쓰기</a>"
  . "               </div>"
  . "            </div>"
  . "        </div>"
  . "    </div>";
      
  $view_html_arr[$i] = $view_html;

};

$json_arr['view_html_arr'] = $view_html_arr;
    `
                }
              </code></pre>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
