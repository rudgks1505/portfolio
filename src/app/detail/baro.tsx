'use client';

import styles from "./page.module.css";
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className={styles.con}>
        <Link href="#">바로컴퍼니</Link>
        <ul className={styles.con_ul}>
          <span>프로젝트 링크</span>
          <li><Link href="http://barocompany.1945.co.kr/index.php" target="_blank">바로컴퍼니 pc</Link></li>
          <li><Link href="http://barocompany.1945.co.kr/m/index.php" target="_blank">바로컴퍼니 m</Link></li>
          <span>프로젝트 개요</span>
          <li>
            그누보드 쇼핑몰을 기반으로 커스터마이징하였으며,
            클라이언트의 “간편하고 빠르게 주문 내용을 게시글로 확인할 수 있게 해달라”는 요청에 따라,<br/>
            뷰 페이지에서 구매 버튼 클릭 시 자동으로 게시글이 생성되도록 구현하였습니다.<br/>
            <div>
              <span className={styles.con_ul_marker}></span>
회사 내부에서 제공하는 함수 구조상, 게시판 번호를 특정 PHP 페이지에 전달하면 해당 게시판의 데이터를 불러올 수 있도록 설계되어 있었습니다.
<br/>
그러나 PHP 기반 서버 렌더링 구조 특성상, 버튼 클릭만으로는 현재 페이지 내 콘텐츠를 동적으로 갱신하기 어려웠고,
<br/>
Swiper의 .update() 메서드도 정상적으로 동작하지 않는 이슈가 있었습니다.
<br/>
이에 따라, PHP에서 직접 SQL 데이터를 조회한 뒤, Ajax로 데이터를 받아 Swiper 인스턴스를 초기화 후 슬라이드를 재구성하는 방식으로 문제를 해결했습니다.
          </div>
          </li>
          <span>담당업무</span>
          <li>
            기본 그누보드 기반으로, 프론트엔드(UI 구현), 백엔드(PHP+SQL 처리), 프론트-백엔드 연동(API 처리) 전체를 1인 개발로 수행했습니다.
          </li>
          <span>주요 기능</span>
          {/* 1 */}
          <li>
            베스트아이템 출력
            <div>
              <span className={styles.con_ul_marker}></span>
              베스트아이템 출력하기전 대분류를 출력하여야했기에(대분류: 2글자 / 소분류: 4글자)
              <pre><code>
                {
                  `
                  <?
\$result = sql_query(\"SELECT * FROM \`yc4_category\` WHERE ca_id LIKE '__'\");  
\$con1_category = [];  

for (\$i = 0; \$row = sql_fetch_array(\$result); \$i++) {  
    \$con1_category[\$i] = \$row;  
} 
?>

                      `}
              </code></pre>
                  분류 버튼 클릭 시, 선택된 카테고리에 해당하는 베스트 항목을 백엔드에서 조회한 뒤,<br/>
                  Swiper 슬라이더를 초기화하고 해당 데이터를 프론트엔드에 동적으로 출력하는 기능을 구현하였습니다.<br/>
                  또한 리뷰 수 출력, 다른 영역에서의 데이터 활용, 모바일 환경에서도 별도의 백엔드 페이지 없이 동일한 백엔드 로직을 재사용할 수 있도록 구현하였습니다
                                <pre><code>
                {
                  `
<ul class='con1_cate'>
  <?foreach($con1_category as $pn=>$pnStr) {
    $pnStr['ca_name'] == '수리/유지보수' && $pnStr['ca_name'] = '수리/<br>유지보수';
    ?>
    <li class="<?=$pn == 0 ? 'on' : ''?>" onclick='cate_f(<?=$pnStr['ca_id']?>)'>
      <span></span>
      <button onclick='cate_on_f(event)'><?=$pnStr['ca_name']?></button>
    </li>
  <?}?>
</ul>

<div class="swiper-container swiper-mainvisual_best" >
  <div class="swiper-wrapper" >
  </div>
</div>

<script>
function cate_on_f(event,con1){
	if(con1 == 'con1'){
		$(event.target.parentElement).addClass('hov');
		$(event.target.parentElement).siblings().removeClass('hov');	
	}else{
		$(event.target.parentElement).addClass('on');
		$(event.target.parentElement).siblings().removeClass('on');		
	};	
};

function cate_f (cate_id = '10'){
	$.post("/res/include/con1_ajax.php",{ cate_id: cate_id }, (res)=>{
		mainvisual_best.removeAllSlides();
		const get_data = JSON.parse(res);

		if(get_data['html']){
			get_data['html'].forEach((item) => {
				mainvisual_best.appendSlide(item);
			});				
		};
	});
};
</script>


// con1,con2 영역에 대한 백엔드 데이터 처리

\$json_arr = [];
\$cate_id = \$_POST['cate_id'];
\$con2 = \$_POST['con2'];
\$mobile = \$_POST['mobile'];
\$buttons_html = '';
\$img_size = 0;
\$a_link = '';

if(\$con2 == 'true'){
\t\$result = sql_query(\"SELECT * FROM \`yc4_item\` where ca_id = '\{\$cate_id\}'\");
\t\$bestlink = \"\";
}else{
\t\$result = sql_query(\"SELECT * FROM \`yc4_item\` where it_type4 = '1' and ca_id LIKE '\{\$cate_id\}__'\");
\t\$bestlink = \"&best=1\";
};

if(empty(trim(\$mobile))){
\t\$img_size = 290;
\t\$a_link = '/shop/item.php';
}else{
\t\$img_size = 340;
\t\$a_link = '/m/shop/item.php';
};

for (\$i=0; \$row = sql_fetch_array(\$result); \$i++){

\t\$comment_qty = sql_fetch(\"SELECT COUNT(*) FROM \`g4_write_4_1_1_1\` where wr_7 = '\{\$row['it_name']\}'\");

\tif(\$con2 != 'true'){
\t\tfor (\$j = 1; \$j <= 5; \$j++) {
\t\t\tif (\$row[\"it_type{\$j}\"] == 1) {
\t\t\t\t\$j == 1 ? \$buttons_html .= \"<button class='icon_item_type icon_item_type{\$j}'>HIT</button>\\n\" : '';
\t\t\t\t\$j == 2 ? \$buttons_html .= \"<button class='icon_item_type icon_item_type{\$j}'>추천</button>\\n\" : '';
\t\t\t\t\$j == 3 ? \$buttons_html .= \"<button class='icon_item_type icon_item_type{\$j}'>NEW</button>\\n\" : '';
\t\t\t\t\$j == 4 ? \$buttons_html .= \"<button class='icon_item_type icon_item_type{\$j}'>BEST</button>\\n\" : '';
\t\t\t\t\$j == 5 ? \$buttons_html .= \"<button class='icon_item_type icon_item_type{\$j}'>SALE</button>\\n\" : '';		
\t\t\t};
\t\t};
\t};

\t\$json_arr['html'][\$i] = \"\"
\t. \"<div class='swiper-slide'>\\n\"
\t. \"<a href='\{\$a_link\}?it_id=\{\$row['it_id']\}\{\$bestlink\}'>\\n\"
\t. \"<div>\\n\"
\t. \"<span></span>\\n\"
\t. \"<div class='con1_type_wrap'>\\n\"
\t. \$buttons_html
\t. \"</div>\\n\"
\t. get_it_image(\$row['it_id'].\"_s\", \$img_size, \$img_size, \"\", date(\"YmdHis\", strtotime(\$row[\"it_time\"])))
\t. \"</div>\\n\"
\t. \"<h1>\{\$row['it_name']\}</h1>\\n\"
\t. \"<p><span>리뷰 : \{\$comment_qty['COUNT(*)']\}</span></p>\"
\t. \"</a>\\n\" 
\t. \"</div>\\n\"; 

\t\$buttons_html = '';
};

echo json_encode(\$json_arr);
                      `}
              </code></pre>
              </div>
          </li>

                    {/* 2*/}
          <li>
            소분류아이템 출력
            <div>
              <span className={styles.con_ul_marker}></span>
              대분류 클릭 후 소분류 출력, 소분류 클릭 시, 백엔드 처리 후 Swiper에 연동하여 출력
              <pre><code>
                {
                  `
<ul>
  <?foreach($con1_category as $pn=>$pnStr) {?>		
    <li class=<?=$pn == 0 ? 'on' : ''?>>
      <button onclick="con2_catebox_f(<?=$pnStr['ca_id']?>); cate_on_f(event); con2_slide_f('<?=$pn + 1?>010');"><?=$pnStr['ca_name']?></button>
    </li>
  <?}?>
</ul>

<div>
  <div class='con2_catebox'>
    <h1></h1>
    <ul></ul>
    <button class='con2_next'></button>
    <button class='con2_prev'></button>
  </div>

  <div class="swiper-container swiper-mainvisual_con2" >
    <div class="swiper-wrapper" >
    </div>
  </div>
</div>

<script>
function con2_catebox_f(ca_id = '10'){
	$.post("/res/include/con2_cate_ajax.php",{ cate_id: ca_id }, (res)=>{
		const get_data = JSON.parse(res);

		$('.con2_catebox > ul').empty();
		$('.con2_catebox > h1').text(get_data['title']);
		get_data['html'].forEach((item, index) => {
			$('.con2_catebox > ul').append(item);	
			index == 0 ? $('.con2_catebox > ul > li').addClass('on') : ''; 		
		});
	});	
};

function con2_slide_f(cate_id = '1010'){
	$.post("/res/include/con1_ajax.php",{ cate_id: cate_id, con2: 'true' }, (res)=>{
		mainvisual_con2.removeAllSlides();
		const get_data = JSON.parse(res);

		if(get_data['html']){
			if(get_data['html'].length < 4 && get_data['html'].length > 1){	
				for (let i = 0; i < 2; i++) {
					con2_fe(get_data);	
				};
			}else{
				con2_fe(get_data);
			}			
		};
	});	
};

function con2_fe(get_data){
	get_data['html'].forEach((item, idx) => {
		mainvisual_con2.appendSlide(item);		
	});
};

</script>

// con2 영역에 대한 백엔드 데이터 처리
\$json_arr = [];
\$cate_id = \$_POST['cate_id'];
\$json_arr['html'] = [];

\$result = sql_query(\"SELECT ca_name, ca_id FROM \`yc4_category\` where ca_id LIKE '{\$cate_id}%'\"); 

for (\$i = 0; \$row = sql_fetch_array(\$result); \$i++) {
    if (\$i == 0) {
        \$json_arr['title'] = \$row['ca_name'];
    } else {
        \$json_arr['html'][\$i - 1] = \"\"
        . \"<li>\\n\"
        .   \"<button onclick=\\\"cate_on_f(event); con2_slide_f('{\$row['ca_id']}');\\\">\"
        .       \"#{\$row['ca_name']}\"
        .   \"</button>\\n\"
        . \"</li>\\n\";
    };
};
                `}
              </code></pre>
              </div>
          </li>
                              {/* 33*/}
          <li>
            구매버튼 클릭시 게시글 작성 및 출력
            <div>
              <span className={styles.con_ul_marker}></span>
기존 쇼핑몰 기능은 구매 클릭 시 별도의 페이지로 이동하여 처리를 진행하는 구조이기 때문에,<br/>
게시글로 등록되도록 하려면 기존 코드를 분석한 뒤 적절한 위치에 삽입해야 했습니다.<br/>
비회원일 경우에는 팝업을 띄워 간단한 정보를 입력받아 진행하며,<br/>
사용자 정보, 비회원 정보, 상품 정보를 하나의 객체에 담아 백엔드로 전송하도록 구현했습니다.
              <pre><code>
                {
                  `
<script>
const infor_obj = {
\t no_member:'',
\t title: [],
\t member: [],
\t select: [],
\t now_url: [],
};
const member_arr = ["\\<?=$member['mb_id']?>","\\<?=$member['mb_hp']?>"];
const now_url = window.location.search;
const infor_len = 2;

infor_obj['select'][0] = [];

function no_member_show_f(member){
\tif($('.slt_add_option').val() == '선택해주세요'){
\t\talert('옵션을 선택해주세요.');
\t\treturn false
\t};
\tif(member){
\t\tshop_write_f(true);
\t}else{
\t\t$('.no_member_con_fade').stop().fadeIn();
\t}
}

function shop_write_f(member){
\tlet origin_price = $('#disp_sell_amount').text();
\tinfor_obj['now_url'][0] = "item.php?"+now_url.substring(1);
\tinfor_obj['title'][0] = \`\\<?=$it['it_name']?> 가격 \${origin_price}\`;

\tfor (let i = 0; i < infor_len; i++) {
\t\tif(!member){
\t\t\tif($.trim($('.no_member_inp').eq(i).val()) == ''){
\t\t\t\ti == 0 ? alert('성함을 입력해주세요.') : alert('번호를 입력해주세요.');
\t\t\t\treturn false
\t\t\t};
\t\t\tif(!isValidPhone($('.no_member_inp').eq(1).val())){
\t\t\t\talert('번호를 올바르게입력해주세요.');
\t\t\t\treturn false
\t\t\t};
\t\t\tinfor_obj['member'][i] = $('.no_member_inp').eq(i).val();
\t\t\tinfor_obj['no_member'] = true;
\t\t}else{
\t\t\tinfor_obj['member'][i] = member_arr[i];
\t\t\tinfor_obj['no_member'] = false;
\t\t};
\t}

\tif(!member){
\t\tif($.trim($("input[name='mb_addr1']").val()) == ''){
\t\t\talert('주소를 입력해주세요.');
\t\t\treturn false
\t\t};
\t\tinfor_obj['member'][2] = $.trim($("input[name='mb_addr1']").val());
\t\tinfor_obj['member'][3] = $.trim($("input[name='mb_addr2']").val());
\t}else{
\t\tinfor_obj['member'][2] = '\\<?=$member["mb_zip1"]?>';
\t\tinfor_obj['member'][3] = '\\<?=$member["mb_addr1"]?> \\<?=$member["mb_addr2"]?>';\t\t\t
\t}

\tinfor_obj['select'][0].push(\`옵션 \${$('.slt_add_option option:selected').text()}\`);\t

\t$.post("/res/include/shop_ajax.php",{ infor_obj: infor_obj, cart_on:'off' }, (res)=>{
\t\tconst get_data = JSON.parse(res);
\t\tconsole.log(get_data);
\t\talert('문의가 완료되었습니다.');
\t\twindow.location.href = '/';
\t});
};

</script>

<?if(!$is_member){?>
<div class='no_member_con_fade'>
\t<div class='no_member_con_wrap'>
\t\t<div class='no_member_con'>
\t\t\t<img src='/m/images/shop/close.png' class='no_member_con_close'>
\t\t\t<h1>비회원이시면 아래에 정보를 입력해 주세요.</h1>
\t\t\t<div>
\t\t\t\t<span>성함</span><input type='text' class="no_member_inp">
\t\t\t</div>
\t\t\t<div>
\t\t\t\t<span>전화번호</span><input type='text' class="no_member_inp" placeholder="예: 010-1234-5678, 064-123-4567">
\t\t\t</div>

\t\t\t<div style='height:auto'>
\t\t\t\t<span>주소</span>
\t\t\t\t<table width='300' border="0" cellspacing="0" cellpadding="0" class="addr_table" style='margin:30px 0px'>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t<input type="text" name="mb_zip1" class="ed" style="width:50px;" maxlength=5 readonly \\<?=$config["cf_req_addr"] ? 'data-required="required"' : '';?> itemname="우편번호" value="\\<?=$member["mb_zip1"]?>" />
\t\t\t\t\t\t\t&nbsp;
\t\t\t\t\t\t\t<a href="javascript:;" onclick="openDaumPostcode2('mb_zip1', 'mb_addr1', 'mb_addr2')">
\t\t\t\t\t\t\t\t<span class="btn1" style='font-size:13px;'>우편번호검색</span>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td style="padding:5px 0;">
\t\t\t\t\t\t\t<input type="text" name="mb_addr1" class="ed" style="width:100%;" readonly \\<?=$config["cf_req_addr"] ? 'data-required="required"' : '';?> itemname="주소" value="\\<?=$member["mb_addr1"]?>" />
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t<input type="text" class="ed" name="mb_addr2" style="width:100%;" itemname="상세주소" value="\\<?=$member["mb_addr2"]?>" />
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t</table>
\t\t\t</div>

\t\t\t<button type="button" onclick='shop_write_f(false)'>문의하기</button>
\t\t</div>
\t</div>
</div>

<script>
$('.no_member_con_close').click(()=>{
\t$('.no_member_con_fade').stop().fadeOut();
});

function openDaumPostcode2(formName, zipName, addr1Name, addr2Name) {
  new daum.Postcode({
\toncomplete: function(data) {
\t  const zipInput = document.getElementsByName(zipName)[0];
\t  const addr1Input = document.getElementsByName(addr1Name)[0];
\t  const addr2Input = document.getElementsByName(addr2Name)[0];

\t  if (zipInput) zipInput.value = data.zonecode;
\t  if (addr1Input) addr1Input.value = data.roadAddress || data.jibunAddress;
\t  if (addr2Input) addr2Input.focus();
\t}
  }).open();
}
</script>
<?}?>
                 `}
              </code></pre>
              게시글 등록을 처리하는 백엔드 로직
              <pre><code>
                {
                  `
<?
$json_arr = [];
$json_arr = $_POST['infor_obj'];
$cart_on = $_POST['cart_on'];

$name_msg = "{$json_arr['member'][0]}님 문의입니다.";

$json_data = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
$json_escaped = addslashes($json_data);

sql_fetch("INSERT INTO g4_write_5_1_1_1 (wr_subject, wr_content, wr_num, wr_datetime) SELECT '{$name_msg}','{$json_escaped}', (COALESCE(MIN(wr_num), 0) - 1), now() FROM g4_write_5_1_1_1");
sql_fetch("UPDATE g4_write_5_1_1_1 SET wr_parent = wr_id");

$inqu_total = sql_fetch("SELECT COUNT(*) AS total FROM g4_write_5_1_1_1;");
sql_fetch("UPDATE g4_board SET bo_count_write = {$inqu_total['total']} WHERE bo_table = '5_1_1_1'");

?>
              `}
              </code></pre>
              게시글 출력
              <pre><code>
                {
                  `
<?$shop_arr = json_decode($view['content'], true);?>

<?if($shop_arr['no_member'] == 'false'){?>
  <h1>회원 아이디 : <?=$shop_arr['member'][0]?></h1>
<?}else{?>
  <h1>비회원 성함 : <?=$shop_arr['member'][0]?></h1>
<?}?>
<h1>전화번호 : <?=$shop_arr['member'][1]?></h1>
<h1>주소 : (<?=$shop_arr['member'][2]?>) <?=$shop_arr['member'][3]?></h1>

<?for ($i=0; $i<count($shop_arr['title']); $i++) {?>
  <div style='margin:20px 0'>
    <span><?=$i+1?>. </span>
    <a href='/shop/<?=$shop_arr['now_url'][$i]?>' target='_blank'>상품명 : <?=$shop_arr['title'][$i]?></a>
    <?if($shop_arr['select'] != 'no'){?>
      <?for($j=0; $j<count($shop_arr['select'][$i]); $j++) {?>
        <p style='font-size:15px'><?=$shop_arr['select'][$i][$j]?></p>
      <?}?>
    <?}?>
  </div>
<?}?>
                                `}
              </code></pre>
              </div>
          </li>
            {/*3*/}
          <li>
            장바구니 물품 게시글 작성
            <div>
              <span className={styles.con_ul_marker}></span>
단일 상품 페이지에서는 하나의 상품과 해당 옵션만 처리하면 되었지만,<br/>
장바구니에서는 여러 상품과 각각의 옵션을 함께 고려해야 했습니다.<br/>
이에 따라, 게시판 출력 구조에 맞춰 장바구니용 코드를 별도로 작성하였습니다.
              <pre><code>
                {
                  `
<script>

let origin_price;
const infor_obj = {
\t title: [],
\t member: [],
\t select: [],
\t now_url: [],
};
const member_arr = ["\\<?=$member['mb_id']?>","\\<?=$member['mb_hp']?>"];
const infor_len = 2;
let repeat_num  = 0;
let inp_check_num = 0;
let inp_j = [];
let j_index = 0;

function shop_write_f(member, all){

\tfor (let i = 0; i < infor_len; i++) {
\t\tif(!member){
\t\t\tif($.trim($('.no_member_inp').eq(i).val()) == ''){
\t\t\t\ti == 0 ? alert('성함을 입력해주세요.') : alert('번호를 입력해주세요.');
\t\t\t\treturn false
\t\t\t};

\t\t\tif(!isValidPhone($('.no_member_inp').eq(1).val())){
\t\t\t\talert('번호를 올바르게입력해주세요.');
\t\t\t\treturn false
\t\t\t};

\t\t\tinfor_obj['member'][i] = $('.no_member_inp').eq(i).val();
\t\t\tinfor_obj['no_member'] = true;
\t\t}else{
\t\t\tinfor_obj['member'][i] = member_arr[i];
\t\t\tinfor_obj['no_member'] = false;
\t\t};
\t};

\tfor (let i = 0; i < \\<?=$total_qty?>; i++) {
\t\tif(\`input[name='chk_ct[\\\${i}]']\`.is(':checked')){
\t\t\tinp_check_num += 1;
\t\t\tinp_j.push(i);
\t\t};
\t};

\tif(!all){
\t\tif(inp_check_num == 0){
\t\t\talert('상품을 체크해주세요.');
\t\t\treturn false;
\t\t};
\t};

\tall ? repeat_num = \\<?=$total_qty?> : repeat_num = inp_check_num;

\tfor (let i = 0; i < repeat_num; i++) {

\t\tall ? j_index = i : j_index = inp_j[i];
\t\torigin_price = \`input[name='it_name[\\\${j_index}]']\`.siblings('.shop_link').children('b').text();

\t\tinfor_obj['title'].push(\`input[name='it_name[\\\${j_index}]']\`.val() + \` 가격 \\\${origin_price}원\`);
\t\tinfor_obj['select'][i] = [];

\t\tif (\`input[name='it_name[\\\${j_index}]']\`.siblings('.cart_item_option').length > 0) {
\t\t\tinfor_obj['select'][i][0] = '옵션'+ \`input[name='it_name[\\\${j_index}]']\`.siblings('.cart_item_option').children('li').text().split('상품선택')[1];
\t\t}else{
\t\t\tinfor_obj['select'][i][0] = '';
\t\t};

\t\tinfor_obj['now_url'].push(\`input[name='it_name[\\\${j_index}]']\`.siblings('.shop_link').children('a').attr('href'));
\t};

\tif(!member){
\t\tif($.trim($("input[name='mb_addr1']").val()) == ''){
\t\t\talert('주소를 입력해주세요.');
\t\t\treturn false
\t\t};
\t\tinfor_obj['member'][2] = $.trim($("input[name='mb_addr1']").val());
\t\tinfor_obj['member'][3] = $.trim($("input[name='mb_addr2']").val());
\t}else{
\t\tinfor_obj['member'][2] = '\\<?=$member["mb_zip1"]?>';
\t\tinfor_obj['member'][3] = '\\<?=$member["mb_addr1"]?> \\<?=$member["mb_addr2"]?>';
\t};

\t$.post("/res/include/shop_ajax.php",{ infor_obj: infor_obj, cart_on:'on'}, (res)=>{
\t\tconst get_data = JSON.parse(res);
\t\tconsole.log(get_data);
\t\talert('문의가 완료되었습니다.');
\t\twindow.location.href = '/';
\t});

};
</script>
              `}
              </code></pre>
              </div>
          </li>
            {/*3*/}
          <li>
            게시글 조회
            <div>
              <span className={styles.con_ul_marker}></span>
              회원은 로그인 상태에서 바로 문의 내역을 조회할 수 있도록 처리하였으며,<br/>
              비회원의 경우에는 이름과 연락처를 입력한 후 조회가 가능하도록 구현하였습니다.
              <pre><code>
                {
                  `
<script>
function sub6_2_f(){
\tlet sub6_2_name =  $('.sub6_2_name').val();
\tlet sub6_2_hp =  $('.sub6_2_hp').val();

\tif(!isValidPhone($('.sub6_2_hp').val())){
\t\talert('번호를 올바르게입력해주세요.');
\t\treturn false;
\t};

\t$.post("/res/include/sub6_2_ajax.php",{ sub6_2_name : sub6_2_name, sub6_2_hp : sub6_2_hp }, (res)=>{
\t\tconst get_data = JSON.parse(res);
\t\tif(get_data["COUNT(*)"] > 0){
\t\t\t window.location.href = \`/pages.php?p=6_1_1_1&sub6_2_name=\${utf8ToBase64(sub6_2_name)}&sub6_2_hp=\${utf8ToBase64(sub6_2_hp)}\`;
\t\t}else{
\t\t\talert('조회된 문의내역이 없습니다.');
\t\t}
\t});	
};
function utf8ToBase64(str) {
\treturn btoa(unescape(encodeURIComponent(str)));
};
</script>

//비회원 문의 내역 조회 처리

\$no_member_name = \$_POST['sub6_2_name'];
\$no_member_hp = \$_POST['sub6_2_hp'];

\$no_member_result = sql_fetch("SELECT COUNT(*) FROM \`g4_write_5_1_1_1\` WHERE JSON_EXTRACT(wr_content, '\$.member[0]') = '\{\$no_member_name\}'
and JSON_EXTRACT(wr_content, '\$.member[1]') = '\{\$no_member_hp\}'");

<\?=json_encode(\$no_member_result)?>
                `}
              </code></pre>
              </div>
          </li>

          {/*4*/}
          <li>
            게시글 출력
            <div>
              <span className={styles.con_ul_marker}></span>
              회원 정보가 URL에 직접 노출되지 않도록 base64 인코딩을 적용해 간단히 감추는 방식으로 처리하였습니다.<br/>
              하나의 데이터 안에 여러 상품과 각각의 옵션 정보를 담는 구조로 되어 있기 때문에,<br/>
              게시글 출력 시 이중 반복문을 사용하여 각 상품과 그에 따른 옵션을 개별적으로 렌더링하였습니다.
              <pre><code>
                {
                  `
  <?
  \$order_arr = [];

  if (empty(\$_GET['sub6_2_name']) && empty(\$_GET['sub6_2_hp'])) {
      \$order_result = sql_query("SELECT * FROM \`g4_write_5_1_1_1\` where wr_subject = '{\$inqu_id}'");
  } else {
      \$sub6_2_name_atob = base64_decode(\$_GET['sub6_2_name']);
      \$sub6_2_hp_atob = base64_decode(\$_GET['sub6_2_hp']);
      \$order_result = sql_query("SELECT * FROM \`g4_write_5_1_1_1\` WHERE JSON_EXTRACT(wr_content, '\$.member[0]') = '{\$sub6_2_name_atob}' and JSON_EXTRACT(wr_content, '\$.member[1]') = '{\$sub6_2_hp_atob}'");
  }

  for (\$i = 0; \$row = sql_fetch_array(\$order_result); \$i++) {
      \$order_arr[\$i] = \$row;
  }
  ?>

  <div class='order_date_con'>
    <table class='order_date_table' width="98%" align="center" style="border-collapse:collapse;">
      //생략
      <tbody>
        <? for (\$i = 0; \$i < count(\$order_arr); \$i++) {
            \$order_de = json_decode(\$order_arr[\$i]['wr_content'], true);
        ?>
        <tr>
          <td><?=\$i + 1?></td>
          <td style='text-align:left;padding-left:20px;'>
            <?for (\$j = 0; \$j < count(\$order_de['title']); \$j++) { ?>
              <p><?=\$j + 1?>. <?=\$order_de['title'][\$j]?>
                <?if (\$order_de['select'] != 'no') { ?>
                  <? for (\$k = 0; \$k < count(\$order_de['select'][\$j]); \$k++) { ?>
                    <span><?=\$order_de['select'][\$j][\$k]?></span>
                  <? } ?>
                <? } ?>
              </p>
            <?php } ?>
          </td>
          <td><?=\$order_de['member'][0]?></td>
          <td><?=\$order_de['member'][1]?></td>
          <td>(<?=\$order_de['member'][2]?>)<br><?=\$order_de['member'][3]?></td>
          <td><?=\$order_arr[\$i]['wr_datetime']?></td>
        </tr>
        <? } ?>
      </tbody>
    </table>
  </div>
                `}
              </code></pre>
              </div>
          </li>
        </ul>
      </div>
    </>
  )
}