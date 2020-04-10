package kr.or.connect.reservation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import kr.or.connect.reservation.dao.ReservationInfoDao;
import kr.or.connect.reservation.dao.ReservationPriceDao;
import kr.or.connect.reservation.dto.ReservationInfo;
import kr.or.connect.reservation.dto.ReservationPrice;
import kr.or.connect.reservation.dto.param.ReservationParam;
import kr.or.connect.reservation.dto.response.ReservationResponse;
import kr.or.connect.reservation.service.ReservationService;
import kr.or.connect.reservation.util.DateUtil;
import lombok.NonNull;

@Service
public class ReservationServiceImpl implements ReservationService {
	@Autowired
	private ReservationInfoDao reservationInfoDao;
	@Autowired
	private ReservationPriceDao reservationPriceDao;
	
	@Override
	@Transactional
	public List<ReservationInfo> getReservationInfoByEmail(String reservationEmail) {		
		return reservationInfoDao.selectByEmail(reservationEmail);
	}

	@Override
	@Transactional
	public int getTotalPrice(String reservationEmail, int productId, int displayInfoId, String reservationDate) {
		return reservationInfoDao.selectTotalPrice(reservationEmail,productId,displayInfoId,reservationDate);
	}

	@Override
	@Transactional
	public int getIdByEmail(String reservationEmail) {
		return reservationInfoDao.selectIdByEmail(reservationEmail);
	}

	@Override
	@Transactional(readOnly = false)
	public ReservationResponse changeCancelFlagById(int reservationInfoId, boolean cancelFlag) {
		int updateCnt = reservationInfoDao.updateCancelFlagById(reservationInfoId, cancelFlag);

		//결과는 랜덤값을 반환하라고 명세서에 나와있어서 하드코딩한 의미없는 데이터를 반환.
		ReservationResponse reservationResponse = ReservationResponse.builder()
				.reservationInfoId(reservationInfoId)
				.cancelYn(false)
				.createDate(DateUtil.getNowDate())
				.modifyDate(DateUtil.getNowDate())
				.displayInfoId(1)
				.productId(1)
				.reservationDate(DateUtil.getNowDate())
				.reservationEmail("test@test.com")
				.reservationInfoId(reservationInfoId)
				.reservationName("테스트")
				.reservationTelephone("000-0000-0000")
				.prices(new ArrayList<ReservationPrice>())
				.build();

		return reservationResponse;
	}

	@Override
	@Transactional(readOnly = false)
	public ReservationResponse addReservation(ReservationParam reservationParam) {	
		ReservationInfo reservationInfo = reservationParam.getReservationInfo();
		
		int reservationInfoId = reservationInfoDao.insert(reservationInfo);

		List<ReservationPrice> prices = reservationParam.getPrices();
		for(ReservationPrice reservationPrice : prices) {
			reservationPrice.setReservationInfoId(reservationInfoId);
			Long reservationPriceId = reservationPriceDao.insert(reservationPrice);
		}

		//결과는 랜덤값을 반환하라고 명세서에 나와있어서 하드코딩한 의미없는 데이터를 반환.
		ReservationResponse reservationResponse = ReservationResponse.builder()
				.reservationInfoId(reservationInfoId)
				.cancelYn(false)
				.createDate(DateUtil.getNowDate())
				.modifyDate(DateUtil.getNowDate())
				.displayInfoId(1)
				.productId(1)
				.reservationDate(DateUtil.getNowDate())
				.reservationEmail("test@test.com")
				.reservationInfoId(reservationInfoId)
				.reservationName("테스트")
				.reservationTelephone("000-0000-0000")
				.prices(new ArrayList<ReservationPrice>())
				.build();
		
		return reservationResponse;
	}

	@Override
	public String getRandomReservationDate() {
		return DateUtil.getRandomYearMonthDay("yyyy-MM-dd");
	}
}
