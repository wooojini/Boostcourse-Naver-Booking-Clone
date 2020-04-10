package kr.or.connect.reservation.dao.sql;

public class CommentDaoSql {
	public static final String SELECT_COMMENTS_BY_DISPLAY_INFO_ID = "SELECT reservation_user_comment.id AS comment_id, reservation_user_comment.product_id, reservation_user_comment.reservation_info_id AS reservation_info_id, score, comment, reservation_name, reservation_tel AS reservation_telephone, reservation_email, reservation_date, reservation_user_comment.create_date, reservation_user_comment.modify_date FROM reservation_user_comment LEFT JOIN reservation_info ON reservation_info.id = reservation_user_comment.reservation_info_id WHERE reservation_info.display_info_id = :displayInfoId ORDER BY create_date DESC";
	public static final String SELECT_AVG_SCORE_BY_DISPLAY_INFO_ID = "SELECT AVG(score) FROM reservation_user_comment LEFT JOIN reservation_info ON reservation_info.id = reservation_user_comment.reservation_info_id WHERE reservation_info.display_info_id = :displayInfoId";
}

