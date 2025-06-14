'use client';

import styles from "./page.module.css";
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className={styles.con}>
        <Link href="#">기존 사이트에 제가 작성한 코드 일부만 적용한 사례입니다.</Link>
        <ul className={styles.con_ul}>
          <span>프로젝트 개요</span>
          <li>
            메인페이지 영상기능 추가 
            <div>
              <span className={styles.con_ul_marker}></span>
              이미 유튜브 영상을 업로드하는 게시판이 존재하는 상태에서,<br/>
              메인 페이지에 해당 게시판에 등록된 유튜브 영상이 표시되도록 해달라는 요청이었습니다.<br/>
              영상 영역 옆에는 최신 영상 4개의 탭이 있으며, 각 탭을 클릭하면 iframe 태그를 통해 해당 영상이 재생되도록 구현했습니다.
                            <pre><code>
                {
                  `
<div class='con2_video'>
\t<div class='con2_video_main'>
\t\t<iframe width="774" height="435" src="" autoplay="true" frameborder="0" style='border-radius:10px;'></iframe>
\t\t<p>\${list[0]['subject']}</p>
\t</div>

\t<ul>
\t\t<?\$src_result = array()?> 

\t\t<?for (\$i=0; \$i<count(\$list); \$i++) {

\t\t\t\$src_str = \$list[\$i]['wr_1'];
\t\t\t\$target = "=";
\t\t\t\$pos = strpos(\$src_str, \$target);

\t\t\tif (\$pos !== false) {
\t\t\t\tarray_push(\$src_result, substr(\$src_str, \$pos + strlen(\$target)));
\t\t\t}

\t\t\tif( \$list[\$i]['wr_1'] ){
\t\t\t\t\$list_thumb = "https://img.youtube.com/vi/{\$src_result[\$i]}/0.jpg";
\t\t\t}
\t\t?>

\t\t\t<li>
\t\t\t\t<div style="background:url('\${\$list_thumb}') no-repeat center center; background-size:cover;"></div>
\t\t\t\t<p>\${\$list[\$i]['subject']}</p>
\t\t\t</li>
\t\t<?}?>
\t</ul>

</div>

<script>
\t\$('.con2_video_main > iframe').attr('src',"https://www.youtube.com/embed/\${\$src_result[0]}?autoplay=1&mute=1");
\tconst src_result = <?=json_encode(\$src_result)?>;

\tfor(let i = 0; i < 4; i++){
\t\t\$('.con2_video li').eq(i).click(()=>{
\t\t\t\$('.con2_video_main > iframe').attr('src',\`https://www.youtube.com/embed/\${src_result[i]}?autoplay=1&mute=1\`);
\t\t\t\$('.con2_video_main > p').text(\$(\`.con2_video li:nth-of-type(\${i + 1}) > p\`).text());
\t\t})
\t}
</script>
                `}
            </code></pre>
            </div>
          </li>

        {/*1*/}
          <li>
            진행상황기능 추가 
            <div>
              <span className={styles.con_ul_marker}></span>
뷰 페이지에서는 게시글의 진행상황(wr_8 값)을 변경할 수 있도록 버튼을 제공합니다.<br/>
리스트 페이지에서는 $list 배열에 담긴 정보를 바탕으로 반복문을 통해 각 게시글을 출력합니다.<br/>
각 버튼에 대한 스크립트 접근은 반복문 내부에 작성하며, 선택자는 .last()를 사용하여 해당 반복 순서의 마지막 요소에 정확히 적용되도록 처리했습니다.
            <pre><code>
                {
                  `
//게시판 리스트
<?for ($i=0; $i<count($list); $i++) {?>
    //생략
<td>
    <button class='inqu_btn'></button>
</td>
<script>				
        if(<?=$list[$i]['wr_8']?> == 1){
            $('.inqu_btn').last().addClass('inqu_btn_before');
            $('.inqu_btn').last().text('접수 완료');
        }
        if(<?=$list[$i]['wr_8']?> == 2){
            $('.inqu_btn').last().addClass('inqu_btn_ing');
            $('.inqu_btn').last().text('상담 진행 중');
        }
        if(<?=$list[$i]['wr_8']?> == 3){
            $('.inqu_btn').last().addClass('inqu_btn_finish');
            $('.inqu_btn').last().text('상담 완료');
        }
</script>
<?}?>

//게시판 뷰페이지
<?php
if(\$is_admin){
?>

<div class='inqu_btn_con'>
\t<button style='margin-left:0;' class='inqu_btn inqu_btn_before'><span>접수 완료</span></button>
\t<button class='inqu_btn inqu_btn_ing'><span>상담 진행 중</span></button>
\t<button class='inqu_btn inqu_btn_finish'><span>상담 완료</span></button>
\t<button class='inqu_btn inqu_btn_change' onclick='inqu_btn_f()'><span>진행상황 변경하기</span></button>
</div>

<script>
\t\$('.inqu_btn').click(function(){
\t\tif(\$(this).hasClass('inqu_btn_change')) return false;
\t\t\$('.inqu_btn').filter('.on').removeClass('on');
\t\t\$(this).addClass('on');
\t});

\tlet inqu_btn_num = 0;
\tlet inqu_wr_id = <?=$view["wr_id"]?>;

\tfunction inqu_btn_f(){
\t\tif(!\$('.inqu_btn').hasClass('on')){
\t\t\talert('진행상황 선택해주세요.');
\t\t\treturn false;
\t\t}
\t\tif(!confirm(\`\${\$('.inqu_btn.on').text()}로 변경하시겠습니까?\`)){
\t\t\treturn false;
\t\t}

\t\t\$('.inqu_btn.on').hasClass('inqu_btn_before') && (inqu_btn_num = 1);
\t\t\$('.inqu_btn.on').hasClass('inqu_btn_ing') && (inqu_btn_num = 2);
\t\t\$('.inqu_btn.on').hasClass('inqu_btn_finish') && (inqu_btn_num = 3);

\t\t\$.post("/res/include/inqu_btn_ajax.php", {
\t\t\tinqu_btn_num: inqu_btn_num,
\t\t\tinqu_wr_id: inqu_wr_id
\t\t}, (res) => {
\t\t\tlocation.reload();
\t\t});
\t}

\tif(<?=$view["wr_8"]?> == 1){
\t\t\$('.view_title > button').addClass('inqu_btn_before').text('접수 완료');
\t}
\tif(<?=$view["wr_8"]?> == 2){
\t\t\$('.view_title > button').addClass('inqu_btn_ing').text('상담 진행 중');
\t}
\tif(<?=$view["wr_8"]?> == 3){
\t\t\$('.view_title > button').addClass('inqu_btn_finish').text('상담 완료');
\t}
</script>

<!-- inqu_btn_ajax.php -->
<?php
\$inqu_btn_num = \$_POST['inqu_btn_num'];
\$inqu_wr_id = \$_POST['inqu_wr_id'];
sql_fetch("UPDATE g4_write_3_2_1_1 SET wr_8 = {\$inqu_btn_num} WHERE wr_id = {\$inqu_wr_id}");
echo json_encode(\$inqu_btn_num);
?>
`}
            </code></pre>
            </div>
          </li>
                  {/*22*/}
          <li>
            달력,남은시간 기능 추가 
            <div>
              <span className={styles.con_ul_marker}></span>
            특정 게시판에 날짜를 입력하면, 해당 월의 달력을 출력하고 결혼식까지 남은 시간을 실시간으로 표시하는 기능입니다.<br/>
            <pre><code>
                {
                  `
<style>
.con3{width:100%;height:1260px;position:relative;box-sizing:border-box;padding-top:72px;}
.con3 > table{margin:0 auto;border-collapse:collapse}
.con3 > table th,.con3 > table td{height:80px;border:0;font-size:24px;font-weight:400;color:#000;padding:0;text-align:Center;position:relative;}
.con3 > table tr:not(:nth-of-type(2)) td:first-child,.con3 > table tr:not(:nth-of-type(2)) th:first-child{color:#fe5b4f;}
.second_row_span{display:inline-block;width:80px;height:80px;line-height:80px;text-align:center;position:relative;vertical-align:middle;}
.target_span{display:inline-block;width:52px;line-height:52px;color:#fff;border-radius:50%;background:#f7c0ce;position:absolute;top:14px;left:14px;}

.con3 > ul{display:flex;justify-content:center;width:100%;height:112px;margin-top:35px;}
.con3 > ul > li{display:inline-block;width:90px;height:100%;margin:0 10px;box-sizing:border-box;padding-top:20px;text-align:center;background:#f8f8f8;
border-radius:10px;}
.con3 > ul > li > h1{font-size:30px;color:#222;font-weight:400;margin-bottom:8px;}
.con3 > ul > li > p{font-size:16px;font-weight:400;color:#bcbcbc}
</style>

<div class='con3'>
\t<table>
\t\t<colgroup>
\t\t\t<col width="80px" />
\t\t\t<col width="80px" />
\t\t\t<col width="80px" />
\t\t\t<col width="80px" />
\t\t\t<col width="80px" />
\t\t\t<col width="80px" />
\t\t\t<col width="80px" />
\t\t</colgroup>
\t\t<tr>
\t\t\t<th>일</th>
\t\t\t<th>월</th>
\t\t\t<th>화</th>
\t\t\t<th>수</th>
\t\t\t<th>목</th>
\t\t\t<th>금</th>
\t\t\t<th>토</th>
\t\t</tr>
\t</table>

\t<ul>
\t\t<li><h1>365</h1><p>Days</p></li>
\t\t<li><h1>365</h1><p>Hours</p></li>
\t\t<li><h1>365</h1><p>Min</p></li>
\t\t<li><h1>365</h1><p>Sec</p></li>
\t</ul>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js"></script>
<script>
\tlet first_day = new Date("\${result['wr_1']}-\${result['wr_2']}-01");
\tconst last_day = new Date(Number("\${result['wr_1']}"), Number("\${result['wr_2']}"), 0).getDate();
\tlet j_num = 0;
\tlet tr_num = 0;
\tlet span_color = '#000';
\tconst day_yo = ['일','월','화','수','목','금','토'];
\tconst day_yo_day = new Date("\${result['wr_1']}/\${result['wr_2']}/\${result['wr_3']}").getDay();

\tif(Number(\${result['wr_4']}) < 12){
\t\t\$('.morning').eq(0).text('AM');
\t\t\$('.morning').eq(1).text('오전');
\t}else{
\t\t\$('.morning').eq(0).text('PM');
\t\t\$('.morning').eq(1).text('오후');\t
\t}

\tlast_day == 0 ? tr_num = Math.ceil(last_day / 7) : tr_num = Math.ceil(last_day / 7) + 1;
\t\$('.day_yo').text(\`\${day_yo[day_yo_day]}요일\`);
\t\$('.con1_day').text(\`\${day_yo[day_yo_day]}요일\`);

\tfor(let i = 0; i < tr_num; i++){
\t\t\$('.con3 > table').append('<tr></tr>');
\t\tif(i == 0){
\t\t\t\$('.con3 > table tr').eq(1).append(\`<td colspan='7' style='text-align:right'></td>\`);
\t\t\tfor(let j = 6; j >= first_day.getDay(); j--){
\t\t\t\tj_num += 1;
\t\t\t\tfirst_day.getDay() == 0 && j == 6 ? span_color = '#fe5b4f' : span_color = '#000';
\t\t\t\tif(\${result['wr_3']} == j_num){
\t\t\t\t\t\$('.con3 > table tr:nth-of-type(2) td').append(\`<span class='second_row_span'><span class='target_span'>\${j_num}</span></span>\`);
\t\t\t\t}else{
\t\t\t\t\t\$('.con3 > table tr:nth-of-type(2) td').append(\`<span class='second_row_span' style='color:\${span_color}'>\${j_num}</span>\`);
\t\t\t\t}
\t\t\t}
\t\t}else{
\t\t\tfor(let j = 0; j < 7; j++){
\t\t\t\tif(j_num == last_day) break;
\t\t\t\tj_num += 1;
\t\t\t\tif(\${result['wr_3']} == j_num){
\t\t\t\t\t\$('.con3 > table tr').eq(i + 1).append(\`<td><span class='target_span'>\${j_num}</span></td>\`);
\t\t\t\t}else{
\t\t\t\t\t\$('.con3 > table tr').eq(i + 1).append(\`<td>\${j_num}</td>\`);
\t\t\t\t}
\t\t\t}
\t\t}
\t}

\tconst today = dayjs();
\tconst futureDate = dayjs("\${result['wr_1']}-\${result['wr_2']}-\${result['wr_3']} \${result['wr_4']}:00:00");

\tconst day_set = ()=>{
\t\tconst diffInSeconds = futureDate.diff(today, 'second');
\t\tconst diffDays = Math.floor(diffInSeconds / (60 * 60 * 24));
\t\t\$('.con3 > ul > li:nth-of-type(1) > h1').text(diffDays);
\t};
\tday_set();

\tlet dif_insecond;
\tlet dif_second;
\tlet dif_min;
\tlet dif_hours;

\tconst second_set = ()=>{
\t\tdif_insecond = futureDate.diff(dayjs(), 'second');
\t\tdif_second = dif_insecond % 60;
\t\t\$('.con3 > ul > li:nth-of-type(4) > h1').text(dif_second); 
\t};
\tsecond_set();
\tconst id_interval_s = setInterval(() => { second_set(); }, 1000);

\tconst min_set = ()=>{
\t\tdif_min = Math.floor((dif_insecond % (60 * 60)) / 60);
\t\t\$('.con3 > ul > li:nth-of-type(3) > h1').text(dif_min); 
\t};
\tmin_set();
\tconst id_interval_m = setInterval(() => { min_set(); }, 1000 * 60);

\tconst hours_set = ()=>{
\t\tdif_hours = Math.floor((dif_insecond % (60 * 60 * 24)) / (60 * 60));
\t\t\$('.con3 > ul > li:nth-of-type(2) > h1').text(dif_hours);
\t};
\thours_set();
\tconst id_interval_h = setInterval(() => { hours_set(); }, 1000 * 60 * 60);

\tif(\$('.con3 > ul > li:nth-of-type(4) > h1').text() < 0){
\t\tclearInterval(id_interval_s);
\t\tclearInterval(id_interval_m);
\t\tclearInterval(id_interval_h);
\t}
</script>
`}
            </code></pre>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}