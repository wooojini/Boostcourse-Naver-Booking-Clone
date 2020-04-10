package kr.or.connect.reservation.dao.sql;

public class ProductImageDaoSql {
	public static final int ETC_IMG_LIMIT = 1;
	public static final String SELECT_BY_DISPLAY_INFO_ID = "SELECT content_type, file_info.create_date, delete_flag, file_info.id AS file_info_id, file_name, file_info.modify_date, product_image.product_id, product_image.id AS product_image_id, save_file_name, type FROM product_image LEFT JOIN file_info ON product_image.file_id = file_info.id LEFT JOIN display_info ON product_image.product_id = display_info.product_id WHERE display_info.id = :displayInfoId";
	public static final String SELECT_FILE_INFO_BY_DISPLAY_INFO_ID = "SELECT file_info.id, file_info.file_name, file_info.save_file_name, file_info.delete_flag, file_info.content_type, file_info.create_date, file_info.modify_date FROM product_image LEFT JOIN file_info ON product_image.file_id = file_info.id LEFT JOIN display_info ON product_image.product_id = display_info.product_id WHERE type = :imageType AND display_info.id = :displayInfoId ORDER BY file_info.id limit :limit";
}
