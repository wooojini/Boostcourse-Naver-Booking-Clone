package kr.or.connect.reservation.dto.response;

import java.util.List;

import kr.or.connect.reservation.dto.ReservationPrice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationResponse {
	@NonNull
	private boolean cancelYn;

	@NonNull
	private String createDate;
	
	@NonNull
	private int displayInfoId;
	
	@NonNull
	private String modifyDate;
	
	@NonNull
	private int productId;
	
	@NonNull
	private String reservationDate;
	
	@NonNull
	private String reservationEmail;
	
	@NonNull
	private int reservationInfoId;
	
	@NonNull
	private String reservationName;
	
	@NonNull
	private String reservationTelephone;
	
	@NonNull
	private List<ReservationPrice> prices;
}
