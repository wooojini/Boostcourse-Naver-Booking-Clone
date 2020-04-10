package kr.or.connect.reservation.type;

public enum ProductPriceType {
	ADULT("A"), YOUTH("Y"), SET("S"), DISABLED("D"), EARLY_BIRD("E"), VIP("V"), R_SEAT("R"), B_SEAT("B"), S_SEAT("S"), DAY("D"), BABY("B"), CITIZEN("C");
	
	private final String productPriceName;
	
	ProductPriceType(String productPriceName) {
		this.productPriceName = productPriceName;
	}
	
	public String getProductPriceName() {
		return this.productPriceName;
	}
}
