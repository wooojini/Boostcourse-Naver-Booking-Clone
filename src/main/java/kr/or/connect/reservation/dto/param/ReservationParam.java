package kr.or.connect.reservation.dto.param;

import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import kr.or.connect.reservation.dto.ReservationInfo;
import kr.or.connect.reservation.dto.ReservationPrice;
import kr.or.connect.reservation.util.DateUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationParam {
	@NotNull
	@Positive
	private int displayInfoId;
	
	@NotNull
	@Positive
	private int productId;
	
	@Email(message = "이메일 양식을 지켜주세요.")
	@NotBlank(message = "이메일을 입력해주세요.")
	private String reservationEmail;
	
	@NotBlank(message = "예매자명을 입력해주세요.")
	private String reservationName;
	
	@NotBlank(message = "연락처를 입력해주세요.")
	private String reservationTelephone;
	
	@NotBlank(message = "예약날짜가 필요합니다.")
	private String reservationYearMonthDay;
	
	@NotEmpty(message = "예매티켓을 선택해주세요.")
	private List<ReservationPrice> prices;
	
	public ReservationInfo getReservationInfo() {
		String nowDate = DateUtil.getNowDate();
		
		return ReservationInfo.builder()
				.productId(this.getProductId())		
				.displayInfoId(this.getDisplayInfoId())
		        .reservationName(this.getReservationName())
				.reservationEmail(this.getReservationEmail())
				.reservationTelephone(this.getReservationTelephone())
				.reservationDate(this.getReservationYearMonthDay())
				.createDate(nowDate)
				.modifyDate(nowDate)
				.build();
	}
}
