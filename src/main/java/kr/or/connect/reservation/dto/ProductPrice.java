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
public class ProductPrice {
	@NonNull
	private String createDate;
	
	@NonNull
	private double discountRate;
	
	@NonNull
	private String modifyDate;
	
	@NonNull
	private int price;
	
	@NonNull
	private String priceTypeName;
	
	@NonNull
	private int productId;
	
	@NonNull
	private int productPriceId;
}
