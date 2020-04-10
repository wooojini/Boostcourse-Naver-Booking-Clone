package kr.or.connect.reservation.dao.sql;

public class PromotionDaoSql {
	public static final String SELECT_ALL ="SELECT promotion.id, promotion.product_id, file_info.save_file_name as productImageUrl FROM promotion LEFT JOIN product_image ON promotion.product_id = product_image.product_id LEFT JOIN file_info ON product_image.file_id = file_info.id WHERE product_image.type = :imageType";
	public static final String SELECT_FILE_INFO_BY_ID = "SELECT file_info.id, file_info.file_name, file_info.save_file_name, file_info.content_type, file_info.delete_flag, file_info.create_date, file_info.modify_date FROM promotion LEFT JOIN product_image ON promotion.product_id = product_image.product_id LEFT JOIN file_info ON product_image.file_id = file_info.id WHERE product_image.type = :imageType AND promotion.product_id = :productId";
}
