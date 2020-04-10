package kr.or.connect.reservation.service;

import java.util.List;

import kr.or.connect.reservation.dto.ReservationInfo;
import kr.or.connect.reservation.dto.param.ReservationParam;
import kr.or.connect.reservation.dto.response.ReservationResponse;
import lombok.NonNull;

public interface ReservationService {
	public List<ReservationInfo> getReservationInfoByEmail(String reservationEmail);
	public int getTotalPrice(String reservationEmail, int productId, int displayInfoId, String reservationDate);
	public int getIdByEmail(String reservationEmail);
	public ReservationResponse changeCancelFlagById(int reservationInfoId, boolean cancelFlag);
	public ReservationResponse addReservation(ReservationParam reservationParam);
	public String getRandomReservationDate();
}
