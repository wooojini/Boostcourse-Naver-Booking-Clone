package kr.or.connect.reservation.dao.sql;

public class DisplayInfoImageDaoSql {
  public static final String SELECT_BY_DISPLAY_INFO_ID =
      "SELECT display_info_image.id AS display_info_image_id, display_info_id, file_info.id AS file_id, file_name, save_file_name, content_type, delete_flag, create_date, modify_date FROM display_info_image LEFT JOIN file_info ON file_id = file_info.id WHERE display_info_id = :displayInfoId";
}
