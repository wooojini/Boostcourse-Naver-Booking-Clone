<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="utf-8">
    <meta name="description" content="네이버 예약, 네이버 예약이 연동된 곳 어디서나 바로 예약하고, 네이버 예약 홈(나의예약)에서 모두 관리할 수 있습니다.">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
    <title>네이버 예약</title>
    <link href="./css/style.css?ver=1.0" rel="stylesheet">
    <script src="./js/lib/handlebars.min-v4.7.3.js"></script>
    <script type="module" src="./js/review.js?ver=1.0"></script>
</head>

<body>
    <input id="displayInfoId" type="hidden" value="${displayInfoId}" />
    <div id="container" name="top">
        <div class="header fade">
            <header class="header_tit">
                <h1 class="logo">
                    <a href="#" class="lnk_logo" title="네이버"> <span class="spr_bi ico_n_logo">네이버</span> </a>
                    <a href="#" class="lnk_logo" title="예약"> <span class="spr_bi ico_bk_logo">예약</span> </a>
                </h1>
                <a href="bookinglogin" class="btn_my"> <span title="예약확인">예약확인</span> </a>
            </header>
        </div>
        <div class="ct">
            <div class="wrap_review_list">
                <div class="review_header">
                    <div class="top_title gr">
                        <a href="./detail?id=${displayInfoId}" class="btn_back" title="이전 화면으로 이동"> <i class="fn fn-backward1"></i>
                        </a>
                        <h2><a class="title" href="#">오디컴퍼니 주식회사</a></h2>
                    </div>
                </div>
                <div class="section_review_list">
                    <div class="review_box">
                        <h3 class="title_h3">예매자 한줄평</h3>
                        <div class="short_review_area">
                            <div class="grade_area"> <span class="graph_mask"> <em class="graph_value"
                                        style="width: 88%;"></em> </span> <strong class="text_value"> <span>0.0</span>
                                    <em class="total">5.0</em> </strong> <span class="join_count"><em
                                        class="green">0건</em> 등록</span> </div>
                            <ul class="list_short_review">
                            </ul>
                        </div>
                        <p class="guide"> <i class="spr_book2 ico_bell"></i> <span>네이버 예약을 통해 실제 방문한 이용자가 남긴
                                평가입니다.</span> </p>
                    </div>
                </div>
            </div>
        </div>
        <hr>
    </div>
    <footer>
        <div class="gototop">
            <a href="#top" class="lnk_top"> <span class="lnk_top_text">TOP</span> </a>
        </div>
        <div id="footer" class="footer">
            <p class="dsc_footer">네이버(주)는 통신판매의 당사자가 아니며, 상품의정보, 거래조건, 이용 및 환불 등과 관련한 의무와 책임은 각 회원에게 있습니다.</p>
            <span class="copyright">© NAVER Corp.</span>
        </div>
    </footer>
</body>

<script type="myTemplate" id="reviewItem">
    <li class="list_item" data-id="{{commentId}}">
        <div>
            <div class="review_area">
                {{#if saveFileName}}
                    <div class="thumb_area">
                        <a href="#" class="thumb" title="이미지 크게 보기">
                            <img width="90" height="90" class="img_vertical_top"
                                src=""
                                alt="리뷰이미지" />
                        </a>
                        <span class="img_count" style="display:none;">1</span>
                    </div>
                {{/if}}
                <h4 class="resoc_name">{{productDescription}}</h4>
                <p class="review">
                    {{comment}}
                </p>
            </div>
            <div class="info_area">
                <div class="review_info">
                    <span class="grade">{{score}}</span>
                    <span class="name">{{reservationEmail}}</span>
                    <span class="date">{{reservationDate}} 방문</span>
                </div>
            </div>
        </div>
    </li>
 </script>

</html>