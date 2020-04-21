package kr.or.connect.reservation.dao.sql;

public class PromotionDaoSql {
  public static final String SELECT_ALL =
      "SELECT promotion.id, promotion.product_id, file_info.save_file_name as productImageUrl, product_image.id as product_image_id FROM promotion LEFT JOIN product_image ON promotion.product_id = product_image.product_id LEFT JOIN file_info ON product_image.file_id = file_info.id WHERE product_image.type = :imageType";
}
