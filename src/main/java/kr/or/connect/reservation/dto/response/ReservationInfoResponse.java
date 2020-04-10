package kr.or.connect.reservation.dto.response;

import java.util.List;

import kr.or.connect.reservation.dto.ReservationInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationInfoResponse {
	@NonNull
	private List<ReservationInfo> reservations;
	
	@NonNull
	private int size;
}
