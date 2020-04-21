<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>  

<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="utf-8" />
  <meta name="description" content="네이버 예약, 네이버 예약이 연동된 곳 어디서나 바로 예약하고, 네이버 예약 홈(나의예약)에서 모두 관리할 수 있습니다." />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no" />
  <title>네이버 예약</title>
  <link href="./css/style.css?ver=1.0" rel="stylesheet" />
  <script src="./js/lib/handlebars.min-v4.7.3.js"></script>
  <script type="module" src="./js/myreservation.js?ver=1.0"></script>
</head>

<body>
	<input id="reservation_email" type="hidden"
		value="${sessionScope.reservationEmail}" />
	<div id="container">
		<div class="header">
			<header class="header_tit" name="top">
				<h1 class="logo">
					<a href="./" class="lnk_logo" title="네이버"> <span
						class="spr_bi ico_n_logo">네이버</span>
					</a> <a href="./" class="lnk_logo" title="예약"> <span
						class="spr_bi ico_bk_logo">예약</span>
					</a>
				</h1>
				<c:choose>
					<c:when test="${sessionScope.reservationEmail != null}">
						<a href="myreservation" class="btn_my"> <span
							class="viewReservation" title="이메일">${sessionScope.reservationEmail}</span>
						</a>
					</c:when>
					<c:otherwise>
						<a href="bookingLoginForm" class="btn_my"> <span
							class="viewReservation" title="예약확인">예약확인</span>
						</a>
					</c:otherwise>
				</c:choose>
			</header>
		</div>
		<hr />
		<div class="ct">
			<div class="section_my">
				<!-- 예약 현황 -->
				<div class="my_summary">
					<ul class="summary_board">
						<li class="item"><a href="#"class="link_summary_board on"> 
								<i class="spr_book2 ico_book2"></i>
								<em class="tit">전체</em> <span class="figure">0</span>
						</a></li>
						<li class="item"><a href="#" class="link_summary_board">
								<i class="spr_book2 ico_book_ss"></i> <em class="tit">이용예정</em>
								<span class="figure">0</span>
						</a></li>
						<li class="item"><a href="#" class="link_summary_board">
								<i class="spr_book2 ico_check"></i> <em class="tit">이용완료</em> <span
								class="figure">0</span>
						</a></li>
						<li class="item"><a href="#" class="link_summary_board">
								<i class="spr_book2 ico_back"></i> <em class="tit">취소·환불</em> <span
								class="figure">0</span>
						</a></li>
					</ul>
				</div>
				<!--// 예약 현황 -->

				<!-- 내 예약 리스트 -->
				<div class="wrap_mylist hide">
					<ul class="list_cards" ng-if="bookedLists.length > 0">
						<li class="card" style="display: none;">
							<div class="link_booking_details">
								<div class="card_header">
									<div class="left"></div>
									<div class="middle">
										<i class="spr_book2 ico_clock"></i> <span class="tit">예약
											신청중</span>
									</div>
									<div class="right"></div>
								</div>
							</div>
						</li>
						<li class="card confirmed">
							<div class="link_booking_details">
								<div class="card_header">
									<div class="left"></div>
									<div class="middle">
										<i class="spr_book2 ico_check2"></i> <span class="tit">예약
											확정</span>
									</div>
									<div class="right"></div>
								</div>
							</div>
						</li>
						<li class="card used">
							<div class="link_booking_details">
								<div class="card_header">
									<div class="left"></div>
									<div class="middle">
										<i class="spr_book2 ico_check2"></i> <span class="tit">이용
											완료</span>
									</div>
									<div class="right"></div>
								</div>
							</div>
						</li>
						<li class="card used cancel">
							<div class="link_booking_details">
								<div class="card_header">
									<div class="left"></div>
									<div class="middle">
										<i class="spr_book2 ico_cancel"></i> <span class="tit">취소된
											예약</span>
									</div>
									<div class="right"></div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<!--// 내 예약 리스트 -->

				<!-- 예약 리스트 없음 -->
				<div class="err">
					<i class="spr_book ico_info_nolist"></i>
					<h1 class="tit">예약 리스트가 없습니다</h1>
				</div>
				<!--// 예약 리스트 없음 -->
			</div>
		</div>
		<hr />
	</div>
	<footer>
		<div class="gototop">
			<a href="#top" class="lnk_top"> <span class="lnk_top_text">TOP</span>
			</a>
		</div>
		<div id="footer" class="footer">
			<p class="dsc_footer">네이버(주)는 통신판매의 당사자가 아니며, 상품의정보, 거래조건, 이용 및
				환불 등과 관련한 의무와 책임은 각 회원에게 있습니다.</p>
			<span class="copyright">© NAVER Corp.</span>
		</div>
	</footer>

	<!-- 취소 팝업 -->
	<div class="popup_booking_wrapper hide">
		<div class="dimm_dark" style="display: block"></div>
		<div class="popup_booking refund">
			<h1 class="pop_tit">
				<span>서비스명/상품명</span> <small class="sm">2000.0.00.(월)2000.0.00.(일)</small>
			</h1>
			<div class="nomember_alert">
				<p>취소하시겠습니까?</p>
			</div>
			<div class="pop_bottom_btnarea">
				<div class="btn_gray">
					<a href="#" class="btn_bottom no_btn"><span>아니오</span></a>
				</div>
				<div class="btn_green">
					<a href="#" class="btn_bottom yes_btn"><span>예</span></a>
				</div>
			</div>
			<!-- 닫기 -->
			<a href="#" class="popup_btn_close" title="close"> <i
				class="spr_book2 ico_cls"></i>
			</a>
			<!--// 닫기 -->
		</div>
	</div>
	<!--// 취소 팝업 -->
</body>

<script type="myTemplate" id="confirmItem">
  <article class="card_item">
    	<a href="#" class="link_booking_details">
    		<div class="card_body">
    			<div class="left"></div>
    			<div class="middle">
    				<div class="card_detail">
    					<em class="booking_number">No.{{reservationInfoId}}</em>
    					<h4 class="tit">{{productDescription}}</h4>
    					<ul class="detail">
    						<li class="item">
    							<span class="item_tit">일정</span>
    							<em class="item_dsc">
    								{{#changeDatePattern reservationDate}}
    									{{reservationDate}}
    								{{/changeDatePattern}}
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">내역</span>
    							<em class="item_dsc">
    								내역이 없습니다.
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">장소</span>
    							<em class="item_dsc">
    								{{#if placeName}}
    									{{placeName}}
    								{{else}}
    									내역이 없습니다.
    								{{/if}}
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">업체</span>
    							<em class="item_dsc">
    								오디컴퍼니 주식회사
    							</em>
    						</li>
    					</ul>
    					<div class="price_summary">
    						<span class="price_tit">결제 예정금액</span>
    						<em class="price_amount">
    							<span>
    								{{#changeCurrencyPattern totalPrice}}
                   						{{totalPrice}}
               						{{/changeCurrencyPattern}}
    							</span>
    							<span class="unit">원</span>
    						</em>
    					</div>
    					<div class="booking_cancel">
    						<button class="btn"><span>취소</span></button>
    					</div>
    				</div>
    			</div>
    			<div class="right"></div>
    		</div>
    		<div class="card_footer">
    			<div class="left"></div>
    			<div class="middle"></div>
    			<div class="right"></div>
    		</div>
    	</a>
    	<a href="#" class="fn fn-share1 naver-splugin btn_goto_share" title="공유하기"></a>
    </article>
  </script>

<script type="myTemplate" id="usedItem">
  <article class="card_item">
    	<a href="#" class="link_booking_details">
    		<div class="card_body">
    			<div class="left"></div>
    			<div class="middle">
    				<div class="card_detail">
    					<em class="booking_number">No.{{reservationInfoId}}</em>
    					<h4 class="tit">{{productDescription}}</h4>
    					<ul class="detail">
    						<li class="item">
    							<span class="item_tit">일정</span>
    							<em class="item_dsc">
    								{{#changeDatePattern reservationDate}}
    									{{reservationDate}}
    								{{/changeDatePattern}}
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">내역</span>
    							<em class="item_dsc">
    								내역이 없습니다.
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">장소</span>
    							<em class="item_dsc">
    								{{#if placeName}}
    									{{placeName}}
    								{{else}}
    									내역이 없습니다.
    								{{/if}}
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">업체</span>
    							<em class="item_dsc">
    								오디컴퍼니 주식회사
    							</em>
    						</li>
    					</ul>
    					<div class="price_summary">
    						<span class="price_tit">결제 예정금액</span>
    						<em class="price_amount">
    							<span>
    								{{#changeCurrencyPattern totalPrice}}
                   						{{totalPrice}}
               						{{/changeCurrencyPattern}}
    							</span>
    							<span class="unit">원</span>
    						</em>
    					</div>
    					<div class="booking_cancel">
    						<a href="reviewWrite?reservId={{reservationInfoId}}&productId={{productId}}"><button class="btn"><span>예매자 리뷰
    									남기기</span></button></a>
    					</div>
    				</div>
    			</div>
    			<div class="right"></div>
    		</div>
    		<div class="card_footer">
    			<div class="left"></div>
    			<div class="middle"></div>
    			<div class="right"></div>
    		</div>
    	</a>
    </article>
  </script>

<script type="myTemplate" id="cancelItem">
  <article class="card_item">
    	<a href="#" class="link_booking_details">
    		<div class="card_body">
    			<div class="left"></div>
    			<div class="middle">
    				<div class="card_detail">
    					<em class="booking_number">No.{{reservationInfoId}}</em>
    					<h4 class="tit">{{productDescription}}</h4>
    					<ul class="detail">
    						<li class="item">
    							<span class="item_tit">일정</span>
    							<em class="item_dsc">
    								{{#changeDatePattern reservationDate}}
    									{{reservationDate}}
    								{{/changeDatePattern}}
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">내역</span>
    							<em class="item_dsc">
    								내역이 없습니다.
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">장소</span>
    							<em class="item_dsc">
    								{{#if placeName}}
    									{{placeName}}
    								{{else}}
    									내역이 없습니다.
    								{{/if}}
    							</em>
    						</li>
    						<li class="item">
    							<span class="item_tit">업체</span>
    							<em class="item_dsc">
    								오디컴퍼니 주식회사
    							</em>
    						</li>
    					</ul>
    					<div class="price_summary">
    						<span class="price_tit">결제 예정금액</span>
    						<em class="price_amount">
    							<span>
    								{{#changeCurrencyPattern totalPrice}}
                   						{{totalPrice}}
               						{{/changeCurrencyPattern}}
    							</span>
    							<span class="unit">원</span>
    						</em>
    					</div>
    				</div>
    			</div>
    			<div class="right"></div>
    		</div>
    		<div class="card_footer">
    			<div class="left"></div>
    			<div class="middle"></div>
    			<div class="right"></div>
    		</div>
    	</a>
    </article>
 </script>

</html>