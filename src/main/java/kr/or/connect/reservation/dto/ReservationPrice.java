package kr.or.connect.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationPrice {
	@NonNull
	private int count;

	@NonNull
	private int productPriceId;
	
	@NonNull
	private int reservationInfoId;
	
	@NonNull
	private int reservationInfoPriceId;
}
