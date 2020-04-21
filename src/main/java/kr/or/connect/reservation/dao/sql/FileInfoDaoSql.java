package kr.or.connect.reservation.dao.sql;

public class FileInfoDaoSql {
  public static final String SELECT_BY_PRODUCT_IMAGE_ID =
      "SELECT file_info.id, file_info.file_name, file_info.save_file_name, file_info.content_type, file_info.delete_flag, file_info.create_date, file_info.modify_date FROM file_info LEFT JOIN product_image ON product_image.file_id = file_info.id WHERE product_image.id = :productImageId";

  public static final String SELECT_BY_DISPLAY_INFO_IMAGE_ID =
      "SELECT file_info.id, file_info.file_name, file_info.save_file_name, file_info.content_type, file_info.delete_flag, file_info.create_date, file_info.modify_date FROM file_info LEFT JOIN display_info_image ON display_info_image.file_id = file_info.id WHERE display_info_image.id = :displayInfoImageId";

  public static final String SELECT_BY_COMMENT_IMAGE_ID =
      "SELECT file_info.id, file_info.file_name, file_info.save_file_name, file_info.content_type, file_info.delete_flag, file_info.create_date, file_info.modify_date FROM file_info LEFT JOIN reservation_user_comment_image ON reservation_user_comment_image.file_id = file_info.id WHERE reservation_user_comment_image.id = :commentImageId";
}
