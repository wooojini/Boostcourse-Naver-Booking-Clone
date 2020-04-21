package kr.or.connect.reservation.dao.sql;

public class CommentImageDaoSql {
  public static final String SELECT_COMMENT_IMAGES =
      "SELECT reservation_user_comment_image.id as image_id, reservation_user_comment_image.reservation_info_id, reservation_user_comment_image.reservation_user_comment_id, file_info.id AS file_id, file_name, save_file_name, content_type, delete_flag, file_info.create_date, file_info.modify_date FROM reservation_user_comment_image LEFT JOIN reservation_info ON reservation_user_comment_image.reservation_info_id = reservation_info.id LEFT JOIN file_info ON reservation_user_comment_image.file_id = file_info.id WHERE reservation_info.display_info_id = :displayInfoId AND reservation_user_comment_image.reservation_user_comment_id = :commentId";
}
