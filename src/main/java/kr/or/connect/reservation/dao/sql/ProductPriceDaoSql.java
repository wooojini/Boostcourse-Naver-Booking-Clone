package kr.or.connect.reservation.dao.sql;

public class ProductPriceDaoSql {
	public static final String SELECT_BY_DISPLAY_INFO_ID = "SELECT product_price.id AS product_price_id, product_price.product_id, price_type_name, price, discount_rate, product_price.create_date, product_price.modify_date FROM product_price LEFT JOIN product ON product.id = product_price.product_id LEFT JOIN display_info ON product.id = display_info.product_id WHERE display_info.id = :displayInfoId";
}
