package kr.or.connect.reservation.dao.sql;

public class ReservationInfoDaoSql {
	public static final String SELECT_BY_EMAIL= "SELECT id AS reservation_info_id, product_id, display_info_id, reservation_name, reservation_tel AS reservation_telephone, reservation_email, cancel_flag AS cancel_yn, create_date, modify_date, reservation_date FROM reservation_info WHERE reservation_email = :reservationEmail";
	public static final String SELECT_TOTAL_PRICE = "SELECT sum(price*count) FROM reservation_info LEFT JOIN reservation_info_price ON reservation_info.id = reservation_info_price.reservation_info_id LEFT JOIN product_price ON reservation_info_price.product_price_id = product_price.id WHERE reservation_email = :reservationEmail AND reservation_info.product_id = :productId AND reservation_info.display_info_id = :displayInfoId AND reservation_date = :reservationDate";
	public static final String SELECT_ID_BY_EMAIL = "SELECT id FROM reservation_info WHERE reservation_email = :reservationEmail";
	public static final String UPDATE_CANCEL_FLAG_BY_ID = "UPDATE reservation_info SET cancel_flag = :cancelFlag WHERE id = :reservationInfoId";
}
