package kr.or.connect.reservation.dto.response;

import java.util.List;

import kr.or.connect.reservation.dto.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {
	@NonNull
	private List<Product> items;
	
	@NonNull
	private int totalCount;
}
