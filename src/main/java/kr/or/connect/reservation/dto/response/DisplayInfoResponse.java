package kr.or.connect.reservation.dto.response;

import java.util.List;

import kr.or.connect.reservation.dto.Comment;
import kr.or.connect.reservation.dto.DisplayInfo;
import kr.or.connect.reservation.dto.DisplayInfoImage;
import kr.or.connect.reservation.dto.ProductImage;
import kr.or.connect.reservation.dto.ProductPrice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DisplayInfoResponse {
	@NonNull
	private DisplayInfo displayInfo;
	
	@NonNull
	private DisplayInfoImage displayInfoImage;
	
	@NonNull
	private List<ProductImage> productImages;
	
	@NonNull
	private List<ProductPrice> productPrices;
	
	@NonNull
	private List<Comment> comments;
	
	@NonNull
	private double averageScore;
	
	private String reservationDate;
}
